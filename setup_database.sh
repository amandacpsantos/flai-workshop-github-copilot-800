#!/bin/bash

# Setup and populate OctoFit database

echo "============================================"
echo "OctoFit Database Setup Script"
echo "============================================"
echo ""

# Activate virtual environment
echo "Activating virtual environment..."
source /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend/venv/bin/activate

# Navigate to backend directory
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend

# Run migrations
echo "Running makemigrations..."
python manage.py makemigrations

echo ""
echo "Running migrate..."
python manage.py migrate

echo ""
echo "Populating database with test data..."
python manage.py populate_db

echo ""
echo "============================================"
echo "Setup complete!"
echo "============================================"
echo ""
echo "Verifying database with MongoDB..."
echo ""

# Verify with mongosh
mongosh --quiet --eval "
use octofit_db
print('\\n=== Collections in octofit_db ===')
db.getCollectionNames().forEach(function(col) {
    print('- ' + col)
})
print('\\n=== Sample User ===')
printjson(db.users.findOne())
print('\\n=== Sample Team ===')
printjson(db.teams.findOne())
print('\\n=== Sample Activity ===')
printjson(db.activities.findOne())
print('\\n=== Sample Leaderboard Entry ===')
printjson(db.leaderboard.findOne())
print('\\n=== Sample Workout ===')
printjson(db.workouts.findOne())
print('\\n=== Collection Stats ===')
print('Users: ' + db.users.count())
print('Teams: ' + db.teams.count())
print('Activities: ' + db.activities.count())
print('Leaderboard: ' + db.leaderboard.count())
print('Workouts: ' + db.workouts.count())
"

echo ""
echo "Done!"
