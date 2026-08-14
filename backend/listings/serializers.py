
from rest_framework import serializers
from .models import Listing, ListingImage, Favorite


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ["id", "image"]


class ListingSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source="owner.full_name", read_only=True)
    owner_phone = serializers.CharField(source="owner.phone", read_only=True)

    category_display = serializers.CharField(source="get_category_display", read_only=True)
    images = ListingImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            "id", "title", "price", "location", "category",
            "category_display", "description", "created_at",
            "owner", "owner_name", "owner_phone", "images", "uploaded_images", "is_favorited",
        ]
        read_only_fields = ["owner"]

    def get_is_favorited(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False
        return obj.favorited_by.filter(user=request.user).exists()

    def validate_uploaded_images(self, value):
        if len(value) > 4:
            raise serializers.ValidationError("حداکثر ۴ عکس مجاز است.")
        return value

    def create(self, validated_data):
        images = validated_data.pop("uploaded_images", [])
        listing = Listing.objects.create(**validated_data)
        for img in images:
            ListingImage.objects.create(listing=listing, image=img)
        return listing