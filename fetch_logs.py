import requests

# Define the base URL of the API and the admin password
BASE_URL = "https://quickspace-api.netlify.app/.netlify/functions/api/"
ADMIN_PASSWORD = "password123"  # replace with your actual password

def fetch_logs():
    """Function to fetch logs from the API."""
    url = f"{BASE_URL}/admin/logs?password={ADMIN_PASSWORD}"
    try:
        # Send a GET request to the /admin/logs endpoint with the password query parameter
        response = requests.get(url)
        
        if response.status_code == 200:
            # Print the fetched logs
            logs = response.json()
            print("Logs:")
            for log in logs:
                print(log)
        else:
            print(f"Failed to fetch logs: {response.status_code}")
    except Exception as e:
        print(f"Error fetching logs: {e}")

if __name__ == "__main__":
    fetch_logs()
