

// import { useCallback, useRef, useState } from "react";
// import {
//   View,
//   FlatList,
//   ActivityIndicator,
//   Text,
//   StyleSheet,
//   RefreshControl,
//   TextInput,
//   TouchableOpacity,
//   Modal,
// } from "react-native";
// import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { getListings } from "../../utils/listings";
// import ListingCard from "../../components/ListingCard";
// import { categories } from "../../data/categories";
// import { cities } from "../../data/cities";
// import { useAuth } from "../../context/AuthContext";

// const APP_NAME = "ازدور"; // TODO: replace with your real app/brand name

// export default function Home() {
//   const { user } = useAuth();
//   const insets = useSafeAreaInsets();
//   const navigation = useNavigation();
//   const params = useLocalSearchParams<{ categoryId?: string }>();
//   const [listings, setListings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [activeCategory, setActiveCategory] = useState<string | null>(null);
//   const [activeCity, setActiveCity] = useState<string | null>(null);
//   const [cityModalVisible, setCityModalVisible] = useState(false);
//   const searchTimer = useRef<any>(null);

//   const load = async (opts?: { search?: string; categoryId?: string | null; cityId?: string | null }) => {
//     try {
//       const data = await getListings({
//         search: opts?.search !== undefined ? opts.search : search,
//         categoryId: opts?.categoryId !== undefined ? opts.categoryId : activeCategory,
//         cityId: opts?.cityId !== undefined ? opts.cityId : activeCity,
//       });
//       setListings(data);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       const incoming = params.categoryId ?? null;
//       if (incoming !== activeCategory) {
//         setActiveCategory(incoming);
//         load({ categoryId: incoming }).finally(() => setLoading(false));
//       } else {
//         load().finally(() => setLoading(false));
//       }
//     }, [params.categoryId])
//   );

//   useFocusEffect(
//     useCallback(() => {
//       const unsubscribe = navigation.addListener("tabPress" as any, () => {
//         setActiveCategory(null);
//         setActiveCity(null);
//         setSearch("");
//         load({ categoryId: null, cityId: null, search: "" });
//       });
//       return unsubscribe;
//     }, [navigation])
//   );

//   const onChangeSearch = (text: string) => {
//     setSearch(text);
//     if (searchTimer.current) clearTimeout(searchTimer.current);
//     searchTimer.current = setTimeout(() => load({ search: text }), 400);
//   };

//   const clearSearch = () => {
//     setSearch("");
//     load({ search: "" });
//   };

//   const onSelectCategory = (id: string) => {
//     const next = activeCategory === id ? null : id;
//     setActiveCategory(next);
//     load({ categoryId: next });
//   };

//   const onSelectCity = (id: string | null) => {
//     setActiveCity(id);
//     setCityModalVisible(false);
//     load({ cityId: id });
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await load();
//     setRefreshing(false);
//   };

//   const activeCategoryLabel = categories.find((c) => c.id === activeCategory)?.title;
//   const activeCityLabel = cities.find((c) => c.id === activeCity)?.title;
//   const firstName = user?.full_name?.split(" ")[0];
//   const searchPlaceholder = activeCityLabel
//     ? `جستجو در ${activeCityLabel}...`
//     : "جستجو در همه شهرها...";

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#00a884" />
//       </View>
//     );
//   }

//   const ListHeader = (
//     <>
//       <View style={styles.sectionHeader}>
//         <Text style={styles.sectionTitle}>دسته‌بندی‌ها</Text>
//         <Text style={styles.sectionHint}>برای فیلتر کردن روی یکی بزنید</Text>
//       </View>
//       <View style={styles.categoryGrid}>
//         {categories.map((c) => {
//           const active = activeCategory === c.id;
//           return (
//             <TouchableOpacity
//               key={c.id}
//               style={styles.categoryGridItem}
//               onPress={() => onSelectCategory(c.id)}
//               activeOpacity={0.75}
//             >
//               <View style={[styles.categoryCircle, active && styles.categoryCircleActive]}>
//                 <Ionicons name={c.icon as any} size={22} color={active ? "#fff" : "#00a884"} />
//               </View>
//               <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]} numberOfLines={1}>
//                 {c.title}
//               </Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>

//       {listings.length > 0 && (
//         <Text style={styles.resultsCount}>
//           {listings.length} اعلان
//           {activeCategoryLabel ? ` در «${activeCategoryLabel}»` : ""}
//           {activeCityLabel ? ` - ${activeCityLabel}` : ""}
//         </Text>
//       )}
//     </>
//   );

