#!/bin/bash

# Full Stack Notes Application - One-Command Execution Script
# This script sets up and runs the entire application (backend + frontend)

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default environment
ENV=${1:-dev}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Notes App - One-Command Setup${NC}"
echo -e "${GREEN}Environment: $ENV${NC}"
echo -e "${GREEN}========================================${NC}"

# Check for required dependencies
echo -e "\n${YELLOW}Checking dependencies...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is not installed${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All dependencies found${NC}"

# Set environment variable
export ENVIRONMENT=$ENV

# Setup PostgreSQL with Docker
echo -e "\n${YELLOW}Setting up PostgreSQL database...${NC}"

# Check if PostgreSQL container exists
if [ ! "$(docker ps -q -f name=notes-postgres)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=notes-postgres)" ]; then
        # Container exists but is stopped, start it
        echo "Starting existing PostgreSQL container..."
        docker start notes-postgres
    else
        # Container doesn't exist, create it
        echo "Creating PostgreSQL container..."
        docker run -d \
            --name notes-postgres \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -p 5432:5432 \
            postgres:14-alpine
        
        # Wait for PostgreSQL to be ready
        echo "Waiting for PostgreSQL to be ready..."
        sleep 5
    fi
fi

echo -e "${GREEN}✓ PostgreSQL is running${NC}"

# Create databases for all environments
echo -e "\n${YELLOW}Creating databases...${NC}"

docker exec notes-postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'notes_app_dev'" | grep -q 1 || \
    docker exec notes-postgres psql -U postgres -c "CREATE DATABASE notes_app_dev;"

docker exec notes-postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'notes_app_test'" | grep -q 1 || \
    docker exec notes-postgres psql -U postgres -c "CREATE DATABASE notes_app_test;"

docker exec notes-postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'notes_app_prod'" | grep -q 1 || \
    docker exec notes-postgres psql -U postgres -c "CREATE DATABASE notes_app_prod;"

echo -e "${GREEN}✓ Databases created${NC}"

# Setup Backend
echo -e "\n${YELLOW}Setting up backend...${NC}"

cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate || source venv/Scripts/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt

# Run migrations
echo "Running database migrations..."
alembic upgrade head

echo -e "${GREEN}✓ Backend setup complete${NC}"

# Start backend in background
echo -e "\n${YELLOW}Starting backend server...${NC}"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo -e "${GREEN}✓ Backend running on http://localhost:8000${NC}"
echo -e "${GREEN}  API Docs: http://localhost:8000/api/docs${NC}"

cd ..

# Setup Frontend
echo -e "\n${YELLOW}Setting up frontend...${NC}"

cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "Installing Node dependencies..."
    npm install
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"

# Start frontend
echo -e "\n${YELLOW}Starting frontend server...${NC}"
npm run dev &
FRONTEND_PID=$!

cd ..

# Display information
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Application is running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "\nBackend:  ${GREEN}http://localhost:8000${NC}"
echo -e "Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "API Docs: ${GREEN}http://localhost:8000/api/docs${NC}"
echo -e "\nEnvironment: ${YELLOW}$ENV${NC}"
echo -e "\n${YELLOW}Press Ctrl+C to stop all servers${NC}\n"

# Wait for Ctrl+C
trap "echo -e '\n${YELLOW}Stopping servers...${NC}'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
