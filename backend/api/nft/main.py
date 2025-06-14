# main.py  – stable version with detailed logs

import os, json, uuid, hashlib, datetime, base64, unicodedata, logging, requests
from typing import List, Annotated
from fastapi import FastAPI, UploadFile, File, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from sqlalchemy.future import select

from db     import engine, SessionLocal
from models import Base, Collection
import routes_snippet                  # noqa: E402  (kept at the very end)
# ── hard-wired credentials (YOUR current values) ───────────────────────
API_KEY  = "a74b03a635434116af6a3f68676a8dd2"
UID      = os.getenv("NMKR_UID")
ADDR     = "addr_test1qz9wg7357z5g8jmjpaqfc9q6set8g07ge5xfzggy0r6rrpgkte5s98c3y6nxkcg8fx2hmptawp9yrswlvj54fcavq2gsjljc30"
NMKR_HDR    = {"Authorization": f"Bearer {API_KEY}", "Content-Type": "application/json"}
BF_ID    = os.getenv("BLOCKFROST_PROJECT_ID")

NMKR_HOST   = "studio-api.preprod.nmkr.io"                 # test-net
BF_BASE_URL = "https://cardano-preprod.blockfrost.io/api/v0"

BASE        = f"https://{NMKR_HOST}/v2"
UPLOAD_URL  = f"{BASE}/UploadNft/{UID}?uploadsource=api"
MINT_URL    = lambda nft_uid: f"{BASE}/MintAndSendSpecific/{UID}/{nft_uid}/1/{ADDR}"

TINY_PNG_B64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII="

# ── logging ────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)s  %(message)s")
log = logging.getLogger("cert-mvp")

# ── FastAPI & DB bootstrap ─────────────────────────────────────────────
app        = FastAPI()
app.include_router(routes_snippet.router)
templates  = Jinja2Templates(directory="templates")

@app.on_event("startup")
async def startup_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# ── helpers ────────────────────────────────────────────────────────────
def sanitize(filename: str, max_bytes: int = 32) -> str:
    """
    - ASCII-only
    - Removes spaces / punctuation
    - Ensures final string (basename + '_' + hash6) ≤ 32 bytes
    """
    # 1. base name, ASCII-only
    base = unicodedata.normalize("NFKD", filename.rsplit(".", 1)[0])\
                      .encode("ascii", "ignore").decode()
    base = "".join(c for c in base if c.isalnum())      # keep letters+digits only

    # 2. 6-char hash to avoid duplicates
    suffix = "_" + hashlib.sha1(filename.encode()).hexdigest()[:6]  # 7 bytes incl. '_'

    # 3. trim base so total ≤ 32 bytes
    keep = max_bytes - len(suffix)
    base = base[:keep]                                   # now base+suffix ≤ 32

    return base + suffix

def bf_headers(): return {"project_id": BF_ID}
def bf_get(path:str):     return requests.get(f"{BF_BASE_URL}{path}", headers=bf_headers(), timeout=40)

# ── upload & mint ──────────────────────────────────────────────────────
@app.post("/upload")
async def upload_and_mint(file: UploadFile = File(...)):
    data = await file.read()
    body = {
        "tokenname":      sanitize(file.filename),
        "displayname":    file.filename,
        "description":    "Proof-of-existence document",
        "previewImageNft":{"mimetype":"image/png","fileFromBase64":TINY_PNG_B64},
        "subfiles":[{"subfile":{
            "mimetype":file.content_type or "application/octet-stream",
            "fileFromBase64":base64.b64encode(data).decode()},
            "description":file.filename}]
    }

    up = requests.post(UPLOAD_URL, headers=NMKR_HDR, data=json.dumps(body), timeout=90)
    log.info("NMKR upload -> %s", up.status_code)
    if up.status_code != 200:
        return JSONResponse(status_code=up.status_code,
                            content={"stage":"upload","nmkr":up.text})

    nft_uid = up.json().get("nftUid")
    if not nft_uid:
        return JSONResponse(status_code=500,
                            content={"stage":"upload","error":"nftUid missing","raw":up.text})

    mint = requests.get(MINT_URL(nft_uid),
                        headers={"Authorization":f"Bearer {API_KEY}","accept":"application/json"},
                        timeout=40)
    log.info("NMKR mint   -> %s", mint.status_code)
    if mint.status_code != 200:
        return JSONResponse(status_code=mint.status_code,
                            content={"stage":"mint","nmkr":mint.text})

    return {"status":"success","upload":up.json(),"mint":mint.json()}

