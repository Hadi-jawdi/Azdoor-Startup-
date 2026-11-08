// import { useEffect, useState } from "react";
// import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
// import { router } from "expo-router";
// import { useAuth } from "../context/AuthContext";
// import { followUser, unfollowUser } from "../utils/profiles";

// const GREEN = "#00a884";

// export default function FollowButton({
//   userId,
//   initialFollowing,
//   compact = false,
//   onChange,
// }: {
//   userId: number;
//   initialFollowing: boolean;
//   compact?: boolean;
//   onChange?: (isFollowing: boolean, followersCount: number) => void;
// }) {
//   const { user, token } = useAuth();
//   const [following, setFollowing] = useState(initialFollowing);
//   const [busy, setBusy] = useState(false);

//   // keep in sync if the parent reloads the data
//   useEffect(() => setFollowing(initialFollowing), [initialFollowing]);

//   const handlePress = async () => {
//     if (!user) {
//       router.push("/profile"); // not logged in -> go to login
//       return;
//     }
//     if (busy) return;

//     const next = !following;
//     setFollowing(next); // optimistic update
//     setBusy(true);

//     try {
//       const res = next
//         ? await followUser(userId, token)
//         : await unfollowUser(userId, token);
//       setFollowing(res.is_following);
//       onChange?.(res.is_following, res.followers_count);
//     } catch {
//       setFollowing(!next); // undo on error
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <TouchableOpacity
//       style={[
//         styles.button,
//         compact && styles.compact,
//         following ? styles.following : styles.follow,
//       ]}
//       onPress={handlePress}
//       activeOpacity={0.85}
//     >
//       {busy ? (
//         <ActivityIndicator size="small" color={following ? "#222" : "#fff"} />
//       ) : (
//         <Text
//           style={[
//             styles.text,
//             compact && styles.textCompact,
//             following ? styles.textFollowing : styles.textFollow,
//           ]}
//         >
//           {following ? "دنبال می‌کنید" : "دنبال کردن"}
//         </Text>
//       )}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     minWidth: 130,
//     minHeight: 40,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   compact: { minWidth: 92, minHeight: 34, paddingHorizontal: 12, borderRadius: 9 },
//   follow: { backgroundColor: GREEN },
//   following: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#dfe2e6" },
//   text: { fontSize: 13.5, fontWeight: "800" },
//   textCompact: { fontSize: 12 },
//   textFollow: { color: "#fff" },
//   textFollowing: { color: "#222" },
// });


import { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { followUser, unfollowUser } from "../utils/profiles";

const GREEN = "#00a884";

export default function FollowButton({
  userId,
  initialFollowing,
  compact = false,
  overlay = false,
  onChange,
}: {
  userId: number;
  initialFollowing: boolean;
  compact?: boolean;
  overlay?: boolean; // style for use on top of videos
  onChange?: (isFollowing: boolean, followersCount: number) => void;
}) {
  const { user, token } = useAuth();
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  // keep in sync if the parent reloads the data
  useEffect(() => setFollowing(initialFollowing), [initialFollowing]);

  const handlePress = async () => {
    if (!user) {
      router.push("/profile"); // not logged in -> go to login
      return;
    }
    if (busy) return;

    const next = !following;
    setFollowing(next); // optimistic update
    setBusy(true);

    try {
      const res = next
        ? await followUser(userId, token)
        : await unfollowUser(userId, token);
      setFollowing(res.is_following);
      onChange?.(res.is_following, res.followers_count);
    } catch {
      setFollowing(!next); // undo on error
    } finally {
      setBusy(false);
    }
  };

  const darkText = following && !overlay;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        compact && styles.compact,
        following ? styles.following : styles.follow,
        overlay && following && styles.followingOverlay,
      ]}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      {busy ? (
        <ActivityIndicator size="small" color={darkText ? "#222" : "#fff"} />
      ) : (
        <Text
          style={[
            styles.text,
            compact && styles.textCompact,
            darkText ? styles.textFollowing : styles.textFollow,
          ]}
        >
          {following ? "دنبال می‌کنید" : "دنبال کردن"}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 130,
    minHeight: 40,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  compact: { minWidth: 92, minHeight: 34, paddingHorizontal: 12, borderRadius: 9 },
  follow: { backgroundColor: GREEN },
  following: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#dfe2e6" },
  followingOverlay: {
    backgroundColor: "transparent",
    borderColor: "rgba(255,255,255,0.85)",
  },
  text: { fontSize: 13.5, fontWeight: "800" },
  textCompact: { fontSize: 12 },
  textFollow: { color: "#fff" },
  textFollowing: { color: "#222" },
});