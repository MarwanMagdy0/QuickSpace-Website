import requests
import psutil

# Define the base URL of the API
BASE_URL = "https://quickspace-api.netlify.app/.netlify/functions/api/"

def get_mac_address():
    """Get the MAC address of the first network interface."""
    for interface, addrs in psutil.net_if_addrs().items():
        for addr in addrs:
            if addr.family == psutil.AF_LINK:  # Looking for MAC address (AF_LINK)
                return addr.address
    return None  # Return None if no MAC address is found

def check_valid_mac(user_mac):
    """Function to check if the MAC address is valid."""
    url = f"{BASE_URL}/is_valid_mac/{user_mac}"
    
    try:
        # Send GET request to the /is_valid_mac endpoint
        response = requests.get(url)
        
        # Extract 'valid' from the response JSON, default to False if not found
        json_response = response.json()
        return json_response.get("valid", False)  # Return the valid flag directly
    except Exception as e:
        print(f"Error checking MAC: {e}")
        return False

def main():
    # Get the MAC address of the system
    user_mac = get_mac_address()
    
    if user_mac:
        print(f"MAC Address found: {user_mac}")
        # Check if the MAC address is valid
        is_valid = check_valid_mac(user_mac)
        # Print the 'valid' flag (True/False)
        print(is_valid)
    else:
        print("No MAC address found.")

if __name__ == "__main__":
    main()
