FROM python:3.9-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all NFT directory contents
COPY . .

EXPOSE 8001

# Use uvicorn to run the mint_nft.py app
CMD ["uvicorn", "mint_nft:app", "--host", "0.0.0.0", "--port", "8001", "--reload"] 