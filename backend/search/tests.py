from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from athletes.models import AthleteProfile
from coaches.models import CoachProfile


class SearchTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        #Create logged in user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@test.com',
            password='testpass123',
            role='athlete',
            first_name='Test',
            last_name='User'
        )

        #Create athlete user
        self.athlete_user = User.objects.create_user(
            username='johnsmith',
            email='john@test.com',
            password='testpass123',
            role='athlete',
            first_name='John',
            last_name='Smith'
        )

        #Create athlete profile
        self.athlete_profile = AthleteProfile.objects.create(
            user=self.athlete_user,
            sport='football',
            position='quarterback',
            grad_year=2026,
            interest_level=['usports', 'cjfl'],
            stats={}
        )

        #Create coach user
        self.coach_user = User.objects.create_user(
            username='janecoach',
            email='jane@test.com',
            password='testpass123',
            role='coach',
            first_name='Jane',
            last_name='Doe'
        )

        #Create coach profile
        self.coach_profile = CoachProfile.objects.create(
            user=self.coach_user,
            sport='football',
            school_or_team='University of Regina Rams',
            level='usports',
            contact_email='jane@uregina.ca'
        )

        # Authenticate as test user
        self.client.force_authenticate(user=self.user)

    #This test seaches the athletes by the first name and should return 200 because there is an athlete with the name John
    def test_search_athlete_by_first_name(self):
        res = self.client.get('/api/search/?name=John')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['athletes']['total'], 1)
        self.assertEqual(res.data['coaches']['total'], 0)

    #This test seaches the athletes by the last name and should return 200 because there is an athlete with the last name Smith
    def test_search_athlete_by_last_name(self):
        res = self.client.get('/api/search/?name=Smith')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['athletes']['total'], 1)

    #This test seaches the coaches by the first name and should return 200 because there is a coach with the name Jane
    def test_search_coach_by_first_name(self):
        res = self.client.get('/api/search/?name=Jane')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['coaches']['total'], 1)
        self.assertEqual(res.data['athletes']['total'], 0)

    #This test seaches the coaches by the last name and should return 200 because there is a coach with the last name Doe
    def test_search_coach_by_last_name(self):
        res = self.client.get('/api/search/?name=Doe')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['coaches']['total'], 1)

    #Same as the athlete search just making sure case not sensitive works
    def test_search_case_insensitive(self):
        res = self.client.get('/api/search/?name=john')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['athletes']['total'], 1)

    #search for partial name of athletes should return 200
    def test_search_partial_name(self):
        res = self.client.get('/api/search/?name=Jo')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['athletes']['total'], 1)

    #returns 200 with no ahtletes or coaches found because no names match
    def test_search_no_results(self):
        res = self.client.get('/api/search/?name=zzznomatch')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['athletes']['total'], 0)
        self.assertEqual(res.data['coaches']['total'], 0)

    #returns all names
    def test_search_no_name_returns_all(self):
        res = self.client.get('/api/search/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(res.data['athletes']['total'], 1)
        self.assertGreaterEqual(res.data['coaches']['total'], 1)

    #make sure it requires auth token to search
    def test_search_requires_authentication(self):
        self.client.force_authenticate(user=None)
        res = self.client.get('/api/search/?name=John')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
