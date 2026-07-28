from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from coaches.models import CoachProfile


class CoachProfileTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        # create coach user
        self.coach_user = User.objects.create_user(
            username='coach1',
            email='coach@test.com',
            password='testpass123',
            role='coach',
            first_name='Jane',
            last_name='Doe'
        )

        # create another user to test authorization
        self.other_user = User.objects.create_user(
            username='other1',
            email='other@test.com',
            password='testpass123',
            role='athlete',
            first_name='John',
            last_name='Smith'
        )

        # authenticate as coach
        self.client.force_authenticate(user=self.coach_user)

    def test_create_coach_profile(self):
        res = self.client.post('/api/coaches/', {
            'sport': 'football',
            'school_or_team': 'University of Regina Rams',
            'level': 'usports',
            'contact_email': 'coach@uregina.ca'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['sport'], 'football')
        self.assertEqual(res.data['school_or_team'], 'University of Regina Rams')

    def test_cannot_create_duplicate_profile(self):
        CoachProfile.objects.create(
            user=self.coach_user,
            sport='football',
            school_or_team='University of Regina Rams',
            level='usports'
        )
        res = self.client.post('/api/coaches/', {
            'sport': 'hockey',
            'school_or_team': 'University of Saskatchewan Huskies',
            'level': 'usports'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_own_profile(self):
        CoachProfile.objects.create(
            user=self.coach_user,
            sport='football',
            school_or_team='University of Regina Rams',
            level='usports'
        )
        res = self.client.get('/api/coaches/me/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['sport'], 'football')

    def test_get_profile_by_id(self):
        profile = CoachProfile.objects.create(
            user=self.coach_user,
            sport='football',
            school_or_team='University of Regina Rams',
            level='usports'
        )
        res = self.client.get(f'/api/coaches/{profile.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['school_or_team'], 'University of Regina Rams')

    def test_update_own_profile(self):
        profile = CoachProfile.objects.create(
            user=self.coach_user,
            sport='football',
            school_or_team='University of Regina Rams',
            level='usports'
        )
        res = self.client.put(f'/api/coaches/{profile.id}/update/', {
            'sport': 'football',
            'school_or_team': 'University of Saskatchewan Huskies',
            'level': 'usports'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['school_or_team'], 'University of Saskatchewan Huskies')

    def test_cannot_update_other_users_profile(self):
        profile = CoachProfile.objects.create(
            user=self.coach_user,
            sport='football',
            school_or_team='University of Regina Rams',
            level='usports'
        )
        self.client.force_authenticate(user=self.other_user)
        res = self.client.put(f'/api/coaches/{profile.id}/update/', {
            'sport': 'football',
            'school_or_team': 'Different Team',
            'level': 'usports'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_request_rejected(self):
        self.client.force_authenticate(user=None)
        res = self.client.get('/api/coaches/me/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
