
from django.urls import path
from .views import (
    ListingListCreateView,
    ListingDetailView,
    ToggleFavoriteView,
    FavoriteListView,
    MyListingsView,
    UserListingsView,
)

urlpatterns = [
    path("", ListingListCreateView.as_view(), name="listing-list-create"),
    path("mine/", MyListingsView.as_view(), name="my-listings"),
    path("favorites/", FavoriteListView.as_view(), name="favorite-list"),
    path("user/<int:pk>/", UserListingsView.as_view(), name="user-listings"),

    path("<int:pk>/", ListingDetailView.as_view(), name="listing-detail"),
    path("<int:pk>/favorite/", ToggleFavoriteView.as_view(), name="toggle-favorite"),
]