from django.contrib import admin
from .models import OctoFitUser, Team, Activity, Leaderboard, Workout


@admin.register(OctoFitUser)
class OctoFitUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'age')
    search_fields = ('username', 'email')


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'activity_type', 'duration', 'date')
    list_filter = ('activity_type', 'date')
    search_fields = ('user__username', 'activity_type')


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('user', 'score')
    ordering = ('-score',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
