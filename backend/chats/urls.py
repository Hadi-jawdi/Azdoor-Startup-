from django.urls import path
from .views import ConversationListView, StartConversationView, MessageListCreateView

urlpatterns = [
    path("conversations/", ConversationListView.as_view(), name="conversation-list"),
    path("conversations/start/", StartConversationView.as_view(), name="conversation-start"),
    path("conversations/<int:pk>/messages/", MessageListCreateView.as_view(), name="conversation-messages"),
]   