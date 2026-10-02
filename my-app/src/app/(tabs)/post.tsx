
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
//   Modal,
// } from "react-native";
// import { router } from "expo-router";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { useAuth } from "../../context/AuthContext";
// import { createListing } from "../../utils/listings";
// import { categories } from "../../data/categories";
// import { cities } from "../../data/cities";

// const MAX_IMAGES = 4;
// const MAX_DESCRIPTION = 500;

// const DEAL_TYPES = [
//   { id: "rent", title: "اجاره" },
//   { id: "mortgage", title: "رهن" },
//   { id: "sale", title: "فروش" },
// ];

// const PROPERTY_TYPES = [
//   { id: "residential", title: "مسکونی" },
//   { id: "commercial", title: "تجاری" },
//   { id: "admin-commercial", title: "اداری و تجاری" },
// ];

// const EMPLOYMENT_TYPES = [
//   { id: "full-time", title: "تمام وقت" },
//   { id: "part-time", title: "پاره وقت" },
//   { id: "remote", title: "دورکار" },
//   { id: "internship", title: "کارآموزی" },
// ];

// function toFarsiNum(n: number) {
//   const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
//   return String(n).split("").map((d) => farsiDigits[Number(d)]).join("");
// }

// export default function PostAd() {
//   const { user, token } = useAuth();
//   const insets = useSafeAreaInsets();
//   const [title, setTitle] = useState("");
//   const [price, setPrice] = useState("");
//   const [cityId, setCityId] = useState<string | null>(null);
//   const [address, setAddress] = useState("");
//   const [description, setDescription] = useState("");
//   const [categoryId, setCategoryId] = useState<string | null>(null);
//   const [dealType, setDealType] = useState<string | null>(null);
//   const [propertyType, setPropertyType] = useState<string | null>(null);
//   const [employmentType, setEmploymentType] = useState<string | null>(null);
//   const [images, setImages] = useState<string[]>([]);
//   const [submitting, setSubmitting] = useState(false);
//   const [cityModalVisible, setCityModalVisible] = useState(false);

//   const isRealEstate = categoryId === "real-estate";
//   const isJobs = categoryId === "jobs";
//   const selectedCategory = categories.find((c) => c.id === categoryId);
//   const selectedCityLabel = cities.find((c) => c.id === cityId)?.title;

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
//     if (!title || !cityId || (!isJobs && !price)) {
//       Alert.alert("خطا", "لطفاً فیلدهای الزامی را تکمیل کنید.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       await createListing(
//         {
//           title,
//           price,
//           location: selectedCityLabel || "",
//           address,
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
//       setTitle(""); setPrice(""); setCityId(null); setAddress(""); setDescription(""); setImages([]);
//       setCategoryId(null); setDealType(null); setPropertyType(null); setEmploymentType(null);
//       router.push("/");
//     } catch (err: any) {
//       Alert.alert("خطا", err.message);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   let step = 1;
//   const stepCategory = step++;
//   const stepDetails = isRealEstate || isJobs ? step++ : null;
//   const stepPhotos = isJobs ? null : step++;
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
//               <View style={styles.jobTypeGrid}>
//                 {DEAL_TYPES.map((d) => (
//                   <TouchableOpacity
//                     key={d.id}
//                     // style={[styles.optionChip, dealType === d.id && styles.optionChipActive]}
//                     style={[styles.jobTypeChip, dealType === d.id && styles.optionChipActive]}

//                     onPress={() => setDealType(d.id)}
//                   >
//                     <Text style={[styles.optionChipText, dealType === d.id && styles.optionChipTextActive]}>
//                       {d.title}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <Text style={styles.label}>نوع ملک</Text>
//               <View style={styles.jobTypeGrid}>
//                 {PROPERTY_TYPES.map((p) => (
//                   <TouchableOpacity
//                     key={p.id}
//                     style={[styles.jobTypeChip, propertyType === p.id && styles.optionChipActive]}
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

//           {/* Photos */}
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
//                     ? `مثلاً: ${selectedCategory.title}`
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

