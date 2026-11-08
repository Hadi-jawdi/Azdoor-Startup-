
// import { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Share,
//   Linking,
//   Alert,
//   Pressable,
//   Animated,
//   ScrollView,
//   Image,
// } from "react-native";
// import { useVideoPlayer, VideoView } from "expo-video";
// import { router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useAuth } from "../context/AuthContext";
// import { toggleFavorite } from "../utils/listings";
// import { startConversation } from "../utils/chat";


// // 
// import FollowButton from "./FollowButton";
// import { followUser } from "../utils/profiles";
// // 
// const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// const APP_NAME = "ازدور";
// const PREVIEW_WORDS = 1; // words of the description shown before "more"

// // Sound is ON by default. If the user mutes one reel, the choice is
// // remembered for the next reels (shared by all cards).
// let GLOBAL_MUTED = false;

// // export default function VideoReelCard({
// //   item,
// //   isActive,
// //   onToggleFavorite,
// // }: {
// //   item: any;
// //   isActive: boolean;
// //   onToggleFavorite?: (id: number, favorited: boolean) => void;
// // }) {
// export default function VideoReelCard({
//   item,
//   isActive,
//   onToggleFavorite,
//   onFollowChange,
// }: {
//   item: any;
//   isActive: boolean;
//   onToggleFavorite?: (id: number, favorited: boolean) => void;
//   onFollowChange?: (ownerId: number, isFollowing: boolean) => void;
// }) {
//   const { user, token } = useAuth();
//   const insets = useSafeAreaInsets();

//   const [favorited, setFavorited] = useState(!!item.is_favorited);
//   const [busy, setBusy] = useState(false);
//   const [muted, setMuted] = useState(GLOBAL_MUTED);
//   const [showDescription, setShowDescription] = useState(false);

//   const lastTap = useRef(0);
//   const tapTimer = useRef<any>(null);
//   const heartScale = useRef(new Animated.Value(0)).current;

//   const player = useVideoPlayer(item.video, (p) => {
//     p.loop = true;
//     p.muted = GLOBAL_MUTED;
//   });

//   /* PLAY / PAUSE (sound follows the saved mute choice) */
//   useEffect(() => {
//     if (isActive) {
//       player.muted = GLOBAL_MUTED;
//       setMuted(GLOBAL_MUTED);
//       player.play();
//     } else {
//       player.pause();
//       player.currentTime = 0;
//       setShowDescription(false);
//     }
//   }, [isActive, player]);

//   useEffect(() => {
//     return () => {
//       if (tapTimer.current) clearTimeout(tapTimer.current);
//     };
//   }, []);

//   /* MUTE */
//   const toggleMute = () => {
//     const next = !muted;
//     GLOBAL_MUTED = next;
//     player.muted = next;
//     setMuted(next);
//   };

//   /* HEART ANIMATION */
//   const animateHeart = () => {
//     heartScale.setValue(0);

//     Animated.sequence([
//       Animated.spring(heartScale, {
//         toValue: 1,
//         friction: 4,
//         tension: 100,
//         useNativeDriver: true,
//       }),
//       Animated.delay(400),
//       Animated.timing(heartScale, {
//         toValue: 0,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//     ]).start();
//   };

//   /*
//    * VIDEO TAP
//    * Single tap  = mute / unmute (after a short wait, so a double tap never mutes)
//    * Double tap  = like (never removes an existing like)
//    */
//   const handleVideoPress = () => {
//     const now = Date.now();

//     if (now - lastTap.current < 300) {
//       if (tapTimer.current) {
//         clearTimeout(tapTimer.current);
//         tapTimer.current = null;
//       }
//       lastTap.current = 0;

//       if (!favorited) {
//         handleFavorite(true);
//       } else {
//         animateHeart();
//       }
//       return;
//     }

//     lastTap.current = now;
//     tapTimer.current = setTimeout(() => {
//       tapTimer.current = null;
//       toggleMute();
//     }, 300);
//   };

