#!/usr/bin/env python3
"""
export_json.py – Converts the Excel data file to the JSON format
consumed by the WordPress plugin.

Usage (run from the repository root):
    python3 tools/export_json.py

Output:
    situations-resolutions/assets/data/situations.json
"""

import json
import os
import sys

try:
    import pandas as pd
except ImportError:
    sys.exit("Error: pandas is not installed. Run: pip install pandas openpyxl")

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EXCEL_FILE = os.path.join(REPO_ROOT, "Situations-n-Resolutions-with-sections.xlsx")
OUTPUT_FILE = os.path.join(
    REPO_ROOT, "situations-resolutions", "assets", "data", "situations.json"
)


def main():
    if not os.path.isfile(EXCEL_FILE):
        sys.exit(f"Error: Excel file not found at {EXCEL_FILE}")

    print(f"Reading: {EXCEL_FILE}")
    df = pd.read_excel(EXCEL_FILE)
    df.columns = [c.strip() for c in df.columns]

    required = {"Stroke", "Number", "Situation", "Recommended resolution", "Applicable Rule"}
    missing = required - set(df.columns)
    if missing:
        sys.exit(f"Error: Missing columns in Excel file: {missing}")

    records = []
    for _, row in df.iterrows():
        records.append(
            {
                "stroke": str(row["Stroke"]),
                "number": int(row["Number"]),
                "situation": str(row["Situation"]),
                "resolution": str(row["Recommended resolution"]),
                "rule": str(row["Applicable Rule"]),
            }
        )

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"Exported {len(records)} records to: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
