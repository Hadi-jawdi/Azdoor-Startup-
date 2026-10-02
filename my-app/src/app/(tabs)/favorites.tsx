// import { useCallback, useState } from "react";
// import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
// import { useFocusEffect, router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useAuth } from "../../context/AuthContext";
// import { getFavorites } from "../../utils/listings";
// import ListingCard from "../../components/ListingCard";

// export default function Favorites() {
//   const { user, token } = useAuth();
//   const [listings, setListings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const load = async () => {
//     try {
//       const data = await getFavorites(token);
//       setListings(data);
//     } catch {
//       setListings([]);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       if (!user) {
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       load().finally(() => setLoading(false));
//     }, [user])
//   );

//   const handleUnfavorite = (id: number, favorited: boolean) => {
//     if (!favorited) {
//       setListings((prev) => prev.filter((l) => l.id !== id));
//     }
//   };

//   if (!user) {
//     return (
//       <View style={styles.centered}>
//         <View style={styles.iconCircle}>
//           <Ionicons name="heart-outline" size={26} color="#00a884" />
//         </View>
//         <Text style={styles.noticeTitle}>ابتدا وارد حساب خود شوید</Text>
//         <Text style={styles.notice}>برای مشاهده علاقه‌مندی‌ها باید وارد حساب کاربری شوید.</Text>
//         <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/profile")}>
//           <Text style={styles.primaryButtonText}>ورود / ثبت‌نام</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#00a884" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>علاقه‌مندی‌ها</Text>
//         <Text style={styles.headerSubtitle}>{listings.length} اعلان ذخیره شده</Text>
//       </View>

//       <FlatList
//         data={listings}
//         keyExtractor={(item) => String(item.id)}
//         numColumns={2}
//         columnWrapperStyle={{ gap: 12 }}
//         contentContainerStyle={styles.listContent}
//         renderItem={({ item }) => (
//           <View style={{ flex: 1, marginBottom: 12 }}>
//             <ListingCard item={item} onToggleFavorite={handleUnfavorite} />
//           </View>
//         )}
//         ListEmptyComponent={
//           <View style={styles.emptyWrap}>
//             <View style={styles.iconCircle}>
//               <Ionicons name="heart-outline" size={26} color="#c7cad1" />
//             </View>
//             <Text style={styles.emptyTitle}>هنوز اعلانی ذخیره نکرده‌اید</Text>
//             <Text style={styles.emptyText}>روی آیکون قلب اعلان‌ها بزنید تا اینجا ذخیره شوند.</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f7f8fa" },
//   centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },

//   header: { padding: 16, paddingBottom: 8 },
//   headerTitle: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
//   headerSubtitle: { fontSize: 13, color: "#9a9ea6", marginTop: 2 },

//   listContent: { paddingHorizontal: 16, paddingBottom: 16 },

//   iconCircle: {
//     width: 56, height: 56, borderRadius: 28, backgroundColor: "#e1f5ee",
//     justifyContent: "center", alignItems: "center", marginBottom: 16,
//   },
//   noticeTitle: { fontSize: 17, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
//   notice: { fontSize: 14, color: "#9a9ea6", textAlign: "center", marginBottom: 22, lineHeight: 20 },
//   primaryButton: { backgroundColor: "#00a884", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 10 },
//   primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },

//   emptyWrap: { alignItems: "center", marginTop: 60, paddingHorizontal: 40, width: "100%" },
//   emptyTitle: { fontSize: 15.5, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
//   emptyText: { textAlign: "center", color: "#9a9ea6", fontSize: 13, lineHeight: 19 },
// });


import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFocusEffect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { getFavorites } from "../../utils/listings";
import ListingCard from "../../components/ListingCard";

const GREEN = "#00a884";
const BG = "#f6f8f7";

