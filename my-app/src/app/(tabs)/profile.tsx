// import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { useState } from "react";

// export default function Profile() {
//   const [phone, setPhone] = useState("");

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>ورود / ثبت‌نام</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="شماره تلفن"
//         value={phone}
//         onChangeText={setPhone}
//         keyboardType="phone-pad"
//         textAlign="right"
//       />
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>ادامه</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center" },
//   title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 24 },
//   input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 16 },
//   button: { backgroundColor: "#00a884", padding: 14, borderRadius: 8, alignItems: "center" },
//   buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
// });

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, loading, login, register, logout } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>سلام، {user.full_name || user.phone}</Text>
        <Text style={styles.subtitle}>{user.phone}</Text>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={logout}>
          <Text style={styles.buttonText}>خروج از حساب</Text>
        </TouchableOpacity>
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
    } catch (err) {
      Alert.alert("خطا", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === "login" ? "ورود" : "ثبت‌نام"}</Text>

      <TextInput
        style={styles.input}
        placeholder="شماره تلفن"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {mode === "register" && (
        <TextInput style={styles.input} placeholder="نام کامل" value={fullName} onChangeText={setFullName} />
      )}

      <TextInput
        style={styles.input}
        placeholder="رمز عبور"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? "..." : mode === "login" ? "ورود" : "ثبت‌نام"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setMode(mode === "login" ? "register" : "login")}>
        <Text style={styles.switchText}>
          {mode === "login" ? "حساب ندارید؟ ثبت‌نام کنید" : "قبلاً ثبت‌نام کرده‌اید؟ وارد شوید"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 24 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 16 },
  button: { backgroundColor: "#00a884", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 8 },
  logoutButton: { backgroundColor: "#e74c3c", marginTop: 24 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  switchText: { textAlign: "center", color: "#00a884", marginTop: 16 },
});