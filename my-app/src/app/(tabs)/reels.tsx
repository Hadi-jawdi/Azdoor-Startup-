
import { useCallback, useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  ActivityIndicator,
  ViewToken,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import VideoReelCard from "../../components/VideoReelCard";

// import { getVideoListings, toggleFavorite as apiToggleFavorite } from "../../utils/listings";
import { getVideoListings, toggleFavorite as apiToggleFavorite } from "../../utils/listings";
import { useAuth } from "../../context/AuthContext";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Reels() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const isFocused = useIsFocused();
  const { token } = useAuth();

  const load = useCallback(async () => {
    try {
      const data = await getVideoListings(token);
      setListings(data);
      setError(false);
    } catch {
      setError(true);
    }
  }, [token]);
  // const isFocused = useIsFocused();

  // const load = useCallback(async () => {
  //   try {
  //     const data = await getVideoListings();
  //     setListings(data);
  //     setError(false);
  //   } catch {
  //     setError(true);
  //   }
  // }, []);

  useFocusEffect(
    useCallback(() => {
      load().finally(() => setLoading(false));
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const retry = () => {
    setLoading(true);
    load().finally(() => setLoading(false));
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  const handleToggleFavorite = (id: number, favorited: boolean) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, is_favorited: favorited } : l)));
  };
  const handleFollowChange = (ownerId: number, isFollowing: boolean) => {
    setListings((prev) =>
      prev.map((l) => (l.owner === ownerId ? { ...l, owner_is_following: isFollowing } : l))
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error && listings.length === 0) {
    return (
      <View style={styles.centered}>
        <View style={styles.stateIconCircle}>
          <Ionicons name="cloud-offline-outline" size={30} color="rgba(255,255,255,0.8)" />
        </View>
        <Text style={styles.stateTitle}>خطا در بارگذاری ویدیوها</Text>
        <Text style={styles.stateText}>اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</Text>
        <TouchableOpacity style={styles.stateButton} onPress={retry} activeOpacity={0.85}>
          <Text style={styles.stateButtonText}>تلاش مجدد</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (listings.length === 0) {
    return (
      <View style={styles.centered}>
        <View style={styles.stateIconCircle}>
          <Ionicons name="videocam-outline" size={32} color="rgba(255,255,255,0.8)" />
        </View>
        <Text style={styles.stateTitle}>هنوز ویدیویی وجود ندارد</Text>
        <Text style={styles.stateText}>ویدیوهای ملک‌ها در این بخش نمایش داده می‌شوند.</Text>
        <TouchableOpacity style={styles.stateButton} onPress={retry} activeOpacity={0.85}>
          <Text style={styles.stateButtonText}>تازه‌سازی</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
                  <VideoReelCard
            item={item}
            isActive={isFocused && index === activeIndex}
            onToggleFavorite={handleToggleFavorite}
            onFollowChange={handleFollowChange}
          />
          // <VideoReelCard
          //   item={item}
          //   isActive={isFocused && index === activeIndex}
          //   onToggleFavorite={handleToggleFavorite}
          // />
        )}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        windowSize={3}
        removeClippedSubviews
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
            colors={["#00a884"]}
            progressBackgroundColor="#1f1f1f"
          />
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 40,
    gap: 8,
  },

  stateIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stateTitle: { fontSize: 16, fontWeight: "700", color: "#fff", textAlign: "center" },
  stateText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    lineHeight: 20,
  },
  stateButton: {
    marginTop: 12,
    backgroundColor: "#00a884",
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 12,
  },
  stateButtonText: { color: "#fff", fontWeight: "700", fontSize: 13.5 },
});