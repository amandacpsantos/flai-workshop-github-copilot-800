from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
from rest_framework.reverse import reverse
from pymongo import MongoClient
from bson import ObjectId
from .models import OctoFitUser, Team, Activity, Leaderboard, Workout
from .serializers import (
    OctoFitUserSerializer,
    TeamSerializer,
    ActivitySerializer,
    LeaderboardSerializer,
    WorkoutSerializer,
)


def get_mongo_db():
    client = MongoClient('localhost', 27017)
    return client['octofit_db']


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('octofit_tracker:octofit-user-list', request=request, format=format),
        'teams': reverse('octofit_tracker:team-list', request=request, format=format),
        'activities': reverse('octofit_tracker:activity-list', request=request, format=format),
        'leaderboard': reverse('octofit_tracker:leaderboard-list', request=request, format=format),
        'workouts': reverse('octofit_tracker:workout-list', request=request, format=format),
    })


class OctoFitUserViewSet(viewsets.ModelViewSet):
    queryset = OctoFitUser.objects.all()
    serializer_class = OctoFitUserSerializer

    def partial_update(self, request, pk=None):
        """Update user fields + team membership directly in MongoDB."""
        db = get_mongo_db()
        try:
            user_oid = ObjectId(pk)
        except Exception:
            return Response({'error': 'Invalid user id'}, status=status.HTTP_400_BAD_REQUEST)

        # Fields to update on the user document
        update_fields = {}
        for field in ('name', 'username', 'email', 'age'):
            if field in request.data:
                val = request.data[field]
                if field == 'age':
                    try:
                        update_fields[field] = int(val) if val not in (None, '') else None
                    except (ValueError, TypeError):
                        update_fields[field] = None
                else:
                    update_fields[field] = val

        if update_fields:
            db.users.update_one({'_id': user_oid}, {'$set': update_fields})

        # Handle team membership change
        if 'team_id' in request.data:
            new_team_id = request.data.get('team_id')
            # Remove user from all teams first
            db.teams.update_many({}, {'$pull': {'members': user_oid}})
            if new_team_id is not None:
                try:
                    new_team_id = int(new_team_id)
                except (ValueError, TypeError):
                    new_team_id = None
                if new_team_id is not None:
                    # Add user to the chosen team
                    db.teams.update_one({'team_id': new_team_id}, {'$addToSet': {'members': user_oid}})

        # Return updated user doc
        doc = db.users.find_one({'_id': user_oid})
        if not doc:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Find current team
        team_doc = db.teams.find_one({'members': user_oid})
        return Response({
            '_id': str(doc['_id']),
            'name': doc.get('name', ''),
            'username': doc.get('username', ''),
            'email': doc.get('email', ''),
            'age': doc.get('age', 0),
            'team_id': team_doc.get('team_id') if team_doc else None,
            'team': team_doc.get('name') if team_doc else None,
        })


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class LeaderboardViewSet(ViewSet):
    """Returns leaderboard data directly from MongoDB."""

    def list(self, request):
        db = get_mongo_db()

        # Build a team_id -> team_name map
        teams = {t.get('team_id'): t.get('name', 'Unknown') for t in db.teams.find({})}

        entries = []
        for doc in db.leaderboard.find({}).sort('rank', 1):
            team_id = doc.get('team_id')
            entries.append({
                '_id': str(doc['_id']),
                'user_name': doc.get('user_name', 'N/A'),
                'team': teams.get(team_id, f'Team {team_id}' if team_id else 'N/A'),
                'total_calories': doc.get('total_calories', 0),
                'total_activities': doc.get('total_activities', 0),
                'total_distance': doc.get('total_distance', 0),
                'total_duration': doc.get('total_duration', 0),
                'rank': doc.get('rank', 0),
            })
        return Response(entries)


class WorkoutViewSet(ViewSet):
    """Returns workout data directly from MongoDB."""

    def list(self, request):
        db = get_mongo_db()
        workouts = []
        for doc in db.workouts.find({}):
            workouts.append({
                '_id': str(doc['_id']),
                'title': doc.get('title', doc.get('name', 'N/A')),
                'description': doc.get('description', ''),
                'difficulty': doc.get('difficulty', 'N/A'),
                'duration': doc.get('duration', 0),
                'exercises': doc.get('exercises', []),
                'recommended_for': doc.get('recommended_for', []),
            })
        return Response(workouts)
