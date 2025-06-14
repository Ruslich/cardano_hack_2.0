from fastapi import FastAPI, Form, Request
from fastapi.templating import Jinja2Templates
from typing import List
import requests
import os
import json
from dotenv import load_dotenv
import uuid

# Load .env
load_dotenv()

# Configs from .env
BLOCKFROST_PROJECT_ID = os.getenv("BLOCKFROST_PROJECT_ID")

# Blockfrost setup
BLOCKFROST_BASE_URL = "https://cardano-preprod.blockfrost.io/api/v0"

# For now: simple in-memory storage (later can be DB)
collections = {}

# Hardcoded example asset IDs
ASSET_IDS = [
    "5bffb88141587dc43d8665ee8c98199a7a9680074c01a77bdd5af8c55465737443616d5363616e6e65722030362e30362e32352031332e3234"
]

app = FastAPI()
templates = Jinja2Templates(directory="templates")

# === BLOCKFROST HELPERS ===

def get_asset_info(asset_id):
    url = f"{BLOCKFROST_BASE_URL}/assets/{asset_id}"
    headers = {"project_id": BLOCKFROST_PROJECT_ID}
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return None
    return response.json()

def build_nft_list():
    nft_data = []
    for asset_id in ASSET_IDS:
        asset_info = get_asset_info(asset_id)
        if not asset_info:
            continue
        metadata = asset_info.get("onchain_metadata", {})
        files = metadata.get("files", [])
        if not metadata or not files:
            continue
        file_info = files[0]
        nft_data.append({
            "asset_id": asset_id,
            "name": metadata.get("name", ""),
            "file_name": file_info.get("name", ""),
            "media_type": file_info.get("mediaType", ""),
            "ipfs_link": file_info.get("src", "")
        })
    return nft_data

# === ROUTES ===

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("home.html", {"request": request})

@app.post("/list-assets")
async def list_assets(request: Request):
    nft_data = build_nft_list()
    return templates.TemplateResponse("assets.html", {"request": request, "assets": nft_data})

@app.post("/create-collection")
async def create_collection(request: Request, selected_assets: List[str] = Form(...)):
    # Simulate database insert
    collection_id = str(uuid.uuid4())
    collections[collection_id] = selected_assets

    return {"success": True, "collection_link": f"/collection/{collection_id}"}

@app.get("/collection/{collection_id}")
async def view_collection(request: Request, collection_id: str):
    selected_assets = collections.get(collection_id)
    if not selected_assets:
        return {"error": "Collection not found"}

    nft_data = []
    for asset_id in selected_assets:
        asset_info = get_asset_info(asset_id)
        if not asset_info:
            continue
        metadata = asset_info.get("onchain_metadata", {})
        files = metadata.get("files", [])
        if not metadata or not files:
            continue
        file_info = files[0]
        nft_data.append({
            "asset_id": asset_id,
            "name": metadata.get("name", ""),
            "file_name": file_info.get("name", ""),
            "media_type": file_info.get("mediaType", ""),
            "ipfs_link": file_info.get("src", "")
        })

    return templates.TemplateResponse("collection.html", {"request": request, "collection": nft_data})