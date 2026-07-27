from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from users.models import User
from athletes.models import AthleteProfile, ProfileView


class AthleteProfileTests(TestCase):

    def setUp(self):
        # Create API client
        self.client = APIClient()

        # Create test users
        self.athlete = User.objects.create_user(
            username='athlete1',
            email='athlete@test.com',
            password='testpass123',
            role='athlete'
        )

        self.coach = User.objects.create_user(
            username='coach1',
            email='coach@test.com',
            password='testpass123',
            role='coach'
        )

        # Create an athlete profile for testing
        self.profile = AthleteProfile.objects.create(
            user=self.athlete,
            sport='football',
            position='Quarterback',
            grad_year=2027,
            gpa=3.5,
            intended_major='Computer Science',
            stats={
                "passing_yards": 3000
            }
        )

        # Authenticate as athlete by default
        self.client.force_authenticate(user=self.athlete)


    def test_get_my_profile(self):
        res = self.client.get('/api/athletes/me/')

        self.assertEqual(
            res.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            res.data['sport'],
            'football'
        )


    def test_create_athlete_profile(self):
        # Remove existing profile because users can only have one profile
        AthleteProfile.objects.filter(
            user=self.athlete
        ).delete()

        res = self.client.post('/api/athletes/', {
            'sport': 'hockey',
            'position': 'Forward',
            'grad_year': 2028,
            'gpa': 3.8,
            'intended_major': 'Business'
        }, format='json')

        self.assertEqual(
            res.status_code,
            status.HTTP_201_CREATED
        )

        self.assertEqual(
            AthleteProfile.objects.count(),
            1
        )


    def test_cannot_create_duplicate_profile(self):
        res = self.client.post('/api/athletes/', {
            'sport': 'basketball',
            'position': 'Guard'
        }, format='json')

        self.assertEqual(
            res.status_code,
            status.HTTP_400_BAD_REQUEST
        )


    def test_get_athlete_profile(self):
        res = self.client.get(
            f'/api/athletes/{self.profile.id}/'
        )

        self.assertEqual(
            res.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            res.data['position'],
            'Quarterback'
        )


    def test_update_profile(self):
        res = self.client.put(
            f'/api/athletes/{self.profile.id}/',
            {
                'position': 'Running Back'
            },
            format='json'
        )

        self.assertEqual(
            res.status_code,
            status.HTTP_200_OK
        )

        self.profile.refresh_from_db()

        self.assertEqual(
            self.profile.position,
            'Running Back'
        )


    def test_only_owner_can_update_profile(self):
        # Coach tries to update athlete profile
        self.client.force_authenticate(
            user=self.coach
        )

        res = self.client.put(
            f'/api/athletes/{self.profile.id}/',
            {
                'position': 'Goalkeeper'
            },
            format='json'
        )

        self.assertEqual(
            res.status_code,
            status.HTTP_403_FORBIDDEN
        )


    def test_profile_view_is_created(self):
        # Coach views athlete profile
        self.client.force_authenticate(
            user=self.coach
        )

        res = self.client.get(
            f'/api/athletes/{self.profile.id}/'
        )

        self.assertEqual(
            res.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            ProfileView.objects.count(),
            1
        )

        self.profile.refresh_from_db()

        self.assertEqual(
            self.profile.profile_views,
            1
        )


    def test_get_profile_views(self):
        # Create a profile view
        ProfileView.objects.create(
            viewer=self.coach,
            viewed=self.athlete
        )

        self.profile.profile_views = 1
        self.profile.save()

        res = self.client.get(
            f'/api/athletes/{self.profile.id}/views/'
        )

        self.assertEqual(
            res.status_code,
            status.HTTP_200_OK
        )

        self.assertEqual(
            res.data['total_views'],
            1
        )


    def test_only_owner_can_view_profile_views(self):
        self.client.force_authenticate(
            user=self.coach
        )

        res = self.client.get(
            f'/api/athletes/{self.profile.id}/views/'
        )

        self.assertEqual(
            res.status_code,
            status.HTTP_403_FORBIDDEN
        )


    def test_get_sport_config(self):
        res = self.client.get(
            '/api/athletes/sport-config/'
        )

        self.assertEqual(
            res.status_code,
            status.HTTP_200_OK
        )

        self.assertIn(
            'stat_fields',
            res.data
        )

        self.assertIn(
            'interest_levels',
            res.data
        )


    def test_unauthenticated_request_rejected(self):
        self.client.force_authenticate(
            user=None
        )

        res = self.client.get(
            '/api/athletes/me/'
        )

        self.assertEqual(
            res.status_code,
            status.HTTP_401_UNAUTHORIZED
        )
