# from django.urls import path
# from .views import RegisterView, LoginView, LogoutView, MeView

# urlpatterns = [
#     path("register/", RegisterView.as_view(), name="register"),
#     path("login/", LoginView.as_view(), name="login"),
#     path("logout/", LogoutView.as_view(), name="logout"),
#     path("me/", MeView.as_view(), name="me"),
# ]
from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, MeView,
    ProfileView, FollowView, FollowersListView, FollowingListView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("me/", MeView.as_view(), name="me"),
    path("users/<int:pk>/", ProfileView.as_view(), name="profile"),
    path("users/<int:pk>/follow/", FollowView.as_view(), name="follow"),
    path("users/<int:pk>/followers/", FollowersListView.as_view(), name="followers"),
    path("users/<int:pk>/following/", FollowingListView.as_view(), name="following"),
]