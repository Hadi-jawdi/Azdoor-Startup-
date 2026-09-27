
// import { useEffect, useRef, useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Share, Linking, Alert } from "react-native";
// import { useVideoPlayer, VideoView } from "expo-video";
// import { router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useAuth } from "../context/AuthContext";
// import { toggleFavorite } from "../utils/listings";
// import { startConversation } from "../utils/chat";

// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// export default function VideoReelCard({
//   item,
//   isActive,
//   onToggleFavorite,
// }: {
//   item: any; // same Listing shape as ListingCard's `item`, plus `video`
//   isActive: boolean;
//   onToggleFavorite?: (id: number, favorited: boolean) => void;
// }) {
//   const { user, token } = useAuth();
//   const [favorited, setFavorited] = useState(!!item.is_favorited);
//   const [busy, setBusy] = useState(false);
//   const [muted, setMuted] = useState(true);

//   const player = useVideoPlayer(item.video, (p) => {
//     p.loop = true;
//     p.muted = true;
//   });

//   useEffect(() => {
//     if (isActive) {
//       player.play();
//     } else {
//       player.pause();
//       player.currentTime = 0;
//     }
//   }, [isActive, player]);

//   const toggleMute = () => {
//     const next = !muted;
//     player.muted = next;
//     setMuted(next);
//   };

//   const handleFavorite = async () => {
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

//   const handleCall = () => {
//     if (!item?.owner_phone) return;
//     Linking.openURL(`tel:${item.owner_phone}`).catch(() =>
//       Alert.alert("خطا", "امکان برقراری تماس وجود ندارد.")
//     );
//   };

//   const handleMessage = async () => {
//     if (!user) {
//       router.push("/profile");
//       return;
//     }
//     try {
//       const conversation = await startConversation(item.id, token);
//       router.push(`/chat/${conversation.id}`);
//     } catch (err: any) {
//       Alert.alert("خطا", err.message);
//     }
//   };

//   const handleShare = () => {
//     Share.share({ message: `${item.title} — ${item.price}` }).catch(() => {});
//   };

//   const isOwnListing = user && item.owner === user.id;

//   return (
//     <View style={styles.container}>
//       <VideoView style={StyleSheet.absoluteFill} player={player} contentFit="cover" nativeControls={false} />

//       <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={toggleMute} />

//       {muted && (
//         <View style={styles.muteBadge}>
//           <Ionicons name="volume-mute" size={16} color="#fff" />
//         </View>
//       )}

//       <View style={styles.actionRail} pointerEvents="box-none">
//         {!isOwnListing && (
//           <>
//             <ActionButton icon="chatbubble-ellipses" label="پیام" onPress={handleMessage} />
//             <ActionButton icon="call" label="تماس" onPress={handleCall} />
//           </>
//         )}
//         <ActionButton
//           icon={favorited ? "heart" : "heart-outline"}
//           label="ذخیره"
//           onPress={handleFavorite}
//           active={favorited}
//         />
//         <ActionButton icon="share-social" label="اشتراک" onPress={handleShare} />
//       </View>

//       <LinearGradient colors={["transparent", "rgba(0,0,0,0.85)"]} style={styles.bottomOverlay}>
//         {!!item.owner_name && (
//           <View style={styles.ownerRow}>
//             <View style={styles.ownerAvatar}>
//               <Text style={styles.ownerAvatarText}>{item.owner_name.trim().charAt(0)}</Text>
//             </View>
//             <Text style={styles.ownerName} numberOfLines={1}>{item.owner_name}</Text>
//           </View>
//         )}
//         {item.deal_type_display && (
//           <View style={styles.dealBadge}>
//             <Text style={styles.dealBadgeText}>{item.deal_type_display}</Text>
//           </View>
//         )}
//         <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
//         <View style={styles.priceRow}>
//           <Ionicons name="pricetag" size={13} color="#fff" />
//           <Text style={styles.price}>{item.price}</Text>
//         </View>
//         {!!item.location && (
//           <View style={styles.locationRow}>
//             <Ionicons name="location-sharp" size={12} color="rgba(255,255,255,0.75)" />
//             <Text style={styles.location}>{item.location}</Text>
//           </View>
//         )}
//       </LinearGradient>
//     </View>
//   );
// }

// function ActionButton({ icon, label, onPress, active }: { icon: any; label: string; onPress: () => void; active?: boolean }) {
//   return (
//     <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.65}>
//       <View style={[styles.actionIconCircle, active && styles.actionIconCircleActive]}>
//         <Ionicons name={icon} size={23} color={active ? "#e74c3c" : "#fff"} />
//       </View>
//       <Text style={styles.actionLabel}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: "#000" },
//   muteBadge: {
//     position: "absolute", top: 60, alignSelf: "center",
//     backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 16, padding: 6,
//   },
//   actionRail: { position: "absolute", right: 12, bottom: 150, alignItems: "center", gap: 22 },
//   actionButton: { alignItems: "center", gap: 5 },
//   actionIconCircle: {
//     width: 48, height: 48, borderRadius: 24,
//     backgroundColor: "rgba(255,255,255,0.16)",
//     borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
//     justifyContent: "center", alignItems: "center",
//     shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
//     elevation: 4,
//   },
//   actionIconCircleActive: { backgroundColor: "rgba(231,76,60,0.22)", borderColor: "rgba(231,76,60,0.45)" },
//   actionLabel: { color: "#fff", fontSize: 11, fontWeight: "600" },
//   bottomOverlay: { position: "absolute", left: 0, right: 0, bottom: 0, paddingTop: 70, paddingBottom: 28, paddingHorizontal: 16 },
//   ownerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
//   ownerAvatar: {
//     width: 30, height: 30, borderRadius: 15,
//     backgroundColor: "#00a884", justifyContent: "center", alignItems: "center",
//     borderWidth: 1.5, borderColor: "rgba(255,255,255,0.6)",
//   },
//   ownerAvatarText: { color: "#fff", fontSize: 13, fontWeight: "700" },
//   ownerName: { color: "#fff", fontSize: 13.5, fontWeight: "700" },
//   dealBadge: {
//     alignSelf: "flex-start", backgroundColor: "#00a884",
//     paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 8,
//   },
//   dealBadgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
//   title: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 6, lineHeight: 21 },
//   priceRow: { flexDirection: "row", alignItems: "center", gap: 5 },
//   price: { color: "#fff", fontSize: 15, fontWeight: "700" },
//   locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
//   location: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
// });


