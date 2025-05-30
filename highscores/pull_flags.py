import requests
import pandas as pd
import base64
from io import BytesIO
import time

def download_and_convert_flags(input_file='flags.csv', output_file='flags_data.csv'):
    df = pd.read_csv(input_file)
    
    results = []
    total = len(df)
    
    for idx, row in df.iterrows():
        country = row['Country']
        flag_url = row['Flag_image_url']
        
        print(f"Processing {idx+1}/{total}: {country}")
        
        try:
            response = requests.get(flag_url, timeout=10)
            response.raise_for_status()
            
            flag_data = base64.b64encode(response.content).decode('utf-8')
            
            results.append({
                'Country': country,
                'Flag_Data': flag_data
            })
            
        except Exception as e:
            print(f"Error downloading {country}: {e}")
            results.append({
                'Country': country,
                'Flag_Data': None
            })
        
        time.sleep(0.5)
    
    output_df = pd.DataFrame(results)
    output_df.to_csv(output_file, index=False)
    print(f"Saved {len(results)} entries to {output_file}")

if __name__ == "__main__":
    download_and_convert_flags()