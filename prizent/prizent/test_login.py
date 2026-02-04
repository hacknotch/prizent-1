import requests
import json

url = "http://localhost:8081/api/auth/login"
headers = {"Content-Type": "application/json"}
data = {
    "username": "admin",
    "password": "password"
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, headers=headers, json=data)
    print(f"Status Code: {response.status_code}")
    print("Response Body:")
    print(response.text)
except Exception as e:
    print(f"Error: {e}")
