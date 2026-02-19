from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .models import OctoFitUser, Team, Activity, Leaderboard, Workout
from .serializers import (
    OctoFitUserSerializer,
    TeamSerializer,
    ActivitySerializer,
    LeaderboardSerializer,
    WorkoutSerializer,
)


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


class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer


class LeaderboardViewSet(viewsets.ModelViewSet):
    queryset = Leaderboard.objects.all().order_by('-score')
    serializer_class = LeaderboardSerializer


class WorkoutViewSet(viewsets.ModelViewSet):
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
