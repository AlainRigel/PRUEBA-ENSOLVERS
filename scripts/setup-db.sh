#!/bin/bash

# Database setup script for PostgreSQL

set -e

echo "Setting up PostgreSQL database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running"
    exit 1
fi

# Start PostgreSQL container
if [ ! "$(docker ps -q -f name=notes-postgres)" ]; then
    if [ "$(docker ps -aq -f status=exited -f name=notes-postgres)" ]; then
        docker start notes-postgres
    else
        docker run -d \
            --name notes-postgres \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -p 5432:5432 \
            postgres:14-alpine
        
        sleep 5
    fi
fi

# Create databases
docker exec notes-postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'notes_app_dev'" | grep -q 1 || \
    docker exec notes-postgres psql -U postgres -c "CREATE DATABASE notes_app_dev;"

docker exec notes-postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'notes_app_test'" | grep -q 1 || \
    docker exec notes-postgres psql -U postgres -c "CREATE DATABASE notes_app_test;"

docker exec notes-postgres psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'notes_app_prod'" | grep -q 1 || \
    docker exec notes-postgres psql -U postgres -c "CREATE DATABASE notes_app_prod;"

echo "✓ Database setup complete"
