

# from django.urls import path
# from .views import ListingListCreateView, ListingDetailView, ToggleFavoriteView, FavoriteListView

# urlpatterns = [
#     path("", ListingListCreateView.as_view(), name="listing-list-create"),
#     path("favorites/", FavoriteListView.as_view(), name="favorite-list"),
#     path("<int:pk>/", ListingDetailView.as_view(), name="listing-detail"),
#     path("<int:pk>/favorite/", ToggleFavoriteView.as_view(), name="toggle-favorite"),
# ]

from django.urls import path
from .views import (
    ListingListCreateView,
    ListingDetailView,
    ToggleFavoriteView,
    FavoriteListView,
    MyListingsView,
)

urlpatterns = [
    path("", ListingListCreateView.as_view(), name="listing-list-create"),
    path("mine/", MyListingsView.as_view(), name="my-listings"),
    path("favorites/", FavoriteListView.as_view(), name="favorite-list"),
    path("<int:pk>/", ListingDetailView.as_view(), name="listing-detail"),
    path("<int:pk>/favorite/", ToggleFavoriteView.as_view(), name="toggle-favorite"),
]