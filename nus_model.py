import os
import warnings
import re
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest
from transformers import pipeline

try:
    from urllib3.exceptions import NotOpenSSLWarning
    warnings.filterwarnings("ignore", category=NotOpenSSLWarning)
except Exception:
    pass

# suppress noisy RuntimeWarnings that should not appear after our fixes,
# but keep them turned on while debugging if you prefer
warnings.filterwarnings("ignore", message="divide by zero encountered in matmul")
warnings.filterwarnings("ignore", message="overflow encountered in matmul")
warnings.filterwarnings("ignore", message="invalid value encountered in matmul")
warnings.filterwarnings("ignore", category=RuntimeWarning)


CSV_PATH = "cleaned_data.csv"
FEATURES = ["Employees_Total", "Revenue_USD", "IT_spend", "Corporate_Family_Members"]
DESIRED_CLUSTERS = 5
RANDOM_STATE = 42
CONTAMINATION = 0.05   # for IsolationForest
USE_EXPLAINER = True  # set True if you have resources and want to run HF model
PIPELINE_DEVICE = -1   # -1 = CPU, 0 = first GPU/MPS device (set -1 to avoid "Device set to use mps:0" prints)


df = pd.read_csv(CSV_PATH)

def clean_column(col):
    col = re.sub(r"[^\w]+", "_", str(col).strip())
    return col.strip("_")

df.columns = [clean_column(c) for c in df.columns]

#ensure 'DUNS_Number' exists (some datasets may have different names)
if 'DUNS_Number' not in df.columns:
    #try to detect common alternatives or create an index
    if 'DUNS' in df.columns:
        df.rename(columns={'DUNS': 'DUNS_Number'}, inplace=True)
    else:
        df['DUNS_Number'] = np.arange(len(df))


for col in FEATURES:
    if col not in df.columns:
        #create column with zeros if missing (safer than failing)
        df[col] = 0
    #convert to numeric, coerce bad values to NaN then fill
    df[col] = pd.to_numeric(df[col], errors='coerce')

#fill NaNs sensibly:
#employees_Total: minimum 1 (avoid divisions / log issues). Keep integer-ish.
df['Employees_Total'] = df['Employees_Total'].fillna(1).replace(0, 1).astype(float)

#other numeric features: fill missing with 0
for col in ["Revenue_USD", "IT_spend", "Corporate_Family_Members"]:
    df[col] = df[col].fillna(0).astype(float)

#optional engineered columns
df['IT_Intensity'] = df['IT_spend'] / df['Revenue_USD'].replace(0, np.nan)  # keep NaN if revenue 0
df['Family_Network_Size'] = df['Corporate_Family_Members']


#use log1p to handle zeros safely
df_model_log = np.log1p(df[FEATURES].clip(lower=0))  # clip negative numbers to 0 before log1p

#replace inf / -inf / NaN that might remain
df_model_log = df_model_log.replace([np.inf, -np.inf], np.nan).fillna(0)


col_variances = df_model_log.var(axis=0)
zero_var_cols = col_variances[col_variances <= 0].index.tolist()

if zero_var_cols:
    #add tiny gaussian noise so algorithms that divide by variance don't blow up
    jitter_scale = 1e-8  # very small
    rng = np.random.default_rng(RANDOM_STATE)
    for c in zero_var_cols:
        df_model_log[c] += rng.normal(loc=0.0, scale=jitter_scale, size=len(df_model_log))

# final NaN/inf guard
df_model_log = df_model_log.replace([np.inf, -np.inf], np.nan).fillna(0)

scaler = StandardScaler()
X = scaler.fit_transform(df_model_log.values)

# Ensure finite numeric matrix (no nan / inf)
X = np.nan_to_num(X, nan=0.0, posinf=0.0, neginf=0.0)

# If dataset is extremely small or has too few distinct rows, adjust n_clusters
n_samples = X.shape[0]
unique_rows = np.unique(X.round(decimals=8), axis=0).shape[0]  # rounded uniqueness
n_clusters = min(DESIRED_CLUSTERS, max(1, unique_rows, n_samples))

# If we don't have enough unique samples for the requested clusters, reduce clusters
if unique_rows < DESIRED_CLUSTERS:
    n_clusters = max(1, unique_rows)


