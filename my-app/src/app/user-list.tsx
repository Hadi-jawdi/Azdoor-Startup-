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
import { useAuth } from "../context/AuthContext";
import FollowButton from "../components/FollowButton";
import { getFollowers, getFollowing } from "../utils/profiles";

const GREEN = "#00a884";

export default function UserList() {
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();

  const isFollowers = type !== "following";
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          const data = isFollowers
            ? await getFollowers(id, token)
            : await getFollowing(id, token);
          if (active) setPeople(data);
        } catch {
          if (active) setPeople([]);
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [id, token, isFollowers])
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {isFollowers ? "دنبال‌کننده‌ها" : "دنبال‌شده‌ها"}
        </Text>
        <View style={styles.iconButton} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={GREEN} />
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: 14, paddingBottom: insets.bottom + 30 }}
          ListEmptyComponent={
            <Text style={styles.empty}>
              {isFollowers ? "هنوز دنبال‌کننده‌ای ندارد." : "هنوز کسی را دنبال نمی‌کند."}
            </Text>
          }
          renderItem={({ item }) => {
            const name = item.full_name || "کاربر Azdoor";
            return (
              <View style={styles.row}>
                <TouchableOpacity
                  style={styles.rowMain}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/user/${item.id}`)}
                >
                  {item.avatar ? (
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  ) : (
                    <View style={[styles.avatar, styles.avatarFallback]}>
                      <Text style={styles.avatarLetter}>{name.charAt(0)}</Text>
                    </View>
                  )}

                  <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>
                      {name}
                    </Text>
                    {item.account_type === "agent" && (
                      <Text style={styles.sub} numberOfLines={1}>
                        مشاور املاک{item.agency_name ? ` • ${item.agency_name}` : ""}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* no follow button next to yourself */}
                {user?.id !== item.id && (
                  <FollowButton
                    userId={item.id}
                    initialFollowing={item.is_following}
                    compact
                  />
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
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
  topTitle: { flex: 1, textAlign: "center", fontSize: 17, fontWeight: "800", color: "#171717" },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 9,
    borderWidth: 1,
    borderColor: "#edf0f2",
    gap: 10,
  },
  rowMain: { flex: 1, flexDirection: "row", alignItems: "center", gap: 11 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarFallback: { backgroundColor: GREEN, justifyContent: "center", alignItems: "center" },
  avatarLetter: { color: "#fff", fontSize: 18, fontWeight: "800" },
  info: { flex: 1 },
  name: { fontSize: 14.5, fontWeight: "700", color: "#222", textAlign: "right" },
  sub: { fontSize: 11.5, color: GREEN, marginTop: 3, textAlign: "right" },
  empty: { textAlign: "center", color: "#9a9ea6", marginTop: 40, fontSize: 13 },
});