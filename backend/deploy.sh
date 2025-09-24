#!/bin/bash

# School Visiting Management System Deployment Script
# This script deploys the SVMS to production

set -e

echo "🚀 Starting SVMS Deployment..."

# Create logs directory
mkdir -p logs

# Copy production environment file
if [ -f ".env.production" ]; then
    cp .env.production .env
    echo "✅ Production environment variables loaded"
else
    echo "❌ .env.production file not found!"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Create uploads directory
mkdir -p uploads

# Set proper permissions
chmod 755 uploads
chmod 755 logs

# Start/Restart the application with PM2
echo "🔄 Starting application with PM2..."
pm2 start ecosystem.config.js --env production
pm2 save

echo "✅ SVMS Backend deployed successfully!"
echo "📊 Check status: pm2 status"
echo "📋 View logs: pm2 logs svms-backend"