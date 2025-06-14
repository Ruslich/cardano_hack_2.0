import requests

BLOCKFROST_PROJECT_ID = "preprodtHwAt3kjGk57LCCgPxMGLKzlkd9GCBw7"
WALLET_ADDRESS = "addr_test1qz9wg7357z5g8jmjpaqfc9q6set8g07ge5xfzggy0r6rrpgkte5s98c3y6nxkcg8fx2hmptawp9yrswlvj54fcavq2gsjljc30"

url = f"https://cardano-preprod.blockfrost.io/api/v0/addresses/{WALLET_ADDRESS}/assets"
headers = {"project_id": BLOCKFROST_PROJECT_ID}

response = requests.get(url, headers=headers)
print(response.status_code)
print(response.json())