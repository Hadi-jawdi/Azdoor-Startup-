import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { Stack, router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import ListingCard from "../../components/ListingCard";
import FollowButton from "../../components/FollowButton";
import { getProfile, getUserListings } from "../../utils/profiles";

const GREEN = "#00a884";

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // reload every time the screen is focused (e.g. after editing the profile)
  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const [p, l] = await Promise.all([
            getProfile(id, token),
            getUserListings(id, token),
          ]);
          if (!active) return;
          setProfile(p);
          setListings(l);
          setError("");
        } catch (e: any) {
          if (active) setError(e?.message || "خطایی رخ داد.");
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [id, token])
  );

  const topBar = (title: string) => (
    <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
      <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
        {/* arrow-forward points right = "back" in an RTL layout */}
        <Ionicons name="arrow-forward" size={22} color="#222" />
      </TouchableOpacity>
      <Text style={styles.topTitle} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.iconButton} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        {topBar("پروفایل")}
        <Text style={styles.errorText}>{error || "کاربر پیدا نشد."}</Text>
      </View>
    );
  }

  const isAgent = profile.account_type === "agent";
  const displayName = profile.full_name || "کاربر Azdoor";

  const header = (
    <View style={styles.header}>
      {/* AVATAR */}
      {profile.avatar ? (
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarFallback]}>
          <Text style={styles.avatarLetter}>{displayName.charAt(0)}</Text>
        </View>
      )}

      {/* NAME + BADGE */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>{displayName}</Text>
        {profile.is_verified && (
          <Ionicons name="checkmark-circle" size={19} color="#3478f6" />
        )}
      </View>

      {isAgent && (
        <View style={styles.agentBadge}>
          <Ionicons name="briefcase-outline" size={12} color={GREEN} />
          <Text style={styles.agentBadgeText}>
            مشاور املاک{profile.agency_name ? ` • ${profile.agency_name}` : ""}
          </Text>
        </View>
      )}

      {!!profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

      {!!profile.city && (
        <View style={styles.cityRow}>
          <Ionicons name="location-outline" size={14} color="#7f8790" />
          <Text style={styles.city}>{profile.city}</Text>
        </View>
      )}

      {/* STATS */}
      <View style={styles.statsCard}>
        <Stat value={profile.listings_count ?? listings.length} label="آگهی" />
        <View style={styles.statDivider} />
        <Stat
          value={profile.followers_count}
          label="دنبال‌کننده"
          onPress={() => router.push(`/user-list?id=${id}&type=followers`)}
        />
        <View style={styles.statDivider} />
        <Stat
          value={profile.following_count}
          label="دنبال‌شده"
          onPress={() => router.push(`/user-list?id=${id}&type=following`)}
        />
      </View>

      {/* ACTION BUTTON */}
      <View style={styles.actionRow}>
        {profile.is_me ? (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/edit-profile")}
          >
            <Ionicons name="create-outline" size={16} color="#222" />
            <Text style={styles.editText}>ویرایش پروفایل</Text>
          </TouchableOpacity>
        ) : (
          <FollowButton
            userId={profile.id}
            initialFollowing={profile.is_following}
            onChange={(isFollowing, followersCount) =>
              setProfile((p: any) => ({
                ...p,
                is_following: isFollowing,
                followers_count: followersCount,
              }))
            }
          />
        )}
      </View>

      <Text style={styles.sectionTitle}>آگهی‌ها</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {topBar(displayName)}

      <FlatList
        data={listings}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        ListHeaderComponent={header}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <ListingCard item={item} />
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>هنوز آگهی‌ای ثبت نشده است.</Text>
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function Stat({
  value,
  label,
  onPress,
}: {
  value: number;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.statItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f7f8fa" },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f6f7",
    justifyContent: "center",
    alignItems: "center",
  },
  topTitle: { flex: 1, textAlign: "center", fontSize: 17, fontWeight: "800", color: "#171717", marginHorizontal: 8 },

  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#e3f7f0",
  },
  avatarFallback: { backgroundColor: GREEN, justifyContent: "center", alignItems: "center" },
  avatarLetter: { color: "#fff", fontSize: 36, fontWeight: "800" },

  nameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  name: { fontSize: 21, fontWeight: "800", color: "#171717" },

  agentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#e8f7f2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
  },
  agentBadgeText: { color: GREEN, fontSize: 12, fontWeight: "700" },

  bio: { color: "#4a4f57", fontSize: 13.5, lineHeight: 21, textAlign: "center", marginTop: 10 },
  cityRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 8 },
  city: { color: "#7f8790", fontSize: 12.5 },

  statsCard: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "#f8faf9",
    borderRadius: 16,
    marginTop: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#edf0ef",
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: "#171717" },
  statLabel: { fontSize: 11, color: "#8d929b", marginTop: 3 },
  statDivider: { width: 1, height: 30, backgroundColor: "#e1e4e3" },

  actionRow: { marginTop: 16, alignSelf: "stretch", alignItems: "center" },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minWidth: 160,
    minHeight: 40,
    borderWidth: 1,
    borderColor: "#dfe2e6",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  editText: { color: "#292929", fontSize: 13.5, fontWeight: "700" },

  sectionTitle: {
    alignSelf: "stretch",
    textAlign: "right",
    fontSize: 16,
    fontWeight: "800",
    color: "#242424",
    marginTop: 22,
  },

  cell: { width: "50%", padding: 6 },
  empty: { textAlign: "center", color: "#9a9ea6", marginTop: 30, fontSize: 13 },
  errorText: { textAlign: "center", color: "#e74c3c", marginTop: 40, fontSize: 14 },
});