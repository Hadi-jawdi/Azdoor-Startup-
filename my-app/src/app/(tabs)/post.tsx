

// import { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Alert,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { router } from "expo-router";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useAuth } from "../../context/AuthContext";
// import { createListing } from "../../utils/listings";
// import { categories } from "../../data/categories";

// const MAX_IMAGES = 4;
// const MAX_DESCRIPTION = 500;

// const DEAL_TYPES = [
//   { id: "rent", title: "اجاره" },
//   { id: "sale", title: "فروش" },
// ];

// const PROPERTY_TYPES = [
//   { id: "residential", title: "مسکونی" },
//   { id: "commercial", title: "تجاری" },
// ];

// const EMPLOYMENT_TYPES = [
//   { id: "full-time", title: "تمام وقت" },
//   { id: "part-time", title: "پاره وقت" },
//   { id: "remote", title: "دورکار" },
//   { id: "internship", title: "کارآموزی" },
// ];

// export default function PostAd() {
//   const { user, token } = useAuth();
//   const insets = useSafeAreaInsets();
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [location, setLocation] = useState("");
//   const [description, setDescription] = useState("");
//   const [categoryId, setCategoryId] = useState<string | null>(null);
//   const [dealType, setDealType] = useState<string | null>(null);
//   const [propertyType, setPropertyType] = useState<string | null>(null);
//   const [employmentType, setEmploymentType] = useState<string | null>(null);
//   const [images, setImages] = useState<string[]>([]);
//   const [submitting, setSubmitting] = useState(false);

//   const isRealEstate = categoryId === "real-estate";
//   const isJobs = categoryId === "jobs";
//   const selectedCategory = categories.find((c) => c.id === categoryId);

//   const Header = ({ subtitle }: { subtitle: string }) => (
//     <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
//       <Text style={styles.headerTitle}>ثبت اعلان</Text>
//       <Text style={styles.headerSubtitle}>{subtitle}</Text>
//     </View>
//   );

//   if (!user) {
//     return (
//       <View style={styles.container}>
//         <Header subtitle="برای ثبت اعلان وارد حساب خود شوید" />
//         <View style={styles.centered}>
//           <View style={styles.lockIcon}>
//             <Ionicons name="lock-closed-outline" size={26} color="#00a884" />
//           </View>
//           <Text style={styles.noticeTitle}>ابتدا وارد حساب خود شوید</Text>
//           <Text style={styles.notice}>برای ثبت اعلان جدید باید وارد حساب کاربری خود شوید.</Text>
//           <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/profile")}>
//             <Text style={styles.primaryButtonText}>ورود / ثبت‌نام</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   const pickImages = async () => {
//     if (images.length >= MAX_IMAGES) {
//       Alert.alert("محدودیت عکس", `حداکثر ${MAX_IMAGES} عکس می‌توانید اضافه کنید.`);
//       return;
//     }
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("خطا", "دسترسی به گالری داده نشد.");
//       return;
//     }
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       selectionLimit: MAX_IMAGES - images.length,
//       quality: 0.7,
//     });
//     if (!result.canceled) {
//       const newUris = result.assets.map((a) => a.uri);
//       setImages((prev) => [...prev, ...newUris].slice(0, MAX_IMAGES));
//     }
//   };

//   const removeImage = (uri: string) => {
//     setImages((prev) => prev.filter((i) => i !== uri));
//   };

