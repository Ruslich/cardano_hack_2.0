# routes_share.py  ── “share-link” endpoints
from fastapi import APIRouter, Depends, Request, Form
from sqlalchemy.orm import Session
import secrets, json
from fastapi.responses import JSONResponse

from db      import SessionLocal
from models  import Collection

router = APIRouter()

# ── DB session dependency ────────────────────────────────────────────
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ── POST /collection/new  → returns opaque “share token” ─────────────
@router.post("/collection/new", response_model=dict)
async def create_collection(
    request: Request,
    selected_assets: list[str] = Form(...),        # comes from <input name="selected_assets">
    db: Session        = Depends(get_db),
):
    share_token = secrets.token_urlsafe(10)        # e.g. Y3U...dsg
    db.add(Collection(id=share_token,
                      asset_ids=json.dumps(selected_assets)))
    db.commit()

    link = str(request.base_url) + f"collection/{share_token}"
    return {"ok": True, "share_token": share_token, "link": link}

# ── GET /collection/{share_token}  → read-only view ──────────────────
@router.get("/collection/{share_token}")
async def view_collection(share_token: str,
                          request: Request,
                          db: Session = Depends(get_db)):
    row = db.get(Collection, share_token)
    if not row:
        return JSONResponse(status_code=404,
                            content={"error": "collection not found"})

    from main import bf_get            # reuse helper from main.py
    assets = []
    for aid in json.loads(row.asset_ids):
        assets.append(bf_get(f"/assets/{aid}").json())

    return request.app.templates.TemplateResponse(
        "collection.html",
        {"request": request, "items": assets, "cid": share_token},
    )