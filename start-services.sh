#!/bin/bash

# Create uploads directory if it doesn't exist
mkdir -p uploads

# Start Python service
echo "Starting Python NFT service..."
cd backend/api/nft
uvicorn mint_nft:app --reload --port 8001 &
PYTHON_PID=$!
cd ../../..

# Start Node.js service from backend directory
echo "Starting Node.js service..."
cd backend
npm start &
NODE_PID=$!
cd ..

# Function to handle script termination
cleanup() {
    echo "Shutting down services..."
    kill $PYTHON_PID
    kill $NODE_PID
    exit
}

# Trap SIGINT and SIGTERM signals
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait $PYTHON_PID $NODE_PID 