
// import { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
// import { Link, router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useAuth } from "../context/AuthContext";
// import { toggleFavorite } from "../utils/listings";

// export default function ListingCard({ item, onToggleFavorite }: { item: any; onToggleFavorite?: (id: number, favorited: boolean) => void }) {
//   const { user, token } = useAuth();
//   const [favorited, setFavorited] = useState(!!item.is_favorited);
//   const [busy, setBusy] = useState(false);

//   const handleFavorite = async (e: any) => {
//     e.preventDefault();
//     if (!user) {
//       router.push("/profile");
//       return;
//     }
//     if (busy) return;
//     const next = !favorited;
//     setFavorited(next);
//     setBusy(true);
//     try {
//       await toggleFavorite(item.id, token);
//       onToggleFavorite?.(item.id, next);
//     } catch {
//       setFavorited(!next);
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <Link href={`/listing/${item.id}`} asChild>
//       <TouchableOpacity style={styles.card} activeOpacity={0.9}>
//         <View style={styles.imageWrap}>
//           {item.images?.[0] ? (
//             <Image source={{ uri: item.images[0].image }} style={styles.image} resizeMode="cover" />
//           ) : (
//             <View style={styles.imagePlaceholder}>
//               <Ionicons name="image-outline" size={24} color="#c7cad1" />
//             </View>
//           )}

//           <LinearGradient
//             colors={["transparent", "rgba(0,0,0,0.55)"]}
//             style={styles.gradientOverlay}
//           >
//             <Text style={styles.priceOnImage} numberOfLines={1}>{item.price}</Text>
//           </LinearGradient>

//           <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
//             <Ionicons
//               name={favorited ? "heart" : "heart-outline"}
//               size={16}
//               color={favorited ? "#e74c3c" : "#5f6570"}
//             />
//           </TouchableOpacity>

//           {item.category_display && (
//             <View style={styles.categoryBadge}>
//               <Text style={styles.categoryBadgeText} numberOfLines={1}>{item.category_display}</Text>
//             </View>
//           )}

//           {item.deal_type_display && (
//    <View style={[styles.categoryBadge, styles.dealBadge]}>
//      <Text style={styles.categoryBadgeText} numberOfLines={1}>{item.deal_type_display}</Text>
//    </View>
// )}
//         </View>

//         <View style={styles.body}>
//           <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
//           <View style={styles.metaRow}>
//             <Ionicons name="location-outline" size={11} color="#9a9ea6" />
//             <Text style={styles.meta} numberOfLines={1}>{item.location}</Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     </Link>
//   );
// }

// const styles = StyleSheet.create({
//   card: {
//     flex: 1,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     overflow: "hidden",
//     borderWidth: 1,
//     borderColor: "#eef0f2",
//     elevation: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 6,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   imageWrap: { width: "100%", aspectRatio: 1, backgroundColor: "#f4f5f7", position: "relative" },
//   image: { width: "100%", height: "100%" },
//   imagePlaceholder: { flex: 1, justifyContent: "center", alignItems: "center" },

//   gradientOverlay: {
//     position: "absolute", bottom: 0, left: 0, right: 0,
//     height: "45%", justifyContent: "flex-end", padding: 8,
//   },
//   priceOnImage: { color: "#fff", fontWeight: "700", fontSize: 13.5 },

//   favoriteButton: {
//     position: "absolute", top: 8, right: 8,
//     width: 28, height: 28, borderRadius: 14,
//     backgroundColor: "rgba(255,255,255,0.92)",
//     justifyContent: "center", alignItems: "center",
//   },

//   categoryBadge: {
//     position: "absolute", top: 8, left: 8,
//     backgroundColor: "rgba(255,255,255,0.92)",
//     borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3,
//     maxWidth: "60%",
//   },
//   categoryBadgeText: { fontSize: 10, color: "#1a1a1a", fontWeight: "600" },
//   dealBadge: { top: 8, right: 8, left: undefined },

//   body: { padding: 10 },
//   title: { fontSize: 13.5, fontWeight: "600", color: "#1a1a1a" },
//   metaRow: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
//   meta: { fontSize: 11, color: "#9a9ea6", flexShrink: 1 },
// });










import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite } from "../utils/listings";

const GREEN = "#00a884";