//   /* FAVORITE / LIKE */
//   const handleFavorite = async (fromDoubleTap = false) => {
//     if (!user) {
//       router.push("/profile");
//       return;
//     }

//     if (busy) return;

//     const next = !favorited;
//     setFavorited(next);

//     if (next && fromDoubleTap) {
//       animateHeart();
//     }

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

//   /* FOLLOW (from the + badge on the rail) */
//   const handleRailFollow = async () => {
//     if (!user) {
//       router.push("/profile");
//       return;
//     }
//     onFollowChange?.(item.owner, true); // instant update
//     try {
//       await followUser(item.owner, token);
//     } catch {
//       onFollowChange?.(item.owner, false); // undo on error
//     }
//   };
//   /* CALL OWNER */
//   const handleCall = () => {
//     if (!item?.owner_phone) {
//       Alert.alert("شماره تماس موجود نیست", "این آگهی شماره تماس ندارد.");
//       return;
//     }

//     Linking.openURL(`tel:${item.owner_phone}`).catch(() =>
//       Alert.alert("خطا", "امکان برقراری تماس وجود ندارد.")
//     );
//   };

//   /* MESSAGE OWNER */
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

//   /* SHARE */
//   const handleShare = () => {
//     Share.share({
//       message: `${item.title}\n${item.price}\n${item.location || ""}`,
//     }).catch(() => {});
//   };

//   /* PROPERTY DETAILS */
//   const handlePropertyPress = () => {
//     // Change this route if your listing details screen uses another route.
//     router.push(`/listing/${item.id}`);
//   };

//   // Short preview of the description (first words) + "more"
//   const descWords = (item.description || "").trim().split(/\s+/).filter(Boolean);
//   const hasMore = descWords.length > PREVIEW_WORDS;
//   const preview = descWords.slice(0, PREVIEW_WORDS).join(" ");

//   const isOwnListing = user && item.owner === user.id;

//   return (
//     <View style={styles.container}>
//       {/* VIDEO */}
//       <VideoView
//         style={StyleSheet.absoluteFill}
//         player={player}
//         contentFit="cover"
//         nativeControls={false}
//       />

//       {/* TAP AREA */}
//       <Pressable style={StyleSheet.absoluteFill} onPress={handleVideoPress} />

//       {/* DIM LAYER while the caption is open (tap to close) */}
//       {showDescription && (
//         <Pressable
//           style={styles.captionDim}
//           onPress={() => setShowDescription(false)}
//         />
//       )}

//       {/* DOUBLE TAP HEART */}
//       <Animated.View
//         pointerEvents="none"
//         style={[
//           styles.bigHeart,
//           {
//             transform: [
//               {
//                 scale: heartScale.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [0.5, 1.2],
//                 }),
//               },
//             ],
//             opacity: heartScale,
//           },
//         ]}
//       >
//         <Ionicons name="heart" size={105} color="#fff" />
//       </Animated.View>

//       {/* TOP FADE (keeps the logo readable on bright videos) */}
//       <LinearGradient
//         pointerEvents="none"
//         colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0)"]}
//         style={[styles.topFade, { height: insets.top + 90 }]}
//       />

//       {/* TOP BAR */}
//       <View style={[styles.topBar, { top: insets.top + 8 }]}>
//         <Text style={styles.logo}>{APP_NAME}</Text>

//         <TouchableOpacity
//           style={styles.iconCircle}
//           activeOpacity={0.7}
//           onPress={toggleMute}
//           hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
//         >
//           <Ionicons
//             name={muted ? "volume-mute" : "volume-high"}
//             size={20}
//             color="#fff"
//           />
//         </TouchableOpacity>
//       </View>

