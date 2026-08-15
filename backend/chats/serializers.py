from rest_framework import serializers
from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "conversation", "sender", "text", "created_at", "is_read"]
        read_only_fields = ["sender", "conversation"]


class ConversationSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source="listing.title", read_only=True)
    listing_image = serializers.SerializerMethodField()
    other_user_name = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id", "listing", "listing_title", "listing_image",
            "other_user_name", "last_message", "unread_count", "created_at",
        ]

    def _other_user(self, obj):
        request = self.context.get("request")
        me = request.user
        return obj.seller if obj.buyer_id == me.id else obj.buyer

    def get_listing_image(self, obj):
        first = obj.listing.images.first()
        if not first:
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(first.image.url) if request else first.image.url

    def get_other_user_name(self, obj):
        u = self._other_user(obj)
        return u.full_name or u.phone

    def get_last_message(self, obj):
        last = obj.messages.order_by("-created_at").first()
        return last.text if last else None

    def get_unread_count(self, obj):
        request = self.context.get("request")
        return obj.messages.filter(is_read=False).exclude(sender=request.user).count()