try:
    kmeans = KMeans(n_clusters=n_clusters, random_state=RANDOM_STATE, n_init=10)
    seg_labels = kmeans.fit_predict(X)
    df['Segment'] = seg_labels
except Exception as e:
    # fallback: everything in single segment
    warnings.warn(f"KMeans failed; assigning single-segment fallback. Error: {e}")
    df['Segment'] = 0

# if too few samples for IsolationForest, skip and mark all normal
try:
    # IsolationForest requires at least a few samples; check
    if n_samples >= 5:
        iso = IsolationForest(contamination=CONTAMINATION, random_state=RANDOM_STATE)
        df['Anomaly'] = iso.fit_predict(X)  # 1 = normal, -1 = anomaly
    else:
        df['Anomaly'] = 1
except Exception as e:
    warnings.warn(f"IsolationForest failed; marking all normal. Error: {e}")
    df['Anomaly'] = 1


segment_medians = df.groupby("Segment")[FEATURES].median().fillna(0)

def get_peer_comparison_row(row, segment_stats):
    seg = row['Segment']
    # safe lookup
    if seg not in segment_stats.index:
        return "Baseline (No segment stats)"
    median_it = segment_stats.loc[seg, 'IT_spend']
    if median_it <= 0:
        return "Baseline (Zero IT Spend Group)"
    ratio = row['IT_spend'] / (median_it + 1e-12)
    if ratio < 0.6:
        return "Under-invested"
    if ratio > 1.4:
        return "High Investor"
    return "Market Average"

df['IT_Insight'] = df.apply(lambda r: get_peer_comparison_row(r, segment_medians), axis=1)


print("Sanity check (first rows):")
print(df[['DUNS_Number', 'Segment', 'Anomaly', 'IT_Insight']].head())


if USE_EXPLAINER:
    def build_robust_prompt(row, segment_stats):
        peer_status = get_peer_comparison_row(row, segment_stats)
        is_anomaly = "YES (High Risk)" if row['Anomaly'] == -1 else "No (Standard Profile)"
        # handle missing fields elegantly
        company = row.get('Entity_Type', 'Unknown Entity')
        ownership = row.get('Ownership_Type', 'Unknown Ownership')
        country = row.get('Country', 'Unknown Country')
        sic = row.get('SIC_Code', 'Unknown SIC')
        year_found = int(row['Year_Found']) if 'Year_Found' in row and not pd.isna(row['Year_Found']) else 'Unknown'
        return f"""
TASK: Generate an executive briefing using EXACTLY the format below.
Do NOT summarize into a paragraph.

FORMAT (MUST FOLLOW EXACTLY):

SECTION 1: OPERATIONAL PROFILE
- Business description:
- Organizational structure:
- Scale assessment:

SECTION 2: STRENGTHS, RISKS & ANOMALIES
- Key strengths:
- Key risks:
- Anomaly interpretation:

SECTION 3: COMMERCIAL IMPLICATIONS
- Vendor opportunity:
- Recommended engagement rationale:

DATA:
Company Type: {company}
Ownership: {ownership}
Country: {country}
Industry (SIC): {sic}
Founded: {year_found}
Employees: {int(row['Employees_Total'])}
Revenue: ${row['Revenue_USD']:,.0f}
Corporate Family Size: {int(row['Family_Network_Size'])}
IT Spend: ${row['IT_spend']:,.0f}
Peer IT Assessment: {peer_status}
Anomaly Flag: {is_anomaly}
"""


    explainer = pipeline("text2text-generation", model="google/flan-t5-large", device=PIPELINE_DEVICE)
    # choose one target DUNS to demo
    target_duns = 728834216
    if target_duns in df['DUNS_Number'].values:
        row = df[df['DUNS_Number'] == target_duns].iloc[0]
        prompt = build_robust_prompt(row, segment_medians)
        print(f"--- ANALYZING DUNS {target_duns} ---")
        response = explainer(prompt, max_length=512, do_sample=True, temperature=0.7, repetition_penalty=1.2)
        print(response[0].get("generated_text", response))
    else:
        print(f"Target DUNS {target_duns} not found; skipping explainer.")

