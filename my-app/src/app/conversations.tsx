import { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { getConversations } from "../utils/chat";

export default function Conversations() {
  const { token, user } = useAuth();
  const insets = useSafeAreaInsets();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      getConversations(token)
        .then(setConversations)
        .catch(() => setConversations([]))
        .finally(() => setLoading(false));
    }, [user])
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={20} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>پیام‌ها</Text>
        <View style={{ width: 38 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00a884" />
        </View>
      ) : !user ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>برای مشاهده پیام‌ها وارد حساب خود شوید.</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/chat/${item.id}`)}>
              {item.listing_image ? (
                <Image source={{ uri: item.listing_image }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Ionicons name="image-outline" size={18} color="#c7cad1" />
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.other_user_name}</Text>
                <Text style={styles.cardListing} numberOfLines={1}>{item.listing_title}</Text>
                {item.last_message && (
                  <Text style={styles.cardLast} numberOfLines={1}>{item.last_message}</Text>
                )}
              </View>
              {item.unread_count > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.unread_count}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="chatbubbles-outline" size={26} color="#c7cad1" />
              </View>
              <Text style={styles.emptyTitle}>هنوز گفتگویی ندارید</Text>
              <Text style={styles.emptyText}>با تماس یا پیام به فروشندگان، گفتگوی شما اینجا نمایش داده می‌شود.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eef0f2",
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: "#f4f5f7",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },

  listContent: { padding: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eef0f2",
    gap: 10,
  },
  thumb: { width: 52, height: 52, borderRadius: 10, backgroundColor: "#f4f5f7" },
  thumbPlaceholder: { justifyContent: "center", alignItems: "center" },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  cardListing: { fontSize: 12, color: "#00a884", marginTop: 2, fontWeight: "600" },
  cardLast: { fontSize: 12.5, color: "#9a9ea6", marginTop: 3 },

  badge: {
    minWidth: 20, height: 20, borderRadius: 10, backgroundColor: "#00a884",
    justifyContent: "center", alignItems: "center", paddingHorizontal: 5,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },

  emptyWrap: { alignItems: "center", marginTop: 60, paddingHorizontal: 40 },
  emptyIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "#f4f5f7",
    justifyContent: "center", alignItems: "center", marginBottom: 14,
  },
  emptyTitle: { fontSize: 15.5, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  emptyText: { textAlign: "center", color: "#9a9ea6", fontSize: 13, lineHeight: 19 },
});