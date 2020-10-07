#!/bin/bash

# Description:  This is the building and deploying script for BCOS.
# Build for beta by typing './build_deploy.sh --beta'

if [[ $1 == '--prod' ]]
then

# Navigate to /home/portal_user/bco_editor/frontend/
cd /home/portal_user/bco_editor/frontend/

elif [[ $1 == '--beta' ]]
then

# Navigate to /home/beta_portal_user/bco_editor/frontend/
cd /home/beta_portal_user/bco_editor/frontend/

else

# Bad parameters.
echo 'Invalid build parameters!  Please provide the --prod or --beta flag.'

# Getoulathere.
exit 1

fi

# Get rid of the build folder.
rm -rf build

# Install node packages, then build.
# The install command has to be run with sudo?, see https://github.com/sass/node-sass/issues/2264
# sudo -u portal_user npm install
npm install
npm run-script build

if [[ $1 == '--prod' ]]
then

# Get rid of everything in the portal already.
cd /var/www/html/portal/
sudo rm -rf *

# Go back to the build folder and copy everything over.
cd /home/portal_user/bco_editor/frontend/build/
sudo cp -rf ./ /var/www/html/portal/

elif [[ $1 == '--beta' ]]
then

# Get rid of everything in the beta portal already.
cd /var/www/html/beta_portal/
sudo rm -rf *

# Go back to the build folder and copy everything over.
cd /home/beta_portal_user/bco_editor/frontend/build/
sudo cp -rf ./ /var/www/html/beta_portal/

fi