//   const handleSubmit = async () => {
//     if (!categoryId) {
//       Alert.alert("خطا", "لطفاً دسته‌بندی را انتخاب کنید.");
//       return;
//     }
//     if (isRealEstate && (!dealType || !propertyType)) {
//       Alert.alert("خطا", "لطفاً نوع معامله و نوع ملک را انتخاب کنید.");
//       return;
//     }
//     if (isJobs && !employmentType) {
//       Alert.alert("خطا", "لطفاً نوع همکاری را انتخاب کنید.");
//       return;
//     }
//     if (!isJobs && images.length === 0) {
//       Alert.alert("خطا", "لطفاً حداقل یک عکس اضافه کنید.");
//       return;
//     }
//     if (!title || !location || (!isJobs && !price)) {
//       Alert.alert("خطا", "لطفاً فیلدهای الزامی را تکمیل کنید.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       await createListing(
//         {
//           title,
//           price,
//           location,
//           description,
//           category: categoryId,
//           deal_type: isRealEstate ? dealType : null,
//           property_type: isRealEstate ? propertyType : null,
//           employment_type: isJobs ? employmentType : null,
//           images,
//         },
//         token
//       );
//       Alert.alert("موفق", "اعلان شما ثبت شد.");
//       setTitle(""); setPrice(""); setLocation(""); setDescription(""); setImages([]);
//       setCategoryId(null); setDealType(null); setPropertyType(null); setEmploymentType(null);
//       router.push("/");
//     } catch (err: any) {
//       Alert.alert("خطا", err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Compute step numbers dynamically since real-estate/jobs cards are conditional
//   let step = 1;
//   const stepCategory = step++;
//   const stepDetails = isRealEstate || isJobs ? step++ : null;
//   const stepPhotos = isJobs ? null : step++; // jobs skip photos entirely
//   const stepBasic = step++;
//   const stepDescription = step++;

//   return (
//     <KeyboardAvoidingView
//       style={{ flex: 1 }}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
//     >
//       <View style={styles.container}>
//         <Header subtitle="مرحله به مرحله اعلان خود را تکمیل کنید" />

//         <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//           {/* Category */}
//           <View style={styles.card}>
//             <View style={styles.cardHeaderRow}>
//               <View style={styles.stepBadge}>
//                 <Text style={styles.stepBadgeText}>{toFarsiNum(stepCategory)}</Text>
//               </View>
//               <Text style={styles.cardHeader}>دسته‌بندی</Text>
//               <Text style={styles.required}>الزامی</Text>
//             </View>
//             <Text style={styles.cardHint}>اعلان شما در کدام دسته‌بندی قرار می‌گیرد؟</Text>

//             <View style={styles.categoryGrid}>
//               {categories.map((c) => {
//                 const active = categoryId === c.id;
//                 return (
//                   <TouchableOpacity
//                     key={c.id}
//                     style={styles.categoryGridItem}
//                     onPress={() => setCategoryId(c.id)}
//                     activeOpacity={0.8}
//                   >
//                     <View style={[styles.categoryCircle, active && styles.categoryCircleActive]}>
//                       <Ionicons name={c.icon as any} size={22} color={active ? "#fff" : "#00a884"} />
//                     </View>
//                     <Text style={[styles.categoryGridLabel, active && styles.categoryGridLabelActive]} numberOfLines={1}>
//                       {c.title}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </View>

//           {/* Real estate details */}
//           {isRealEstate && (
//             <View style={styles.card}>
//               <View style={styles.cardHeaderRow}>
//                 <View style={styles.stepBadge}>
//                   <Text style={styles.stepBadgeText}>{toFarsiNum(stepDetails!)}</Text>
//                 </View>
//                 <Text style={styles.cardHeader}>جزئیات ملک</Text>
//                 <Text style={styles.required}>الزامی</Text>
//               </View>

//               <Text style={styles.label}>نوع معامله</Text>
//               <View style={styles.optionRow}>
//                 {DEAL_TYPES.map((d) => (
//                   <TouchableOpacity
//                     key={d.id}
//                     style={[styles.optionChip, dealType === d.id && styles.optionChipActive]}
//                     onPress={() => setDealType(d.id)}
//                   >
//                     <Text style={[styles.optionChipText, dealType === d.id && styles.optionChipTextActive]}>
//                       {d.title}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <Text style={styles.label}>نوع ملک</Text>
//               <View style={styles.optionRow}>
//                 {PROPERTY_TYPES.map((p) => (
//                   <TouchableOpacity
//                     key={p.id}
//                     style={[styles.optionChip, propertyType === p.id && styles.optionChipActive]}
//                     onPress={() => setPropertyType(p.id)}
//                   >
//                     <Text style={[styles.optionChipText, propertyType === p.id && styles.optionChipTextActive]}>
//                       {p.title}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Job details */}
//           {isJobs && (
//             <View style={styles.card}>
//               <View style={styles.cardHeaderRow}>
//                 <View style={styles.stepBadge}>
//                   <Text style={styles.stepBadgeText}>{toFarsiNum(stepDetails!)}</Text>
//                 </View>
//                 <Text style={styles.cardHeader}>جزئیات شغل</Text>
//                 <Text style={styles.required}>الزامی</Text>
//               </View>

