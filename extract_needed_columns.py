import pandas as pd
import numpy as np

# 1. LOAD THE DATA FROM A SINGLE EXCEL FILE
excel_file = 'champions_group_data-2.xlsx'

# Load the original data from "Sheet 1"
df_original = pd.read_excel(excel_file, sheet_name='Sheet1')

# Load the reference headers from "Sheet 1 (2)"
df_reference = pd.read_excel(excel_file, sheet_name='Sheet1 (2)', nrows=0)

# 2. IDENTIFY COLUMNS TO KEEP
keep_columns = df_reference.columns.tolist()
# Only keep columns that actually exist in the original sheet
columns_to_drop = [col for col in df_original.columns if col not in keep_columns]

# 3. APPLY FILTERING
df_clean = df_original.drop(columns=columns_to_drop)

# 4. DATA CLEANING LOGIC
def convert_range_to_number(val):
    if pd.isna(val) or val == '':
        return 0
    val = str(val).strip().lower()
    if 'to' in val:
        try:
            parts = val.split('to')
            return (float(parts[0].strip()) + float(parts[1].strip())) / 2
        except:
            return 0
    if '+' in val:
        try:
            return float(val.replace('+', '').strip())
        except:
            return 0
    try:
        return float(val)
    except:
        return 0

# Apply range conversion to hardware columns
hardware_cols = [
    'No. of PC', 'No. of Desktops', 'No. of Laptops', 
    'No. of Routers', 'No. of Servers', 'No. of Storage Devices'
]

for col in hardware_cols:
    if col in df_clean.columns:
        df_clean[col] = df_clean[col].apply(convert_range_to_number)

# Ensure numeric columns are actually numeric
numeric_cols = ['Revenue (USD)', 'Employees Total', 'Market Value (USD)', 'IT Budget', 'IT spend']
for col in numeric_cols:
    if col in df_clean.columns:
        df_clean[col] = pd.to_numeric(df_clean[col], errors='coerce').fillna(0)

# Fill missing values for categorical columns
categorical_cols = df_clean.select_dtypes(include=['object']).columns
df_clean[categorical_cols] = df_clean[categorical_cols].fillna('Unknown')

# 5. SAVE THE CLEANED DATA
df_clean.to_csv('cleaned_data.csv', index=False)
print("Data cleaning complete. Saved to 'cleaned_data.csv'.")