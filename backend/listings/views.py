
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Listing, Favorite
from .serializers import ListingSerializer
from .permissions import IsOwnerOrReadOnly


class ListingListCreateView(generics.ListCreateAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        qs = super().get_queryset()
        category = self.request.query_params.get("category")
        search = self.request.query_params.get("search")
        city = self.request.query_params.get("city")
        deal_type = self.request.query_params.get("deal_type")
        property_type = self.request.query_params.get("property_type")
        has_video = self.request.query_params.get("has_video")
        if category:
            qs = qs.filter(category=category)
        if has_video:
            qs = qs.filter(video__isnull=False).exclude(video="")
        if deal_type:
            qs = qs.filter(deal_type=deal_type)
        if property_type:
            qs = qs.filter(property_type=property_type)
        if city:
            qs = qs.filter(location__icontains=city)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(location__icontains=search))
        return qs

    # def get_queryset(self):
    #     qs = super().get_queryset()
    #     category = self.request.query_params.get("category")
    #     search = self.request.query_params.get("search")
    #     city = self.request.query_params.get("city")
    #     deal_type = self.request.query_params.get("deal_type")
    #     property_type = self.request.query_params.get("property_type")
    #     if category:
    #         qs = qs.filter(category=category)
    #     if deal_type:
    #        qs = qs.filter(deal_type=deal_type)
    #     if property_type:
    #       qs = qs.filter(property_type=property_type)
    #     if city:
    #         qs = qs.filter(location__icontains=city)
    #     if search:
    #         qs = qs.filter(Q(title__icontains=search) | Q(location__icontains=search))
    #     return qs

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]


class MyListingsView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(owner=self.request.user)


class ToggleFavoriteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        listing = get_object_or_404(Listing, pk=pk)
        favorite, created = Favorite.objects.get_or_create(user=request.user, listing=listing)
        if not created:
            favorite.delete()
            return Response({"favorited": False})
        return Response({"favorited": True})


class FavoriteListView(generics.ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(favorited_by__user=self.request.user).order_by("-favorited_by__created_at")