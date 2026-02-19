from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import OctoFitUser, Team, Activity, Leaderboard, Workout
import datetime


class OctoFitUserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            age=17,
        )

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
            'age': 16,
        }
        response = self.client.post('/api/users/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class TeamTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            username='teamuser',
            email='team@example.com',
            password='pass',
            age=18,
        )
        self.team = Team.objects.create(name='Alpha Team')

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        data = {'name': 'Beta Team'}
        response = self.client.post('/api/teams/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ActivityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            username='actuser',
            email='act@example.com',
            password='pass',
            age=15,
        )

    def test_list_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LeaderboardTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = OctoFitUser.objects.create(
            username='lbuser',
            email='lb@example.com',
            password='pass',
            age=16,
        )

    def test_list_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class WorkoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.workout = Workout.objects.create(
            name='Morning Routine',
            description='A light morning workout',
            exercises=['push-ups', 'sit-ups', 'jumping jacks'],
        )

    def test_list_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_workout(self):
        data = {
            'name': 'Evening Run',
            'description': 'A 5km evening run',
            'exercises': ['warm-up', 'run', 'cool-down'],
        }
        response = self.client.post('/api/workouts/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ApiRootTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_api_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_root_redirects_to_api(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
