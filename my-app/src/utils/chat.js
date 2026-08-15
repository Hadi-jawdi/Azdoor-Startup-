import { apiRequest } from "./api";

export function getConversations(token) {
  return apiRequest(`/chats/conversations/`, { token });
}

export function startConversation(listingId, token) {
  return apiRequest(`/chats/conversations/start/`, {
    method: "POST",
    body: { listing: listingId },
    token,
  });
}

export function getMessages(conversationId, token) {
  return apiRequest(`/chats/conversations/${conversationId}/messages/`, { token });
}

export function sendMessage(conversationId, text, token) {
  return apiRequest(`/chats/conversations/${conversationId}/messages/`, {
    method: "POST",
    body: { text },
    token,
  });
}