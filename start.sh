#!/bin/bash

# Install dependencies
echo "Installing backend dependencies..."
cd server && npm install

echo "Installing frontend dependencies..."
cd ../client && npm install

# Build frontend
echo "Building frontend..."
npm run build

# Start backend server
echo "Starting backend server..."
cd ../server && npm run dev &

# Start frontend (for development)
echo "Starting frontend..."
cd ../client && npm start
