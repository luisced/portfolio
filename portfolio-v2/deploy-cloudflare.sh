#!/bin/bash

# Build the project
echo "Building the project..."
npm run build

# Copy configuration files to the dist folder
echo "Copying configuration files to dist folder..."
# _headers and _redirects files are already in the dist folder

# Deploy to Cloudflare Pages
echo "Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=portfolio --branch=main

echo "Deployment complete!"
