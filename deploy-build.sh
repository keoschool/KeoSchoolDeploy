#!/bin/bash
# Deployment build script that creates the correct directory structure

echo "Starting deployment build..."

# Clean previous build
rm -rf dist

# Run the standard build
echo "Building client and server..."
npm run build

# Check if build succeeded
if [ $? -ne 0 ]; then
    echo "Build failed"
    exit 1
fi

# Create the expected directory structure
echo "Fixing directory structure for deployment..."
mkdir -p dist/public

# Move all client files to dist/public (keeping server files in dist root)
find dist -maxdepth 1 -type f -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "*.map" | while read file; do
    if [[ ! "$(basename "$file")" == "index.js" ]]; then
        mv "$file" dist/public/
    fi
done

# Move assets directory if it exists
if [ -d "dist/assets" ]; then
    mv dist/assets dist/public/
fi

echo "Build completed successfully!"
echo "Structure:"
echo "dist/"
echo "├── index.js (server)"
echo "└── public/ (client assets)"
ls -la dist/
ls -la dist/public/ 2>/dev/null || echo "No public directory contents"