//       {/* ACTION RAIL */}
//           {/* ACTION RAIL */}
//       <View style={styles.actionRail}>
//         {!!item.owner && (
//           <View style={styles.railAvatarWrap}>
//             <TouchableOpacity
//               activeOpacity={0.8}
//               onPress={() => router.push(`/user/${item.owner}`)}
//             >
//               {item.owner_avatar ? (
//                 <Image
//                   source={{ uri: item.owner_avatar }}
//                   style={styles.railAvatar}
//                 />
//               ) : (
//                 <View style={[styles.railAvatar, styles.railAvatarFallback]}>
//                   <Text style={styles.avatarText}>
//                     {(item.owner_name || "A").trim().charAt(0)}
//                   </Text>
//                 </View>
//               )}
//             </TouchableOpacity>

//             {/* + badge: only if it's not your video and you don't follow yet */}
//             {!isOwnListing && !item.owner_is_following && (
//               <TouchableOpacity
//                 style={styles.railPlus}
//                 onPress={handleRailFollow}
//                 activeOpacity={0.8}
//                 hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//               >
//                 <Ionicons name="add" size={14} color="#fff" />
//               </TouchableOpacity>
//             )}
//           </View>
//         )}

//         <ActionButton
//           icon={favorited ? "heart" : "heart-outline"}
//       {/* <View style={styles.actionRail}>
//         <ActionButton
//           icon={favorited ? "heart" : "heart-outline"} */}
//           label={favorited ? "ذخیره شد" : "ذخیره"}
//           active={favorited}
//           onPress={() => handleFavorite(false)}
//         />

//         {!isOwnListing && (
//           <ActionButton
//             icon="chatbubble-ellipses-outline"
//             label="پیام"
//             onPress={handleMessage}
//           />
//         )}

//         {!isOwnListing && (
//           <ActionButton icon="call-outline" label="تماس" onPress={handleCall} />
//         )}

//         <ActionButton
//           icon="paper-plane-outline"
//           label="اشتراک"
//           onPress={handleShare}
//         />
//       </View>

//       {/* BOTTOM INFO */}
//       <LinearGradient
//         colors={[
//           "transparent",
//           "rgba(0,0,0,0.10)",
//           "rgba(0,0,0,0.55)",
//           "rgba(0,0,0,0.92)",
//         ]}
//         style={styles.bottomGradient}
//         pointerEvents="box-none"
//       >
//         <View style={styles.bottomContent}>
//           OWNER
//           {!!item.owner_name && (
//             <View style={styles.ownerRow}>
//               <View style={styles.ownerAvatar}>
//                 <Text style={styles.avatarText}>
//                   {item.owner_name.trim().charAt(0)}
//                 </Text>
//               </View>

//               <View style={styles.ownerInfo}>
//                 <Text style={styles.ownerName} numberOfLines={1}>
//                   {item.owner_name}
//                 </Text>
//                 <Text style={styles.ownerSubtitle}>صاحب آگهی</Text>
//               </View>

//               {!isOwnListing && (
//                 <TouchableOpacity
//                   style={styles.messageButton}
//                   activeOpacity={0.8}
//                   onPress={handleMessage}
//                 >
//                   <Text style={styles.messageText}>پیام</Text>
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}

//           {/* DEAL TYPE */}
//           {!!item.deal_type_display && (
//             <View style={styles.dealBadge}>
//               <Text style={styles.dealBadgeText}>{item.deal_type_display}</Text>
//             </View>
//           )}

//           {/* TITLE */}
//           <TouchableOpacity activeOpacity={0.9} onPress={handlePropertyPress}>
//             <Text style={styles.title} numberOfLines={2}>
//               {item.title}
//             </Text>
//           </TouchableOpacity>

//           {/* PRICE */}
//           {!!item.price && (
//             <View style={styles.priceRow}>
//               <Ionicons name="pricetag" size={15} color="#fff" />
//               <Text style={styles.price}>{item.price}</Text>
//             </View>
//           )}

//           {/* LOCATION */}
//           {!!item.location && (
//             <View style={styles.locationRow}>
//               <Ionicons
//                 name="location-sharp"
//                 size={14}
//                 color="rgba(255,255,255,0.8)"
//               />
//               <Text style={styles.location} numberOfLines={1}>
//                 {item.location}
//               </Text>
//             </View>
//           )}