//   return (
//     <View style={styles.container}>
//       <LinearGradient colors={["#00c39a", "#00806a"]} style={styles.hero}>
//         {/* Brand bar */}
//         <View style={styles.brandRow}>
//           <View style={styles.brandLeft}>
//             <View style={styles.logoMark}>
//               <Ionicons name="storefront" size={18} color="#00806a" />
//             </View>
//             {/* <Text style={styles.brandName}>{APP_NAME}</Text> */}
//           </View>

//           <View style={styles.brandRight}>
//             <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/conversations")}>
//               <Ionicons name="chatbubbles-outline" size={19} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/profile")}>
//               <Ionicons name={user ? "person" : "person-outline"} size={18} color="#fff" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Greeting */}
//         <Text style={styles.heroGreeting}>
//           {firstName ? `سلام، ${firstName} 👋` : "به بازارچه خوش آمدید 👋"}
//         </Text>
//         <Text style={styles.heroSubtitle}>چه چیزی امروز نیاز داری؟</Text>

//         {/* Search */}
//         <View style={styles.searchCard}>
//           <View style={styles.searchIconCircle}>
//             <Ionicons name="search" size={16} color="#00a884" />
//           </View>
//           <TextInput
//             style={styles.searchInput}
//             value={search}
//             onChangeText={onChangeSearch}
//             placeholder={searchPlaceholder}
//             placeholderTextColor="#b6b9bf"
//             returnKeyType="search"
//           />
//           {search.length > 0 && (
//             <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
//               <Ionicons name="close" size={13} color="#9a9ea6" />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* City selector */}
//         <TouchableOpacity style={styles.citySelector} onPress={() => setCityModalVisible(true)}>
//           <Ionicons name="location" size={16} color="#00a884" />
//           <Text style={styles.citySelectorText}>
//             {activeCityLabel ? activeCityLabel : "انتخاب شهر: همه شهرها"}
//           </Text>
//           <Ionicons name="chevron-down" size={16} color="#9a9ea6" />
//         </TouchableOpacity>
//       </LinearGradient>

//       {/* City modal picker */}
//       <Modal
//         visible={cityModalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setCityModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalBackdrop}
//           activeOpacity={1}
//           onPress={() => setCityModalVisible(false)}
//         >
//           <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>شهر خود را انتخاب کنید</Text>

//             <TouchableOpacity style={styles.modalRow} onPress={() => onSelectCity(null)}>
//               <Ionicons
//                 name={activeCity === null ? "radio-button-on" : "radio-button-off"}
//                 size={20}
//                 color={activeCity === null ? "#00a884" : "#c7cad1"}
//               />
//               <Text style={styles.modalRowText}>همه شهرها</Text>
//             </TouchableOpacity>

//             {cities.map((c) => (
//               <TouchableOpacity key={c.id} style={styles.modalRow} onPress={() => onSelectCity(c.id)}>
//                 <Ionicons
//                   name={activeCity === c.id ? "radio-button-on" : "radio-button-off"}
//                   size={20}
//                   color={activeCity === c.id ? "#00a884" : "#c7cad1"}
//                 />
//                 <Text style={styles.modalRowText}>{c.title}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {error ? (
//         <View style={styles.centered}>
//           <Ionicons name="cloud-offline-outline" size={32} color="#c7cad1" />
//           <Text style={styles.errorText}>خطا در بارگذاری اعلان‌ها</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={() => load()}>
//             <Text style={styles.retryText}>تلاش مجدد</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={listings}
//           keyExtractor={(item) => String(item.id)}
//           contentContainerStyle={styles.listContent}
//           numColumns={2}
//           columnWrapperStyle={{ gap: 12 }}
//           ListHeaderComponent={ListHeader}
//           renderItem={({ item }) => (
//             <View style={{ flex: 1, marginBottom: 12 }}>
//               <ListingCard item={item} />
//             </View>
//           )}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00a884" />
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyWrap}>
//               <View style={styles.emptyIconCircle}>
//                 <Ionicons name="search-outline" size={28} color="#c7cad1" />
//               </View>
//               <Text style={styles.emptyTitle}>نتیجه‌ای یافت نشد</Text>
//               <Text style={styles.emptyText}>عبارت دیگری را امتحان کنید یا فیلترها را پاک کنید.</Text>
//             </View>
//           }
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f7f8fa" },
//   centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },

//   hero: {
//     paddingTop: 14,
//     paddingHorizontal: 18,
//     paddingBottom: 20,
//     borderBottomLeftRadius: 28,
//     borderBottomRightRadius: 28,
//   },

