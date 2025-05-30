import requests
import base64

def url_to_base64(url):
    try:
        print(f"Downloading: {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        flag_data = base64.b64encode(response.content).decode('utf-8')
        
        with open('base_64.txt', 'w') as f:
            f.write(flag_data)
            
        print(f"Success! Base64 data saved to base_64.txt")
        print(f"Data length: {len(flag_data)} characters")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    url = input("Enter the CSV URL: ").strip()
    url_to_base64(url)