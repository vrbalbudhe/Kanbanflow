#!/bin/bash
set -e
echo "Installing Node.js..."
yum update -y
curl -sL https://rpm.nodesource.com/setup_16.x | bash -
yum install -y nodejs
mkdir -p /var/www/kbf
npm install -g pm2
echo "Node.js version:"
node -v
echo "npm version:"
npm -v
echo "PM2 version:"
pm2 -v
echo "Node.js installation completed"