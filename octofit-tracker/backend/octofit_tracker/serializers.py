from rest_framework import serializers
from pymongo import MongoClient
from bson import ObjectId
from .models import OctoFitUser, Team, Activity, Leaderboard, Workout


def get_mongo_db():
    client = MongoClient('localhost', 27017)
    return client['octofit_db']


class OctoFitUserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    def get__id(self, obj):
        return str(obj._id)

    class Meta:
        model = OctoFitUser
        fields = ['_id', 'name', 'username', 'email', 'password', 'age']


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()

    def get__id(self, obj):
        return str(obj._id)

    def get_members(self, obj):
        try:
            db = get_mongo_db()
            team_doc = db.teams.find_one({'_id': ObjectId(str(obj._id))})
            if not team_doc or not team_doc.get('members'):
                return []
            member_ids = [ObjectId(str(mid)) for mid in team_doc['members']]
            users = list(db.users.find({'_id': {'$in': member_ids}}))
            return [
                {
                    '_id': str(u['_id']),
                    'name': u.get('name', ''),
                    'username': u.get('username', ''),
                    'email': u.get('email', ''),
                }
                for u in users
            ]
        except Exception:
            return []

    class Meta:
        model = Team
        fields = ['_id', 'name', 'members']


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    user = OctoFitUserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=OctoFitUser.objects.all(), source='user', write_only=True
    )

    def get__id(self, obj):
        return str(obj._id)

    class Meta:
        model = Activity
        fields = ['_id', 'user', 'user_id', 'activity_type', 'duration', 'date']


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    user = OctoFitUserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=OctoFitUser.objects.all(), source='user', write_only=True
    )

    def get__id(self, obj):
        return str(obj._id)

    class Meta:
        model = Leaderboard
        fields = ['_id', 'user', 'user_id', 'score']


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    def get__id(self, obj):
        return str(obj._id)

    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'exercises']
