from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_connections, name='connection-list'),
    path('send/', views.send_connection, name='connection-send'),
    path('<uuid:pk>/', views.respond_to_connection, name='connection-respond'),
    path('<uuid:pk>/withdraw/', views.withdraw_connection, name='connection-withdraw'),
]