//           {/* DESCRIPTION: only the first words + "more" */}
//           {!!item.description && (
//             <View style={styles.captionWrap}>
//               {showDescription ? (
//                 <ScrollView
//                   style={styles.captionScroll}
//                   nestedScrollEnabled
//                   showsVerticalScrollIndicator={false}
//                 >
//                   <Text style={styles.caption}>
//                     {item.description}
//                     {hasMore && (
//                       <Text
//                         style={styles.captionMore}
//                         onPress={() => setShowDescription(false)}
//                       >
//                         {"  کمتر"}
//                       </Text>
//                     )}
//                   </Text>
//                 </ScrollView>
//               ) : (
//                 <Text style={styles.caption}>
//                   {preview}
//                   {hasMore && (
//                     <Text
//                       style={styles.captionMore}
//                       onPress={() => setShowDescription(true)}
//                     >
//                       {" … بیشتر"}
//                     </Text>
//                   )}
//                 </Text>
//               )}
//             </View>
//           )}
//         </View>
//       </LinearGradient>
//     </View>
//   );
// }

// /* ACTION BUTTON */

// function ActionButton({
//   icon,
//   label,
//   onPress,
//   active,
// }: {
//   icon: any;
//   label: string;
//   onPress: () => void;
//   active?: boolean;
// }) {
//   return (
//     <TouchableOpacity
//       style={styles.actionButton}
//       onPress={onPress}
//       activeOpacity={0.7}
//     >
//       <View style={styles.actionIcon}>
//         <Ionicons
//           name={icon}
//           size={25}
//           color={active ? "#ff3040" : "#fff"}
//         />
//       </View>
//       <Text style={styles.actionLabel}>{label}</Text>
//     </TouchableOpacity>
//   );
// }

// /* STYLES */

// const styles = StyleSheet.create({
//   container: {
//     width: SCREEN_WIDTH,
//     height: SCREEN_HEIGHT,
//     backgroundColor: "#000",
//   },

//   /* Top */
//   topFade: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 15,
//   },
//   topBar: {
//     position: "absolute",
//     left: 16,
//     right: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     zIndex: 20,
//   },
//   logo: {
//     color: "#fff",
//     fontSize: 22,
//     fontWeight: "800",
//     textShadowColor: "rgba(0,0,0,0.4)",
//     textShadowRadius: 5,
//   },
//   iconCircle: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "rgba(0,0,0,0.35)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   /* Heart */
//   bigHeart: {
//     position: "absolute",
//     top: SCREEN_HEIGHT / 2 - 52,
//     left: SCREEN_WIDTH / 2 - 52,
//     zIndex: 30,
//     shadowColor: "#000",
//     shadowOpacity: 0.35,
//     shadowRadius: 10,
//   },

//   /* Action rail */
//   actionRail: {
//     position: "absolute",
//     left: 10,
//     bottom: 205,
//     alignItems: "center",
//     gap: 16,
//     zIndex: 20,
//   },
//   railAvatarWrap: {
//     marginBottom: 6,
//     alignItems: "center",
//   },
//   railAvatar: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   railAvatarFallback: {
//     backgroundColor: "#00a884",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   railPlus: {
//     position: "absolute",
//     bottom: -9,
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: "#00a884",
//     borderWidth: 2,
//     borderColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   actionButton: {
//     alignItems: "center",
//     justifyContent: "center",
//     minWidth: 52,
//   },
//   actionIcon: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     backgroundColor: "rgba(0,0,0,0.28)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   actionLabel: {
//     color: "#fff",
//     fontSize: 10.5,
//     fontWeight: "600",
//     marginTop: 4,
//     textShadowColor: "rgba(0,0,0,0.7)",
//     textShadowRadius: 4,
//   },

