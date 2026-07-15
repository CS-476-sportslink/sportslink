from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_profile, name='coach-create'),
    path('me/', views.get_my_profile, name='coach-me'),
    path('<uuid:pk>/', views.get_profile, name='coach-detail'),
    path('<uuid:pk>/update/', views.update_profile, name='coach-update'),
]