//               <Text style={styles.label}>نوع همکاری</Text>
//               <View style={styles.jobTypeGrid}>
//                 {EMPLOYMENT_TYPES.map((j) => (
//                   <TouchableOpacity
//                     key={j.id}
//                     style={[styles.jobTypeChip, employmentType === j.id && styles.optionChipActive]}
//                     onPress={() => setEmploymentType(j.id)}
//                   >
//                     <Text style={[styles.optionChipText, employmentType === j.id && styles.optionChipTextActive]}>
//                       {j.title}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </View>
//           )}

//           {/* Photos — skipped entirely for jobs */}
//           {!isJobs && (
//             <View style={styles.card}>
//               <View style={styles.cardHeaderRow}>
//                 <View style={styles.stepBadge}>
//                   <Text style={styles.stepBadgeText}>{toFarsiNum(stepPhotos!)}</Text>
//                 </View>
//                 <Text style={styles.cardHeader}>عکس‌ها</Text>
//                 <Text style={styles.required}>الزامی</Text>
//                 <Text style={styles.cardHeaderCount}>{images.length}/{MAX_IMAGES}</Text>
//               </View>
//               <Text style={styles.cardHint}>عکس اول به‌عنوان تصویر اصلی اعلان نمایش داده می‌شود.</Text>

//               <View style={styles.imageGrid}>
//                 {images.map((uri, i) => (
//                   <View key={uri} style={styles.imageSlot}>
//                     <Image source={{ uri }} style={styles.imageThumb} />
//                     {i === 0 && (
//                       <View style={styles.mainBadge}>
//                         <Text style={styles.mainBadgeText}>اصلی</Text>
//                       </View>
//                     )}
//                     <TouchableOpacity style={styles.removeBadge} onPress={() => removeImage(uri)}>
//                       <Ionicons name="close" size={13} color="#fff" />
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//                 {images.length < MAX_IMAGES && (
//                   <TouchableOpacity style={styles.addImageBox} onPress={pickImages}>
//                     <Ionicons name="camera-outline" size={22} color="#00a884" />
//                     <Text style={styles.addImageText}>افزودن</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>
//           )}

//           {/* Basic info */}
//           <View style={styles.card}>
//             <View style={styles.cardHeaderRow}>
//               <View style={styles.stepBadge}>
//                 <Text style={styles.stepBadgeText}>{toFarsiNum(stepBasic)}</Text>
//               </View>
//               <Text style={styles.cardHeader}>اطلاعات اصلی</Text>
//               <Text style={styles.required}>الزامی</Text>
//             </View>

//             <Text style={styles.label}>{isJobs ? "عنوان شغلی" : "عنوان اعلان"}</Text>
//             <View style={styles.inputWrap}>
//               <Ionicons name="pricetags-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 value={title}
//                 onChangeText={setTitle}
//                 placeholder={
//                   isJobs
//                     ? "مثلاً: نیازمند برنامه‌نویس React Native"
//                     : selectedCategory
//                     ? `مثلاً: ${selectedCategory.title} در حالت خوب`
//                     : "عنوان اعلان را بنویسید"
//                 }
//                 placeholderTextColor="#b6b9bf"
//               />
//             </View>

//             <Text style={styles.label}>{isJobs ? "حقوق (اختیاری)" : "قیمت"}</Text>
//             <View style={styles.inputWrap}>
//               <Ionicons name="cash-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 value={price}
//                 onChangeText={setPrice}
//                 keyboardType={isJobs ? "default" : "numeric"}
//                 placeholder={isJobs ? "مبلغ یا توافقی" : "مبلغ به افغانی"}
//                 placeholderTextColor="#b6b9bf"
//               />
//             </View>

