from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import os
import json
import asyncio
import aiohttp
import uuid

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

async def update_credential_status(uuid, transaction_hash, status="completed"):
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "http://localhost:4000/api/update-credential-status",
            json={
                "uuid": uuid,
                "transaction_hash": transaction_hash,
                "status": status
            }
        ) as response:
            if response.status != 200:
                raise HTTPException(status_code=500, detail="Failed to update credential status")

async def mint_nft_async(pdf_path, student_id, student_name, university_wallet):
    try:
        # Generate a unique asset name
        asset_name = f"{student_id}_{uuid.uuid4().hex[:8]}"
        
        # Run the mint_nft.py script
        process = await asyncio.create_subprocess_exec(
            "python3", "mint_nft.py",
            pdf_path,
            student_id,
            student_name,
            university_wallet,
            asset_name,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        stdout, stderr = await process.communicate()
        
        if process.returncode != 0:
            print(f"Error minting NFT: {stderr.decode()}")
            return {
                "success": False,
                "error": stderr.decode(),
                "asset_name": asset_name,
                "transaction_hash": None
            }
        
        # Parse the output to get the transaction hash
        output = stdout.decode()
        try:
            result = json.loads(output)
            return {
                "success": True,
                "asset_name": asset_name,
                "transaction_hash": result.get("transaction_hash"),
                "policy_id": result.get("policy_id")
            }
        except json.JSONDecodeError:
            print(f"Error parsing mint_nft.py output: {output}")
            return {
                "success": False,
                "error": "Failed to parse mint_nft.py output",
                "asset_name": asset_name,
                "transaction_hash": None
            }
            
    except Exception as e:
        print(f"Error in mint_nft_async: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "asset_name": asset_name,
            "transaction_hash": None
        }

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    student_id: str = None,
    student_name: str = None,
    university_wallet: str = None
):
    if not all([student_id, student_name, university_wallet]):
        raise HTTPException(status_code=400, detail="Missing required parameters")
    
    try:
        # Save the uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Generate a unique ID for the credential
        credential_uuid = str(uuid.uuid4())
        
        # Start the minting process asynchronously
        minting_result = await mint_nft_async(file_path, student_id, student_name, university_wallet)
        
        # If minting failed, update the credential status to failed
        if not minting_result["success"]:
            await update_credential_status(credential_uuid, None, "failed")
            raise HTTPException(status_code=500, detail=minting_result["error"])
        
        # Return the initial response
        response = {
            "success": True,
            "uuid": credential_uuid,
            "asset_name": minting_result["asset_name"],
            "transaction_hash": minting_result["transaction_hash"],
            "policy_id": minting_result.get("policy_id")
        }
        
        # If we have a transaction hash, update the credential status
        if minting_result["transaction_hash"]:
            await update_credential_status(credential_uuid, minting_result["transaction_hash"])
        
        return response
        
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001) 