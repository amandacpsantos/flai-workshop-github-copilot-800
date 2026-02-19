from django.core.management.base import BaseCommand
from pymongo import MongoClient, ASCENDING
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        self.stdout.write(self.style.SUCCESS('Connected to MongoDB'))

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Create unique index on email field
        db.users.create_index([("email", ASCENDING)], unique=True)
        self.stdout.write(self.style.SUCCESS('Created unique index on email field'))

        # Sample data - Superheroes
        marvel_heroes = [
            {
                'name': 'Iron Man',
                'email': 'tony.stark@marvel.com',
                'password': 'hashed_password',
                'team_id': 1,
                'created_at': datetime.now()
            },
            {
                'name': 'Captain America',
                'email': 'steve.rogers@marvel.com',
                'password': 'hashed_password',
                'team_id': 1,
                'created_at': datetime.now()
            },
            {
                'name': 'Thor',
                'email': 'thor.odinson@marvel.com',
                'password': 'hashed_password',
                'team_id': 1,
                'created_at': datetime.now()
            },
            {
                'name': 'Black Widow',
                'email': 'natasha.romanoff@marvel.com',
                'password': 'hashed_password',
                'team_id': 1,
                'created_at': datetime.now()
            },
            {
                'name': 'Hulk',
                'email': 'bruce.banner@marvel.com',
                'password': 'hashed_password',
                'team_id': 1,
                'created_at': datetime.now()
            },
        ]

        dc_heroes = [
            {
                'name': 'Batman',
                'email': 'bruce.wayne@dc.com',
                'password': 'hashed_password',
                'team_id': 2,
                'created_at': datetime.now()
            },
            {
                'name': 'Superman',
                'email': 'clark.kent@dc.com',
                'password': 'hashed_password',
                'team_id': 2,
                'created_at': datetime.now()
            },
            {
                'name': 'Wonder Woman',
                'email': 'diana.prince@dc.com',
                'password': 'hashed_password',
                'team_id': 2,
                'created_at': datetime.now()
            },
            {
                'name': 'Flash',
                'email': 'barry.allen@dc.com',
                'password': 'hashed_password',
                'team_id': 2,
                'created_at': datetime.now()
            },
            {
                'name': 'Aquaman',
                'email': 'arthur.curry@dc.com',
                'password': 'hashed_password',
                'team_id': 2,
                'created_at': datetime.now()
            },
        ]

        # Insert users
        all_users = marvel_heroes + dc_heroes
        result = db.users.insert_many(all_users)
        user_ids = result.inserted_ids
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(user_ids)} users'))

        # Insert teams
        teams = [
            {
                'team_id': 1,
                'name': 'Team Marvel',
                'description': 'Earth\'s Mightiest Heroes',
                'created_at': datetime.now(),
                'members': [user_ids[i] for i in range(5)]
            },
            {
                'team_id': 2,
                'name': 'Team DC',
                'description': 'Justice League',
                'created_at': datetime.now(),
                'members': [user_ids[i] for i in range(5, 10)]
            },
        ]
        result = db.teams.insert_many(teams)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(result.inserted_ids)} teams'))

        # Insert activities
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Boxing']
        activities = []
        
        for i, user_id in enumerate(user_ids):
            # Each user has 3-7 activities
            num_activities = random.randint(3, 7)
            for j in range(num_activities):
                activity = {
                    'user_id': user_id,
                    'activity_type': random.choice(activity_types),
                    'duration': random.randint(15, 120),  # minutes
                    'distance': round(random.uniform(1, 25), 2),  # km
                    'calories': random.randint(100, 800),
                    'date': datetime.now() - timedelta(days=random.randint(0, 30)),
                    'notes': f'Great {random.choice(activity_types).lower()} session'
                }
                activities.append(activity)
        
        result = db.activities.insert_many(activities)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(result.inserted_ids)} activities'))

        # Calculate and insert leaderboard data
        leaderboard = []
        for i, user_id in enumerate(user_ids):
            user = all_users[i]
            # Calculate total stats from activities
            user_activities = [a for a in activities if a['user_id'] == user_id]
            total_activities = len(user_activities)
            total_calories = sum(a['calories'] for a in user_activities)
            total_distance = sum(a['distance'] for a in user_activities)
            total_duration = sum(a['duration'] for a in user_activities)
            
            leaderboard_entry = {
                'user_id': user_id,
                'user_name': user['name'],
                'team_id': user['team_id'],
                'total_activities': total_activities,
                'total_calories': total_calories,
                'total_distance': round(total_distance, 2),
                'total_duration': total_duration,
                'rank': 0,  # Will be calculated based on total_calories
                'last_updated': datetime.now()
            }
            leaderboard.append(leaderboard_entry)
        
        # Sort by total_calories and assign ranks
        leaderboard.sort(key=lambda x: x['total_calories'], reverse=True)
        for rank, entry in enumerate(leaderboard, start=1):
            entry['rank'] = rank
        
        result = db.leaderboard.insert_many(leaderboard)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(result.inserted_ids)} leaderboard entries'))

        # Insert workout suggestions
        workouts = [
            {
                'title': 'Super Soldier Strength Training',
                'description': 'Build strength like Captain America',
                'difficulty': 'Advanced',
                'duration': 60,
                'exercises': [
                    'Push-ups: 4 sets of 25',
                    'Pull-ups: 4 sets of 15',
                    'Squats: 4 sets of 30',
                    'Bench Press: 4 sets of 12',
                    'Deadlifts: 4 sets of 10'
                ],
                'created_at': datetime.now(),
                'recommended_for': ['strength', 'muscle building']
            },
            {
                'title': 'Speedster Cardio Blast',
                'description': 'Run fast like The Flash',
                'difficulty': 'Intermediate',
                'duration': 45,
                'exercises': [
                    'Sprint intervals: 10x100m',
                    'Jumping jacks: 3 sets of 50',
                    'Burpees: 3 sets of 20',
                    'Mountain climbers: 3 sets of 30',
                    'Cool down jog: 10 minutes'
                ],
                'created_at': datetime.now(),
                'recommended_for': ['cardio', 'speed', 'endurance']
            },
            {
                'title': 'Warrior Princess Workout',
                'description': 'Train like Wonder Woman',
                'difficulty': 'Advanced',
                'duration': 75,
                'exercises': [
                    'Sword swings (or similar): 3 sets of 20',
                    'Shield raises: 3 sets of 25',
                    'Lunges: 4 sets of 15 per leg',
                    'Planks: 4 sets of 90 seconds',
                    'Battle rope: 3 sets of 45 seconds'
                ],
                'created_at': datetime.now(),
                'recommended_for': ['strength', 'endurance', 'agility']
            },
            {
                'title': 'Zen Master Flexibility',
                'description': 'Find your inner peace with yoga',
                'difficulty': 'Beginner',
                'duration': 30,
                'exercises': [
                    'Sun salutations: 5 rounds',
                    'Warrior poses: Hold each for 1 minute',
                    'Tree pose: 1 minute per side',
                    'Child\'s pose: 3 minutes',
                    'Meditation: 5 minutes'
                ],
                'created_at': datetime.now(),
                'recommended_for': ['flexibility', 'balance', 'mindfulness']
            },
            {
                'title': 'Aquatic Endurance Training',
                'description': 'Train like the King of Atlantis',
                'difficulty': 'Intermediate',
                'duration': 60,
                'exercises': [
                    'Swimming laps: 20 lengths',
                    'Underwater sprints: 5 sets',
                    'Water treading: 10 minutes',
                    'Pool-edge push-ups: 3 sets of 15',
                    'Water resistance training: 20 minutes'
                ],
                'created_at': datetime.now(),
                'recommended_for': ['swimming', 'endurance', 'full body']
            },
            {
                'title': 'Dark Knight HIIT',
                'description': 'High intensity training for vigilant heroes',
                'difficulty': 'Advanced',
                'duration': 40,
                'exercises': [
                    'Box jumps: 4 sets of 20',
                    'Kettlebell swings: 4 sets of 25',
                    'Medicine ball slams: 4 sets of 15',
                    'Battle ropes: 4 sets of 45 seconds',
                    'Tire flips: 3 sets of 10'
                ],
                'created_at': datetime.now(),
                'recommended_for': ['HIIT', 'strength', 'power']
            },
        ]
        
        result = db.workouts.insert_many(workouts)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(result.inserted_ids)} workout suggestions'))

        # Close connection
        client.close()

        self.stdout.write(self.style.SUCCESS('Database population completed successfully!'))