//             <Text style={styles.label}>{isJobs ? "محل کار" : "موقعیت"}</Text>
//             <View style={styles.inputWrap}>
//               <Ionicons name="location-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 value={location}
//                 onChangeText={setLocation}
//                 placeholder="شهر، منطقه"
//                 placeholderTextColor="#b6b9bf"
//               />
//             </View>
//           </View>

//           {/* Description */}
//           <View style={styles.card}>
//             <View style={styles.cardHeaderRow}>
//               <View style={styles.stepBadge}>
//                 <Text style={styles.stepBadgeText}>{toFarsiNum(stepDescription)}</Text>
//               </View>
//               <Text style={styles.cardHeader}>{isJobs ? "شرایط و توضیحات شغل" : "توضیحات"}</Text>
//               <Text style={styles.optionalTag}>اختیاری</Text>
//             </View>
//             <TextInput
//               style={styles.textArea}
//               value={description}
//               onChangeText={(t) => setDescription(t.slice(0, MAX_DESCRIPTION))}
//               placeholder={
//                 isJobs
//                   ? "شرح وظایف، شرایط لازم، مزایا و..."
//                   : "جزئیات، وضعیت، و هر نکته‌ای که خریدار باید بداند..."
//               }
//               placeholderTextColor="#b6b9bf"
//               multiline
//               textAlignVertical="top"
//             />
//             <Text style={styles.charCount}>{description.length}/{MAX_DESCRIPTION}</Text>
//           </View>

//           <View style={{ height: 90 }} />
//         </ScrollView>

//         {/* Sticky submit bar */}
//         <View style={styles.footer}>
//           <TouchableOpacity
//             style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
//             onPress={handleSubmit}
//             disabled={submitting}
//           >
//             <Text style={styles.submitButtonText}>
//               {submitting ? "در حال ثبت..." : "ثبت اعلان"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// function toFarsiNum(n: number) {
//   const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
//   return String(n).split("").map((d) => farsiDigits[Number(d)]).join("");
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f7f8fa" },
//   scrollContent: { padding: 16, paddingBottom: 8 },

//   header: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 18,
//     paddingBottom: 16,
//     borderBottomLeftRadius: 22,
//     borderBottomRightRadius: 22,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   headerTitle: { fontSize: 21, fontWeight: "700", color: "#1a1a1a" },
//   headerSubtitle: { fontSize: 13, color: "#9a9ea6", marginTop: 3 },

//   centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
//   lockIcon: {
//     width: 56, height: 56, borderRadius: 28, backgroundColor: "#e1f5ee",
//     justifyContent: "center", alignItems: "center", marginBottom: 16,
//   },
//   noticeTitle: { fontSize: 17, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
//   notice: { fontSize: 14, color: "#9a9ea6", textAlign: "center", marginBottom: 22, lineHeight: 20 },
//   primaryButton: { backgroundColor: "#00a884", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 10 },
//   primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },

//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 14,
//     borderWidth: 1,
//     borderColor: "#eef0f2",
//   },
//   cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
//   stepBadge: {
//     width: 24, height: 24, borderRadius: 12,
//     backgroundColor: "#e1f5ee",
//     justifyContent: "center", alignItems: "center",
//   },
//   stepBadgeText: { fontSize: 12.5, fontWeight: "700", color: "#00806a" },
//   cardHeader: { fontSize: 15, fontWeight: "700", color: "#1a1a1a", flex: 1 },
//   cardHeaderCount: { fontSize: 13, color: "#9a9ea6", fontWeight: "600" },
//   required: { fontSize: 10.5, color: "#e74c3c", fontWeight: "700" },
//   optionalTag: { fontSize: 10.5, color: "#9a9ea6", fontWeight: "600" },
//   cardHint: { fontSize: 12, color: "#9a9ea6", marginTop: 8, marginBottom: 12 },

