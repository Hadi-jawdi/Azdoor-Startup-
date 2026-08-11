import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";

export default function PostAd() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!title || !price) {
      Alert.alert("خطا", "لطفاً عنوان و قیمت را وارد کنید.");
      return;
    }
    // TODO: connect to Django POST /api/listings/ endpoint with the auth token
    Alert.alert("موفق", "اعلان شما ثبت شد (نمونه — هنوز به سرور وصل نیست).");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>عنوان</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} textAlign="right" />

      <Text style={styles.label}>قیمت</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" textAlign="right" />

      <Text style={styles.label}>موقعیت</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} textAlign="right" />

      <Text style={styles.label}>توضیحات</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        value={description}
        onChangeText={setDescription}
        multiline
        textAlign="right"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>ثبت اعلان</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 12, textAlign: "right" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  button: { backgroundColor: "#00a884", padding: 14, borderRadius: 8, marginTop: 24, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});