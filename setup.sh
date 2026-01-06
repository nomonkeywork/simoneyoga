#!/bin/bash
# Setup script for SimoneYoga project

echo "🚀 Setting up SimoneYoga project..."

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Frontend dependencies already installed"
fi
cd ..

# Build frontend
echo "🔨 Building React app..."
cd frontend
npm run build
cd ..

# Prepare deploy folder
echo "📁 Preparing deploy folder..."
rm -rf deploy/assets deploy/api deploy/config
mkdir -p deploy/assets deploy/api deploy/config

# Copy React build
echo "📋 Copying React build..."
cp -r frontend/dist/* deploy/assets/ 2>/dev/null || echo "⚠️  Build output not found. Run 'npm run build' in frontend/ first"

# Copy PHP backend
echo "📋 Copying PHP backend..."
cp -r backend/api/* deploy/api/ 2>/dev/null || echo "⚠️  Backend files not found"
cp -r backend/config/* deploy/config/ 2>/dev/null || echo "⚠️  Config files not found"

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Run database-schema.sql in your MariaDB database"
echo "2. Configure GitHub Secrets (FTP_SERVER, FTP_USER, FTP_PASSWORD)"
echo "3. Push to main branch to trigger auto-deployment"