//   brandRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   brandLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
//   logoMark: {
//     width: 32, height: 32, borderRadius: 10,
//     backgroundColor: "#fff",
//     justifyContent: "center", alignItems: "center",
//   },
//   brandName: { fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.2 },
//   brandRight: { flexDirection: "row", alignItems: "center", gap: 8 },
//   iconButton: {
//     width: 34, height: 34, borderRadius: 17,
//     backgroundColor: "rgba(255,255,255,0.16)",
//     justifyContent: "center", alignItems: "center",
//     position: "relative",
//   },

//   heroGreeting: { fontSize: 19, fontWeight: "700", color: "#fff" },
//   heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.82)", marginTop: 3, marginBottom: 16 },

//   searchCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     paddingVertical: 4,
//     paddingHorizontal: 6,
//     elevation: 4,
//     shadowColor: "#00302a",
//     shadowOpacity: 0.18,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 6 },
//     marginBottom: 10,
//   },
//   searchIconCircle: {
//     width: 34, height: 34, borderRadius: 17,
//     backgroundColor: "#e1f5ee",
//     justifyContent: "center", alignItems: "center",
//     marginRight: 8,
//   },
//   searchInput: { flex: 1, paddingVertical: 12, fontSize: 14.5, color: "#1a1a1a" },
//   clearButton: {
//     width: 22, height: 22, borderRadius: 11, backgroundColor: "#f4f5f7",
//     justifyContent: "center", alignItems: "center", marginLeft: 6,
//   },

//   citySelector: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     backgroundColor: "rgba(255,255,255,0.16)",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     paddingVertical: 11,
//   },
//   citySelectorText: { flex: 1, color: "#fff", fontSize: 13.5, fontWeight: "600" },

//   sectionHeader: { paddingHorizontal: 4, paddingTop: 16, paddingBottom: 4 },
//   sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
//   sectionHint: { fontSize: 11.5, color: "#9a9ea6", marginTop: 2 },

//   categoryGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     paddingTop: 14,
//     paddingBottom: 6,
//   },
//   categoryGridItem: { width: "25%", alignItems: "center", marginBottom: 18 },
//   categoryCircle: {
//     width: 54, height: 54, borderRadius: 27,
//     backgroundColor: "#e1f5ee",
//     justifyContent: "center", alignItems: "center",
//     marginBottom: 6,
//   },
//   categoryCircleActive: { backgroundColor: "#00a884" },
//   categoryLabel: { fontSize: 11.5, color: "#5f6570", fontWeight: "500", textAlign: "center" },
//   categoryLabelActive: { color: "#00a884", fontWeight: "700" },

//   modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
//   modalSheet: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//     maxHeight: "70%",
//   },
//   modalHandle: {
//     width: 36, height: 4, borderRadius: 2, backgroundColor: "#e4e6ea",
//     alignSelf: "center", marginBottom: 16,
//   },
//   modalTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a", marginBottom: 14 },
//   modalRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
//   modalRowText: { fontSize: 14.5, color: "#1a1a1a" },

//   listContent: { paddingHorizontal: 16, paddingBottom: 16 },
//   resultsCount: { fontSize: 13, color: "#9a9ea6", marginTop: 8, marginBottom: 12, fontWeight: "500" },

//   errorText: { fontSize: 14, color: "#5f6570" },
//   retryButton: { marginTop: 4, backgroundColor: "#00a884", paddingHorizontal: 20, paddingVertical: 9, borderRadius: 10 },
//   retryText: { color: "#fff", fontWeight: "600", fontSize: 13.5 },

//   emptyWrap: { alignItems: "center", marginTop: 60, paddingHorizontal: 40, width: "100%" },
//   emptyIconCircle: {
//     width: 64, height: 64, borderRadius: 32, backgroundColor: "#f4f5f7",
//     justifyContent: "center", alignItems: "center", marginBottom: 14,
//   },
//   emptyTitle: { fontSize: 15.5, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
//   emptyText: { textAlign: "center", color: "#9a9ea6", fontSize: 13, lineHeight: 19 },
// });

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
import { useFocusEffect, router, useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getListings } from "../../utils/listings";
import ListingCard from "../../components/ListingCard";
import { categories } from "../../data/categories";
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

