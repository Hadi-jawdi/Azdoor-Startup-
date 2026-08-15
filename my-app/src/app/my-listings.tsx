import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { getMyListings, deleteListing } from "../utils/listings";

export default function MyListings() {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await getMyListings(token);
      setListings(data);
    } catch {
      setListings([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load().finally(() => setLoading(false));
    }, [])
  );

  const handleDelete = (id: number, title: string) => {
    Alert.alert("حذف اعلان", `آیا از حذف «${title}» مطمئن هستید؟`, [
      { text: "انصراف", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteListing(id, token);
            setListings((prev) => prev.filter((l) => l.id !== id));
          } catch (err: any) {
            Alert.alert("خطا", err.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={20} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>اعلان‌های من</Text>
        <View style={{ width: 38 }} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00a884" />
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.images?.[0] ? (
                <Image source={{ uri: item.images[0].image }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Ionicons name="image-outline" size={20} color="#c7cad1" />
                </View>
              )}

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
                <Text style={styles.cardMeta} numberOfLines={1}>{item.location}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => router.push(`/listing/edit/${item.id}`)}
                >
                  <Ionicons name="create-outline" size={17} color="#00a884" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(item.id, item.title)}
                >
                  <Ionicons name="trash-outline" size={17} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="pricetags-outline" size={26} color="#c7cad1" />
              </View>
              <Text style={styles.emptyTitle}>هنوز اعلانی ثبت نکرده‌اید</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/post")}>
                <Text style={styles.primaryButtonText}>ثبت اولین اعلان</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

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
  thumb: { width: 64, height: 64, borderRadius: 10, backgroundColor: "#f4f5f7" },
  thumbPlaceholder: { justifyContent: "center", alignItems: "center" },
  cardBody: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  cardPrice: { fontSize: 13.5, fontWeight: "700", color: "#00a884", marginTop: 3 },
  cardMeta: { fontSize: 12, color: "#9a9ea6", marginTop: 3 },

  actions: { flexDirection: "row", gap: 6 },
  actionButton: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: "#f3fbf8",
    justifyContent: "center", alignItems: "center",
  },
  deleteButton: { backgroundColor: "#fdedec" },

  emptyWrap: { alignItems: "center", marginTop: 60, paddingHorizontal: 40 },
  emptyIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "#f4f5f7",
    justifyContent: "center", alignItems: "center", marginBottom: 14,
  },
  emptyTitle: { fontSize: 15.5, fontWeight: "700", color: "#1a1a1a", marginBottom: 16 },
  primaryButton: { backgroundColor: "#00a884", paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10 },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});