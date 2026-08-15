from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from listings.models import Listing


class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Conversation.objects.filter(Q(buyer=user) | Q(seller=user)).order_by("-created_at")


class StartConversationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        listing_id = request.data.get("listing")
        listing = get_object_or_404(Listing, pk=listing_id)
        if listing.owner_id == request.user.id:
            return Response({"detail": "شما نمی‌توانید با خودتان گفتگو کنید."}, status=400)
        conversation, _ = Conversation.objects.get_or_create(
            listing=listing, buyer=request.user, defaults={"seller": listing.owner}
        )
        serializer = ConversationSerializer(conversation, context={"request": request})
        return Response(serializer.data)


class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def _conversation(self):
        return get_object_or_404(
            Conversation.objects.filter(Q(buyer=self.request.user) | Q(seller=self.request.user)),
            pk=self.kwargs["pk"],
        )

    def get_queryset(self):
        conversation = self._conversation()
        conversation.messages.exclude(sender=self.request.user).update(is_read=True)
        return conversation.messages.all()

    def perform_create(self, serializer):
        conversation = self._conversation()
        serializer.save(conversation=conversation, sender=self.request.user)