
from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Follow
###

from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["phone", "full_name", "password"]

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("این شماره قبلاً ثبت شده است.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(phone=data["phone"], password=data["password"])
        if not user:
            raise serializers.ValidationError("شماره یا رمز عبور اشتباه است.")
        data["user"] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "phone", "full_name","account_type"]



####

def _is_following(request, target):
    user = getattr(request, "user", None)
    if not user or not user.is_authenticated:
        return False
    return Follow.objects.filter(follower=user, following=target).exists()


class ProfileSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    listings_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    is_me = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id", "full_name", "bio", "city", "avatar",
            "account_type", "agency_name", "is_verified",
            "followers_count", "following_count","listings_count",
            "is_following", "is_me",
        ]

    def get_followers_count(self, obj):
        return obj.followers_set.count()

    def get_following_count(self, obj):
        return obj.following_set.count()

    def get_is_following(self, obj):
        return _is_following(self.context.get("request"), obj)
    
    def get_listings_count(self, obj):
        return obj.listings.count()

    def get_is_me(self, obj):
        request = self.context.get("request")
        return bool(request and request.user.is_authenticated and request.user.id == obj.id)


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["full_name", "bio", "city", "avatar", "account_type", "agency_name"]


class UserCardSerializer(serializers.ModelSerializer):
    """Compact user used in followers / following lists."""
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "full_name", "avatar", "account_type", "agency_name", "is_following"]

    def get_is_following(self, obj):
        return _is_following(self.context.get("request"), obj)