# ── wallet NFT listing ─────────────────────────────────────────────────
def list_wallet_nfts():
    r = bf_get(f"/addresses/{ADDR}/assets")
    if r.status_code != 200:
        log.warning("Blockfrost addr assets -> %s  %s", r.status_code, r.text[:120])
        return []

    try:
        assets = r.json()
        if isinstance(assets, list) and assets and isinstance(assets[0], str):
            # When wallet is empty, Blockfrost returns [""] – filter that out
            assets = []
    except ValueError:
        assets = []

    items=[]
    for a in assets:
        aid = a.get("unit")          # ← the 56-byte hex asset-id
        if aid=="lovelace": continue
        meta = bf_get(f"/assets/{aid}").json()
        files= meta.get("onchain_metadata",{}).get("files",[])
        if not files:       continue
        f=files[0]
        items.append({
            "asset_id":aid,
            "name":meta["onchain_metadata"].get("name",""),
            "file_name":f.get("name",""),
            "media_type":f.get("mediaType",""),
            "ipfs_link":f.get("src","")
        })
    return items

# ── pages & collection endpoints ───────────────────────────────────────
@app.get("/")
async def home(request: Request):
    assets = list_wallet_nfts_nmkr()        # ← use NMKR flavour
    return templates.TemplateResponse("home.html",
                                      {"request": request, "assets": assets})


@app.post("/create-collection")
async def create_collection(request:Request,
                            selected_assets:Annotated[List[str],Form()]):
    cid = str(uuid.uuid4())
    async with SessionLocal() as s:
        s.add(Collection(id=cid, asset_ids=json.dumps(selected_assets)))
        await s.commit()
    log.info("Collection %s saved (%d assets)", cid, len(selected_assets))
    return {"collection":cid,"view_url":f"/collection/{cid}"}

@app.get("/collection/{cid}")
async def view_collection(request:Request, cid:str):
    async with SessionLocal() as s:
        res = await s.execute(select(Collection).where(Collection.id==cid))
        col = res.scalar_one_or_none()
    if not col:
        return JSONResponse(status_code=404, content={"error":"collection not found"})
    items=[bf_get(f"/assets/{aid}").json() for aid in json.loads(col.asset_ids)]
    return templates.TemplateResponse("collection.html",
           {"request":request,"items":items,"cid":cid})

EXCLUDE_NAMES = {"tUSDM.pdf"}            # anything you never want shown

def list_wallet_nfts_nmkr():
    url     = f"https://{NMKR_HOST}/v2/GetAllAssetsInWallet/{ADDR}"
    params  = {"blockchain": "Cardano"}
    r       = requests.get(url, params=params, headers=NMKR_HDR, timeout=40)
    if r.status_code != 200:
        log.warning("NMKR wallet call -> %s %s", r.status_code, r.text[:120])
        return []

    rows, items = r.json(), []
    for a in rows:
        if a.get("unit") == "lovelace":
            continue                                  # skip ADA
        if a.get("assetName") in EXCLUDE_NAMES:
            continue                                  # skip demo NFT
        items.append({
            "asset_id":   a["unit"],
            "name":       a.get("assetName", ""),
            "file_name":  a.get("assetName", ""),
            "media_type": "",
            "ipfs_link":  ""
        })
    return items