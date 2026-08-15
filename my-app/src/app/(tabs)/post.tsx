


import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { createListing } from "../../utils/listings";
import { categories } from "../../data/categories";

const MAX_IMAGES = 4;

export default function PostAd() {
  const { user, token } = useAuth();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0].id);
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <View style={styles.centered}>
        <View style={styles.lockIcon}>
          <Ionicons name="lock-closed-outline" size={26} color="#00a884" />
        </View>
        <Text style={styles.noticeTitle}>ابتدا وارد حساب خود شوید</Text>
        <Text style={styles.notice}>برای ثبت اعلان جدید باید وارد حساب کاربری خود شوید.</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/profile")}>
          <Text style={styles.primaryButtonText}>ورود / ثبت‌نام</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pickImages = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert("محدودیت عکس", `حداکثر ${MAX_IMAGES} عکس می‌توانید اضافه کنید.`);
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("خطا", "دسترسی به گالری داده نشد.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: MAX_IMAGES - images.length,
      quality: 0.7,
    });
    if (!result.canceled) {
      const newUris = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newUris].slice(0, MAX_IMAGES));
    }
  };

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((i) => i !== uri));
  };

  const handleSubmit = async () => {
    if (!title || !price || !location) {
      Alert.alert("خطا", "لطفاً عنوان، قیمت و موقعیت را وارد کنید.");
      return;
    }
    if (images.length === 0) {
      Alert.alert("خطا", "لطفاً حداقل یک عکس اضافه کنید.");
      return;
    }
    setSubmitting(true);
    try {
      await createListing({ title, price, location, description, category: categoryId, images }, token);
      Alert.alert("موفق", "اعلان شما ثبت شد.");
      setTitle(""); setPrice(""); setLocation(""); setDescription(""); setImages([]);
      router.push("/");
    } catch (err: any) {
      Alert.alert("خطا", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>ثبت اعلان جدید</Text>
          <Text style={styles.pageSubtitle}>اطلاعات کالا یا خدمات خود را با دقت وارد کنید</Text>

          {/* Photos */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeader}>عکس‌ها</Text>
              <Text style={styles.cardHeaderCount}>{images.length}/{MAX_IMAGES}</Text>
            </View>
            <Text style={styles.cardHint}>عکس اول به‌عنوان تصویر اصلی اعلان نمایش داده می‌شود.</Text>

            <View style={styles.imageGrid}>
              {images.map((uri, i) => (
                <View key={uri} style={styles.imageSlot}>
                  <Image source={{ uri }} style={styles.imageThumb} />
                  {i === 0 && (
                    <View style={styles.mainBadge}>
                      <Text style={styles.mainBadgeText}>اصلی</Text>
                    </View>
                  )}
                  <TouchableOpacity style={styles.removeBadge} onPress={() => removeImage(uri)}>
                    <Ionicons name="close" size={13} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
              {images.length < MAX_IMAGES && (
                <TouchableOpacity style={styles.addImageBox} onPress={pickImages}>
                  <Ionicons name="camera-outline" size={22} color="#00a884" />
                  <Text style={styles.addImageText}>افزودن</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Basic info */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>اطلاعات اصلی</Text>

            <Text style={styles.label}>عنوان اعلان</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="pricetags-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="مثلاً: آپارتمان ۳ اتاقه در شهر نو"
                placeholderTextColor="#b6b9bf"
              />
            </View>

            <Text style={styles.label}>قیمت</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="cash-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                placeholder="مبلغ به افغانی"
                placeholderTextColor="#b6b9bf"
              />
            </View>

            <Text style={styles.label}>موقعیت</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="location-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="شهر، منطقه"
                placeholderTextColor="#b6b9bf"
              />
            </View>
          </View>

          {/* Category */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>دسته‌بندی</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 4 }}>
              {categories.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.categoryChip, categoryId === c.id && styles.categoryChipActive]}
                  onPress={() => setCategoryId(c.id)}
                >
                  <Ionicons
                    name={c.icon as any}
                    size={15}
                    color={categoryId === c.id ? "#fff" : "#5f6570"}
                  />
                  <Text style={[styles.categoryChipText, categoryId === c.id && styles.categoryChipTextActive]}>
                    {c.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>توضیحات</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="جزئیات، وضعیت، و هر نکته‌ای که خریدار باید بداند..."
              placeholderTextColor="#b6b9bf"
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>

        {/* Sticky submit bar */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? "در حال ثبت..." : "ثبت اعلان"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  scrollContent: { padding: 16, paddingBottom: 8 },

  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32, backgroundColor: "#fff" },
  lockIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  noticeTitle: { fontSize: 17, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
  notice: { fontSize: 14, color: "#9a9ea6", textAlign: "center", marginBottom: 22, lineHeight: 20 },
  primaryButton: { backgroundColor: "#00a884", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 10 },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  pageTitle: { fontSize: 21, fontWeight: "700", color: "#1a1a1a", marginBottom: 2 },
  pageSubtitle: { fontSize: 13.5, color: "#9a9ea6", marginBottom: 18 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#eef0f2",
  },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardHeader: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  cardHeaderCount: { fontSize: 13, color: "#9a9ea6", fontWeight: "600" },
  cardHint: { fontSize: 12, color: "#9a9ea6", marginTop: 3, marginBottom: 12 },

  imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
  imageSlot: { position: "relative" },
  imageThumb: { width: 76, height: 76, borderRadius: 10, backgroundColor: "#f4f5f7" },
  mainBadge: {
    position: "absolute", bottom: 4, left: 4, backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1.5,
  },
  mainBadgeText: { color: "#fff", fontSize: 9.5, fontWeight: "600" },
  removeBadge: {
    position: "absolute", top: -6, right: -6, backgroundColor: "#e74c3c",
    width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  addImageBox: {
    width: 76, height: 76, borderRadius: 10, borderWidth: 1.5, borderColor: "#00a884",
    borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 3,
    backgroundColor: "#f3fbf8",
  },
  addImageText: { fontSize: 10.5, color: "#00a884", fontWeight: "600" },

  label: { fontSize: 12.5, fontWeight: "600", color: "#5f6570", marginTop: 14, marginBottom: 6 },
  inputWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
    paddingHorizontal: 12, backgroundColor: "#fbfbfc",
  },
  inputIcon: {},
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
    backgroundColor: "#fff", padding: 16, paddingBottom: 22,
    borderTopWidth: 1, borderTopColor: "#eef0f2",
    elevation: 8, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: -2 },
  },
  submitButton: { backgroundColor: "#00a884", borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  submitButtonDisabled: { backgroundColor: "#9fd6c4" },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 15.5 },
});