export default function ListingCard({
  item,
  onToggleFavorite,
}: {
  item: any;
  onToggleFavorite?: (id: number, favorited: boolean) => void;
}) {
  const { user, token } = useAuth();

  const [favorited, setFavorited] = useState(
    !!item.is_favorited
  );

  const [busy, setBusy] = useState(false);

  const handleFavorite = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();

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

  const image =
    item.images?.[0]?.image ||
    item.image ||
    null;

  const hasLocation = !!item.location;

  return (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
      >
        {/* IMAGE */}
        <View style={styles.imageWrap}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <View style={styles.placeholderIcon}>
                <Ionicons
                  name="image-outline"
                  size={25}
                  color="#aeb4bb"
                />
              </View>

              <Text style={styles.placeholderText}>
                بدون تصویر
              </Text>
            </View>
          )}

          {/* Bottom image gradient */}
          <LinearGradient
            colors={[
              "transparent",
              "rgba(0,0,0,0.08)",
              "rgba(0,0,0,0.72)",
            ]}
            style={styles.gradientOverlay}
          />

          {/* PRICE */}
          {!!item.price && (
            <View style={styles.priceContainer}>
              <Text
                style={styles.price}
                numberOfLines={1}
              >
                {item.price}
              </Text>
            </View>
          )}

          {/* FAVORITE */}
          <TouchableOpacity
            style={[
              styles.favoriteButton,
              favorited && styles.favoriteButtonActive,
            ]}
            onPress={handleFavorite}
            activeOpacity={0.8}
          >
            <Ionicons
              name={
                favorited
                  ? "heart"
                  : "heart-outline"
              }
              size={18}
              color={
                favorited
                  ? "#e74c3c"
                  : "#353a40"
              }
            />
          </TouchableOpacity>

          {/* CATEGORY */}
          {!!item.category_display && (
            <View style={styles.categoryBadge}>
              <Ionicons
                name="pricetag-outline"
                size={11}
                color="#34383d"
              />

              <Text
                style={styles.categoryBadgeText}
                numberOfLines={1}
              >
                {item.category_display}
              </Text>
            </View>
          )}

          {/* DEAL TYPE */}
          {!!item.deal_type_display && (
            <View style={styles.dealBadge}>
              <View style={styles.dealDot} />

              <Text
                style={styles.dealBadgeText}
                numberOfLines={1}
              >
                {item.deal_type_display}
              </Text>
            </View>
          )}

          {/* IMAGE COUNT */}
          {item.images?.length > 1 && (
            <View style={styles.imageCount}>
              <Ionicons
                name="images-outline"
                size={12}
                color="#fff"
              />

              <Text style={styles.imageCountText}>
                {item.images.length}
              </Text>
            </View>
          )}
        </View>

        {/* BODY */}
        <View style={styles.body}>
          {/* Title */}
          <Text
            style={styles.title}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* Location */}
          {hasLocation && (
            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color="#7f8790"
              />

              <Text
                style={styles.location}
                numberOfLines={1}
              >
                {item.location}
              </Text>
            </View>
          )}

          {/* Extra information */}
          <View style={styles.bottomRow}>
            <View style={styles.detailsRow}>
              {!!item.property_type_display && (
                <View style={styles.detailItem}>
                  <Ionicons
                    name="home-outline"
                    size={12}
                    color={GREEN}
                  />

                  <Text
                    style={styles.detailText}
                    numberOfLines={1}
                  >
                    {item.property_type_display}
                  </Text>
                </View>
              )}

              {!!item.employment_type_display && (
                <View style={styles.detailItem}>
                  <Ionicons
                    name="briefcase-outline"
                    size={12}
                    color={GREEN}
                  />

                  <Text
                    style={styles.detailText}
                    numberOfLines={1}
                  >
                    {item.employment_type_display}
                  </Text>
                </View>
              )}
            </View>

            {/* Arrow */}
            <View style={styles.arrowButton}>
              <Ionicons
                name="chevron-forward"
                size={14}
                color="#9299a1"
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  /* CARD */

  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 17,
    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#edf0f1",

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.055,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  /* IMAGE */

  imageWrap: {
    width: "100%",
    aspectRatio: 0.9,
    backgroundColor: "#f1f3f4",
    position: "relative",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e7e9eb",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderText: {
    fontSize: 10,
    color: "#a1a7ae",
    marginTop: 7,
  },

  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "55%",
  },

  /* PRICE */

  priceContainer: {
    position: "absolute",
    left: 10,
    bottom: 9,

    maxWidth: "72%",

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 8,

    backgroundColor: "rgba(0,0,0,0.42)",
  },

  price: {
    color: "#fff",
    fontSize: 13.5,
    fontWeight: "800",
  },

  /* FAVORITE */

  favoriteButton: {
    position: "absolute",
    top: 9,
    right: 9,

    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: "rgba(255,255,255,0.94)",

    justifyContent: "center",
    alignItems: "center",

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  favoriteButtonActive: {
    backgroundColor: "#fff4f3",
  },

  /* CATEGORY */

  categoryBadge: {
    position: "absolute",
    top: 9,
    left: 9,

    maxWidth: "58%",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 8,

    backgroundColor: "rgba(255,255,255,0.94)",
  },

  categoryBadgeText: {
    fontSize: 9.5,
    fontWeight: "700",
    color: "#34383d",
    marginLeft: 4,
  },

  /* DEAL */

  dealBadge: {
    position: "absolute",
    top: 51,
    left: 9,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 8,
    paddingVertical: 5,

    borderRadius: 8,

    backgroundColor: "rgba(0,168,132,0.95)",
  },

  dealDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#fff",
    marginRight: 5,
  },

  dealBadgeText: {
    color: "#fff",
    fontSize: 9.5,
    fontWeight: "700",
  },

  /* IMAGE COUNT */

  imageCount: {
    position: "absolute",
    right: 9,
    bottom: 9,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 7,
    paddingVertical: 4,

    borderRadius: 7,

    backgroundColor: "rgba(0,0,0,0.42)",
  },

  imageCountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },

  /* BODY */

  body: {
    paddingHorizontal: 11,
    paddingTop: 10,
    paddingBottom: 10,
  },

  title: {
    color: "#191c20",
    fontSize: 13.5,
    fontWeight: "700",
    lineHeight: 19,
    minHeight: 19,
  },

  /* LOCATION */

  locationRow: {
    flexDirection: "row",
    alignItems: "center",

    marginTop: 7,
  },

  location: {
    flex: 1,

    fontSize: 11,
    color: "#858c94",

    marginLeft: 4,
  },

  /* BOTTOM */

  bottomRow: {
    minHeight: 24,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 9,

    paddingTop: 8,

    borderTopWidth: 1,
    borderTopColor: "#f0f1f2",
  },

  detailsRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  detailItem: {
    flexDirection: "row",
    alignItems: "center",

    maxWidth: "80%",

    marginRight: 7,
  },

  detailText: {
    fontSize: 9.5,
    color: "#737b84",
    marginLeft: 4,
    flexShrink: 1,
  },

  arrowButton: {
    width: 24,
    height: 24,
    borderRadius: 12,

    backgroundColor: "#f4f6f6",

    justifyContent: "center",
    alignItems: "center",
  },
});