#!/bin/bash

# This file should be in ~/bco_editor/frontend

# Build the files.
npm run-script build
# Move the files.
sudo cp -rf ./build /var/www/frontend/build
# Restart the services.
sudo systemctl restart gunicorn.service
sudo systemctl restart nginx