//             <Text style={styles.label}>{isJobs ? "شهر محل کار" : "شهر"}</Text>
//             <TouchableOpacity style={styles.dropdownWrap} onPress={() => setCityModalVisible(true)}>
//               <Ionicons name="location-outline" size={17} color="#9a9ea6" />
//               <Text style={[styles.dropdownText, !selectedCityLabel && styles.dropdownPlaceholder]}>
//                 {selectedCityLabel || "شهر را انتخاب کنید"}
//               </Text>
//               <Ionicons name="chevron-down" size={16} color="#9a9ea6" />
//             </TouchableOpacity>

//             <Text style={styles.label}>آدرس دقیق (اختیاری)</Text>
//             <View style={styles.inputWrap}>
//               <Ionicons name="navigate-outline" size={17} color="#9a9ea6" style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 value={address}
//                 onChangeText={setAddress}
//                 placeholder="مثلاً: کارته سه، نزدیک مسجد"
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

//       {/* City picker modal */}
//       <Modal
//         visible={cityModalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => setCityModalVisible(false)}
//       >
//         <TouchableOpacity
//           style={styles.modalBackdrop}
//           activeOpacity={1}
//           onPress={() => setCityModalVisible(false)}
//         >
//           <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
//             <View style={styles.modalHandle} />
//             <Text style={styles.modalTitle}>شهر خود را انتخاب کنید</Text>
//             {cities.map((c) => (
//               <TouchableOpacity
//                 key={c.id}
//                 style={styles.modalRow}
//                 onPress={() => {
//                   setCityId(c.id);
//                   setCityModalVisible(false);
//                 }}
//               >
//                 <Ionicons
//                   name={cityId === c.id ? "radio-button-on" : "radio-button-off"}
//                   size={20}
//                   color={cityId === c.id ? "#00a884" : "#c7cad1"}
//                 />
//                 <Text style={styles.modalRowText}>{c.title}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     </KeyboardAvoidingView>
//   );
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

//   dropdownWrap: {
//     flexDirection: "row", alignItems: "center", gap: 8,
//     borderWidth: 1, borderColor: "#e4e6ea", borderRadius: 10,
//     paddingHorizontal: 12, paddingVertical: 12, backgroundColor: "#fbfbfc",
//   },
//   dropdownText: { flex: 1, fontSize: 14.5, color: "#1a1a1a" },
//   dropdownPlaceholder: { color: "#b6b9bf" },

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

//   modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
//   modalSheet: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 20,
//     maxHeight: "70%",
//   },
//   modalHandle: {
//     width: 36, height: 4, borderRadius: 2, backgroundColor: "#e4e6ea",
//     alignSelf: "center", marginBottom: 16,
//   },
//   modalTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a", marginBottom: 14 },
//   modalRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
//   modalRowText: { fontSize: 14.5, color: "#1a1a1a" },
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
  StatusBar,
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
  { id: "rent", title: "اجاره", icon: "home-outline" },
  { id: "mortgage", title: "رهن", icon: "key-outline" },
  { id: "sale", title: "فروش", icon: "pricetag-outline" },
];

const PROPERTY_TYPES = [
  { id: "residential", title: "مسکونی", icon: "home-outline" },
  { id: "commercial", title: "تجاری", icon: "business-outline" },
  { id: "admin-commercial", title: "اداری و تجاری", icon: "briefcase-outline" },
];

const EMPLOYMENT_TYPES = [
  { id: "full-time", title: "تمام وقت", icon: "time-outline" },
  { id: "part-time", title: "پاره وقت", icon: "timer-outline" },
  { id: "remote", title: "دورکار", icon: "laptop-outline" },
  { id: "internship", title: "کارآموزی", icon: "school-outline" },
];