import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Share, Linking, Alert } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite } from "../utils/listings";
import { startConversation } from "../utils/chat";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function VideoReelCard({
  item,
  isActive,
  onToggleFavorite,
}: {
  item: any; // same Listing shape as ListingCard's `item`, plus `video`
  isActive: boolean;
  onToggleFavorite?: (id: number, favorited: boolean) => void;
}) {
  const { user, token } = useAuth();
  const [favorited, setFavorited] = useState(!!item.is_favorited);
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(true);

  const player = useVideoPlayer(item.video, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [isActive, player]);

  const toggleMute = () => {
    const next = !muted;
    player.muted = next;
    setMuted(next);
  };

  const handleFavorite = async () => {
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

  const handleCall = () => {
    if (!item?.owner_phone) return;
    Linking.openURL(`tel:${item.owner_phone}`).catch(() =>
      Alert.alert("خطا", "امکان برقراری تماس وجود ندارد.")
    );
  };

  const handleMessage = async () => {
    if (!user) {
      router.push("/profile");
      return;
    }
    try {
      const conversation = await startConversation(item.id, token);
      router.push(`/chat/${conversation.id}`);
    } catch (err: any) {
      Alert.alert("خطا", err.message);
    }
  };

  const handleShare = () => {
    Share.share({ message: `${item.title} — ${item.price}` }).catch(() => {});
  };

  const isOwnListing = user && item.owner === user.id;

  return (
    <View style={styles.container}>
      <VideoView style={StyleSheet.absoluteFill} player={player} contentFit="cover" nativeControls={false} />

      <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={toggleMute} />

      {muted && (
        <View style={styles.muteBadge}>
          <Ionicons name="volume-mute" size={16} color="#fff" />
        </View>
      )}

      <View style={styles.actionRail} pointerEvents="box-none">
        {!isOwnListing && (
          <>
            <ActionButton icon="chatbubble-ellipses" label="پیام" onPress={handleMessage} />
            <ActionButton icon="call" label="تماس" onPress={handleCall} />
          </>
        )}
        <ActionButton
          icon={favorited ? "heart" : "heart-outline"}
          label="ذخیره"
          onPress={handleFavorite}
          active={favorited}
        />
        <ActionButton icon="share-social" label="اشتراک" onPress={handleShare} />
      </View>

      <LinearGradient colors={["transparent", "rgba(0,0,0,0.85)"]} style={styles.bottomOverlay}>
        {!!item.owner_name && (
          <View style={styles.ownerRow}>
            <View style={styles.ownerAvatar}>
              <Text style={styles.ownerAvatarText}>{item.owner_name.trim().charAt(0)}</Text>
            </View>
            <Text style={styles.ownerName} numberOfLines={1}>{item.owner_name}</Text>
          </View>
        )}
        {item.deal_type_display && (
          <View style={styles.dealBadge}>
            <Text style={styles.dealBadgeText}>{item.deal_type_display}</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.priceRow}>
          <Ionicons name="pricetag" size={13} color="#fff" />
          <Text style={styles.price}>{item.price}</Text>
        </View>
        {!!item.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-sharp" size={12} color="rgba(255,255,255,0.75)" />
            <Text style={styles.location}>{item.location}</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

function ActionButton({ icon, label, onPress, active }: { icon: any; label: string; onPress: () => void; active?: boolean }) {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress} activeOpacity={0.65}>
      <View style={[styles.actionIconCircle, active && styles.actionIconCircleActive]}>
        <Ionicons name={icon} size={23} color={active ? "#e74c3c" : "#fff"} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: "#000" },
  muteBadge: {
    position: "absolute", top: 60, alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 16, padding: 6,
  },
  actionRail: { position: "absolute", right: 12, bottom: 150, alignItems: "center", gap: 22 },
  actionButton: { alignItems: "center", gap: 5 },
  actionIconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.25)",
    justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  actionIconCircleActive: { backgroundColor: "rgba(231,76,60,0.22)", borderColor: "rgba(231,76,60,0.45)" },
  actionLabel: { color: "#fff", fontSize: 11, fontWeight: "600" },
  bottomOverlay: { position: "absolute", left: 0, right: 0, bottom: 0, paddingTop: 70, paddingBottom: 28, paddingHorizontal: 16 },
  ownerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  ownerAvatar: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "#00a884", justifyContent: "center", alignItems: "center",
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.6)",
  },
  ownerAvatarText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  ownerName: { color: "#fff", fontSize: 13.5, fontWeight: "700" },
  dealBadge: {
    alignSelf: "flex-start", backgroundColor: "#00a884",
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 8,
  },
  dealBadgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  title: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 6, lineHeight: 21 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  price: { color: "#fff", fontSize: 15, fontWeight: "700" },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  location: { color: "rgba(255,255,255,0.75)", fontSize: 12 },
});