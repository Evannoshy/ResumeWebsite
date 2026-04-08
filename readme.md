Group 6 NUS Datathon 2026: Company Intelligence & Segmentation Tool 
Authors: Evan, Yuxuan, Amelia, Justin, Llisha.
Competition: NUS Datathon 2026

Project Overview
This project processes raw firmographic data to generate meaningful business insights. It uses a two-stage machine learning pipeline:
Unsupervised Learning: Clusters companies into 6 distinct segments and detects operational anomalies using statistical profiling.
Generative AI: Fine-tunes a flan-t5-base model to produce structured executive briefings based on processed data points.
The goal is to transform a static CSV of company statistics into actionable Commercial Intelligence for investors and sales teams.

Setup & Installation (Google Colab)
This project is designed to run in Google Colab with GPU acceleration.
1. Mount Google Drive
from google.colab import drive
drive.mount('/content/drive')
%cd /content/drive/My Drive/Your_Project_Folder
2. Install Dependencies
!pip install -r requirements.txt

Usage Instructions
Step 1: Data Processing
Run the processing script to clean data, perform K-Means clustering, and detect anomalies using Isolation Forest.
python process_data.py
Input: cleaned_data.csv
Output: processed_data.csv
(Contains new columns such as Company_Segment, Is_Anomaly, Peer_IT_Assessment)
Step 2: Prepare Training Data (CSV → JSON Semantic Transformation)
The train_flan_t5.py script requires a JSON file.
Although training_data.json originates from processed_data.csv, this step is not a simple file format conversion. Instead, it is a semantic transformation designed specifically for supervised language model fine-tuning.

Purpose
Large Language Models such as FLAN-T5 do not learn effectively from tabular data. They require text-to-text supervision pairs. This step restructures numerical and categorical company data into instruction-style inputs paired with structured executive-level outputs.

What This Step Does
Selects a subset of representative companies from processed_data.csv
Extracts engineered features and firmographic metadata
Converts each row into:
An input prompt containing structured key-value facts
An output response representing an ideal executive briefing
Saves the result as a JSON array suitable for Seq2Seq training

What This Step Is Not
Not a row-by-row CSV → JSON dump
Not a schema-preserving transformation
Not fully automated (manual curation ensures output quality)
Required JSON Format
Convert selected rows into the following structure and save as training_data.json:
[
  {
    "input": "DATA: Company Type: Subsidiary | Ownership: Private | Country: CHINA | IT Spend Ratio: 0.12 | Segment: Digitally Lean SME ...",
    "output": "SECTION 1: OPERATIONAL PROFILE\n- Business description: ..."
  }
]
Pipeline Context
cleaned_data.csv
   ↓
processed_data.csv        (Clustering + Anomaly Detection)
   ↓
training_data.json        (LLM-ready supervision pairs)
   ↓
Fine-tuned FLAN-T5 Model

This design ensures the language model learns how to reason about companies, rather than merely restating statistics.
Step 3: Train & Test the LLM
Run the training script to fine-tune the T5 model.
The script also performs a sample inference at the end to demonstrate model performance.
Ensure your Colab runtime type is set to T4 GPU.
python train_flan_t5.py
Input: training_data.json
Output: Fine-tuned model saved to ./flan-t5-company-insights

Methodology
1. Feature Engineering
We engineered several key metrics to improve clustering quality:
IT_Spend_Ratio: Measures digital maturity (IT Spend / Revenue)
Family_Network_Size: Indicates corporate support structure
Scale_Class: Logical buckets based on employee count (e.g., Micro, SME, Enterprise)
2. Anomaly Detection
We used an Isolation Forest (contamination = 0.05) to flag companies with unusual operational patterns, such as high revenue but zero IT infrastructure.
3. Language Modeling
We fine-tuned Google’s FLAN-T5 Base using Seq2SeqTrainer.
The model is trained to generate a structured three-section executive report:
Operational Profile: Core nature of the business
Strengths & Risks: Data-driven assessment of stability
Commercial Implications: Actionable insights for vendors or investors

Requirements & Limitations
Hardware: GPU required. CPU-only training is not recommended.
Data: Pipeline assumes the specific schema of cleaned_data.csv.
Memory: Optimized for standard Colab limits
(Batch size = 1, Gradient accumulation = 16)

License
This project was created for the NUS Datathon 2026.
No specific license is attached.
If you want next, I can:
Add a “Future Improvements” section (automatic CSV→JSON generation is a strong one)
Tighten language for judge scoring rubrics
Or refactor this into a research-paper-style README 