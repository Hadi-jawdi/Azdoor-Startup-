
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
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Share,
  Linking,
  Alert,
  Pressable,
  Animated,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite } from "../utils/listings";
import { startConversation } from "../utils/chat";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  Dimensions.get("window");

export default function VideoReelCard({
  item,
  isActive,
  onToggleFavorite,
}: {
  item: any;
  isActive: boolean;
  onToggleFavorite?: (id: number, favorited: boolean) => void;
}) {
  const { user, token } = useAuth();

  const [favorited, setFavorited] = useState(
    !!item.is_favorited
  );

  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(true);
  const [showDescription, setShowDescription] = useState(false);

  const lastTap = useRef(0);

  const heartScale = useRef(
    new Animated.Value(0)
  ).current;

  const player = useVideoPlayer(item.video, (p) => {
    p.loop = true;
    p.muted = true;
  });

  /*
   * PLAY / PAUSE
   */

  useEffect(() => {
    if (isActive) {
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
    }
  }, [isActive, player]);

  /*
   * MUTE
   */

  const toggleMute = () => {
    const next = !muted;

    player.muted = next;

    setMuted(next);
  };

  /*
   * HEART ANIMATION
   */

  const animateHeart = () => {
    heartScale.setValue(0);

    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1,
        friction: 4,
        tension: 100,
        useNativeDriver: true,
      }),

      Animated.delay(400),

      Animated.timing(heartScale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  /*
   * VIDEO TAP
   *
   * Single tap = mute/unmute
   * Double tap = like
   */

  const handleVideoPress = () => {
    const now = Date.now();

    if (now - lastTap.current < 300) {
      handleFavorite(true);
    } else {
      toggleMute();
    }

    lastTap.current = now;
  };

  /*
   * FAVORITE / LIKE
   */

  const handleFavorite = async (
    fromDoubleTap = false
  ) => {
    if (!user) {
      router.push("/profile");
      return;
    }

    if (busy) return;

    const next = !favorited;

    setFavorited(next);

    if (next && fromDoubleTap) {
      animateHeart();
    }

    setBusy(true);

    try {
      await toggleFavorite(item.id, token);

      onToggleFavorite?.(
        item.id,
        next
      );
    } catch {
      setFavorited(!next);
    } finally {
      setBusy(false);
    }
  };

  /*
   * CALL OWNER
   */

  const handleCall = () => {
    if (!item?.owner_phone) {
      Alert.alert(
        "شماره تماس موجود نیست",
        "این آگهی شماره تماس ندارد."
      );

      return;
    }

    Linking.openURL(
      `tel:${item.owner_phone}`
    ).catch(() =>
      Alert.alert(
        "خطا",
        "امکان برقراری تماس وجود ندارد."
      )
    );
  };

  /*
   * MESSAGE OWNER
   */

  const handleMessage = async () => {
    if (!user) {
      router.push("/profile");
      return;
    }

    try {
      const conversation =
        await startConversation(
          item.id,
          token
        );

      router.push(
        `/chat/${conversation.id}`
      );
    } catch (err: any) {
      Alert.alert(
        "خطا",
        err.message
      );
    }
  };

  /*
   * SHARE
   */

  const handleShare = () => {
    Share.share({
      message: `${item.title}\n${item.price}\n${
        item.location || ""
      }`,
    }).catch(() => {});
  };

  /*
   * PROPERTY DETAILS
   */

  const handlePropertyPress = () => {
    // Change this route if your listing details
    // screen uses another route.
    router.push(`/listing/${item.id}`);
  };

  const isOwnListing =
    user && item.owner === user.id;

  return (
    <View style={styles.container}>

      {/* =====================================================
          VIDEO
      ===================================================== */}

      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />

      {/* =====================================================
          VIDEO TOUCH AREA
      ===================================================== */}

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleVideoPress}
      />

      {/* =====================================================
          DOUBLE TAP HEART
      ===================================================== */}

      <Animated.View
        pointerEvents="none"
        style={[
          styles.bigHeart,

          {
            transform: [
              {
                scale: heartScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.2],
                }),
              },
            ],

            opacity: heartScale,
          },
        ]}
      >
        <Ionicons
          name="heart"
          size={105}
          color="#fff"
        />
      </Animated.View>

      {/* =====================================================
          TOP BAR
      ===================================================== */}

      <View style={styles.topBar}>

        <Text style={styles.logo}>
          Azdoor
        </Text>

        <TouchableOpacity
          style={styles.moreButton}
          activeOpacity={0.7}
          onPress={() =>
            Alert.alert(
              "گزینه‌ها",
              "گزینه‌های بیشتر به‌زودی اضافه می‌شوند."
            )
          }
        >
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

      </View>

      {/* =====================================================
          MUTE INDICATOR
      ===================================================== */}

      <View style={styles.muteContainer}>
        <View style={styles.muteBadge}>

          <Ionicons
            name={
              muted
                ? "volume-mute"
                : "volume-high"
            }
            size={17}
            color="#fff"
          />

        </View>
      </View>

      {/* =====================================================
          RIGHT ACTION RAIL
          INSTAGRAM STYLE
      ===================================================== */}

      <View style={styles.actionRail}>

        {/* LIKE / SAVE */}

        <ActionButton
          icon={
            favorited
              ? "heart"
              : "heart-outline"
          }
          label={
            favorited
              ? "ذخیره شد"
              : "ذخیره"
          }
          active={favorited}
          onPress={() =>
            handleFavorite(false)
          }
        />

        {/* MESSAGE */}

        {!isOwnListing && (
          <ActionButton
            icon="chatbubble-ellipses-outline"
            label="پیام"
            onPress={handleMessage}
          />
        )}

        {/* CALL */}

        {!isOwnListing && (
          <ActionButton
            icon="call-outline"
            label="تماس"
            onPress={handleCall}
          />
        )}

        {/* SHARE */}

        <ActionButton
          icon="paper-plane-outline"
          label="اشتراک"
          onPress={handleShare}
        />

      </View>

      {/* =====================================================
          BOTTOM GRADIENT
      ===================================================== */}

      <LinearGradient
        colors={[
          "transparent",
          "rgba(0,0,0,0.10)",
          "rgba(0,0,0,0.55)",
          "rgba(0,0,0,0.92)",
        ]}
        style={styles.bottomGradient}
        pointerEvents="box-none"
      >

        <View style={styles.bottomContent}>

          {/* =================================================
              OWNER
          ================================================= */}

          {!!item.owner_name && (
            <View style={styles.ownerRow}>

              {/* AVATAR */}

              <View style={styles.ownerAvatar}>

                <Text style={styles.avatarText}>
                  {item.owner_name
                    .trim()
                    .charAt(0)}
                </Text>

              </View>

              {/* OWNER INFORMATION */}

              <View style={styles.ownerInfo}>

                <View
                  style={styles.ownerNameRow}
                >

                  <Text
                    style={styles.ownerName}
                    numberOfLines={1}
                  >
                    {item.owner_name}
                  </Text>

                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color="#3797f0"
                  />

                </View>

                <Text
                  style={styles.ownerSubtitle}
                >
                  صاحب آگهی
                </Text>

              </View>

              {/* MESSAGE BUTTON */}

              {!isOwnListing && (
                <TouchableOpacity
                  style={styles.followButton}
                  activeOpacity={0.8}
                  onPress={handleMessage}
                >
                  <Text
                    style={styles.followText}
                  >
                    پیام
                  </Text>
                </TouchableOpacity>
              )}

            </View>
          )}

          {/* =================================================
              DEAL TYPE
          ================================================= */}

          {!!item.deal_type_display && (
            <View style={styles.dealBadge}>

              <Text
                style={styles.dealBadgeText}
              >
                {item.deal_type_display}
              </Text>

            </View>
          )}

          {/* =================================================
              TITLE
          ================================================= */}

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePropertyPress}
          >

            <Text
              style={styles.title}
              numberOfLines={2}
            >
              {item.title}
            </Text>

          </TouchableOpacity>

          {/* =================================================
              PRICE
          ================================================= */}

          {!!item.price && (
            <View style={styles.priceRow}>

              <Ionicons
                name="pricetag"
                size={14}
                color="#fff"
              />

              <Text style={styles.price}>
                {item.price}
              </Text>

            </View>
          )}

          {/* =================================================
              LOCATION
          ================================================= */}

          {!!item.location && (
            <View style={styles.locationRow}>

              <Ionicons
                name="location-sharp"
                size={14}
                color="rgba(255,255,255,0.8)"
              />

              <Text
                style={styles.location}
                numberOfLines={1}
              >
                {item.location}
              </Text>

            </View>
          )}

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          {!!item.description && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                setShowDescription(
                  !showDescription
                )
              }
            >

              <Text
                style={styles.description}
                numberOfLines={
                  showDescription ? 4 : 1
                }
              >
                {item.description}
              </Text>

              <Text style={styles.moreText}>
                {showDescription
                  ? "کمتر"
                  : "بیشتر"}
              </Text>

            </TouchableOpacity>
          )}

        </View>

      </LinearGradient>

    </View>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  icon,
  label,
  onPress,
  active,
}: {
  icon: any;
  label: string;
  onPress: () => void;
  active?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.actionButton}
      onPress={onPress}
      activeOpacity={0.7}
    >

      <View style={styles.actionIcon}>

        <Ionicons
          name={icon}
          size={28}
          color={
            active
              ? "#ff3040"
              : "#fff"
          }
        />

      </View>

      <Text style={styles.actionLabel}>
        {label}
      </Text>

    </TouchableOpacity>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* =====================================================
     CONTAINER
  ===================================================== */

  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#000",
  },

  /* =====================================================
     TOP
  ===================================================== */

  topBar: {
    position: "absolute",

    top: 48,
    left: 16,
    right: 16,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    zIndex: 20,
  },

  logo: {
    color: "#fff",

    fontSize: 23,
    fontWeight: "800",

    letterSpacing: -0.8,

    textShadowColor:
      "rgba(0,0,0,0.4)",

    textShadowRadius: 5,
  },

  moreButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor:
      "rgba(0,0,0,0.30)",

    justifyContent: "center",
    alignItems: "center",
  },

  /* =====================================================
     MUTE
  ===================================================== */

  muteContainer: {
    position: "absolute",

    top: 105,
    right: 15,

    zIndex: 20,
  },

  muteBadge: {
    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor:
      "rgba(0,0,0,0.45)",

    justifyContent: "center",
    alignItems: "center",
  },

  /* =====================================================
     HEART ANIMATION
  ===================================================== */

  bigHeart: {
    position: "absolute",

    top:
      SCREEN_HEIGHT / 2 - 52,

    left:
      SCREEN_WIDTH / 2 - 52,

    zIndex: 30,

    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },

  /* =====================================================
     RIGHT ACTIONS
  ===================================================== */

  actionRail: {
    position: "absolute",

    right: 10,
    bottom: 175,

    alignItems: "center",

    gap: 18,

    zIndex: 20,
  },

  actionButton: {
    alignItems: "center",
    justifyContent: "center",

    minWidth: 52,
  },

  actionIcon: {
    width: 48,
    height: 48,

    justifyContent: "center",
    alignItems: "center",
  },

  actionLabel: {
    color: "#fff",

    fontSize: 10.5,
    fontWeight: "600",

    marginTop: 1,

    textShadowColor:
      "rgba(0,0,0,0.7)",

    textShadowRadius: 4,
  },

  /* =====================================================
     BOTTOM GRADIENT
  ===================================================== */

  bottomGradient: {
    position: "absolute",

    left: 0,
    right: 0,
    bottom: 0,

    minHeight: 370,

    justifyContent: "flex-end",

    zIndex: 10,
  },

  /* =====================================================
     CONTENT
  ===================================================== */

  bottomContent: {
    paddingHorizontal: 16,

    paddingBottom: 40,

    /*
     * Leave space on the right
     * for Instagram-style actions.
     */

    paddingRight: 78,

    alignItems: "flex-start",
  },

  /* =====================================================
     OWNER
  ===================================================== */

  ownerRow: {
    flexDirection: "row",

    alignItems: "center",

    width: "100%",

    marginBottom: 12,
  },

  ownerAvatar: {
    width: 43,
    height: 43,

    borderRadius: 22,

    backgroundColor: "#00a884",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: "#fff",

    marginRight: 9,
  },

  avatarText: {
    color: "#fff",

    fontSize: 16,
    fontWeight: "800",
  },

  ownerInfo: {
    flex: 1,

    alignItems: "flex-start",
  },

  ownerNameRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,
  },

  ownerName: {
    color: "#fff",

    fontSize: 14,
    fontWeight: "800",

    maxWidth: 150,

    textShadowColor:
      "rgba(0,0,0,0.5)",

    textShadowRadius: 4,
  },

  ownerSubtitle: {
    color:
      "rgba(255,255,255,0.72)",

    fontSize: 10.5,

    marginTop: 1,
  },

  /* =====================================================
     MESSAGE BUTTON
  ===================================================== */

  followButton: {
    paddingHorizontal: 13,
    paddingVertical: 6,

    borderRadius: 6,

    borderWidth: 1,

    borderColor:
      "rgba(255,255,255,0.85)",
  },

  followText: {
    color: "#fff",

    fontSize: 11,

    fontWeight: "700",
  },

  /* =====================================================
     DEAL
  ===================================================== */

  dealBadge: {
    alignSelf: "flex-start",

    backgroundColor: "#00a884",

    paddingHorizontal: 9,
    paddingVertical: 4,

    borderRadius: 5,

    marginBottom: 7,
  },

  dealBadgeText: {
    color: "#fff",

    fontSize: 11,

    fontWeight: "700",
  },

  /* =====================================================
     TITLE
  ===================================================== */

  title: {
    color: "#fff",

    fontSize: 17,

    lineHeight: 22,

    fontWeight: "800",

    marginBottom: 7,

    textAlign: "left",

    textShadowColor:
      "rgba(0,0,0,0.7)",

    textShadowRadius: 5,
  },

  /* =====================================================
     PRICE
  ===================================================== */

  priceRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 5,

    gap: 5,
  },

  price: {
    color: "#fff",

    fontSize: 15,

    fontWeight: "800",

    textShadowColor:
      "rgba(0,0,0,0.6)",

    textShadowRadius: 4,
  },

  /* =====================================================
     LOCATION
  ===================================================== */

  locationRow: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 5,

    gap: 4,
  },

  location: {
    color:
      "rgba(255,255,255,0.82)",

    fontSize: 12,

    flexShrink: 1,
  },

  /* =====================================================
     DESCRIPTION
  ===================================================== */

  description: {
    color:
      "rgba(255,255,255,0.82)",

    fontSize: 12,

    lineHeight: 17,

    marginTop: 3,

    maxWidth:
      SCREEN_WIDTH - 110,
  },

  moreText: {
    color: "#fff",

    fontSize: 11,

    fontWeight: "700",

    marginTop: 2,
  },

});