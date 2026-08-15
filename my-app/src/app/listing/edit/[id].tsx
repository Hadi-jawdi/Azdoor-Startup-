import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { getListing, updateListing } from "../../../utils/listings";
import { categories } from "../../../data/categories";

export default function EditListing() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0].id);

  useEffect(() => {
    getListing(id as string)
      .then((item) => {
        setTitle(item.title);
        setPrice(item.price);
        setLocation(item.location);
        setDescription(item.description || "");
        setCategoryId(item.category);
      })
      .catch((err) => Alert.alert("خطا", err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!title || !price || !location) {
      Alert.alert("خطا", "لطفاً عنوان، قیمت و موقعیت را وارد کنید.");
      return;
    }
    setSubmitting(true);
    try {
      await updateListing(id as string, { title, price, location, description, category: categoryId }, token);
      Alert.alert("موفق", "تغییرات ذخیره شد.");
      router.back();
    } catch (err: any) {
      Alert.alert("خطا", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00a884" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-forward" size={20} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ویرایش اعلان</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.label}>عنوان اعلان</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="pricetags-outline" size={17} color="#9a9ea6" />
            <TextInput style={styles.input} value={title} onChangeText={setTitle} />
          </View>

          <Text style={styles.label}>قیمت</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="cash-outline" size={17} color="#9a9ea6" />
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
          </View>

          <Text style={styles.label}>موقعیت</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="location-outline" size={17} color="#9a9ea6" />
            <TextInput style={styles.input} value={location} onChangeText={setLocation} />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>دسته‌بندی</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.categoryChip, categoryId === c.id && styles.categoryChipActive]}
                onPress={() => setCategoryId(c.id)}
              >
                <Ionicons name={c.icon as any} size={15} color={categoryId === c.id ? "#fff" : "#5f6570"} />
                <Text style={[styles.categoryChipText, categoryId === c.id && styles.categoryChipTextActive]}>
                  {c.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>توضیحات</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 14) + 8 }]}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>{submitting ? "در حال ذخیره..." : "ذخیره تغییرات"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eef0f2",
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: "#f4f5f7",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },

  scrollContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: "#eef0f2",
  },
  cardHeader: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },

  label: { fontSize: 12.5, fontWeight: "600", color: "#5f6570", marginTop: 10, marginBottom: 6 },
  inputWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
    paddingHorizontal: 12, backgroundColor: "#fbfbfc",
  },
  input: { flex: 1, paddingVertical: 11, fontSize: 14.5, color: "#1a1a1a" },

  categoryChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, backgroundColor: "#fbfbfc",
  },
  categoryChipActive: { backgroundColor: "#00a884", borderColor: "#00a884" },
  categoryChipText: { fontSize: 13, color: "#5f6570", fontWeight: "500" },
  categoryChipTextActive: { color: "#fff" },

  textArea: {
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
    backgroundColor: "#fbfbfc", padding: 12, marginTop: 10,
    height: 110, fontSize: 14.5, color: "#1a1a1a",
  },

  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff", padding: 16,
    borderTopWidth: 1, borderTopColor: "#eef0f2",
    elevation: 8, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: -2 },
  },
  submitButton: { backgroundColor: "#00a884", borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  submitButtonDisabled: { backgroundColor: "#9fd6c4" },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 15.5 },
});