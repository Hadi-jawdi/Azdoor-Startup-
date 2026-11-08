from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import Follow

User = get_user_model()


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ("-date_joined",)
    list_display = ("phone", "full_name", "account_type", "is_verified", "is_staff", "date_joined")
    list_filter = ("account_type", "is_verified", "is_staff", "is_active")
    search_fields = ("phone", "full_name", "agency_name")

    fieldsets = (
        (None, {"fields": ("phone", "password")}),
        ("Profile", {"fields": (
            "full_name", "bio", "city", "avatar",
            "account_type", "agency_name", "is_verified",
        )}),
        ("Permissions", {"fields": (
            "is_active", "is_staff", "is_superuser", "groups", "user_permissions",
        )}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("phone", "full_name", "password1", "password2"),
        }),
    )


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ("follower", "following", "created_at")