//   categoryGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
//   categoryGridItem: { width: "25%", alignItems: "center", marginBottom: 14 },
//   categoryCircle: {
//     width: 52, height: 52, borderRadius: 26,
//     backgroundColor: "#f4f5f7",
//     justifyContent: "center", alignItems: "center",
//     marginBottom: 6,
//   },
//   categoryCircleActive: { backgroundColor: "#00a884" },
//   categoryGridLabel: { fontSize: 11, color: "#5f6570", fontWeight: "500", textAlign: "center" },
//   categoryGridLabelActive: { color: "#00a884", fontWeight: "700" },

//   imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 4 },
//   imageSlot: { position: "relative" },
//   imageThumb: { width: 76, height: 76, borderRadius: 10, backgroundColor: "#f4f5f7" },
//   mainBadge: {
//     position: "absolute", bottom: 4, left: 4, backgroundColor: "rgba(0,0,0,0.55)",
//     borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1.5,
//   },
//   mainBadgeText: { color: "#fff", fontSize: 9.5, fontWeight: "600" },
//   removeBadge: {
//     position: "absolute", top: -6, right: -6, backgroundColor: "#e74c3c",
//     width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center",
//     borderWidth: 2, borderColor: "#fff",
//   },
//   addImageBox: {
//     width: 76, height: 76, borderRadius: 10, borderWidth: 1.5, borderColor: "#00a884",
//     borderStyle: "dashed", alignItems: "center", justifyContent: "center", gap: 3,
//     backgroundColor: "#f3fbf8",
//   },
//   addImageText: { fontSize: 10.5, color: "#00a884", fontWeight: "600" },

//   label: { fontSize: 12.5, fontWeight: "600", color: "#5f6570", marginTop: 14, marginBottom: 6 },
//   inputWrap: {
//     flexDirection: "row", alignItems: "center", gap: 8,
//     borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
//     paddingHorizontal: 12, backgroundColor: "#fbfbfc",
//   },
//   inputIcon: {},
//   input: { flex: 1, paddingVertical: 12, fontSize: 14.5, color: "#1a1a1a" },

//   optionRow: { flexDirection: "row", gap: 10 },
//   optionChip: {
//     flex: 1, alignItems: "center",
//     borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
//     paddingVertical: 12, backgroundColor: "#fbfbfc",
//   },
//   optionChipActive: { backgroundColor: "#00a884", borderColor: "#00a884" },
//   optionChipText: { fontSize: 13.5, color: "#5f6570", fontWeight: "600" },
//   optionChipTextActive: { color: "#fff" },

//   jobTypeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
//   jobTypeChip: {
//     width: "47%", alignItems: "center",
//     borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
//     paddingVertical: 12, backgroundColor: "#fbfbfc",
//   },

//   textArea: {
//     borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
//     backgroundColor: "#fbfbfc", padding: 12, marginTop: 10,
//     height: 110, fontSize: 14.5, color: "#1a1a1a",
//   },
//   charCount: { fontSize: 11, color: "#c7cad1", textAlign: "left", marginTop: 6 },

//   footer: {
//     position: "absolute", bottom: 0, left: 0, right: 0,
//     backgroundColor: "#fff", padding: 16, paddingBottom: 22,
//     borderTopWidth: 1, borderTopColor: "#eef0f2",
//     elevation: 8, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: -2 },
//   },
//   submitButton: { backgroundColor: "#00a884", borderRadius: 12, paddingVertical: 15, alignItems: "center" },
//   submitButtonDisabled: { backgroundColor: "#9fd6c4" },
//   submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 15.5 },
// });

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
  Modal,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { createListing } from "../../utils/listings";
import { categories } from "../../data/categories";
import { cities } from "../../data/cities";

const MAX_IMAGES = 4;
const MAX_DESCRIPTION = 500;

const DEAL_TYPES = [
  { id: "rent", title: "اجاره" },
  { id: "mortgage", title: "رهن" },
  { id: "sale", title: "فروش" },
];

const PROPERTY_TYPES = [
  { id: "residential", title: "مسکونی" },
  { id: "commercial", title: "تجاری" },
  { id: "admin-commercial", title: "اداری و تجاری" },
];

