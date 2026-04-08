import pandas as pd
import numpy as np
import re
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest

# 1. LOAD & CLEAN
df = pd.read_csv("cleaned_data.csv")
df.columns = [re.sub(r"[^\w]+", "_", c.strip()).strip("_") for c in df.columns]

# 2. DATA SANITIZATION (The Fix for 'matmul' errors)
features = ["Employees_Total", "Revenue_USD", "IT_spend", "Corporate_Family_Members"]

# Ensure numeric and fill NaNs immediately
for col in features:
    df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)

# Use log1p to handle zeros safely (log(1+x))
df_model_log = np.log1p(df[features])

# CRITICAL: Replace any remaining Infs or NaNs with 0 before scaling
df_model_log = df_model_log.replace([np.inf, -np.inf], np.nan).fillna(0)

# 3. RUN STATISTICAL FUNCTIONS SEPARATELY
scaler = StandardScaler()
X = scaler.fit_transform(df_model_log)

# Check for constant columns (variance=0) which causes 'divide by zero'
# If a column has no variation, KMeans will fail. We add a tiny bit of noise if needed.
if np.any(np.isnan(X)):
    X = np.nan_to_num(X)

# Cluster
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
df["Segment"] = kmeans.fit_predict(X)

# Anomaly Detection
iso = IsolationForest(contamination=0.05, random_state=42)
df["Anomaly"] = iso.fit_predict(X)

# 4. RUN INSIGHT FUNCTIONS SEPARATELY
# Calculate group medians
segment_medians = df.groupby("Segment")[features].median()

def get_peer_comparison(row):
    """Safely calculates the insight for a single row."""
    seg = row['Segment']
    median_it = segment_medians.loc[seg, 'IT_spend']
    
    # Avoid divide-by-zero if median is 0
    if median_it <= 0:
        return "Baseline (Zero IT Spend Group)"
    
    ratio = row['IT_spend'] / median_it
    
    if ratio < 0.6: return "Under-invested"
    if ratio > 1.4: return "High Investor"
    return "Market Average"

# Add insight column to the whole dataframe
df['IT_Insight'] = df.apply(get_peer_comparison, axis=1)

# 5. VERIFY RESULTS
print(df[['DUNS_Number', 'Segment', 'Anomaly', 'IT_Insight']].head())