export default function Favorites() {
  const { user, token } = useAuth();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await getFavorites(token);
      setListings(Array.isArray(data) ? data : []);
    } catch {
      setListings([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        setListings([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      load().finally(() => {
        setLoading(false);
      });
    }, [user, token])
  );

  const handleRefresh = async () => {
    if (!user) return;

    setRefreshing(true);

    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  const handleUnfavorite = (id: number, favorited: boolean) => {
    if (!favorited) {
      setListings((prev) => prev.filter((item) => item.id !== id));
    }
  };

  /*
   * Not logged in
   */
  if (!user) {
    return (
      <View style={styles.centered}>
        <View style={styles.loginIcon}>
          <Ionicons name="heart" size={30} color={GREEN} />
        </View>

        <Text style={styles.noticeTitle}>
          علاقه‌مندی‌های شما
        </Text>

        <Text style={styles.notice}>
          اعلان‌هایی که ذخیره می‌کنید اینجا نمایش داده می‌شوند.
          ابتدا وارد حساب کاربری خود شوید.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={18} color="#fff" />

          <Text style={styles.primaryButtonText}>
            ورود / ثبت‌نام
          </Text>
        </TouchableOpacity>

        <View style={styles.loginHint}>
          <Ionicons
            name="shield-checkmark-outline"
            size={16}
            color="#8b929b"
          />

          <Text style={styles.loginHintText}>
            برای مدیریت اعلان‌های ذخیره‌شده وارد حساب شوید
          </Text>
        </View>
      </View>
    );
  }

  /*
   * Initial loading
   */
  if (loading) {
    return (
      <View style={styles.container}>
        <HeaderSkeleton />

        <View style={styles.loadingGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.skeletonCard}>
              <View style={styles.skeletonImage} />

              <View style={styles.skeletonLineLarge} />
              <View style={styles.skeletonLineSmall} />
              <View style={styles.skeletonLineMedium} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  /*
   * Main page
   */
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleRow}>
            <View style={styles.headerIcon}>
              <Ionicons name="heart" size={19} color={GREEN} />
            </View>

            <View>
              <Text style={styles.headerTitle}>
                علاقه‌مندی‌ها
              </Text>

              <Text style={styles.headerSubtitle}>
                اعلان‌هایی که ذخیره کرده‌اید
              </Text>
            </View>
          </View>

          {listings.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {listings.length}
              </Text>
            </View>
          )}
        </View>

        {listings.length > 0 && (
          <View style={styles.savedInfo}>
            <Ionicons
              name="bookmark-outline"
              size={15}
              color="#737a83"
            />

            <Text style={styles.savedInfoText}>
              {listings.length === 1
                ? "۱ اعلان ذخیره شده"
                : `${listings.length} اعلان ذخیره شده`}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={listings}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          listings.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={GREEN}
            colors={[GREEN]}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ListingCard
              item={item}
              onToggleFavorite={handleUnfavorite}
            />
          </View>
        )}
        ListEmptyComponent={
          <EmptyFavorites />
        }
      />
    </View>
  );
}

/* --------------------------------
   Header loading skeleton
--------------------------------- */

function HeaderSkeleton() {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.headerTitleRow}>
          <View style={styles.skeletonHeaderIcon} />

          <View>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonSubtitle} />
          </View>
        </View>

        <View style={styles.skeletonBadge} />
      </View>
    </View>
  );
}

/* --------------------------------
   Empty favorites
--------------------------------- */

function EmptyFavorites() {
  return (
    <View style={styles.emptyWrap}>
      <View style={styles.emptyIllustration}>
        <View style={styles.emptyHeartCircle}>
          <Ionicons
            name="heart-outline"
            size={34}
            color={GREEN}
          />
        </View>

        <View style={styles.smallHeartOne}>
          <Ionicons
            name="heart"
            size={12}
            color="#9edfd0"
          />
        </View>

        <View style={styles.smallHeartTwo}>
          <Ionicons
            name="heart"
            size={9}
            color="#c5ebe3"
          />
        </View>
      </View>

      <Text style={styles.emptyTitle}>
        هنوز چیزی ذخیره نکرده‌اید
      </Text>

      <Text style={styles.emptyText}>
        وقتی خانه، ملک یا اعلان مورد علاقه‌تان را پیدا کردید،
        روی آیکون قلب بزنید تا بعداً راحت‌تر آن را پیدا کنید.
      </Text>

      <TouchableOpacity
        style={styles.exploreButton}
        activeOpacity={0.85}
        onPress={() => router.push("/")}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color="#fff"
        />

        <Text style={styles.exploreButtonText}>
          مشاهده اعلان‌ها
        </Text>
      </TouchableOpacity>

      <View style={styles.emptyFeatures}>
        <Feature
          icon="heart-outline"
          text="ذخیره سریع"
        />

        <View style={styles.featureDivider} />

        <Feature
          icon="bookmark-outline"
          text="دسترسی آسان"
        />
      </View>
    </View>
  );
}