function toFarsiNum(n: number) {
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  return String(n)
    .split("")
    .map((d) => farsiDigits[Number(d)])
    .join("");
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

  const selectedCategory = categories.find(
    (c) => c.id === categoryId
  );

  const selectedCityLabel = cities.find(
    (c) => c.id === cityId
  )?.title;

  const Header = ({ subtitle }: { subtitle: string }) => (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + 10,
        },
      ]}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.headerBack}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-forward" size={21} color="#17191c" />
        </TouchableOpacity>

        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle}>ثبت اعلان</Text>
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        </View>

        <View style={styles.headerLogo}>
          <Ionicons name="add" size={21} color="#00a884" />
        </View>
      </View>
    </View>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <Header subtitle="برای ثبت اعلان وارد حساب خود شوید" />

        <View style={styles.centered}>
          <View style={styles.lockIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={28}
              color="#00a884"
            />
          </View>

          <Text style={styles.noticeTitle}>
            ابتدا وارد حساب خود شوید
          </Text>

          <Text style={styles.notice}>
            برای ثبت اعلان جدید باید وارد حساب کاربری خود شوید.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/profile")}
            activeOpacity={0.85}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color="#fff"
            />

            <Text style={styles.primaryButtonText}>
              ورود / ثبت‌نام
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const pickImages = async () => {
    if (images.length >= MAX_IMAGES) {
      Alert.alert(
        "محدودیت عکس",
        `حداکثر ${MAX_IMAGES} عکس می‌توانید اضافه کنید.`
      );
      return;
    }

    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "دسترسی لازم است",
        "برای انتخاب عکس، دسترسی به گالری را فعال کنید."
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        selectionLimit: MAX_IMAGES - images.length,
        quality: 0.75,
      });

    if (!result.canceled) {
      const newUris = result.assets.map(
        (asset) => asset.uri
      );

      setImages((prev) =>
        [...prev, ...newUris].slice(0, MAX_IMAGES)
      );
    }
  };

  const removeImage = (uri: string) => {
    setImages((prev) =>
      prev.filter((image) => image !== uri)
    );
  };

  const handleSubmit = async () => {
    if (!categoryId) {
      Alert.alert(
        "دسته‌بندی انتخاب نشده",
        "لطفاً دسته‌بندی اعلان را انتخاب کنید."
      );
      return;
    }

    if (isRealEstate && (!dealType || !propertyType)) {
      Alert.alert(
        "اطلاعات ناقص",
        "لطفاً نوع معامله و نوع ملک را انتخاب کنید."
      );
      return;
    }

    if (isJobs && !employmentType) {
      Alert.alert(
        "اطلاعات ناقص",
        "لطفاً نوع همکاری را انتخاب کنید."
      );
      return;
    }

    if (!isJobs && images.length === 0) {
      Alert.alert(
        "عکس اضافه کنید",
        "لطفاً حداقل یک عکس برای اعلان انتخاب کنید."
      );
      return;
    }

    if (
      !title ||
      !cityId ||
      (!isJobs && !price)
    ) {
      Alert.alert(
        "فیلدهای ناقص",
        "لطفاً تمام فیلدهای الزامی را تکمیل کنید."
      );
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
          employment_type: isJobs
            ? employmentType
            : null,
          images,
        },
        token
      );

      Alert.alert(
        "اعلان ثبت شد",
        "اعلان شما با موفقیت ثبت شد."
      );

      setTitle("");
      setPrice("");
      setCityId(null);
      setAddress("");
      setDescription("");
      setImages([]);
      setCategoryId(null);
      setDealType(null);
      setPropertyType(null);
      setEmploymentType(null);

      router.push("/");
    } catch (err: any) {
      Alert.alert(
        "خطا",
        err?.message || "ثبت اعلان انجام نشد."
      );
    } finally {
      setSubmitting(false);
    }
  };

  let step = 1;

  const stepCategory = step++;
  const stepDetails =
    isRealEstate || isJobs ? step++ : null;
  const stepPhotos =
    isJobs ? null : step++;
  const stepBasic = step++;
  const stepDescription = step++;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      keyboardVerticalOffset={
        Platform.OS === "ios" ? 0 : 24
      }
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <Header subtitle="اطلاعات اعلان خود را وارد کنید" />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 120 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Category */}
          <SectionCard
            step={stepCategory}
            title="دسته‌بندی"
            required
            hint="اعلان شما در کدام دسته‌بندی قرار می‌گیرد؟"
          >
            <View style={styles.categoryGrid}>
              {categories.map((category) => {
                const active =
                  categoryId === category.id;

                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      active &&
                        styles.categoryItemActive,
                    ]}
                    onPress={() =>
                      setCategoryId(category.id)
                    }
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        active &&
                          styles.categoryIconActive,
                      ]}
                    >
                      <Ionicons
                        name={category.icon as any}
                        size={23}
                        color={
                          active
                            ? "#fff"
                            : "#00a884"
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.categoryLabel,
                        active &&
                          styles.categoryLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {category.title}
                    </Text>

                    {active && (
                      <View style={styles.selectedCheck}>
                        <Ionicons
                          name="checkmark"
                          size={10}
                          color="#fff"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </SectionCard>

          {/* Real Estate */}
          {isRealEstate && (
            <SectionCard
              step={stepDetails!}
              title="جزئیات ملک"
              required
            >
              <Text style={styles.fieldLabel}>
                نوع معامله
              </Text>

              <View style={styles.optionGrid}>
                {DEAL_TYPES.map((item) => {
                  const active =
                    dealType === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.optionCard,
                        active &&
                          styles.optionCardActive,
                      ]}
                      onPress={() =>
                        setDealType(item.id)
                      }
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={
                          active
                            ? "#fff"
                            : "#00a884"
                        }
                      />

                      <Text
                        style={[
                          styles.optionText,
                          active &&
                            styles.optionTextActive,
                        ]}
                      >
                        {item.title}
                      </Text>

                      {active && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#fff"
                          style={styles.optionCheck}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text
                style={[
                  styles.fieldLabel,
                  { marginTop: 18 },
                ]}
              >
                نوع ملک
              </Text>

              <View style={styles.optionGrid}>
                {PROPERTY_TYPES.map((item) => {
                  const active =
                    propertyType === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.optionCard,
                        active &&
                          styles.optionCardActive,
                      ]}
                      onPress={() =>
                        setPropertyType(item.id)
                      }
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={
                          active
                            ? "#fff"
                            : "#00a884"
                        }
                      />

                      <Text
                        style={[
                          styles.optionText,
                          active &&
                            styles.optionTextActive,
                        ]}
                      >
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </SectionCard>
          )}

          {/* Jobs */}
          {isJobs && (
            <SectionCard
              step={stepDetails!}
              title="جزئیات شغل"
              required
            >
              <Text style={styles.fieldLabel}>
                نوع همکاری
              </Text>

              <View style={styles.optionGrid}>
                {EMPLOYMENT_TYPES.map((item) => {
                  const active =
                    employmentType === item.id;

                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.optionCard,
                        active &&
                          styles.optionCardActive,
                      ]}
                      onPress={() =>
                        setEmploymentType(item.id)
                      }
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={
                          active
                            ? "#fff"
                            : "#00a884"
                        }
                      />

                      <Text
                        style={[
                          styles.optionText,
                          active &&
                            styles.optionTextActive,
                        ]}
                      >
                        {item.title}
                      </Text>

                      {active && (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color="#fff"
                          style={styles.optionCheck}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </SectionCard>
          )}

          {/* Photos */}
          {!isJobs && (
            <SectionCard
              step={stepPhotos!}
              title="تصاویر"
              required
              count={`${toFarsiNum(
                images.length
              )}/${toFarsiNum(MAX_IMAGES)}`}
              hint="اولین تصویر به‌عنوان تصویر اصلی اعلان نمایش داده می‌شود."
            >
              <View style={styles.imageGrid}>
                {images.map((uri, index) => (
                  <View
                    key={uri}
                    style={styles.imageContainer}
                  >
                    <Image
                      source={{ uri }}
                      style={styles.imageThumb}
                    />

                    {index === 0 && (
                      <View style={styles.mainImageBadge}>
                        <Ionicons
                          name="star"
                          size={10}
                          color="#fff"
                        />
                        <Text style={styles.mainImageText}>
                          اصلی
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.removeImage}
                      onPress={() =>
                        removeImage(uri)
                      }
                    >
                      <Ionicons
                        name="close"
                        size={15}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                {images.length < MAX_IMAGES && (
                  <TouchableOpacity
                    style={styles.addImage}
                    onPress={pickImages}
                    activeOpacity={0.75}
                  >
                    <View style={styles.addImageIcon}>
                      <Ionicons
                        name="camera-outline"
                        size={25}
                        color="#00a884"
                      />
                    </View>

                    <Text style={styles.addImageText}>
                      افزودن عکس
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </SectionCard>
          )}

          {/* Basic information */}
          <SectionCard
            step={stepBasic}
            title="اطلاعات اصلی"
            required
          >
            <FieldLabel
              icon="text-outline"
              text={
                isJobs
                  ? "عنوان شغلی"
                  : "عنوان اعلان"
              }
            />

            <Input
              icon="pricetags-outline"
              value={title}
              onChangeText={setTitle}
              placeholder={
                isJobs
                  ? "مثلاً: نیازمند برنامه‌نویس React Native"
                  : selectedCategory
                  ? `مثلاً: ${selectedCategory.title}`
                  : "عنوان اعلان را بنویسید"
              }
            />

            <FieldLabel
              icon="cash-outline"
              text={
                isJobs
                  ? "حقوق"
                  : "قیمت"
              }
              optional={isJobs}
            />

            <Input
              icon="cash-outline"
              value={price}
              onChangeText={setPrice}
              keyboardType={
                isJobs ? "default" : "numeric"
              }
              placeholder={
                isJobs
                  ? "مثلاً ۱۵٬۰۰۰ افغانی یا توافقی"
                  : "مبلغ به افغانی"
              }
            />

            <FieldLabel
              icon="location-outline"
              text={
                isJobs
                  ? "شهر محل کار"
                  : "شهر"
              }
            />

            <TouchableOpacity
              style={styles.dropdown}
              onPress={() =>
                setCityModalVisible(true)
              }
              activeOpacity={0.8}
            >
              <View style={styles.dropdownIcon}>
                <Ionicons
                  name="location-outline"
                  size={18}
                  color="#00a884"
                />
              </View>

              <Text
                style={[
                  styles.dropdownText,
                  !selectedCityLabel &&
                    styles.dropdownPlaceholder,
                ]}
              >
                {selectedCityLabel ||
                  "شهر را انتخاب کنید"}
              </Text>

              <Ionicons
                name="chevron-down"
                size={18}
                color="#8d929a"
              />
            </TouchableOpacity>

            <FieldLabel
              icon="navigate-outline"
              text="آدرس دقیق"
              optional
            />

            <Input
              icon="navigate-outline"
              value={address}
              onChangeText={setAddress}
              placeholder="مثلاً: کارته سه، نزدیک مسجد"
            />
          </SectionCard>

          {/* Description */}
          <SectionCard
            step={stepDescription}
            title={
              isJobs
                ? "شرایط و توضیحات شغل"
                : "توضیحات"
            }
            optional
          >
            <View style={styles.descriptionHeader}>
              <Ionicons
                name="document-text-outline"
                size={17}
                color="#00a884"
              />

              <Text style={styles.descriptionHint}>
                اطلاعات بیشتری درباره اعلان بنویسید
              </Text>
            </View>

            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={(text) =>
                setDescription(
                  text.slice(
                    0,
                    MAX_DESCRIPTION
                  )
                )
              }
              placeholder={
                isJobs
                  ? "شرح وظایف، شرایط لازم، مزایا و..."
                  : "جزئیات، وضعیت، امکانات و هر نکته‌ای که خریدار باید بداند..."
              }
              placeholderTextColor="#b2b6bd"
              multiline
              textAlignVertical="top"
            />

            <View style={styles.descriptionFooter}>
              <Text style={styles.descriptionTip}>
                توضیحات دقیق‌تر باعث می‌شود کاربران اطلاعات بیشتری داشته باشند.
              </Text>

              <Text style={styles.charCount}>
                {toFarsiNum(description.length)}
                {" / "}
                {toFarsiNum(MAX_DESCRIPTION)}
              </Text>
            </View>
          </SectionCard>

          {/* Preview tip */}
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons
                name="bulb-outline"
                size={20}
                color="#00a884"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>
                نکته
              </Text>

              <Text style={styles.tipText}>
                عکس‌های واضح، عنوان مشخص و توضیحات کامل می‌تواند اعلان شما را برای کاربران قابل‌فهم‌تر کند.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Submit */}
        <View
          style={[
            styles.footer,
            {
              paddingBottom:
                Math.max(insets.bottom, 12),
            },
          ]}
        >
          <View style={styles.footerInfo}>
            <View style={styles.footerIcon}>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#00a884"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.footerTitle}>
                آماده ثبت اعلان؟
              </Text>

              <Text style={styles.footerSubtitle}>
                اطلاعات واردشده را بررسی کنید.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>
              {submitting
                ? "در حال ثبت..."
                : "ثبت اعلان"}
            </Text>

            {!submitting && (
              <Ionicons
                name="arrow-back"
                size={19}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* City modal */}
      <Modal
        visible={cityModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setCityModalVisible(false)
        }
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() =>
              setCityModalVisible(false)
            }
          />

          <View
            style={[
              styles.modalSheet,
              {
                paddingBottom:
                  Math.max(
                    insets.bottom,
                    18
                  ),
              },
            ]}
          >
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View style={styles.modalTitleIcon}>
                <Ionicons
                  name="location"
                  size={20}
                  color="#00a884"
                />
              </View>

              <View>
                <Text style={styles.modalTitle}>
                  انتخاب شهر
                </Text>

                <Text style={styles.modalSubtitle}>
                  شهر محل اعلان را انتخاب کنید
                </Text>
              </View>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.cityList}
            >
              {cities.map((city) => {
                const selected =
                  cityId === city.id;

                return (
                  <TouchableOpacity
                    key={city.id}
                    style={[
                      styles.cityRow,
                      selected &&
                        styles.cityRowSelected,
                    ]}
                    onPress={() => {
                      setCityId(city.id);
                      setCityModalVisible(false);
                    }}
                    activeOpacity={0.75}
                  >
                    <View
                      style={[
                        styles.cityIcon,
                        selected &&
                          styles.cityIconSelected,
                      ]}
                    >
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color={
                          selected
                            ? "#fff"
                            : "#00a884"
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.cityText,
                        selected &&
                          styles.cityTextSelected,
                      ]}
                    >
                      {city.title}
                    </Text>

                    <Ionicons
                      name={
                        selected
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={21}
                      color={
                        selected
                          ? "#00a884"
                          : "#d4d7dc"
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

/* ---------------- Components ---------------- */

function SectionCard({
  step,
  title,
  required,
  optional,
  count,
  hint,
  children,
}: {
  step: number;
  title: string;
  required?: boolean;
  optional?: boolean;
  count?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={styles.stepCircle}>
          <Text style={styles.stepText}>
            {toFarsiNum(step)}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <View style={{ flex: 1 }} />

        {required && (
          <View style={styles.requiredBadge}>
            <Text style={styles.requiredText}>
              الزامی
            </Text>
          </View>
        )}

        {optional && (
          <View style={styles.optionalBadge}>
            <Text style={styles.optionalText}>
              اختیاری
            </Text>
          </View>
        )}

        {count && (
          <Text style={styles.sectionCount}>
            {count}
          </Text>
        )}
      </View>

      {hint && (
        <Text style={styles.sectionHint}>
          {hint}
        </Text>
      )}

      {children}
    </View>
  );
}

function FieldLabel({
  icon,
  text,
  optional,
}: {
  icon: any;
  text: string;
  optional?: boolean;
}) {
  return (
    <View style={styles.fieldLabelRow}>
      <Ionicons
        name={icon}
        size={15}
        color="#00a884"
      />

      <Text style={styles.fieldLabel}>
        {text}
      </Text>

      {optional && (
        <Text style={styles.fieldOptional}>
          اختیاری
        </Text>
      )}
    </View>
  );
}

function Input({
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  icon: any;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: any;
}) {
  return (
    <View style={styles.inputWrap}>
      <Ionicons
        name={icon}
        size={18}
        color="#8d929a"
      />

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#b2b6bd"
        keyboardType={keyboardType}
      />
    </View>
  );
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7f8",
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 4,
  },

  /* Header */

  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingBottom: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#edf0f1",
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  headerBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f5f6",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextWrap: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#151719",
  },

  headerSubtitle: {
    fontSize: 11.5,
    color: "#8d929a",
    marginTop: 2,
  },

  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e9f8f3",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Login */

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },

  lockIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#e6f7f2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  noticeTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#17191c",
    marginBottom: 7,
  },

  notice: {
    fontSize: 13.5,
    color: "#8d929a",
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 24,
  },

  primaryButton: {
    backgroundColor: "#00a884",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 14.5,
  },

  /* Cards */

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginTop: 13,
    borderWidth: 1,
    borderColor: "#e9edef",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 28,
  },

  stepCircle: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#e5f7f2",
    justifyContent: "center",
    alignItems: "center",
  },

  stepText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#00896f",
  },

  sectionTitle: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#17191c",
    marginLeft: 9,
  },

  sectionHint: {
    color: "#91969e",
    fontSize: 11.5,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 13,
  },

  requiredBadge: {
    backgroundColor: "#fff0ee",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },

  requiredText: {
    color: "#d94c3d",
    fontSize: 9.5,
    fontWeight: "700",
  },

  optionalBadge: {
    backgroundColor: "#f1f3f5",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },

  optionalText: {
    color: "#858a92",
    fontSize: 9.5,
    fontWeight: "700",
  },

  sectionCount: {
    color: "#858a92",
    fontSize: 12,
    fontWeight: "700",
  },

  /* Categories */

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 2,
  },

  categoryItem: {
    width: "25%",
    alignItems: "center",
    paddingVertical: 7,
    position: "relative",
  },

  categoryItemActive: {
    backgroundColor: "#f0faf7",
    borderRadius: 13,
  },

  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: "#f3f5f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },

  categoryIconActive: {
    backgroundColor: "#00a884",
  },

  categoryLabel: {
    color: "#666b73",
    fontSize: 10.8,
    fontWeight: "600",
    textAlign: "center",
  },

  categoryLabelActive: {
    color: "#008c73",
    fontWeight: "800",
  },

  selectedCheck: {
    position: "absolute",
    top: 3,
    right: 7,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#00a884",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  /* Options */

  fieldLabel: {
    fontSize: 12,
    color: "#555b63",
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 7,
  },

  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 13,
    marginBottom: 7,
  },

  fieldOptional: {
    marginLeft: 4,
    color: "#a0a4ab",
    fontSize: 10,
  },

  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  optionCard: {
    width: "48%",
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4e7e9",
    backgroundColor: "#fafbfb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    position: "relative",
  },

  optionCardActive: {
    backgroundColor: "#00a884",
    borderColor: "#00a884",
  },

  optionText: {
    color: "#565c64",
    fontSize: 12.5,
    fontWeight: "700",
  },

  optionTextActive: {
    color: "#fff",
  },

  optionCheck: {
    position: "absolute",
    right: 7,
    top: 7,
  },

  /* Images */

  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 2,
  },

  imageContainer: {
    width: 78,
    height: 78,
    borderRadius: 12,
    overflow: "visible",
    position: "relative",
  },

  imageThumb: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#f0f2f3",
  },

  mainImageBadge: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  mainImageText: {
    color: "#fff",
    fontSize: 8.5,
    fontWeight: "700",
  },

  removeImage: {
    position: "absolute",
    right: -6,
    top: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#e74c3c",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  addImage: {
    width: 78,
    height: 78,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#00a884",
    borderStyle: "dashed",
    backgroundColor: "#f0faf7",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  addImageIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#e0f5ef",
    alignItems: "center",
    justifyContent: "center",
  },

  addImageText: {
    color: "#008e74",
    fontSize: 9.5,
    fontWeight: "700",
  },

  /* Inputs */

  inputWrap: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#e1e4e7",
    borderRadius: 11,
    backgroundColor: "#fafbfb",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  input: {
    flex: 1,
    color: "#17191c",
    fontSize: 13.5,
    paddingVertical: 11,
  },

  dropdown: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#e1e4e7",
    borderRadius: 11,
    backgroundColor: "#fafbfb",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  dropdownIcon: {
    width: 31,
    height: 31,
    borderRadius: 9,
    backgroundColor: "#e4f7f2",
    alignItems: "center",
    justifyContent: "center",
  },

  dropdownText: {
    flex: 1,
    color: "#17191c",
    fontSize: 13.5,
  },

  dropdownPlaceholder: {
    color: "#adb1b7",
  },

  /* Description */

  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 11,
    marginBottom: 3,
  },

  descriptionHint: {
    fontSize: 11,
    color: "#969ba2",
  },

  textArea: {
    height: 125,
    borderWidth: 1,
    borderColor: "#e1e4e7",
    borderRadius: 12,
    backgroundColor: "#fafbfb",
    padding: 12,
    marginTop: 9,
    fontSize: 13.5,
    color: "#17191c",
    lineHeight: 21,
  },

  descriptionFooter: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 7,
    gap: 8,
  },

  descriptionTip: {
    flex: 1,
    fontSize: 9.5,
    color: "#a1a5ab",
    lineHeight: 15,
  },

  charCount: {
    fontSize: 10,
    color: "#9a9fa6",
    fontWeight: "700",
  },

  /* Tip */

  tipCard: {
    marginTop: 13,
    backgroundColor: "#eaf8f4",
    borderRadius: 15,
    padding: 13,
    flexDirection: "row",
    gap: 10,
    borderWidth: 1,
    borderColor: "#d5f0e8",
  },

  tipIcon: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: "#d8f2eb",
    alignItems: "center",
    justifyContent: "center",
  },

  tipTitle: {
    color: "#087a64",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 3,
  },

  tipText: {
    color: "#548277",
    fontSize: 10.5,
    lineHeight: 16,
  },

  /* Footer */

  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e8ebed",
    paddingHorizontal: 15,
    paddingTop: 11,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: -3,
    },
  },

  footerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 9,
    gap: 9,
  },

  footerIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#e8f8f3",
    alignItems: "center",
    justifyContent: "center",
  },

  footerTitle: {
    color: "#202327",
    fontSize: 11.5,
    fontWeight: "800",
  },

  footerSubtitle: {
    color: "#999ea5",
    fontSize: 9.5,
    marginTop: 2,
  },

  submitButton: {
    backgroundColor: "#00a884",
    minHeight: 51,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  submitButtonDisabled: {
    backgroundColor: "#9ed7c8",
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 14.5,
    fontWeight: "800",
  },

  /* Modal */

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.42)",
    justifyContent: "flex-end",
  },

  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 18,
    paddingTop: 9,
    maxHeight: "78%",
  },

  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 3,
    backgroundColor: "#dfe2e4",
    alignSelf: "center",
    marginBottom: 18,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  modalTitleIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#e7f7f2",
    alignItems: "center",
    justifyContent: "center",
  },

  modalTitle: {
    color: "#17191c",
    fontSize: 16,
    fontWeight: "800",
  },

  modalSubtitle: {
    color: "#969ba2",
    fontSize: 10.5,
    marginTop: 2,
  },

  cityList: {
    marginBottom: 4,
  },

  cityRow: {
    minHeight: 55,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    marginBottom: 5,
    gap: 10,
  },

  cityRowSelected: {
    backgroundColor: "#eff9f6",
  },

  cityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f1f3f4",
    alignItems: "center",
    justifyContent: "center",
  },

  cityIconSelected: {
    backgroundColor: "#00a884",
  },

  cityText: {
    flex: 1,
    color: "#383d43",
    fontSize: 13.5,
    fontWeight: "600",
  },

  cityTextSelected: {
    color: "#008a70",
    fontWeight: "800",
  },
});