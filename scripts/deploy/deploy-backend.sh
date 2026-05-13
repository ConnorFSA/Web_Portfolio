#!/bin/bash
# This script runs ON THE SERVER, called by the GitHub Action.
# The action already pulled deploy/ before calling this,
# so this script always runs its latest version.
set -e  # exit immediately if any command fails

echo "============================="
echo " Starting backend deployment "
echo "============================="

# Pull only the backend folder from main
echo "Pulling latest backend code..."
cd /home/ubuntu/Web_Portfolio
git fetch origin main
git checkout origin/main -- backend/

# Activate venv and install any new/updated dependencies
echo "Installing Python dependencies..."
cd /home/ubuntu/Web_Portfolio/backend
source venv/bin/activate
pip install -r requirements.txt --quiet

# Restart Gunicorn to pick up the new code
echo "Restarting Gunicorn..."
sudo systemctl restart flask-app

# Confirm it came back up — if it failed, this will exit with error and the GitHub Action will report a failure
echo "Verifying Gunicorn is running..."
sudo systemctl is-active flask-app

echo "============================="
echo " Backend deployment complete! "
echo "============================="