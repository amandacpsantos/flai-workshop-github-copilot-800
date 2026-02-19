# OctoFit Database Verification

Run these commands to verify your database setup:

## 1. Check Collections
```bash
mongosh --eval "use octofit_db; db.getCollectionNames()"
```

**Expected:** 5 collections (users, teams, activities, leaderboard, workouts)

## 2. Check Document Counts
```bash
mongosh --quiet --eval "
use octofit_db
print('Users:', db.users.countDocuments({}))
print('Teams:', db.teams.countDocuments({}))
print('Activities:', db.activities.countDocuments({}))
print('Leaderboard:', db.leaderboard.countDocuments({}))
print('Workouts:', db.workouts.countDocuments({}))
"
```

**Expected:**
- Users: 10
- Teams: 2
- Activities: 30-70
- Leaderboard: 10
- Workouts: 6

## 3. View Sample User
```bash
mongosh --quiet --eval "use octofit_db; db.users.findOne()"
```

**Expected:** Iron Man or another superhero

## 4. View Teams
```bash
mongosh --quiet --eval "use octofit_db; db.teams.find().pretty()"
```

**Expected:** Team Marvel and Team DC

## 5. View Top 3 Leaderboard
```bash
mongosh --quiet --eval "use octofit_db; db.leaderboard.find().sort({rank: 1}).limit(3).forEach(e => print(e.rank + '. ' + e.user_name + ' - ' + e.total_calories + ' calories'))"
```

**Expected:** Ranked list of superheroes by calories

## 6. Verify Email Index
```bash
mongosh --quiet --eval "use octofit_db; db.users.getIndexes()"
```

**Expected:** Should include unique index on `email` field

## 7. Test Django Connection
```bash
source /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend/venv/bin/activate
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend
python manage.py shell -c "from pymongo import MongoClient; client = MongoClient('localhost', 27017); print('Django can connect to MongoDB:', client.octofit_db.users.count_documents({}) > 0)"
```

**Expected:** `Django can connect to MongoDB: True`

## All-in-One Verification
```bash
mongosh --quiet --eval "
use octofit_db
print('\\n=== OctoFit Database Status ===\\n')
print('Collections:', db.getCollectionNames().length)
db.getCollectionNames().forEach(c => print('  ✓', c))
print('\\nDocument Counts:')
print('  Users........:', db.users.countDocuments({}))
print('  Teams........:', db.teams.countDocuments({}))
print('  Activities...:', db.activities.countDocuments({}))
print('  Leaderboard..:', db.leaderboard.countDocuments({}))
print('  Workouts.....:', db.workouts.countDocuments({}))
print('\\nTop 3 Athletes:')
db.leaderboard.find().sort({rank: 1}).limit(3).forEach(e => 
  print('  ' + e.rank + '. ' + e.user_name + ' (' + e.total_calories + ' cal)')
)
print('\\nIndexes on users collection:', db.users.getIndexes().length)
print('\\n=== Setup Complete! ===\\n')
"
```

## If Issues Found

### Reset Database
```bash
mongosh --eval "use octofit_db; db.dropDatabase()"
```

### Re-run Population
```bash
source /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend/venv/bin/activate
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend
python manage.py populate_db
```
