from blockfrost import BlockFrostApi, ApiUrls
import requests
import os
import webbrowser
import mimetypes

# Your Blockfrost Preprod Project ID
BLOCKFROST_PROJECT_ID = "preprodtHwAt3kjGk57LCCgPxMGLKzlkd9GCBw7"

# Create Blockfrost client
api = BlockFrostApi(
    project_id=BLOCKFROST_PROJECT_ID,
    base_url=ApiUrls.preprod.value
)

# Provide any minted Asset ID
asset_id = "5bffb88141587dc43d8665ee8c98199a7a9680074c01a77bdd5af8c55465737443616d5363616e6e65722030362e30362e32352031332e3234"

# Fetch asset metadata
asset_info = api.asset(asset_id)
print("✅ Asset found:", asset_info.asset_name)

# Get IPFS hash from subfiles
subfiles = asset_info.onchain_metadata.files

if not subfiles:
    print("❌ No subfiles found!")
    exit()

# Use first subfile (you can extend for multiple later)
file_info = subfiles[0]
ipfs_url = file_info.src
file_name = file_info.name
mime_type = file_info.mediaType

# Extract pure IPFS hash
ipfs_hash = ipfs_url.split("ipfs://")[1]

# Build full download URL via public IPFS gateway
download_url = f"https://ipfs.io/ipfs/{ipfs_hash}"
print("✅ Download URL:", download_url)

# Download file
response = requests.get(download_url)
if response.status_code != 200:
    print("❌ Download failed!")
    exit()

# Build safe local filename with proper extension
ext = mimetypes.guess_extension(mime_type) or ".bin"
safe_filename = file_name or f"downloaded_file{ext}"

# Save file locally
with open(safe_filename, "wb") as f:
    f.write(response.content)

print(f"✅ File downloaded as: {safe_filename}")

# Open file in default system viewer
webbrowser.open(f"file://{os.path.abspath(safe_filename)}")