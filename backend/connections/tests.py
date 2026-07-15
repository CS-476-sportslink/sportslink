from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from connections.models import Connection


class ConnectionTests(TestCase):

    def setUp(self):
        # Create two test users
        self.client = APIClient()

        self.user1 = User.objects.create_user(
            username='coach1',
            email='coach@test.com',
            password='testpass123',
            role='coach'
        )

        self.user2 = User.objects.create_user(
            username='athlete1',
            email='athlete@test.com',
            password='testpass123',
            role='athlete'
        )

        # Authenticate as user1 by default
        self.client.force_authenticate(user=self.user1)

    def test_send_connection_request(self):
        res = self.client.post('/api/connections/send/', {
            'receiver_id': str(self.user2.id)
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data['status'], 'pending')

    def test_cannot_connect_with_yourself(self):
        res = self.client.post('/api/connections/send/', {
            'receiver_id': str(self.user1.id)
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_send_duplicate_request(self):
        self.client.post('/api/connections/send/', {
            'receiver_id': str(self.user2.id)
        }, format='json')
        res = self.client.post('/api/connections/send/', {
            'receiver_id': str(self.user2.id)
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_connections(self):
        Connection.objects.create(
            initiator=self.user1,
            receiver=self.user2,
            status='pending'
        )
        res = self.client.get('/api/connections/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    def test_filter_connections_by_status(self):
        Connection.objects.create(
            initiator=self.user1,
            receiver=self.user2,
            status='pending'
        )
        res = self.client.get('/api/connections/?status=pending')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        res = self.client.get('/api/connections/?status=accepted')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 0)

    def test_accept_connection(self):
        connection = Connection.objects.create(
            initiator=self.user1,
            receiver=self.user2,
            status='pending'
        )
        # Switch to user2 to accept
        self.client.force_authenticate(user=self.user2)
        res = self.client.put(f'/api/connections/{connection.id}/', {
            'status': 'accepted'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'accepted')

    def test_decline_connection(self):
        connection = Connection.objects.create(
            initiator=self.user1,
            receiver=self.user2,
            status='pending'
        )
        self.client.force_authenticate(user=self.user2)
        res = self.client.put(f'/api/connections/{connection.id}/', {
            'status': 'declined'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['status'], 'declined')

    def test_only_receiver_can_accept(self):
        connection = Connection.objects.create(
            initiator=self.user1,
            receiver=self.user2,
            status='pending'
        )
        # user1 tries to accept their own request
        res = self.client.put(f'/api/connections/{connection.id}/', {
            'status': 'accepted'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_withdraw_connection(self):
        connection = Connection.objects.create(
            initiator=self.user1,
            receiver=self.user2,
            status='pending'
        )
        res = self.client.delete(f'/api/connections/{connection.id}/withdraw/')
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Connection.objects.filter(id=connection.id).exists())

    def test_only_initiator_can_withdraw(self):
        connection = Connection.objects.create(
            initiator=self.user1,
            receiver=self.user2,
            status='pending'
        )
        self.client.force_authenticate(user=self.user2)
        res = self.client.delete(f'/api/connections/{connection.id}/withdraw/')
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_request_rejected(self):
        self.client.force_authenticate(user=None)
        res = self.client.get('/api/connections/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

# Create your tests here.