//   /* Bottom */
//   bottomGradient: {
//     position: "absolute",
//     left: 0,
//     right: 0,
//     bottom: 0,
//     minHeight: 370,
//     justifyContent: "flex-end",
//     zIndex: 10,
//   },
//   bottomContent: {
//     paddingHorizontal: 16,
//     paddingBottom: 40,
//     // Leave space on the left for the action buttons.
//     paddingLeft: 78,
//     alignItems: "flex-start",
//   },

//   /* Owner (glass card) */
//   ownerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     marginBottom: 14,
//     padding: 8,
//     borderRadius: 16,
//     backgroundColor: "rgba(255,255,255,0.14)",
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "rgba(255,255,255,0.3)",
//   },
//   ownerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#00a884",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 1.5,
//     borderColor: "rgba(255,255,255,0.9)",
//     marginEnd: 10,
//   },
//   avatarText: { color: "#fff", fontSize: 16, fontWeight: "700" },

//   // 
//   ownerMain: { flex: 1, flexDirection: "row", alignItems: "center", marginEnd: 8 },
//   ownerAvatarImg: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     borderWidth: 1.5,
//     borderColor: "rgba(255,255,255,0.9)",
//     marginEnd: 10,
//   },

//   // 
//   ownerInfo: { flex: 1, alignItems: "flex-start", marginEnd: 8 },
//   ownerName: {
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: "700",
//   },
//   ownerSubtitle: {
//     color: "rgba(255,255,255,0.7)",
//     fontSize: 11,
//     marginTop: 2,
//   },
//   messageButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 16,
//     backgroundColor: "#fff",
//   },
//   messageText: { color: "#00806a", fontSize: 12.5, fontWeight: "700" },

//   /* Deal badge */
//   dealBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: "#00a884",
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 6,
//     marginBottom: 8,
//   },
//   dealBadgeText: { color: "#fff", fontSize: 11.5, fontWeight: "700" },

//   /* Title / price / location */
//   title: {
//     color: "#fff",
//     fontSize: 18,
//     lineHeight: 25,
//     fontWeight: "700",
//     marginBottom: 8,
//     textShadowColor: "rgba(0,0,0,0.7)",
//     textShadowRadius: 5,
//   },
//   priceRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
//     gap: 6,
//   },
//   price: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "800",
//     textShadowColor: "rgba(0,0,0,0.6)",
//     textShadowRadius: 4,
//   },
//   locationRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 6,
//     gap: 4,
//   },
//   location: {
//     color: "rgba(255,255,255,0.85)",
//     fontSize: 12.5,
//     flexShrink: 1,
//   },

//   /* Caption (Instagram style) */
//   captionDim: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(0,0,0,0.45)",
//     zIndex: 5,
//   },
//   captionWrap: { width: "100%", marginTop: 6 },
//   caption: {
//     color: "rgba(255,255,255,0.92)",
//     fontSize: 13.5,
//     lineHeight: 21,
//     textShadowColor: "rgba(0,0,0,0.5)",
//     textShadowRadius: 3,
//   },
//   captionScroll: { maxHeight: 150 },
//   captionMore: {
//     color: "rgba(255,255,255,0.65)",
//     fontSize: 13,
//     fontWeight: "600",
//     marginTop: 2,
//   },
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
  ScrollView,
  Image,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { toggleFavorite } from "../utils/listings";
import { startConversation } from "../utils/chat";
import FollowButton from "./FollowButton";
import { followUser } from "../utils/profiles";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const APP_NAME = "ازدور";
const PREVIEW_WORDS = 1; // words of the description shown before "more"

// Sound is ON by default. If the user mutes one reel, the choice is
// remembered for the next reels (shared by all cards).
let GLOBAL_MUTED = false;

