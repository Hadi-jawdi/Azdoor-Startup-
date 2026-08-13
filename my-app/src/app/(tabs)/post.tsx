// // import { useState } from "react";
// // import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";

// // export default function PostAd() {
// //   const [title, setTitle] = useState("");
// //   const [price, setPrice] = useState("");
// //   const [location, setLocation] = useState("");
// //   const [description, setDescription] = useState("");

// //   const handleSubmit = () => {
// //     if (!title || !price) {
// //       Alert.alert("خطا", "لطفاً عنوان و قیمت را وارد کنید.");
// //       return;
// //     }
// //     // TODO: connect to Django POST /api/listings/ endpoint with the auth token
// //     Alert.alert("موفق", "اعلان شما ثبت شد (نمونه — هنوز به سرور وصل نیست).");
// //   };

// //   return (
// //     <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
// //       <Text style={styles.label}>عنوان</Text>
// //       <TextInput style={styles.input} value={title} onChangeText={setTitle} textAlign="right" />

// //       <Text style={styles.label}>قیمت</Text>
// //       <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" textAlign="right" />

// //       <Text style={styles.label}>موقعیت</Text>
// //       <TextInput style={styles.input} value={location} onChangeText={setLocation} textAlign="right" />

// //       <Text style={styles.label}>توضیحات</Text>
// //       <TextInput
// //         style={[styles.input, { height: 100, textAlignVertical: "top" }]}
// //         value={description}
// //         onChangeText={setDescription}
// //         multiline
// //         textAlign="right"
// //       />

// //       <TouchableOpacity style={styles.button} onPress={handleSubmit}>
// //         <Text style={styles.buttonText}>ثبت اعلان</Text>
// //       </TouchableOpacity>
// //     </ScrollView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#fff" },
// //   label: { fontSize: 14, fontWeight: "600", marginTop: 12, textAlign: "right" },
// //   input: {
// //     borderWidth: 1,
// //     borderColor: "#ddd",
// //     borderRadius: 8,
// //     padding: 10,
// //     marginTop: 6,
// //   },
// //   button: { backgroundColor: "#00a884", padding: 14, borderRadius: 8, marginTop: 24, alignItems: "center" },
// //   buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
// // });
// import { useState } from "react";
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
// import { router } from "expo-router";
// import { useAuth } from "../../context/AuthContext";
// import { createListing } from "../../utils/listings";
// import { categories } from "../../data/categories";

// export default function PostAd() {
//   const { user, token } = useAuth();
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");
//   const [categoryId, setCategoryId] = useState(categories[0].id);
//   const [submitting, setSubmitting] = useState(false);

//   if (!user) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.notice}>برای ثبت اعلان باید وارد حساب خود شوید.</Text>
//         <TouchableOpacity style={styles.button} onPress={() => router.push("/profile")}>
//           <Text style={styles.buttonText}>ورود / ثبت‌نام</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const handleSubmit = async () => {
//     if (!title || !price || !location) {
//       Alert.alert("خطا", "لطفاً عنوان، قیمت و موقعیت را وارد کنید.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       await createListing({ title, price, location, description, category: categoryId }, token);
//       Alert.alert("موفق", "اعلان شما ثبت شد.");
//       setTitle(""); setPrice(""); setLocation(""); setDescription("");
//       router.push("/");
//     } catch (err) {
//       Alert.alert("خطا", err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
//       <Text style={styles.label}>عنوان</Text>
//       <TextInput style={styles.input} value={title} onChangeText={setTitle} />

//       <Text style={styles.label}>قیمت</Text>
//       <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

//       <Text style={styles.label}>موقعیت</Text>
//       <TextInput style={styles.input} value={location} onChangeText={setLocation} />

//       <Text style={styles.label}>دسته‌بندی</Text>
//       <View style={styles.categoryRow}>
//         {categories.map((c) => (
//           <TouchableOpacity
//             key={c.id}
//             style={[styles.categoryChip, categoryId === c.id && styles.categoryChipActive]}
//             onPress={() => setCategoryId(c.id)}
//           >
//             <Text style={[styles.categoryChipText, categoryId === c.id && styles.categoryChipTextActive]}>
//               {c.title}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <Text style={styles.label}>توضیحات</Text>
//       <TextInput
//         style={[styles.input, { height: 100, textAlignVertical: "top" }]}
//         value={description}
//         onChangeText={setDescription}
//         multiline
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
//         <Text style={styles.buttonText}>{submitting ? "..." : "ثبت اعلان"}</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
//   notice: { fontSize: 15, marginBottom: 16, textAlign: "center" },
//   label: { fontSize: 14, fontWeight: "600", marginTop: 12 },
//   input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginTop: 6 },
//   categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
//   categoryChip: { borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
//   categoryChipActive: { backgroundColor: "#00a884", borderColor: "#00a884" },
//   categoryChipText: { fontSize: 13, color: "#333" },
//   categoryChipTextActive: { color: "#fff" },
//   button: { backgroundColor: "#00a884", padding: 14, borderRadius: 8, marginTop: 24, alignItems: "center" },
//   buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
// });

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
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
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notice}>برای ثبت اعلان باید وارد حساب خود شوید.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/profile")}>
          <Text style={styles.buttonText}>ورود / ثبت‌نام</Text>
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

  const removeImage = (uri) => {
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
    } catch (err) {
      Alert.alert("خطا", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.label}>عکس‌ها ({images.length}/{MAX_IMAGES})</Text>
      <View style={styles.imageRow}>
        {images.map((uri) => (
          <View key={uri} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.imageThumb} />
            <TouchableOpacity style={styles.removeBadge} onPress={() => removeImage(uri)}>
              <Text style={styles.removeBadgeText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        {images.length < MAX_IMAGES && (
          <TouchableOpacity style={styles.addImageBox} onPress={pickImages}>
            <Text style={styles.addImageText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.label}>عنوان</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>قیمت</Text>
      <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

      <Text style={styles.label}>موقعیت</Text>
      <TextInput style={styles.input} value={location} onChangeText={setLocation} />

      <Text style={styles.label}>دسته‌بندی</Text>
      <View style={styles.categoryRow}>
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[styles.categoryChip, categoryId === c.id && styles.categoryChipActive]}
            onPress={() => setCategoryId(c.id)}
          >
            <Text style={[styles.categoryChipText, categoryId === c.id && styles.categoryChipTextActive]}>
              {c.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>توضیحات</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: "top" }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? "..." : "ثبت اعلان"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  notice: { fontSize: 15, marginBottom: 16, textAlign: "center" },
  label: { fontSize: 14, fontWeight: "600", marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 10, marginTop: 6 },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  categoryChip: { borderWidth: 1, borderColor: "#ddd", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  categoryChipActive: { backgroundColor: "#00a884", borderColor: "#00a884" },
  categoryChipText: { fontSize: 13, color: "#333" },
  categoryChipTextActive: { color: "#fff" },
  button: { backgroundColor: "#00a884", padding: 14, borderRadius: 8, marginTop: 24, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  imageRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 8 },
  imageWrapper: { position: "relative" },
  imageThumb: { width: 80, height: 80, borderRadius: 8 },
  removeBadge: {
    position: "absolute", top: -6, right: -6, backgroundColor: "#e74c3c",
    width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center",
  },
  removeBadgeText: { color: "#fff", fontSize: 13, fontWeight: "700", lineHeight: 14 },
  addImageBox: {
    width: 80, height: 80, borderRadius: 8, borderWidth: 1, borderColor: "#ccc",
    borderStyle: "dashed", alignItems: "center", justifyContent: "center",
  },
  addImageText: { fontSize: 28, color: "#aaa" },
});