from django.urls import path
from . import views
#urls.py is what controls what view funcitons are accessed at each url in the API
urlpatterns = [
    path('', views.create_profile, name='athlete-create'),
    path('me/', views.get_my_profile, name='athlete-me'),
    path('sport-config/', views.get_sport_config, name='sport-config'),
    path('<uuid:pk>/', views.get_profile, name='athlete-detail'),
    path('<uuid:pk>/update/', views.update_profile, name='athlete-update'),
    path('<uuid:pk>/views/', views.get_profile_views, name='athlete-views'),
]
