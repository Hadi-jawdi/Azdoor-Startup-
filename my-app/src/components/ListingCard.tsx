
import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite } from "../utils/listings";

export default function ListingCard({ item, onToggleFavorite }: { item: any; onToggleFavorite?: (id: number, favorited: boolean) => void }) {
  const { user, token } = useAuth();
  const [favorited, setFavorited] = useState(!!item.is_favorited);
  const [busy, setBusy] = useState(false);

  const handleFavorite = async (e: any) => {
    e.preventDefault();
    if (!user) {
      router.push("/profile");
      return;
    }
    if (busy) return;
    const next = !favorited;
    setFavorited(next);
    setBusy(true);
    try {
      await toggleFavorite(item.id, token);
      onToggleFavorite?.(item.id, next);
    } catch {
      setFavorited(!next);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.9}>
        <View style={styles.imageWrap}>
          {item.images?.[0] ? (
            <Image source={{ uri: item.images[0].image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={24} color="#c7cad1" />
            </View>
          )}

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.55)"]}
            style={styles.gradientOverlay}
          >
            <Text style={styles.priceOnImage} numberOfLines={1}>{item.price}</Text>
          </LinearGradient>

          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
            <Ionicons
              name={favorited ? "heart" : "heart-outline"}
              size={16}
              color={favorited ? "#e74c3c" : "#5f6570"}
            />
          </TouchableOpacity>

          {item.category_display && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText} numberOfLines={1}>{item.category_display}</Text>
            </View>
          )}

          {item.deal_type_display && (
   <View style={[styles.categoryBadge, styles.dealBadge]}>
     <Text style={styles.categoryBadgeText} numberOfLines={1}>{item.deal_type_display}</Text>
   </View>
)}
        </View>

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={11} color="#9a9ea6" />
            <Text style={styles.meta} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eef0f2",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrap: { width: "100%", aspectRatio: 1, backgroundColor: "#f4f5f7", position: "relative" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },

  gradientOverlay: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    height: "45%", justifyContent: "flex-end", padding: 8,
  },
  priceOnImage: { color: "#fff", fontWeight: "700", fontSize: 13.5 },

  favoriteButton: {
    position: "absolute", top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center", alignItems: "center",
  },

  categoryBadge: {
    position: "absolute", top: 8, left: 8,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3,
    maxWidth: "60%",
  },
  categoryBadgeText: { fontSize: 10, color: "#1a1a1a", fontWeight: "600" },
  dealBadge: { top: 8, right: 8, left: undefined },

  body: { padding: 10 },
  title: { fontSize: 13.5, fontWeight: "600", color: "#1a1a1a" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  meta: { fontSize: 11, color: "#9a9ea6", flexShrink: 1 },
});