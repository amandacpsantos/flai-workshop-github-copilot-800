from rest_framework import serializers
from .models import OctoFitUser, Team, Activity, Leaderboard, Workout


class OctoFitUserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    def get__id(self, obj):
        return str(obj._id)

    class Meta:
        model = OctoFitUser
        fields = ['_id', 'name', 'username', 'email', 'password', 'age']


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()
    members = OctoFitUserSerializer(many=True, read_only=True)

    def get__id(self, obj):
        return str(obj._id)

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