export default function VideoReelCard({
  item,
  isActive,
  onToggleFavorite,
  onFollowChange,
}: {
  item: any;
  isActive: boolean;
  onToggleFavorite?: (id: number, favorited: boolean) => void;
  onFollowChange?: (ownerId: number, isFollowing: boolean) => void;
}) {
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();

  const [favorited, setFavorited] = useState(!!item.is_favorited);
  const [busy, setBusy] = useState(false);
  const [muted, setMuted] = useState(GLOBAL_MUTED);
  const [showDescription, setShowDescription] = useState(false);

  const lastTap = useRef(0);
  const tapTimer = useRef<any>(null);
  const heartScale = useRef(new Animated.Value(0)).current;

  const player = useVideoPlayer(item.video, (p) => {
    p.loop = true;
    p.muted = GLOBAL_MUTED;
  });

  /* PLAY / PAUSE (sound follows the saved mute choice) */
  useEffect(() => {
    if (isActive) {
      player.muted = GLOBAL_MUTED;
      setMuted(GLOBAL_MUTED);
      player.play();
    } else {
      player.pause();
      player.currentTime = 0;
      setShowDescription(false);
    }
  }, [isActive, player]);

  useEffect(() => {
    return () => {
      if (tapTimer.current) clearTimeout(tapTimer.current);
    };
  }, []);

  /* MUTE */
  const toggleMute = () => {
    const next = !muted;
    GLOBAL_MUTED = next;
    player.muted = next;
    setMuted(next);
  };

  /* HEART ANIMATION */
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
   * Single tap  = mute / unmute (after a short wait, so a double tap never mutes)
   * Double tap  = like (never removes an existing like)
   */
  const handleVideoPress = () => {
    const now = Date.now();

    if (now - lastTap.current < 300) {
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
        tapTimer.current = null;
      }
      lastTap.current = 0;

      if (!favorited) {
        handleFavorite(true);
      } else {
        animateHeart();
      }
      return;
    }

    lastTap.current = now;
    tapTimer.current = setTimeout(() => {
      tapTimer.current = null;
      toggleMute();
    }, 300);
  };

  /* FAVORITE / LIKE */
  const handleFavorite = async (fromDoubleTap = false) => {
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
      onToggleFavorite?.(item.id, next);
    } catch {
      setFavorited(!next);
    } finally {
      setBusy(false);
    }
  };

  /* FOLLOW (from the + badge on the rail) */
  const handleRailFollow = async () => {
    if (!user) {
      router.push("/profile");
      return;
    }
    onFollowChange?.(item.owner, true); // instant update
    try {
      await followUser(item.owner, token);
    } catch {
      onFollowChange?.(item.owner, false); // undo on error
    }
  };

  /* CALL OWNER */
  const handleCall = () => {
    if (!item?.owner_phone) {
      Alert.alert("شماره تماس موجود نیست", "این آگهی شماره تماس ندارد.");
      return;
    }

    Linking.openURL(`tel:${item.owner_phone}`).catch(() =>
      Alert.alert("خطا", "امکان برقراری تماس وجود ندارد.")
    );
  };

  /* MESSAGE OWNER */
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

  /* SHARE */
  const handleShare = () => {
    Share.share({
      message: `${item.title}\n${item.price}\n${item.location || ""}`,
    }).catch(() => {});
  };

  /* PROPERTY DETAILS */
  const handlePropertyPress = () => {
    // Change this route if your listing details screen uses another route.
    router.push(`/listing/${item.id}`);
  };

  // Short preview of the description (first words) + "more"
  const descWords = (item.description || "").trim().split(/\s+/).filter(Boolean);
  const hasMore = descWords.length > PREVIEW_WORDS;
  const preview = descWords.slice(0, PREVIEW_WORDS).join(" ");

  const isOwnListing = user && item.owner === user.id;

  return (
    <View style={styles.container}>
      {/* VIDEO */}
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />

      {/* TAP AREA */}
      <Pressable style={StyleSheet.absoluteFill} onPress={handleVideoPress} />

      {/* DIM LAYER while the caption is open (tap to close) */}
      {showDescription && (
        <Pressable
          style={styles.captionDim}
          onPress={() => setShowDescription(false)}
        />
      )}

      {/* DOUBLE TAP HEART */}
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
        <Ionicons name="heart" size={105} color="#fff" />
      </Animated.View>

      {/* TOP FADE (keeps the logo readable on bright videos) */}
      <LinearGradient
        pointerEvents="none"
        colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0)"]}
        style={[styles.topFade, { height: insets.top + 90 }]}
      />

      {/* TOP BAR */}
      <View style={[styles.topBar, { top: insets.top + 8 }]}>
        <Text style={styles.logo}>{APP_NAME}</Text>

        <TouchableOpacity
          style={styles.iconCircle}
          activeOpacity={0.7}
          onPress={toggleMute}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Ionicons
            name={muted ? "volume-mute" : "volume-high"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* ACTION RAIL */}
      <View style={styles.actionRail}>
        {!!item.owner && (
          <View style={styles.railAvatarWrap}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/user/${item.owner}`)}
            >
              {item.owner_avatar ? (
                <Image
                  source={{ uri: item.owner_avatar }}
                  style={styles.railAvatar}
                />
              ) : (
                <View style={[styles.railAvatar, styles.railAvatarFallback]}>
                  <Text style={styles.avatarText}>
                    {(item.owner_name || "A").trim().charAt(0)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* + badge: only if it's not your video and you don't follow yet */}
            {!isOwnListing && !item.owner_is_following && (
              <TouchableOpacity
                style={styles.railPlus}
                onPress={handleRailFollow}
                activeOpacity={0.8}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="add" size={14} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <ActionButton
          icon={favorited ? "heart" : "heart-outline"}
          label={favorited ? "ذخیره شد" : "ذخیره"}
          active={favorited}
          onPress={() => handleFavorite(false)}
        />

        {!isOwnListing && (
          <ActionButton
            icon="chatbubble-ellipses-outline"
            label="پیام"
            onPress={handleMessage}
          />
        )}

        {!isOwnListing && (
          <ActionButton icon="call-outline" label="تماس" onPress={handleCall} />
        )}

        <ActionButton
          icon="paper-plane-outline"
          label="اشتراک"
          onPress={handleShare}
        />
      </View>

      {/* BOTTOM INFO */}
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
          {/* OWNER */}
          {!!item.owner && (
            <View style={styles.ownerRow}>
              {/* tap avatar / name -> owner's profile */}
              <TouchableOpacity
                style={styles.ownerMain}
                activeOpacity={0.8}
                onPress={() => router.push(`/user/${item.owner}`)}
              >
                {item.owner_avatar ? (
                  <Image
                    source={{ uri: item.owner_avatar }}
                    style={styles.ownerAvatarImg}
                  />
                ) : (
                  <View style={styles.ownerAvatar}>
                    <Text style={styles.avatarText}>
                      {(item.owner_name || "A").trim().charAt(0)}
                    </Text>
                  </View>
                )}

                <View style={styles.ownerInfo}>
                  <Text style={styles.ownerName} numberOfLines={1}>
                    {item.owner_name || "کاربر Azdoor"}
                  </Text>
                  <Text style={styles.ownerSubtitle} numberOfLines={1}>
                    {item.owner_account_type === "agent"
                      ? `مشاور املاک${
                          item.owner_agency_name ? ` • ${item.owner_agency_name}` : ""
                        }`
                      : "صاحب آگهی"}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Follow button (hidden on your own videos) */}
              {!isOwnListing && (
                <FollowButton
                  userId={item.owner}
                  initialFollowing={!!item.owner_is_following}
                  compact
                  overlay
                  onChange={(isFollowing) =>
                    onFollowChange?.(item.owner, isFollowing)
                  }
                />
              )}
            </View>
          )}

          {/* DEAL TYPE */}
          {!!item.deal_type_display && (
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>{item.deal_type_display}</Text>
            </View>
          )}

          {/* TITLE */}
          <TouchableOpacity activeOpacity={0.9} onPress={handlePropertyPress}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
          </TouchableOpacity>

          {/* PRICE */}
          {!!item.price && (
            <View style={styles.priceRow}>
              <Ionicons name="pricetag" size={15} color="#fff" />
              <Text style={styles.price}>{item.price}</Text>
            </View>
          )}

          {/* LOCATION */}
          {!!item.location && (
            <View style={styles.locationRow}>
              <Ionicons
                name="location-sharp"
                size={14}
                color="rgba(255,255,255,0.8)"
              />
              <Text style={styles.location} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          )}

          {/* DESCRIPTION: only the first words + "more" */}
          {!!item.description && (
            <View style={styles.captionWrap}>
              {showDescription ? (
                <ScrollView
                  style={styles.captionScroll}
                  nestedScrollEnabled
                  showsVerticalScrollIndicator={false}
                >
                  <Text style={styles.caption}>
                    {item.description}
                    {hasMore && (
                      <Text
                        style={styles.captionMore}
                        onPress={() => setShowDescription(false)}
                      >
                        {"  کمتر"}
                      </Text>
                    )}
                  </Text>
                </ScrollView>
              ) : (
                <Text style={styles.caption}>
                  {preview}
                  {hasMore && (
                    <Text
                      style={styles.captionMore}
                      onPress={() => setShowDescription(true)}
                    >
                      {" … بیشتر"}
                    </Text>
                  )}
                </Text>
              )}
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

/* ACTION BUTTON */

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
          size={25}
          color={active ? "#ff3040" : "#fff"}
        />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: "#000",
  },

  /* Top */
  topFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  topBar: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 20,
  },
  logo: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowRadius: 5,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* Heart */
  bigHeart: {
    position: "absolute",
    top: SCREEN_HEIGHT / 2 - 52,
    left: SCREEN_WIDTH / 2 - 52,
    zIndex: 30,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },

  /* Action rail */
  actionRail: {
    position: "absolute",
    left: 10,
    bottom: 205,
    alignItems: "center",
    gap: 16,
    zIndex: 20,
  },
  railAvatarWrap: {
    alignItems: "center",
    paddingBottom: 10, // room so the + badge stays inside (Android touch)
  },
  railAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#fff",
  },
  railAvatarFallback: {
    backgroundColor: "#00a884",
    justifyContent: "center",
    alignItems: "center",
  },
  railPlus: {
    position: "absolute",
    bottom: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#00a884",
    borderWidth: 2,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 52,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,0,0,0.28)",
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    color: "#fff",
    fontSize: 10.5,
    fontWeight: "600",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowRadius: 4,
  },

  /* Bottom */
  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 370,
    justifyContent: "flex-end",
    zIndex: 10,
  },
  bottomContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    // Leave space on the left for the action buttons.
    paddingLeft: 78,
    alignItems: "flex-start",
  },

  /* Owner (glass card) */
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 14,
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.3)",
  },
  ownerMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginEnd: 8,
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00a884",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.9)",
    marginEnd: 10,
  },
  ownerAvatarImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.9)",
    marginEnd: 10,
  },
  avatarText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  ownerInfo: { flex: 1, alignItems: "flex-start" },
  ownerName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  ownerSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    marginTop: 2,
  },

  /* Deal badge */
  dealBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#00a884",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  dealBadgeText: { color: "#fff", fontSize: 11.5, fontWeight: "700" },

  /* Title / price / location */
  title: {
    color: "#fff",
    fontSize: 18,
    lineHeight: 25,
    fontWeight: "700",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowRadius: 5,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  price: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowRadius: 4,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 4,
  },
  location: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12.5,
    flexShrink: 1,
  },

  /* Caption (Instagram style) */
  captionDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    zIndex: 5,
  },
  captionWrap: { width: "100%", marginTop: 6 },
  caption: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13.5,
    lineHeight: 21,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowRadius: 3,
  },
  captionScroll: { maxHeight: 150 },
  captionMore: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
});