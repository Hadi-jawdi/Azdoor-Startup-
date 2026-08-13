

import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ListingCard({ item }: { item: any }) {
  return (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity style={styles.card} activeOpacity={0.85}>
        <View style={styles.imageWrap}>
          {item.images?.[0] ? (
            <Image source={{ uri: item.images[0].image }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={26} color="#c7cad1" />
            </View>
          )}
        </View>

        <View style={styles.body}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.price}>{item.price}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={12} color="#9a9ea6" />
            <Text style={styles.meta} numberOfLines={1}>{item.location}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eef0f2",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrap: { width: "100%", aspectRatio: 4 / 3, backgroundColor: "#f4f5f7" },
  image: { width: "100%", height: "100%" },
  imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },
  body: { padding: 12 },
  title: { fontSize: 15, fontWeight: "600", color: "#1a1a1a" },
  price: { fontSize: 15, fontWeight: "700", color: "#00a884", marginTop: 5 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  meta: { fontSize: 12, color: "#9a9ea6", flexShrink: 1 },
});