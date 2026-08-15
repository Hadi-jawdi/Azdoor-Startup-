
// import { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import { useAuth } from "../../context/AuthContext";

// // import { useState } from "react";
// import { router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";


// export default function Profile() {
//   const { user, loading, login, register, logout } = useAuth();
//   const [mode, setMode] = useState("login"); // "login" | "register"
//   const [phone, setPhone] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [password, setPassword] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   if (loading) return null;

  
//   if (user) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>سلام، {user.full_name || user.phone}</Text>
//       <Text style={styles.subtitle}>{user.phone}</Text>

//       <TouchableOpacity style={styles.menuRow} onPress={() => router.push("/my-listings")}>
//         <Ionicons name="pricetags-outline" size={19} color="#00a884" />
//         <Text style={styles.menuRowText}>اعلان‌های من</Text>
//         <Ionicons name="chevron-back" size={18} color="#c7cad1" />
//       </TouchableOpacity>

//       <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
//         <Text style={styles.buttonText}>خروج از حساب</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

//   const handleSubmit = async () => {
//     if (!phone || !password || (mode === "register" && !fullName)) {
//       Alert.alert("خطا", "لطفاً همه فیلدها را پر کنید.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       if (mode === "login") {
//         await login(phone, password);
//       } else {
//         await register(phone, fullName, password);
//       }
//     } catch (err) {
//       Alert.alert("خطا", err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{mode === "login" ? "ورود" : "ثبت‌نام"}</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="شماره تلفن"
//         value={phone}
//         onChangeText={setPhone}
//         keyboardType="phone-pad"
//       />

//       {mode === "register" && (
//         <TextInput style={styles.input} placeholder="نام کامل" value={fullName} onChangeText={setFullName} />
//       )}

//       <TextInput
//         style={styles.input}
//         placeholder="رمز عبور"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
//         <Text style={styles.buttonText}>{submitting ? "..." : mode === "login" ? "ورود" : "ثبت‌نام"}</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => setMode(mode === "login" ? "register" : "login")}>
//         <Text style={styles.switchText}>
//           {mode === "login" ? "حساب ندارید؟ ثبت‌نام کنید" : "قبلاً ثبت‌نام کرده‌اید؟ وارد شوید"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({

//   //
//   menuRow: {
//   flexDirection: "row",
//   alignItems: "center",
//   gap: 10,
//   backgroundColor: "#fff",
//   borderWidth: 1,
//   borderColor: "#eef0f2",
//   borderRadius: 12,
//   paddingHorizontal: 14,
//   paddingVertical: 14,
//   marginTop: 20,
// },
// menuRowText: { flex: 1, fontSize: 14.5, fontWeight: "600", color: "#1a1a1a" },

//   //
//   container: { flex: 1, padding: 20, justifyContent: "center" },
//   title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 8 },
//   subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 24 },
//   input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 16 },
//   button: { backgroundColor: "#00a884", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
//   logoutButton: { backgroundColor: "#e74c3c", marginTop: 24 },
//   buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
//   switchText: { textAlign: "center", color: "#00a884", marginTop: 16 },
// });

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, loading, login, register, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
  );

  if (user) {
    return (
      <View style={styles.container}>
        <Header title="پروفایل" subtitle="حساب کاربری و اعلان‌های شما" />

        <View style={styles.content}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{(user.full_name || user.phone).charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.full_name || "کاربر"}</Text>
              <Text style={styles.phone}>{user.phone}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.menuRow} onPress={() => router.push("/my-listings")}>
            <Ionicons name="pricetags-outline" size={19} color="#00a884" />
            <Text style={styles.menuRowText}>اعلان‌های من</Text>
            <Ionicons name="chevron-back" size={18} color="#c7cad1" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
            <Text style={styles.buttonText}>خروج از حساب</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSubmit = async () => {
    if (!phone || !password || (mode === "register" && !fullName)) {
      Alert.alert("خطا", "لطفاً همه فیلدها را پر کنید.");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "login") {
        await login(phone, password);
      } else {
        await register(phone, fullName, password);
      }
    } catch (err: any) {
      Alert.alert("خطا", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={mode === "login" ? "ورود" : "ثبت‌نام"}
        subtitle={mode === "login" ? "وارد حساب کاربری خود شوید" : "یک حساب کاربری جدید بسازید"}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.label}>شماره تلفن</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="call-outline" size={17} color="#9a9ea6" />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="۰۷xxxxxxxx"
              placeholderTextColor="#b6b9bf"
            />
          </View>

          {mode === "register" && (
            <>
              <Text style={styles.label}>نام کامل</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={17} color="#9a9ea6" />
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="نام و تخلص"
                  placeholderTextColor="#b6b9bf"
                />
              </View>
            </>
          )}

          <Text style={styles.label}>رمز عبور</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={17} color="#9a9ea6" />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor="#b6b9bf"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
            <Text style={styles.buttonText}>
              {submitting ? "..." : mode === "login" ? "ورود" : "ثبت‌نام"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode(mode === "login" ? "register" : "login")}>
            <Text style={styles.switchText}>
              {mode === "login" ? "حساب ندارید؟ ثبت‌نام کنید" : "قبلاً ثبت‌نام کرده‌اید؟ وارد شوید"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  content: { padding: 16 },

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingBottom: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    marginBottom: 6,
  },
  headerTitle: { fontSize: 21, fontWeight: "700", color: "#1a1a1a" },
  headerSubtitle: { fontSize: 13, color: "#9a9ea6", marginTop: 3 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eef0f2",
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center",
  },
  avatarText: { color: "#0f6e56", fontWeight: "700", fontSize: 20 },
  name: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
  phone: { fontSize: 13, color: "#9a9ea6", marginTop: 2 },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eef0f2",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 14,
  },
  menuRowText: { flex: 1, fontSize: 14.5, fontWeight: "600", color: "#1a1a1a" },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#eef0f2",
  },
  label: { fontSize: 12.5, fontWeight: "600", color: "#5f6570", marginTop: 10, marginBottom: 6 },
  inputWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
    paddingHorizontal: 12, backgroundColor: "#fbfbfc",
  },
  input: { flex: 1, paddingVertical: 11, fontSize: 14.5, color: "#1a1a1a" },

  button: { backgroundColor: "#00a884", padding: 14, borderRadius: 10, alignItems: "center", marginTop: 20 },
  logoutButton: { backgroundColor: "#e74c3c", marginTop: 16 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  switchText: { textAlign: "center", color: "#00a884", marginTop: 16, fontSize: 13.5 },
});