export default function Home() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [activeDealType, setActiveDealType] = useState<string | null>(null);
  const [activePropertyType, setActivePropertyType] = useState<string | null>(null);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [realEstateModalVisible, setRealEstateModalVisible] = useState(false);
  const [draftDealType, setDraftDealType] = useState<string | null>(null);
  const [draftPropertyType, setDraftPropertyType] = useState<string | null>(null);
  const searchTimer = useRef<any>(null);

  const isRealEstateActive = activeCategory === "real-estate";

  const load = async (opts?: {
    search?: string;
    categoryId?: string | null;
    cityId?: string | null;
    dealType?: string | null;
    propertyType?: string | null;
  }) => {
    try {
      const data = await getListings({
        search: opts?.search !== undefined ? opts.search : search,
        categoryId: opts?.categoryId !== undefined ? opts.categoryId : activeCategory,
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
      const incoming = params.categoryId ?? null;
      if (incoming !== activeCategory) {
        setActiveCategory(incoming);
        if (incoming !== "real-estate") {
          setActiveDealType(null);
          setActivePropertyType(null);
        }
        load({ categoryId: incoming, dealType: null, propertyType: null }).finally(() => setLoading(false));
      } else {
        load().finally(() => setLoading(false));
      }
    }, [params.categoryId])
  );

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener("tabPress" as any, () => {
        setActiveCategory(null);
        setActiveCity(null);
        setActiveDealType(null);
        setActivePropertyType(null);
        setSearch("");
        load({ categoryId: null, cityId: null, search: "", dealType: null, propertyType: null });
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

  const onSelectCategory = (id: string) => {
    if (id === "real-estate") {
      // Open the filter popup instead of instantly toggling
      setDraftDealType(activeDealType);
      setDraftPropertyType(activePropertyType);
      setRealEstateModalVisible(true);
      return;
    }
    const next = activeCategory === id ? null : id;
    setActiveCategory(next);
    setActiveDealType(null);
    setActivePropertyType(null);
    load({ categoryId: next, dealType: null, propertyType: null });
  };

  const applyRealEstateFilters = () => {
    setActiveCategory("real-estate");
    setActiveDealType(draftDealType);
    setActivePropertyType(draftPropertyType);
    setRealEstateModalVisible(false);
    load({ categoryId: "real-estate", dealType: draftDealType, propertyType: draftPropertyType });
  };

  const skipRealEstateFilters = () => {
    setActiveCategory("real-estate");
    setActiveDealType(null);
    setActivePropertyType(null);
    setDraftDealType(null);
    setDraftPropertyType(null);
    setRealEstateModalVisible(false);
    load({ categoryId: "real-estate", dealType: null, propertyType: null });
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

  const activeCategoryLabel = categories.find((c) => c.id === activeCategory)?.title;
  const activeCityLabel = cities.find((c) => c.id === activeCity)?.title;
  const activeDealTypeLabel = DEAL_TYPES.find((d) => d.id === activeDealType)?.title;
  const activePropertyTypeLabel = PROPERTY_TYPES.find((p) => p.id === activePropertyType)?.title;
  const firstName = user?.full_name?.split(" ")[0];
  const searchPlaceholder = activeCityLabel
    ? `جستجو در ${activeCityLabel}...`
    : "جستجو در همه شهرها...";

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00a884" />
      </View>
    );
  }

  const ListHeader = (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>دسته‌بندی‌ها</Text>
        <Text style={styles.sectionHint}>برای فیلتر کردن روی یکی بزنید</Text>
      </View>
      <View style={styles.categoryGrid}>
        {categories.map((c) => {
          const active = activeCategory === c.id;
          return (
            <TouchableOpacity
              key={c.id}
              style={styles.categoryGridItem}
              onPress={() => onSelectCategory(c.id)}
              activeOpacity={0.75}
            >
              <View style={[styles.categoryCircle, active && styles.categoryCircleActive]}>
                <Ionicons name={c.icon as any} size={22} color={active ? "#fff" : "#00a884"} />
              </View>
              <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]} numberOfLines={1}>
                {c.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isRealEstateActive && (activeDealTypeLabel || activePropertyTypeLabel) && (
        <TouchableOpacity
          style={styles.activeFilterBar}
          onPress={() => {
            setDraftDealType(activeDealType);
            setDraftPropertyType(activePropertyType);
            setRealEstateModalVisible(true);
          }}
        >
          <Ionicons name="options" size={15} color="#00a884" />
          <Text style={styles.activeFilterText}>
            {[activeDealTypeLabel, activePropertyTypeLabel].filter(Boolean).join(" • ")}
          </Text>
          <Text style={styles.activeFilterEdit}>ویرایش</Text>
        </TouchableOpacity>
      )}

      {listings.length > 0 && (
        <Text style={styles.resultsCount}>
          {listings.length} اعلان
          {activeCategoryLabel ? ` در «${activeCategoryLabel}»` : ""}
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

      {/* Real estate filter popup */}
      <Modal
        visible={realEstateModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRealEstateModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setRealEstateModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={[styles.reModalSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.modalHandle} />

            <View style={styles.reModalHeader}>
              <View style={styles.reModalTitleRow}>
                <View style={styles.filterCardIconCircle}>
                  <Ionicons name="home" size={16} color="#00a884" />
                </View>
                <View>
                  <Text style={styles.reModalTitle}>فیلتر املاک</Text>
                  <Text style={styles.reModalSubtitle}>نوع معامله و ملک مورد نظر را انتخاب کنید</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setRealEstateModalVisible(false)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close-circle" size={24} color="#c7cad1" />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterGroupLabel}>نوع معامله</Text>
            <View style={styles.segmentedRow}>
              {DEAL_TYPES.map((d) => {
                const active = draftDealType === d.id;
                return (
                  <TouchableOpacity
                    key={d.id}
                    style={[styles.segmentedItem, active && styles.segmentedItemActive]}
                    onPress={() => setDraftDealType(active ? null : d.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name={d.icon as any} size={14} color={active ? "#fff" : "#5f6570"} />
                    <Text style={[styles.segmentedText, active && styles.segmentedTextActive]}>{d.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.filterGroupLabel, { marginTop: 18 }]}>نوع ملک</Text>
            <View style={styles.propertyTypeGrid}>
              {PROPERTY_TYPES.map((p) => {
                const active = draftPropertyType === p.id;
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.propertyTypeCard, active && styles.propertyTypeCardActive]}
                    onPress={() => setDraftPropertyType(active ? null : p.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.propertyTypeIconWrap, active && styles.propertyTypeIconWrapActive]}>
                      <Ionicons name={p.icon as any} size={17} color={active ? "#fff" : "#00a884"} />
                    </View>
                    <Text style={[styles.propertyTypeText, active && styles.propertyTypeTextActive]} numberOfLines={1}>
                      {p.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.reModalFooter}>
              <TouchableOpacity style={styles.reModalSkipButton} onPress={skipRealEstateFilters}>
                <Text style={styles.reModalSkipText}>نمایش همه املاک</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reModalApplyButton} onPress={applyRealEstateFilters}>
                <Text style={styles.reModalApplyText}>اعمال فیلتر</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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

  sectionHeader: { paddingHorizontal: 4, paddingTop: 16, paddingBottom: 4 },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  sectionHint: { fontSize: 11.5, color: "#9a9ea6", marginTop: 2 },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 14,
    paddingBottom: 6,
  },
  categoryGridItem: { width: "25%", alignItems: "center", marginBottom: 18 },
  categoryCircle: {
    width: 54, height: 54, borderRadius: 27,
    backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center",
    marginBottom: 6,
  },
  categoryCircleActive: { backgroundColor: "#00a884" },
  categoryLabel: { fontSize: 11.5, color: "#5f6570", fontWeight: "500", textAlign: "center" },
  categoryLabelActive: { color: "#00a884", fontWeight: "700" },

  activeFilterBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f3fbf8",
    borderWidth: 1,
    borderColor: "#c7ebe0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  activeFilterText: { flex: 1, fontSize: 12.5, color: "#00806a", fontWeight: "600" },
  activeFilterEdit: { fontSize: 12, color: "#00a884", fontWeight: "700" },

  filterCardIconCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center",
  },

  filterGroupLabel: { fontSize: 12, fontWeight: "600", color: "#9a9ea6", marginBottom: 8 },

  segmentedRow: {
    flexDirection: "row",
    backgroundColor: "#f4f5f7",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  segmentedItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 11,
    borderRadius: 9,
  },
  segmentedItemActive: {
    backgroundColor: "#00a884",
    elevation: 2,
    shadowColor: "#00a884",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  segmentedText: { fontSize: 12.5, color: "#5f6570", fontWeight: "600" },
  segmentedTextActive: { color: "#fff" },

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

  reModalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  reModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  reModalTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  reModalTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
  reModalSubtitle: { fontSize: 12, color: "#9a9ea6", marginTop: 2 },

  reModalFooter: { flexDirection: "row", gap: 10, marginTop: 24 },
  reModalSkipButton: {
    flex: 1, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 12, paddingVertical: 14,
  },
  reModalSkipText: { fontSize: 13.5, color: "#5f6570", fontWeight: "600" },
  reModalApplyButton: {
    flex: 1.4, alignItems: "center", justifyContent: "center",
    backgroundColor: "#00a884", borderRadius: 12, paddingVertical: 14,
  },
  reModalApplyText: { fontSize: 14, color: "#fff", fontWeight: "700" },

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