const EMPLOYMENT_TYPES = [
  { id: "full-time", title: "تمام وقت" },
  { id: "part-time", title: "پاره وقت" },
  { id: "remote", title: "دورکار" },
  { id: "internship", title: "کارآموزی" },
];

function toFarsiNum(n: number) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).split("").map((d) => farsiDigits[Number(d)]).join("");
}

export default function PostAd() {
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [cityId, setCityId] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [dealType, setDealType] = useState<string | null>(null);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const isRealEstate = categoryId === "real-estate";
  const isJobs = categoryId === "jobs";
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const selectedCityLabel = cities.find((c) => c.id === cityId)?.title;

  const Header = ({ subtitle }: { subtitle: string }) => (
    <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
      <Text style={styles.headerTitle}>ثبت اعلان</Text>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Header subtitle="برای ثبت اعلان وارد حساب خود شوید" />
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
    if (!categoryId) {
      Alert.alert("خطا", "لطفاً دسته‌بندی را انتخاب کنید.");
      return;
    }
    if (isRealEstate && (!dealType || !propertyType)) {
      Alert.alert("خطا", "لطفاً نوع معامله و نوع ملک را انتخاب کنید.");
      return;
    }
    if (isJobs && !employmentType) {
      Alert.alert("خطا", "لطفاً نوع همکاری را انتخاب کنید.");
      return;
    }
    if (!isJobs && images.length === 0) {
      Alert.alert("خطا", "لطفاً حداقل یک عکس اضافه کنید.");
      return;
    }
    if (!title || !cityId || (!isJobs && !price)) {
      Alert.alert("خطا", "لطفاً فیلدهای الزامی را تکمیل کنید.");
      return;
    }
    setSubmitting(true);
    try {
      await createListing(
        {
          title,
          price,
          location: selectedCityLabel || "",
          address,
          description,
          category: categoryId,
          deal_type: isRealEstate ? dealType : null,
          property_type: isRealEstate ? propertyType : null,
          employment_type: isJobs ? employmentType : null,
          images,
        },
        token
      );
      Alert.alert("موفق", "اعلان شما ثبت شد.");
      setTitle(""); setPrice(""); setCityId(null); setAddress(""); setDescription(""); setImages([]);
      setCategoryId(null); setDealType(null); setPropertyType(null); setEmploymentType(null);
      router.push("/");
    } catch (err: any) {
      Alert.alert("خطا", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  let step = 1;
  const stepCategory = step++;
  const stepDetails = isRealEstate || isJobs ? step++ : null;
  const stepPhotos = isJobs ? null : step++;
  const stepBasic = step++;
  const stepDescription = step++;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
    >
      <View style={styles.container}>
        <Header subtitle="مرحله به مرحله اعلان خود را تکمیل کنید" />

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Category */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{toFarsiNum(stepCategory)}</Text>
              </View>
              <Text style={styles.cardHeader}>دسته‌بندی</Text>
              <Text style={styles.required}>الزامی</Text>
            </View>
            <Text style={styles.cardHint}>اعلان شما در کدام دسته‌بندی قرار می‌گیرد؟</Text>

            <View style={styles.categoryGrid}>
              {categories.map((c) => {
                const active = categoryId === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.categoryGridItem}
                    onPress={() => setCategoryId(c.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.categoryCircle, active && styles.categoryCircleActive]}>
                      <Ionicons name={c.icon as any} size={22} color={active ? "#fff" : "#00a884"} />
                    </View>
                    <Text style={[styles.categoryGridLabel, active && styles.categoryGridLabelActive]} numberOfLines={1}>
                      {c.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Real estate details */}
          {isRealEstate && (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{toFarsiNum(stepDetails!)}</Text>
                </View>
                <Text style={styles.cardHeader}>جزئیات ملک</Text>
                <Text style={styles.required}>الزامی</Text>
              </View>

              <Text style={styles.label}>نوع معامله</Text>
              <View style={styles.jobTypeGrid}>
                {DEAL_TYPES.map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    // style={[styles.optionChip, dealType === d.id && styles.optionChipActive]}
                    style={[styles.jobTypeChip, dealType === d.id && styles.optionChipActive]}

                    onPress={() => setDealType(d.id)}
                  >
                    <Text style={[styles.optionChipText, dealType === d.id && styles.optionChipTextActive]}>
                      {d.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>نوع ملک</Text>
              <View style={styles.jobTypeGrid}>
                {PROPERTY_TYPES.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.jobTypeChip, propertyType === p.id && styles.optionChipActive]}
                    onPress={() => setPropertyType(p.id)}
                  >
                    <Text style={[styles.optionChipText, propertyType === p.id && styles.optionChipTextActive]}>
                      {p.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Job details */}
          {isJobs && (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{toFarsiNum(stepDetails!)}</Text>
                </View>
                <Text style={styles.cardHeader}>جزئیات شغل</Text>
                <Text style={styles.required}>الزامی</Text>
              </View>

              <Text style={styles.label}>نوع همکاری</Text>
              <View style={styles.jobTypeGrid}>
                {EMPLOYMENT_TYPES.map((j) => (
                  <TouchableOpacity
                    key={j.id}
                    style={[styles.jobTypeChip, employmentType === j.id && styles.optionChipActive]}
                    onPress={() => setEmploymentType(j.id)}
                  >
                    <Text style={[styles.optionChipText, employmentType === j.id && styles.optionChipTextActive]}>
                      {j.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Photos */}
          {!isJobs && (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{toFarsiNum(stepPhotos!)}</Text>
                </View>
                <Text style={styles.cardHeader}>عکس‌ها</Text>
                <Text style={styles.required}>الزامی</Text>
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
          )}

          {/* Basic info */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{toFarsiNum(stepBasic)}</Text>
              </View>
              <Text style={styles.cardHeader}>اطلاعات اصلی</Text>
              <Text style={styles.required}>الزامی</Text>
            </View>

            <Text style={styles.label}>{isJobs ? "عنوان شغلی" : "عنوان اعلان"}</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="pricetags-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder={
                  isJobs
                    ? "مثلاً: نیازمند برنامه‌نویس React Native"
                    : selectedCategory
                    ? `مثلاً: ${selectedCategory.title}`
                    : "عنوان اعلان را بنویسید"
                }
                placeholderTextColor="#b6b9bf"
              />
            </View>

            <Text style={styles.label}>{isJobs ? "حقوق (اختیاری)" : "قیمت"}</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="cash-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType={isJobs ? "default" : "numeric"}
                placeholder={isJobs ? "مبلغ یا توافقی" : "مبلغ به افغانی"}
                placeholderTextColor="#b6b9bf"
              />
            </View>

            <Text style={styles.label}>{isJobs ? "شهر محل کار" : "شهر"}</Text>
            <TouchableOpacity style={styles.dropdownWrap} onPress={() => setCityModalVisible(true)}>
              <Ionicons name="location-outline" size={17} color="#9a9ea6" />
              <Text style={[styles.dropdownText, !selectedCityLabel && styles.dropdownPlaceholder]}>
                {selectedCityLabel || "شهر را انتخاب کنید"}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#9a9ea6" />
            </TouchableOpacity>

            <Text style={styles.label}>آدرس دقیق (اختیاری)</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="navigate-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="مثلاً: کارته سه، نزدیک مسجد"
                placeholderTextColor="#b6b9bf"
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{toFarsiNum(stepDescription)}</Text>
              </View>
              <Text style={styles.cardHeader}>{isJobs ? "شرایط و توضیحات شغل" : "توضیحات"}</Text>
              <Text style={styles.optionalTag}>اختیاری</Text>
            </View>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={(t) => setDescription(t.slice(0, MAX_DESCRIPTION))}
              placeholder={
                isJobs
                  ? "شرح وظایف، شرایط لازم، مزایا و..."
                  : "جزئیات، وضعیت، و هر نکته‌ای که خریدار باید بداند..."
              }
              placeholderTextColor="#b6b9bf"
              multiline
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length}/{MAX_DESCRIPTION}</Text>
          </View>

          <View style={{ height: 90 }} />
        </ScrollView>

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

      {/* City picker modal */}
      <Modal
        visible={cityModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCityModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setCityModalVisible(false)}
        >
          <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>شهر خود را انتخاب کنید</Text>
            {cities.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={styles.modalRow}
                onPress={() => {
                  setCityId(c.id);
                  setCityModalVisible(false);
                }}
              >
                <Ionicons
                  name={cityId === c.id ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={cityId === c.id ? "#00a884" : "#c7cad1"}
                />
                <Text style={styles.modalRowText}>{c.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  scrollContent: { padding: 16, paddingBottom: 8 },

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
  },
  headerTitle: { fontSize: 21, fontWeight: "700", color: "#1a1a1a" },
  headerSubtitle: { fontSize: 13, color: "#9a9ea6", marginTop: 3 },

  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  lockIcon: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  noticeTitle: { fontSize: 17, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
  notice: { fontSize: 14, color: "#9a9ea6", textAlign: "center", marginBottom: 22, lineHeight: 20 },
  primaryButton: { backgroundColor: "#00a884", paddingHorizontal: 28, paddingVertical: 13, borderRadius: 10 },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#eef0f2",
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepBadge: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center",
  },
  stepBadgeText: { fontSize: 12.5, fontWeight: "700", color: "#00806a" },
  cardHeader: { fontSize: 15, fontWeight: "700", color: "#1a1a1a", flex: 1 },
  cardHeaderCount: { fontSize: 13, color: "#9a9ea6", fontWeight: "600" },
  required: { fontSize: 10.5, color: "#e74c3c", fontWeight: "700" },
  optionalTag: { fontSize: 10.5, color: "#9a9ea6", fontWeight: "600" },
  cardHint: { fontSize: 12, color: "#9a9ea6", marginTop: 8, marginBottom: 12 },

  categoryGrid: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
  categoryGridItem: { width: "25%", alignItems: "center", marginBottom: 14 },
  categoryCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#f4f5f7",
    justifyContent: "center", alignItems: "center",
    marginBottom: 6,
  },
  categoryCircleActive: { backgroundColor: "#00a884" },
  categoryGridLabel: { fontSize: 11, color: "#5f6570", fontWeight: "500", textAlign: "center" },
  categoryGridLabelActive: { color: "#00a884", fontWeight: "700" },

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
  input: { flex: 1, paddingVertical: 12, fontSize: 14.5, color: "#1a1a1a" },

  dropdownWrap: {
    flexDirection: "row", alignItems: "center", gap: 8,
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#fbfbfc",
  },
  dropdownText: { flex: 1, fontSize: 14.5, color: "#1a1a1a" },
  dropdownPlaceholder: { color: "#b6b9bf" },

  optionRow: { flexDirection: "row", gap: 10 },
  optionChip: {
    flex: 1, alignItems: "center",
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
    paddingVertical: 12, backgroundColor: "#fbfbfc",
  },
  optionChipActive: { backgroundColor: "#00a884", borderColor: "#00a884" },
  optionChipText: { fontSize: 13.5, color: "#5f6570", fontWeight: "600" },
  optionChipTextActive: { color: "#fff" },

  jobTypeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  jobTypeChip: {
    width: "47%", alignItems: "center",
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
    paddingVertical: 12, backgroundColor: "#fbfbfc",
  },

  textArea: {
    borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
    backgroundColor: "#fbfbfc", padding: 12, marginTop: 10,
    height: 110, fontSize: 14.5, color: "#1a1a1a",
  },
  charCount: { fontSize: 11, color: "#c7cad1", textAlign: "left", marginTop: 6 },

  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "#fff", padding: 16, paddingBottom: 22,
    borderTopWidth: 1, borderTopColor: "#eef0f2",
    elevation: 8, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: -2 },
  },
  submitButton: { backgroundColor: "#00a884", borderRadius: 12, paddingVertical: 15, alignItems: "center" },
  submitButtonDisabled: { backgroundColor: "#9fd6c4" },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 15.5 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "70%",
  },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: "#e4e6ea",
    alignSelf: "center", marginBottom: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a", marginBottom: 14 },
  modalRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  modalRowText: { fontSize: 14.5, color: "#1a1a1a" },
});


