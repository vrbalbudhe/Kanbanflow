#!/bin/bash
set -e

APP_DIR="/var/www/kbf"

cd $APP_DIR

echo "Starting Node application from $APP_DIR..."
echo "Fetching environment variables from AWS Parameter Store..."

# Parameter Store paths
DATABASE_URL_PARAM="/kbf/DATABASE_URL"
FRONTEND_URL_PARAM="/kbf/FRONTEND_URL"
JWT_SECRET_PARAM="/kbf/JWT_SECRET"
BACKEND_PORT_PARAM="/kbf/BACKEND_PORT"
VITE_API_URL_PARAM="/kbf/VITE_API_URL"

# Fetching parameters
echo "Fetching DATABASE_URL..."
DATABASE_URL=$(aws ssm get-parameter --name "$DATABASE_URL_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch DATABASE_URL"; exit 1; }

echo "Fetching FRONTEND_URL..."
FRONTEND_URL=$(aws ssm get-parameter --name "$FRONTEND_URL_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch FRONTEND_URL"; exit 1; }

echo "Fetching JWT_SECRET..."
JWT_SECRET=$(aws ssm get-parameter --name "$JWT_SECRET_PARAM" --with-decryption --query Parameter.Value --output text) || { echo "Failed to fetch JWT_SECRET"; exit 1; }

echo "Fetching BACKEND_PORT..."
BACKEND_PORT=$(aws ssm get-parameter --name "$BACKEND_PORT_PARAM" --query Parameter.Value --output text) || { echo "Failed to fetch BACKEND_PORT"; exit 1; }

echo "Fetching VITE_API_URL..."
VITE_API_URL=$(aws ssm get-parameter --name "$VITE_API_URL_PARAM" --query Parameter.Value --output text) || { echo "Failed to fetch VITE_API_URL"; exit 1; }

# Write to .env
echo "Writing .env file..."
cat > "$APP_DIR/.env" << EOF
DATABASE_URL=${DATABASE_URL}
FRONTEND_URL=${FRONTEND_URL}
JWT_SECRET=${JWT_SECRET}
PORT=${BACKEND_PORT}
VITE_API_URL=${VITE_API_URL}
EOF

echo "Starting application with PM2..."

if ! command -v pm2 &> /dev/null; then
    echo "PM2 not found. Installing PM2 globally..."
    npm install -g pm2
fi

if ! command -v node &> /dev/null; then
    echo "Node.js not found. Please ensure Node.js is installed."
    exit 1
fi

pm2 start "$APP_DIR/app.js" --name "kbf" --env production

pm2 startup | bash || echo "PM2 startup script failed, you may need to configure it manually"
pm2 save || echo "PM2 save command failed"

echo "Application started successfully."