function Feature({
  icon,
  text,
}: {
  icon: any;
  text: string;
}) {
  return (
    <View style={styles.feature}>
      <Ionicons
        name={icon}
        size={16}
        color="#7f8790"
      />

      <Text style={styles.featureText}>
        {text}
      </Text>
    </View>
  );
}

/* --------------------------------
   Styles
--------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  centered: {
    flex: 1,
    backgroundColor: BG,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  /* Header */

  header: {
    paddingHorizontal: 16,
    paddingTop: 30,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f1",
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#e8f7f3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 11,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#17191c",
    textAlign: "right",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#969ca4",
    marginTop: 3,
    textAlign: "right",
  },

  countBadge: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 9,
    borderRadius: 17,
    backgroundColor: "#e8f7f3",
    justifyContent: "center",
    alignItems: "center",
  },

  countBadgeText: {
    color: GREEN,
    fontSize: 13,
    fontWeight: "800",
  },

  savedInfo: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f6f7f8",
  },

  savedInfoText: {
    color: "#737a83",
    fontSize: 11.5,
    marginLeft: 5,
  },

  /* Listing grid */

  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 30,
  },

  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },

  cardWrapper: {
    flex: 1,
    minWidth: 0,
  },

  /* Login */

  loginIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#e4f6f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  noticeTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#17191c",
    marginBottom: 8,
    textAlign: "center",
  },

  notice: {
    fontSize: 14,
    color: "#858c95",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  primaryButton: {
    minWidth: 180,
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 13,
    backgroundColor: GREEN,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14,
    marginLeft: 7,
  },

  loginHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#fff",
  },

  loginHintText: {
    color: "#8b929b",
    fontSize: 11,
    marginLeft: 5,
  },

  /* Empty */

  emptyListContent: {
    flexGrow: 1,
  },

  emptyWrap: {
    flex: 1,
    minHeight: 500,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },

  emptyIllustration: {
    width: 110,
    height: 105,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 20,
  },

  emptyHeartCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#e5f7f2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 8,
    borderColor: "#f0fbf8",
  },

  smallHeartOne: {
    position: "absolute",
    top: 6,
    right: 8,
  },

  smallHeartTwo: {
    position: "absolute",
    bottom: 12,
    left: 8,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#202327",
    marginBottom: 8,
    textAlign: "center",
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 21,
    color: "#9298a0",
    textAlign: "center",
    maxWidth: 310,
  },

  exploreButton: {
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: GREEN,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  exploreButtonText: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "800",
    marginLeft: 7,
  },

  emptyFeatures: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 28,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#edf0f1",
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },

  featureText: {
    fontSize: 11.5,
    color: "#7f8790",
    marginLeft: 5,
  },

  featureDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#e6e8ea",
  },

  /* Loading skeleton */

  loadingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },

  skeletonCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingBottom: 13,
    overflow: "hidden",
  },

  skeletonImage: {
    width: "100%",
    height: 145,
    backgroundColor: "#e9ecee",
  },

  skeletonLineLarge: {
    height: 12,
    width: "75%",
    borderRadius: 6,
    backgroundColor: "#e9ecee",
    marginTop: 12,
    marginHorizontal: 10,
  },

  skeletonLineSmall: {
    height: 9,
    width: "50%",
    borderRadius: 5,
    backgroundColor: "#eef0f1",
    marginTop: 8,
    marginHorizontal: 10,
  },

  skeletonLineMedium: {
    height: 10,
    width: "60%",
    borderRadius: 5,
    backgroundColor: "#eef0f1",
    marginTop: 8,
    marginHorizontal: 10,
  },

  skeletonHeaderIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#e9ecee",
    marginRight: 11,
  },

  skeletonTitle: {
    width: 105,
    height: 15,
    borderRadius: 7,
    backgroundColor: "#e9ecee",
  },

  skeletonSubtitle: {
    width: 140,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#eef0f1",
    marginTop: 7,
  },

  skeletonBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e9ecee",
  },
});