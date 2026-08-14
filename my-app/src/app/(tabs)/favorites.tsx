import { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { getFavorites } from "../../utils/listings";
import ListingCard from "../../components/ListingCard";

export default function Favorites() {
  const { user, token } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getFavorites(token);
      setListings(data);
    } catch {
      setListings([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [user])
  );

  const handleUnfavorite = (id: number, favorited: boolean) => {
    if (!favorited) {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  };

  if (!user) {
    return (
      <View style={styles.centered}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart-outline" size={26} color="#00a884" />
        </View>
        <Text style={styles.noticeTitle}>ابتدا وارد حساب خود شوید</Text>
        <Text style={styles.notice}>برای مشاهده علاقه‌مندی‌ها باید وارد حساب کاربری شوید.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/profile")}>
          <Text style={styles.primaryButtonText}>ورود / ثبت‌نام</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00a884" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>علاقه‌مندی‌ها</Text>
        <Text style={styles.headerSubtitle}>{listings.length} اعلان ذخیره شده</Text>
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginBottom: 12 }}>
            <ListingCard item={item} onToggleFavorite={handleUnfavorite} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <View style={styles.iconCircle}>
              <Ionicons name="heart-outline" size={26} color="#c7cad1" />
            </View>
            <Text style={styles.emptyTitle}>هنوز اعلانی ذخیره نکرده‌اید</Text>
            <Text style={styles.emptyText}>روی آیکون قلب اعلان‌ها بزنید تا اینجا ذخیره شوند.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },

  header: { padding: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  headerSubtitle: { fontSize: 13, color: "#9a9ea6", marginTop: 2 },

  listContent: { paddingHorizontal: 16, paddingBottom: 16 },

  iconCircle: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  noticeTitle: { fontSize: 17, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
  notice: { fontSize: 14, color: "#9a9ea6", textAlign: "center", marginBottom: 22, lineHeight: 20 },
  primaryButton: { backgroundColor: "#00a884", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 10 },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  emptyWrap: { alignItems: "center", marginTop: 60, paddingHorizontal: 40, width: "100%" },
  emptyTitle: { fontSize: 15.5, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  emptyText: { textAlign: "center", color: "#9a9ea6", fontSize: 13, lineHeight: 19 },
});