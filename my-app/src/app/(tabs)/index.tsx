

import { useCallback, useRef, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getListings } from "../../utils/listings";
import ListingCard from "../../components/ListingCard";
import { categories } from "../../data/categories";
import { useAuth } from "../../context/AuthContext";

const APP_NAME ="ازدور"; // TODO: replace with your real app/brand name

export default function Home() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const searchTimer = useRef<any>(null);

  const load = async (opts?: { search?: string; categoryId?: string | null }) => {
    try {
      const data = await getListings({
        search: opts?.search ?? search,
        categoryId: opts?.categoryId !== undefined ? opts.categoryId : activeCategory,
      });
      setListings(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load().finally(() => setLoading(false));
    }, [])
  );

  const onChangeSearch = (text: string) => {
    setSearch(text);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => load({ search: text }), 400);
  };

  const clearSearch = () => {
    setSearch("");
    load({ search: "" });
  };

  const onSelectCategory = (id: string) => {
    const next = activeCategory === id ? null : id;
    setActiveCategory(next);
    load({ categoryId: next });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const activeCategoryLabel = categories.find((c) => c.id === activeCategory)?.title;
  const firstName = user?.full_name?.split(" ")[0];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00a884" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#00c39a", "#00806a"]} style={styles.hero}>
        {/* Brand bar */}
        <View style={styles.brandRow}>
          <View style={styles.brandLeft}>
            <View style={styles.logoMark}>
              <Ionicons name="storefront" size={18} color="#00806a" />
            </View>
            <Text style={styles.brandName}>{APP_NAME}</Text>
          </View>

          <View style={styles.brandRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={19} color="#fff" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push("/profile")}
            >
              <Ionicons name={user ? "person" : "person-outline"} size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        <Text style={styles.heroGreeting}>
          {firstName ? `سلام، ${firstName} 👋` : "به بازارچه خوش آمدید 👋"}
        </Text>
        <Text style={styles.heroSubtitle}>چه چیزی امروز نیاز داری؟</Text>

        {/* Search */}
        <View style={styles.searchCard}>
          <View style={styles.searchIconCircle}>
            <Ionicons name="search" size={16} color="#00a884" />
          </View>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={onChangeSearch}
            placeholder="جستجو در عنوان یا موقعیت..."
            placeholderTextColor="#b6b9bf"
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Ionicons name="close" size={13} color="#9a9ea6" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      <View style={styles.categorySection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 18 }}
          renderItem={({ item: c }) => {
            const active = activeCategory === c.id;
            return (
              <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => onSelectCategory(c.id)}
                activeOpacity={0.75}
              >
                <View style={[styles.categoryCircle, active && styles.categoryCircleActive]}>
                  <Ionicons name={c.icon as any} size={20} color={active ? "#fff" : "#00a884"} />
                </View>
                <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                  {c.title}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline-outline" size={32} color="#c7cad1" />
          <Text style={styles.errorText}>خطا در بارگذاری اعلان‌ها</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => load()}>
            <Text style={styles.retryText}>تلاش مجدد</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          ListHeaderComponent={
            listings.length > 0 ? (
              <Text style={styles.resultsCount}>
                {listings.length} اعلان{activeCategoryLabel ? ` در «${activeCategoryLabel}»` : ""}
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={{ flex: 1, marginBottom: 12 }}>
              <ListingCard item={item} />
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00a884" />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search-outline" size={28} color="#c7cad1" />
              </View>
              <Text style={styles.emptyTitle}>نتیجه‌ای یافت نشد</Text>
              <Text style={styles.emptyText}>عبارت دیگری را امتحان کنید یا فیلتر دسته‌بندی را پاک کنید.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },

  hero: {
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  brandLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoMark: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center", alignItems: "center",
  },
  brandName: { fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.2 },
  brandRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconButton: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.16)",
    justifyContent: "center", alignItems: "center",
    position: "relative",
  },
  notifDot: {
    position: "absolute", top: 7, right: 8,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: "#ff6b5e",
    borderWidth: 1, borderColor: "#00a884",
  },

  heroGreeting: { fontSize: 19, fontWeight: "700", color: "#fff" },
  heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.82)", marginTop: 3, marginBottom: 16 },

  searchCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 6,
    elevation: 4,
    shadowColor: "#00302a",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  searchIconCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center",
    marginRight: 8,
  },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 14.5, color: "#1a1a1a" },
  clearButton: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: "#f4f5f7",
    justifyContent: "center", alignItems: "center", marginLeft: 6,
  },

  categorySection: { paddingVertical: 16 },
  categoryItem: { alignItems: "center", width: 64 },
  categoryCircle: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center",
    marginBottom: 6,
  },
  categoryCircleActive: { backgroundColor: "#00a884" },
  categoryLabel: { fontSize: 11.5, color: "#5f6570", fontWeight: "500", textAlign: "center" },
  categoryLabelActive: { color: "#00a884", fontWeight: "700" },

  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  resultsCount: { fontSize: 13, color: "#9a9ea6", marginBottom: 12, fontWeight: "500" },

  errorText: { fontSize: 14, color: "#5f6570" },
  retryButton: { marginTop: 4, backgroundColor: "#00a884", paddingHorizontal: 20, paddingVertical: 9, borderRadius: 10 },
  retryText: { color: "#fff", fontWeight: "600", fontSize: 13.5 },

  emptyWrap: { alignItems: "center", marginTop: 60, paddingHorizontal: 40, width: "100%" },
  emptyIconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: "#f4f5f7",
    justifyContent: "center", alignItems: "center", marginBottom: 14,
  },
  emptyTitle: { fontSize: 15.5, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  emptyText: { textAlign: "center", color: "#9a9ea6", fontSize: 13, lineHeight: 19 },
});