import { Image } from "react-native";
// ...
import Logo from "../../../assets/icon.png";

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
  Modal,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getListings } from "../../utils/listings";
import ListingCard from "../../components/ListingCard";
import { cities } from "../../data/cities";
import { useAuth } from "../../context/AuthContext";

const APP_NAME = "ازدور"; // TODO: replace with your real app/brand name

const DEAL_TYPES = [
  { id: "rent", title: "اجاره", icon: "key-outline" },
  { id: "mortgage", title: "رهن", icon: "document-text-outline" },
  { id: "sale", title: "فروش", icon: "pricetag-outline" },
];

const PROPERTY_TYPES = [
  { id: "residential", title: "مسکونی", icon: "home-outline" },
  { id: "commercial", title: "تجاری", icon: "storefront-outline" },
  { id: "admin-commercial", title: "اداری و تجاری", icon: "business-outline" },
];

// The platform only handles real estate, so the category is fixed.
const REAL_ESTATE_ID = "real-estate";

export default function Home() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [activeDealType, setActiveDealType] = useState<string | null>(null);
  const [activePropertyType, setActivePropertyType] = useState<string | null>(null);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const searchTimer = useRef<any>(null);

  const load = async (opts?: {
    search?: string;
    cityId?: string | null;
    dealType?: string | null;
    propertyType?: string | null;
  }) => {
    try {
      const data = await getListings({
        search: opts?.search !== undefined ? opts.search : search,
        categoryId: REAL_ESTATE_ID,
        cityId: opts?.cityId !== undefined ? opts.cityId : activeCity,
        dealType: opts?.dealType !== undefined ? opts.dealType : activeDealType,
        propertyType: opts?.propertyType !== undefined ? opts.propertyType : activePropertyType,
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

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("tabPress" as any, () => {
        setActiveCity(null);
        setActiveDealType(null);
        setActivePropertyType(null);
        setSearch("");
        load({ cityId: null, search: "", dealType: null, propertyType: null });
      });
      return unsubscribe;
    }, [navigation])
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

  const onSelectDealType = (id: string) => {
    const next = activeDealType === id ? null : id;
    setActiveDealType(next);
    load({ dealType: next });
  };

  const onSelectPropertyType = (id: string) => {
    const next = activePropertyType === id ? null : id;
    setActivePropertyType(next);
    load({ propertyType: next });
  };

  const clearFilters = () => {
    setActiveDealType(null);
    setActivePropertyType(null);
    load({ dealType: null, propertyType: null });
  };

  const onSelectCity = (id: string | null) => {
    setActiveCity(id);
    setCityModalVisible(false);
    load({ cityId: id });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const activeCityLabel = cities.find((c) => c.id === activeCity)?.title;
  const firstName = user?.full_name?.split(" ")[0];
  const searchPlaceholder = activeCityLabel
    ? `جستجو در ${activeCityLabel}...`
    : "جستجو در همه شهرها...";
  const hasFilters = !!activeDealType || !!activePropertyType;

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00a884" />
      </View>
    );
  }

  const ListHeader = (
    <>
      <Text style={styles.filterTitle}>نوع معامله</Text>
      <View style={styles.dealRow}>
        {DEAL_TYPES.map((d) => {
          const active = activeDealType === d.id;
          return (
            <TouchableOpacity
              key={d.id}
              style={[styles.dealCard, active && styles.dealCardActive]}
              onPress={() => onSelectDealType(d.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.dealIconWrap, active && styles.dealIconWrapActive]}>
                <Ionicons name={d.icon as any} size={22} color={active ? "#fff" : "#00a884"} />
              </View>
              <Text style={[styles.dealText, active && styles.dealTextActive]}>{d.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.filterTitle}>نوع ملک</Text>
      <View style={styles.propertyTypeGrid}>
        {PROPERTY_TYPES.map((p) => {
          const active = activePropertyType === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.propertyTypeCard, active && styles.propertyTypeCardActive]}
              onPress={() => onSelectPropertyType(p.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.propertyTypeIconWrap, active && styles.propertyTypeIconWrapActive]}>
                <Ionicons name={p.icon as any} size={17} color={active ? "#fff" : "#00a884"} />
              </View>
              <Text
                style={[styles.propertyTypeText, active && styles.propertyTypeTextActive]}
                numberOfLines={1}
              >
                {p.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {hasFilters && (
        <TouchableOpacity style={styles.clearFilters} onPress={clearFilters}>
          <Ionicons name="close-circle" size={15} color="#00a884" />
          <Text style={styles.clearFiltersText}>پاک کردن فیلترها</Text>
        </TouchableOpacity>
      )}

      {listings.length > 0 && (
        <Text style={styles.resultsCount}>
          {listings.length} اعلان
          {activeCityLabel ? ` - ${activeCityLabel}` : ""}
        </Text>
      )}
    </>
  );

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
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/conversations")}>
              <Ionicons name="chatbubbles-outline" size={19} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile")}>
              <Ionicons name={user ? "person" : "person-outline"} size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting */}
        {/* <Text style={styles.heroGreeting}>
          {firstName ? `سلام، ${firstName} 👋` : " خوش آمدید 👋"}
        </Text>
        <Text style={styles.heroSubtitle}>چه چیزی امروز نیاز داری؟</Text> */}

        {/* Search */}
        <View style={styles.searchCard}>
          <View style={styles.searchIconCircle}>
            <Ionicons name="search" size={16} color="#00a884" />
          </View>
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={onChangeSearch}
            placeholder={searchPlaceholder}
            placeholderTextColor="#b6b9bf"
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <Ionicons name="close" size={13} color="#9a9ea6" />
            </TouchableOpacity>
          )}
        </View>

        {/* City selector */}
        <TouchableOpacity style={styles.citySelector} onPress={() => setCityModalVisible(true)}>
          <Ionicons name="location" size={16} color="#00a884" />
          <Text style={styles.citySelectorText}>
            {activeCityLabel ? activeCityLabel : "انتخاب شهر: همه شهرها"}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#9a9ea6" />
        </TouchableOpacity>
      </LinearGradient>

      {/* City modal picker */}
      <Modal
        visible={cityModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCityModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setCityModalVisible(false)}
        >
          <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>شهر خود را انتخاب کنید</Text>

            <TouchableOpacity style={styles.modalRow} onPress={() => onSelectCity(null)}>
              <Ionicons
                name={activeCity === null ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={activeCity === null ? "#00a884" : "#c7cad1"}
              />
              <Text style={styles.modalRowText}>همه شهرها</Text>
            </TouchableOpacity>

            {cities.map((c) => (
              <TouchableOpacity key={c.id} style={styles.modalRow} onPress={() => onSelectCity(c.id)}>
                <Ionicons
                  name={activeCity === c.id ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={activeCity === c.id ? "#00a884" : "#c7cad1"}
                />
                <Text style={styles.modalRowText}>{c.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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
          ListHeaderComponent={ListHeader}
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
              <Text style={styles.emptyText}>عبارت دیگری را امتحان کنید یا فیلترها را پاک کنید.</Text>
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
    paddingBottom: 20,
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
    marginBottom: 10,
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

  citySelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  citySelectorText: { flex: 1, color: "#fff", fontSize: 13.5, fontWeight: "600" },

  /* Deal type + property type filters (home page) */
  filterTitle: { fontSize: 15, fontWeight: "700", color: "#1a1a1a", marginTop: 18, marginBottom: 10 },

  dealRow: { flexDirection: "row", gap: 10 },
  dealCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eef0f2",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  dealCardActive: { backgroundColor: "#00a884", borderColor: "#00a884" },
  dealIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center",
    marginBottom: 8,
  },
  dealIconWrapActive: { backgroundColor: "rgba(255,255,255,0.22)" },
  dealText: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  dealTextActive: { color: "#fff" },

  propertyTypeGrid: { flexDirection: "row", gap: 8 },
  propertyTypeCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#eef0f2",
  },
  propertyTypeCardActive: {
    backgroundColor: "#f3fbf8",
    borderColor: "#00a884",
  },
  propertyTypeIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center",
    marginBottom: 7,
  },
  propertyTypeIconWrapActive: { backgroundColor: "#00a884" },
  propertyTypeText: { fontSize: 10.5, color: "#5f6570", fontWeight: "600", textAlign: "center" },
  propertyTypeTextActive: { color: "#00806a" },

  clearFilters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 14,
  },
  clearFiltersText: { fontSize: 12.5, color: "#00a884", fontWeight: "600" },

  /* City modal */
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "70%",
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: "#e4e6ea",
    alignSelf: "center", marginBottom: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a", marginBottom: 14 },
  modalRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  modalRowText: { fontSize: 14.5, color: "#1a1a1a" },

  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  resultsCount: { fontSize: 13, color: "#9a9ea6", marginTop: 8, marginBottom: 12, fontWeight: "500" },

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