import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../utils/profiles";

const GREEN = "#00a884";

export default function EditProfile() {
  const { user, token, refreshUser } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [isAgent, setIsAgent] = useState(false);
  const [agencyName, setAgencyName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null); // current avatar URL
  const [newAvatarUri, setNewAvatarUri] = useState<string | null>(null); // newly picked photo

  // load the current values into the form
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const p = await getProfile(user.id, token);
        setFullName(p.full_name || "");
        setBio(p.bio || "");
        setCity(p.city || "");
        setIsAgent(p.account_type === "agent");
        setAgencyName(p.agency_name || "");
        setAvatar(p.avatar || null);
      } catch {
        Alert.alert("خطا", "اطلاعات پروفایل بارگذاری نشد.");
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("اجازه لازم است", "برای انتخاب عکس به گالری اجازه دهید.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) setNewAvatarUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("خطا", "نام را وارد کنید.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile(
        {
          full_name: fullName.trim(),
          bio: bio.trim(),
          city: city.trim(),
          account_type: isAgent ? "agent" : "user",
          agency_name: isAgent ? agencyName.trim() : "",
          avatarUri: newAvatarUri,
        },
        token
      );
      await refreshUser();
      router.back();
    } catch (e: any) {
      Alert.alert("خطا", e?.message || "ذخیره نشد.");
    } finally {
      setSaving(false);
    }
  };

  const shownAvatar = newAvatarUri || avatar;
  const letter = (fullName || "A").charAt(0);

  if (loading) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color={GREEN} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={22} color="#222" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>ویرایش پروفایل</Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* AVATAR */}
        <TouchableOpacity style={styles.avatarWrap} onPress={pickAvatar} activeOpacity={0.8}>
          {shownAvatar ? (
            <Image source={{ uri: shownAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarLetter}>{letter}</Text>
            </View>
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.avatarHint}>برای تغییر عکس بزنید</Text>

        {/* FIELDS */}
        <Text style={styles.label}>نام کامل</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="نام و تخلص"
          placeholderTextColor="#b6b9bf"
          textAlign="right"
        />

        <Text style={styles.label}>درباره من</Text>
        <TextInput
          style={[styles.input, styles.bioInput]}
          value={bio}
          onChangeText={setBio}
          placeholder="چند جمله درباره خودتان بنویسید"
          placeholderTextColor="#b6b9bf"
          textAlign="right"
          multiline
          maxLength={300}
        />
        <Text style={styles.counter}>{bio.length}/300</Text>

        <Text style={styles.label}>شهر</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="مثلاً کابل"
          placeholderTextColor="#b6b9bf"
          textAlign="right"
        />

        {/* AGENT SWITCH */}
        <View style={styles.switchCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>من مشاور املاک هستم</Text>
            <Text style={styles.switchSub}>
              نشان «مشاور املاک» در پروفایل شما نمایش داده می‌شود.
            </Text>
          </View>
          <Switch
            value={isAgent}
            onValueChange={setIsAgent}
            trackColor={{ true: GREEN, false: "#d5d8dc" }}
            thumbColor="#fff"
          />
        </View>

        {isAgent && (
          <>
            <Text style={styles.label}>نام شرکت / دفتر املاک</Text>
            <TextInput
              style={styles.input}
              value={agencyName}
              onChangeText={setAgencyName}
              placeholder="اختیاری"
              placeholderTextColor="#b6b9bf"
              textAlign="right"
            />
          </>
        )}

        {/* SAVE */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.65 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>ذخیره تغییرات</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  topTitle: { flex: 1, textAlign: "center", fontSize: 17, fontWeight: "800", color: "#171717" },

  avatarWrap: { alignSelf: "center", marginTop: 8 },
  avatar: { width: 104, height: 104, borderRadius: 52, borderWidth: 4, borderColor: "#e3f7f0" },
  avatarFallback: { backgroundColor: GREEN, justifyContent: "center", alignItems: "center" },
  avatarLetter: { color: "#fff", fontSize: 40, fontWeight: "800" },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: GREEN,
    borderWidth: 3,
    borderColor: "#f7f8fa",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarHint: { textAlign: "center", color: "#9a9ea6", fontSize: 11.5, marginTop: 8, marginBottom: 6 },

  label: { color: "#555b65", fontSize: 12.5, fontWeight: "700", marginTop: 14, marginBottom: 6, textAlign: "right" },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#e3e6ea",
    borderRadius: 12,
    paddingHorizontal: 13,
    backgroundColor: "#fff",
    color: "#171717",
    fontSize: 14,
  },
  bioInput: { minHeight: 90, paddingTop: 12, textAlignVertical: "top" },
  counter: { color: "#b0b4bb", fontSize: 10.5, marginTop: 4, textAlign: "left" },

  switchCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#edf0f2",
    padding: 14,
    marginTop: 20,
  },
  switchTitle: { fontSize: 14, fontWeight: "700", color: "#222", textAlign: "right" },
  switchSub: { fontSize: 11.5, color: "#9a9ea6", marginTop: 3, textAlign: "right" },

  saveButton: {
    minHeight: 52,
    borderRadius: 12,
    backgroundColor: GREEN,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
  },
  saveText: { color: "#fff", fontSize: 15, fontWeight: "800" },
});