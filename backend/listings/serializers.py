from rest_framework import serializers
from .models import Listing


class ListingSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.full_name", read_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id", "title", "price", "location", "category",
            "category_display", "description", "created_at",
            "owner", "owner_name",
        ]
        read_only_fields = ["owner"]