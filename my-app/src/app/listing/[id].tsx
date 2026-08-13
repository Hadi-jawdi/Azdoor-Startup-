
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { getListing } from "../../utils/listings";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.85;

export default function ListingDetail() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    getListing(id as string)
      .then(setItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00a884" />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error ? `خطا: ${error}` : "اعلان یافت نشد."}</Text>
        <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
          <Text style={styles.backLinkText}>بازگشت</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const images = item.images?.length ? item.images : [];

  return (
    <View style={styles.container}>
      {/* Image carousel or placeholder */}
      <View style={{ height: IMAGE_HEIGHT }}>
        {images.length > 0 ? (
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(img) => String(img.id)}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
              setActiveIndex(idx);
            }}
            renderItem={({ item: img }) => (
              <Image
                source={{ uri: img.image }}
                style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
                resizeMode="cover"
              />
            )}
          />
        ) : (
          <View style={[styles.imagePlaceholder, { height: IMAGE_HEIGHT }]}>
            <Ionicons name="image-outline" size={48} color="#c7cad1" />
          </View>
        )}

        {/* Floating header controls */}
        <View style={[styles.floatingHeader, { top: insets.top + 8 }]}>
          <TouchableOpacity style={styles.circleButton} onPress={() => router.back()}>
            <Ionicons name="arrow-forward" size={20} color="#1a1a1a" />
          </TouchableOpacity>
        </View>

        {/* Dot pagination */}
        {images.length > 1 && (
          <View style={styles.dotsRow}>
            {images.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeIndex && styles.dotActive]} />
            ))}
          </View>
        )}
      </View>

      {/* Content sheet, overlapping the image slightly */}
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />

        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.price}>{item.price}</Text>

        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Ionicons name="location-outline" size={14} color="#5f6570" />
            <Text style={styles.pillText}>{item.location}</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="pricetag-outline" size={14} color="#5f6570" />
            <Text style={styles.pillText}>{item.category_display}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionLabel}>توضیحات</Text>
        <Text style={styles.description}>
          {item.description || "توضیحاتی برای این اعلان ثبت نشده است."}
        </Text>

        {item.owner_name ? (
          <View style={styles.ownerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.owner_name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.ownerLabel}>ثبت شده توسط</Text>
              <Text style={styles.ownerName}>{item.owner_name}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  errorText: { fontSize: 15, color: "#5f6570", textAlign: "center" },
  backLink: { marginTop: 16 },
  backLinkText: { color: "#00a884", fontWeight: "600" },

  imagePlaceholder: { width: "100%", backgroundColor: "#f0f1f3", justifyContent: "center", alignItems: "center" },

  floatingHeader: {
    position: "absolute",
    left: 16,
    flexDirection: "row",
  },
  circleButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  dotsRow: {
    position: "absolute",
    bottom: 28,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  dotActive: {
    backgroundColor: "#fff",
    width: 18,
  },

  sheet: {
    flex: 1,
    marginTop: -24,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e4e6ea",
    alignSelf: "center",
    marginBottom: 16,
  },

  titleRow: { marginBottom: 6 },
  title: { fontSize: 19, fontWeight: "700", color: "#1a1a1a", lineHeight: 26 },
  price: { fontSize: 22, fontWeight: "700", color: "#00a884", marginBottom: 14 },

  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 18 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#f4f5f7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillText: { fontSize: 12.5, color: "#5f6570", fontWeight: "500" },

  divider: { height: 1, backgroundColor: "#eef0f2", marginBottom: 18 },

  sectionLabel: { fontSize: 13, fontWeight: "700", color: "#9a9ea6", marginBottom: 8 },
  description: { fontSize: 14.5, color: "#33363b", lineHeight: 23 },

  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#eef0f2",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e1f5ee",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#0f6e56", fontWeight: "700", fontSize: 16 },
  ownerLabel: { fontSize: 11.5, color: "#9a9ea6" },
  ownerName: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
});