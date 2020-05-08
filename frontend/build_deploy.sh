#!/bin/bash

# Description:  This is the building and deploying script for BCOS.

# Navigate to /home/portal_user/bco_editor/frontend/
cd /home/portal_user/bco_editor/frontend/

# Get rid of the build folder.
rm -rf build

# Install node packages, then build.
# The install command has to be run with sudo?, see https://github.com/sass/node-sass/issues/2264
# sudo -u portal_user npm install
npm install
npm run-script build

# Get rid of everything in the portal already.
cd /var/www/html/portal/
sudo rm -rf *

# Go back to the build folder and copy everything over.
cd /home/portal_user/bco_editor/frontend/build/
sudo cp -rf ./ /var/www/html/portal/

# Restart nginx and gunicorn.
#systemctl restart nginx
#systemctl restart gunicorn
