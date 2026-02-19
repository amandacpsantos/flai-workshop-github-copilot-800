# OctoFit Database Configuration Summary

## What Has Been Configured

### 1. Django Settings (`settings.py`)

#### Database Configuration
```python
DATABASES = {
    'default': {
        'ENGINE': 'djongo',
        'NAME': 'octofit_db',
        'ENFORCE_SCHEMA': False,
        'CLIENT': {
            'host': 'localhost',
            'port': 27017,
        }
    }
}
```

#### Installed Apps
- `rest_framework` - For REST API functionality
- `corsheaders` - For CORS support
- `octofit_tracker` - Main application

#### CORS Configuration
- `CORS_ALLOW_ALL_ORIGINS = True`
- All HTTP methods enabled (GET, POST, PUT, PATCH, DELETE, OPTIONS)
- All common headers allowed

#### Security Settings (Development)
- `ALLOWED_HOSTS = ['*']`
- `DEBUG = True`

### 2. Management Command (`populate_db.py`)

Created at: `/octofit-tracker/backend/octofit_tracker/management/commands/populate_db.py`

**Features:**
- Uses Django ORM pattern with pymongo for direct MongoDB operations
- Clears existing data before population
- Creates unique index on email field
- Populates 5 collections with superhero-themed test data

**Collections Structure:**

#### Users Collection
- 10 superheroes (5 Marvel, 5 DC)
- Fields: name, email, password, team_id, created_at
- Unique index on email field
- Sample: Iron Man (tony.stark@marvel.com), Batman (bruce.wayne@dc.com)

#### Teams Collection
- Team Marvel (Avengers)
- Team DC (Justice League)
- Fields: team_id, name, description, created_at, members[]

#### Activities Collection
- 30-70 activities distributed across all users
- Activity types: Running, Cycling, Swimming, Weightlifting, Yoga, Boxing
- Fields: user_id, activity_type, duration, distance, calories, date, notes
- Random realistic data for each user

#### Leaderboard Collection
- 10 entries (one per user)
- Calculated from activities: total_activities, total_calories, total_distance, total_duration
- Ranked by total_calories
- Fields: user_id, user_name, team_id, rank, stats, last_updated

#### Workouts Collection
- 6 themed workout plans
- Examples: "Super Soldier Strength Training", "Speedster Cardio Blast", "Warrior Princess Workout"
- Fields: title, description, difficulty, duration, exercises[], created_at, recommended_for[]

## Running the Setup

### Prerequisites
- MongoDB service running on localhost:27017 ✅
- Python virtual environment at `/octofit-tracker/backend/venv` ✅
- Required packages in `requirements.txt` ✅

### Execute Setup

**Quick Method:**
```bash
chmod +x /workspaces/flai-workshop-github-copilot-800/setup_database.sh
/workspaces/flai-workshop-github-copilot-800/setup_database.sh
```

**Manual Method:**
```bash
# 1. Activate virtual environment
source /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend/venv/bin/activate

# 2. Navigate to backend
cd /workspaces/flai-workshop-github-copilot-800/octofit-tracker/backend

# 3. Run migrations
python manage.py makemigrations
python manage.py migrate

# 4. Populate database
python manage.py populate_db

# 5. Verify
mongosh --eval "use octofit_db; db.getCollectionNames()"
```

## Verification Commands

### Check Collections
```bash
mongosh --eval "use octofit_db; db.getCollectionNames()"
```

### View Sample Data
```bash
mongosh --eval "
use octofit_db
print('=== Sample User ===')
printjson(db.users.findOne())
print('\n=== Sample Team ===')
printjson(db.teams.findOne())
print('\n=== Collection Counts ===')
print('Users:', db.users.count())
print('Teams:', db.teams.count())
print('Activities:', db.activities.count())
print('Leaderboard:', db.leaderboard.count())
print('Workouts:', db.workouts.count())
"
```

### Verify Email Index
```bash
mongosh --eval "use octofit_db; db.users.getIndexes()"
```

## Expected Output

After successful setup:
- ✅ 10 users (superheroes)
- ✅ 2 teams (Marvel and DC)
- ✅ 30-70 activities
- ✅ 10 leaderboard entries
- ✅ 6 workout suggestions
- ✅ Unique index on users.email

## Next Steps

1. Run the setup script or manual commands above
2. Verify the database was populated correctly
3. Start creating Django REST API endpoints for each collection
4. Test API endpoints with frontend

## Troubleshooting

If you encounter issues:

1. **MongoDB not running:**
   ```bash
   ps aux | grep mongod
   ```

2. **Virtual environment issues:**
   ```bash
   which python
   pip list | grep -i django
   ```

3. **Database connection issues:**
   ```bash
   mongosh --eval "db.adminCommand('ping')"
   ```
