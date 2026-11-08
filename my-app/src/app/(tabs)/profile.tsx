

// import { useState } from "react";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
//   ActivityIndicator,
// } from "react-native";
// import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../utils/profiles";
export default function Profile() {
  // const {
  //   user,
  //   loading,
  //   login,
  //   register,
  //   logout,
  // } = useAuth();
  const {
    user,
    token,
    loading,
    login,
    register,
    logout,
  } = useAuth();

  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<
    "login" | "register"
  >("login");

  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);
  const [me, setMe] = useState<any>(null);

  // reload whenever this tab is focused (e.g. after editing the profile)
  useFocusEffect(
    useCallback(() => {
      if (!user || !token) {
        setMe(null);
        return;
      }
      let active = true;
      getProfile(user.id, token)
        .then((p) => active && setMe(p))
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [user?.id, token])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#00a884"
        />
      </View>
    );
  }

  /*
   * =====================================================
   * LOGGED-IN PROFILE
   * =====================================================
   */

  if (user) {
    const displayName =
      user.full_name || "کاربر Azdoor";

    const avatarLetter =
      displayName.charAt(0);

    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom:
              insets.bottom + 30,
          }}
        >
          {/* ========================================= */}
          {/* PROFILE HEADER */}
          {/* ========================================= */}

          <View
            style={[
              styles.profileHeader,
              {
                paddingTop:
                  insets.top + 12,
              },
            ]}
          >
            {/* TOP BAR */}

            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  Alert.alert(
                    "تنظیمات",
                    "تنظیمات حساب کاربری به‌زودی اضافه می‌شود."
                  )
                }
              >
                <Ionicons
                  name="settings-outline"
                  size={23}
                  color="#222"
                />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>
                پروفایل
              </Text>

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() =>
                  Alert.alert(
                    "اعلان‌ها",
                    "اعلان جدیدی ندارید."
                  )
                }
              >
                <Ionicons
                  name="notifications-outline"
                  size={23}
                  color="#222"
                />
              </TouchableOpacity>
            </View>

            {/* PROFILE INFO */}

            <View style={styles.profileInfo}>
              {/* AVATAR */}
                          <View style={styles.avatarLarge}>
                {me?.avatar ? (
                  <Image
                    source={{ uri: me.avatar }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarLargeText}>
                    {avatarLetter}
                  </Text>
                )}

                <View
                  style={styles.onlineDot}
                />
              </View>

              {/* <View style={styles.avatarLarge}>
                <Text style={styles.avatarLargeText}>
                  {avatarLetter}
                </Text>

                <View
                  style={styles.onlineDot}
                />
              </View> */}

              {/* NAME */}

              <Text style={styles.profileName}>
                {displayName}
              </Text>

              {/* PHONE */}
            

              {/* <Text style={styles.profilePhone}>
                {user.phone}
              </Text> */}
            
                          <Text style={styles.profilePhone}>
                {user.phone}
              </Text>

              {me?.account_type === "agent" && (
                <View style={styles.agentBadge}>
                  <Ionicons
                    name="briefcase-outline"
                    size={12}
                    color="#00a884"
                  />
                  <Text style={styles.agentBadgeText}>
                    مشاور املاک
                    {me.agency_name ? ` • ${me.agency_name}` : ""}
                  </Text>
                </View>
              )}

              {!!me?.bio && (
                <Text style={styles.profileBio}>{me.bio}</Text>
              )}


              {/* EDIT BUTTON */}

              <TouchableOpacity
                style={styles.editProfileButton}
                activeOpacity={0.8}
                onPress={() => router.push("/edit-profile")}
                // onPress={() =>
                //   Alert.alert(
                //     "ویرایش پروفایل",
                //     "ویرایش پروفایل به‌زودی اضافه می‌شود."
                //   )
                // }
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color="#222"
                />

                <Text
                  style={styles.editProfileText}
                >
                  ویرایش پروفایل
                </Text>
              </TouchableOpacity>
            </View>

            {/* ========================================= */}
            {/* STATS */}
            {/* ========================================= */}

            {/* <View style={styles.statsCard}>
              <StatItem
                value="0"
                label="آگهی"
              />

              <View style={styles.statDivider} />

              <StatItem
                value="0"
                label="ذخیره‌شده"
              />

              <View style={styles.statDivider} />

              <StatItem
                value="0"
                label="بازدید"
              />
            </View> */}
                      <View style={styles.statsCard}>
              <StatItem
                value={me?.listings_count ?? 0}
                label="آگهی"
                onPress={() => router.push("/my-listings")}
              />

              <View style={styles.statDivider} />

              <StatItem
                value={me?.followers_count ?? 0}
                label="دنبال‌کننده"
                onPress={() =>
                  router.push(`/user-list?id=${user.id}&type=followers`)
                }
              />

              <View style={styles.statDivider} />

              <StatItem
                value={me?.following_count ?? 0}
                label="دنبال‌شده"
                onPress={() =>
                  router.push(`/user-list?id=${user.id}&type=following`)
                }
              />
            </View>
          </View>

          {/* ==================
          ======================= */}
          {/* MY ACTIVITY */}
          {/* ========================================= */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              فعالیت من
            </Text>

            <MenuCard
              icon="home-outline"
              iconBackground="#e8f7f2"
              iconColor="#00a884"
              title="آگهی‌های من"
              subtitle="مدیریت خانه‌ها و ملک‌های شما"
              onPress={() =>
                router.push("/my-listings")
              }
            />

            {/* <MenuCard
              icon="heart-outline"
              iconBackground="#fff0f1"
              iconColor="#e74c3c"
              title="ذخیره‌شده‌ها"
              subtitle="آگهی‌هایی که ذخیره کرده‌اید"
              onPress={() =>
                Alert.alert(
                  "به‌زودی",
                  "بخش آگهی‌های ذخیره‌شده در حال توسعه است."
                )
              }
            /> */}

            <MenuCard
  icon="heart-outline"
  iconBackground="#fff0f1"
  iconColor="#e74c3c"
  title="ذخیره‌شده‌ها"
  subtitle="آگهی‌هایی که ذخیره کرده‌اید"
  onPress={() => router.push("/favorites")}
/>
            <MenuCard
              icon="person-circle-outline"
              iconBackground="#eef4ff"
              iconColor="#3478f6"
              title="پروفایل عمومی من"
              subtitle="صفحه‌ای که دیگران می‌بینند و دنبال می‌کنند"
              onPress={() => router.push(`/user/${user.id}`)}
            />
          </View>

          {/* ========================================= */}
          {/* ACCOUNT */}
          {/* ========================================= */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              حساب کاربری
            </Text>

            <MenuCard
              icon="person-outline"
              iconBackground="#eef4ff"
              iconColor="#3478f6"
              title="اطلاعات حساب"
              subtitle="نام و شماره تلفن"
              onPress={() =>
                Alert.alert(
                  "اطلاعات حساب",
                  `${displayName}\n${user.phone}`
                )
              }
            />

            <MenuCard
              icon="help-circle-outline"
              iconBackground="#f4f0ff"
              iconColor="#7357d9"
              title="راهنما و پشتیبانی"
              subtitle="کمک و سوالات متداول"
              onPress={() =>
                Alert.alert(
                  "راهنما",
                  "بخش راهنما و پشتیبانی به‌زودی اضافه می‌شود."
                )
              }
            />

            <MenuCard
              icon="shield-checkmark-outline"
              iconBackground="#f0f7ff"
              iconColor="#3478f6"
              title="حریم خصوصی"
              subtitle="امنیت و حریم خصوصی حساب شما"
              onPress={() =>
                Alert.alert(
                  "حریم خصوصی",
                  "سیاست حریم خصوصی به‌زودی اضافه می‌شود."
                )
              }
            />
          </View>

          {/* ========================================= */}
          {/* LOGOUT */}
          {/* ========================================= */}

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "خروج از حساب",
                "آیا مطمئن هستید که می‌خواهید خارج شوید؟",
                [
                  {
                    text: "لغو",
                    style: "cancel",
                  },
                  {
                    text: "خروج",
                    style: "destructive",
                    onPress: logout,
                  },
                ]
              )
            }
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#e74c3c"
            />

            <Text style={styles.logoutText}>
              خروج از حساب
            </Text>
          </TouchableOpacity>

          {/* VERSION */}

          <Text style={styles.version}>
            Azdoor • نسخه 1.0.0
          </Text>
        </ScrollView>
      </View>
    );
  }

  /*
   * =====================================================
   * LOGIN / REGISTER
   * =====================================================
   */

  const handleSubmit = async () => {
    if (
      !phone.trim() ||
      !password.trim() ||
      (mode === "register" &&
        !fullName.trim())
    ) {
      Alert.alert(
        "خطا",
        "لطفاً همه فیلدها را پر کنید."
      );

      return;
    }

    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(
          phone.trim(),
          password
        );
      } else {
        await register(
          phone.trim(),
          fullName.trim(),
          password
        );
      }
    } catch (err: any) {
      Alert.alert(
        "خطا",
        err?.message ||
          "عملیات ناموفق بود."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.authContainer,
          {
            paddingTop:
              insets.top + 35,
            paddingBottom:
              insets.bottom + 30,
          },
        ]}
      >
        {/* ========================================= */}
        {/* LOGO */}
        {/* ========================================= */}

        <View style={styles.authLogo}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="home"
              size={28}
              color="#fff"
            />
          </View>

          <Text style={styles.logoText}>
            Azdoor
          </Text>

          <Text style={styles.logoSubtitle}>
            بازار خانه و ملک افغانستان
          </Text>
        </View>

        {/* ========================================= */}
        {/* AUTH CARD */}
        {/* ========================================= */}

        <View style={styles.authCard}>
          <Text style={styles.authTitle}>
            {mode === "login"
              ? "خوش آمدید 👋"
              : "ایجاد حساب کاربری"}
          </Text>

          <Text style={styles.authSubtitle}>
            {mode === "login"
              ? "برای ادامه وارد حساب خود شوید"
              : "برای استفاده از Azdoor یک حساب بسازید"}
          </Text>

          {/* ========================================= */}
          {/* PHONE */}
          {/* ========================================= */}

          <Text style={styles.label}>
            شماره تلفن
          </Text>

          <View style={styles.inputWrap}>
            <Ionicons
              name="call-outline"
              size={19}
              color="#9a9ea6"
            />

            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="۰۷xxxxxxxx"
              placeholderTextColor="#b6b9bf"
              textAlign="right"
              autoCapitalize="none"
            />
          </View>

          {/* ========================================= */}
          {/* NAME */}
          {/* ========================================= */}

          {mode === "register" && (
            <>
              <Text style={styles.label}>
                نام کامل
              </Text>

              <View style={styles.inputWrap}>
                <Ionicons
                  name="person-outline"
                  size={19}
                  color="#9a9ea6"
                />

                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="نام و تخلص"
                  placeholderTextColor="#b6b9bf"
                  textAlign="right"
                />
              </View>
            </>
          )}

          {/* ========================================= */}
          {/* PASSWORD */}
          {/* ========================================= */}

          <Text style={styles.label}>
            رمز عبور
          </Text>

          <View style={styles.inputWrap}>
            <Ionicons
              name="lock-closed-outline"
              size={19}
              color="#9a9ea6"
            />

            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              placeholderTextColor="#b6b9bf"
              textAlign="right"
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={20}
                color="#8d929b"
              />
            </TouchableOpacity>
          </View>

          {/* FORGOT */}

          {mode === "login" && (
            <TouchableOpacity
              style={styles.forgotButton}
              onPress={() =>
                Alert.alert(
                  "فراموشی رمز",
                  "بازیابی رمز عبور به‌زودی اضافه می‌شود."
                )
              }
            >
              <Text
                style={styles.forgotText}
              >
                رمز عبور را فراموش کرده‌اید؟
              </Text>
            </TouchableOpacity>
          )}

          {/* ========================================= */}
          {/* SUBMIT */}
          {/* ========================================= */}

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
            {submitting ? (
              <ActivityIndicator
                color="#fff"
              />
            ) : (
              <>
                <Text
                  style={styles.submitText}
                >
                  {mode === "login"
                    ? "ورود به حساب"
                    : "ایجاد حساب"}
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#fff"
                />
              </>
            )}
          </TouchableOpacity>

          {/* ========================================= */}
          {/* SWITCH MODE */}
          {/* ========================================= */}

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() =>
              setMode(
                mode === "login"
                  ? "register"
                  : "login"
              )
            }
          >
            <Text style={styles.switchText}>
              {mode === "login"
                ? "حساب ندارید؟ "
                : "قبلاً حساب ساخته‌اید؟ "}
            </Text>

            <Text
              style={styles.switchAction}
            >
              {mode === "login"
                ? "ثبت‌نام کنید"
                : "وارد شوید"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <Text style={styles.authFooter}>
          با استفاده از Azdoor می‌توانید خانه‌ها
          و ملک‌های موردنظر خود را پیدا کنید.
        </Text>
      </ScrollView>
    </View>
  );
}

/*
 * =====================================================
 * STAT ITEM
 * =====================================================
 */

// function StatItem({
//   value,
//   label,
// }: {
//   value: string;
//   label: string;
// }) {
//   return (
//     <View style={styles.statItem}>
//       <Text style={styles.statValue}>
//         {value}
//       </Text>

//       <Text style={styles.statLabel}>
//         {label}
//       </Text>
//     </View>
//   );
// }





function StatItem({
  value,
  label,
  onPress,
}: {
  value: number | string;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.statItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

/*
 * =====================================================
 * MENU CARD
 * =====================================================
 */

function MenuCard({
  icon,
  iconBackground,
  iconColor,
  title,
  subtitle,
  onPress,
}: {
  icon: any;
  iconBackground: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.menuCard}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <View
        style={[
          styles.menuIcon,
          {
            backgroundColor:
              iconBackground,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={21}
          color={iconColor}
        />
      </View>

      <View style={styles.menuInfo}>
        <Text style={styles.menuTitle}>
          {title}
        </Text>

        <Text style={styles.menuSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-back"
        size={19}
        color="#bfc3ca"
      />
    </TouchableOpacity>
  );
}

/*
 * =====================================================
 * STYLES
 * =====================================================
 */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f8fa",
  },

  /*
   * ===================================================
   * PROFILE
   * ===================================================
   */

  profileHeader: {
    backgroundColor: "#fff",

    paddingHorizontal: 16,
    paddingBottom: 20,

    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },

  topBar: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 24,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#171717",
  },

  iconButton: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "#f5f6f7",

    justifyContent: "center",
    alignItems: "center",
  },

  profileInfo: {
    alignItems: "center",
  },

  avatarLarge: {
    width: 92,
    height: 92,

    borderRadius: 46,

    backgroundColor: "#00a884",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 4,
    borderColor: "#e3f7f0",

    position: "relative",
  },

  avatarLargeText: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "800",
  },

  onlineDot: {
    position: "absolute",

    width: 17,
    height: 17,

    borderRadius: 9,

    backgroundColor: "#2ecc71",

    right: 2,
    bottom: 5,

    borderWidth: 3,
    borderColor: "#fff",
  },

  profileName: {
    color: "#171717",

    fontSize: 21,
    fontWeight: "800",

    marginTop: 11,
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },

  agentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#e8f7f2",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 8,
  },

  agentBadgeText: {
    color: "#00a884",
    fontSize: 12,
    fontWeight: "700",
  },

  profileBio: {
    color: "#4a4f57",
    fontSize: 13.5,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 12,
  },

  profilePhone: {
    color: "#8d929b",

    fontSize: 13,

    marginTop: 3,
  },

  editProfileButton: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 6,

    borderWidth: 1,
    borderColor: "#dfe2e6",

    borderRadius: 9,

    paddingHorizontal: 16,
    paddingVertical: 8,

    marginTop: 12,
  },

  editProfileText: {
    color: "#292929",

    fontSize: 12.5,
    fontWeight: "700",
  },

  /*
   * ===================================================
   * STATS
   * ===================================================
   */

  statsCard: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-around",

    backgroundColor: "#f8faf9",

    borderRadius: 16,

    marginTop: 22,

    paddingVertical: 15,

    borderWidth: 1,
    borderColor: "#edf0ef",
  },

  statItem: {
    alignItems: "center",
    flex: 1,
  },

  statValue: {
    color: "#171717",

    fontSize: 18,
    fontWeight: "800",
  },

  statLabel: {
    color: "#8d929b",

    fontSize: 11,

    marginTop: 3,
  },

  statDivider: {
    width: 1,
    height: 30,

    backgroundColor: "#e1e4e3",
  },

  /*
   * ===================================================
   * SECTIONS
   * ===================================================
   */

  section: {
    paddingHorizontal: 16,

    marginTop: 23,
  },

  sectionTitle: {
    color: "#242424",

    fontSize: 16,
    fontWeight: "800",

    marginBottom: 10,

    textAlign: "right",
  },

  /*
   * ===================================================
   * MENU
   * ===================================================
   */

  menuCard: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#fff",

    borderRadius: 15,

    padding: 13,

    marginBottom: 9,

    borderWidth: 1,
    borderColor: "#edf0f2",
  },

  menuIcon: {
    width: 43,
    height: 43,

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 12,
  },

  menuInfo: {
    flex: 1,
  },

  menuTitle: {
    color: "#222",

    fontSize: 14.5,
    fontWeight: "700",

    textAlign: "left",
  },

  menuSubtitle: {
    color: "#9a9ea6",

    fontSize: 11.5,

    marginTop: 3,

    textAlign: "left",
  },

  /*
   * ===================================================
   * LOGOUT
   * ===================================================
   */

  logoutButton: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    marginHorizontal: 16,
    marginTop: 25,

    backgroundColor: "#fff",

    borderRadius: 13,

    borderWidth: 1,
    borderColor: "#f2d4d1",

    paddingVertical: 13,
  },

  logoutText: {
    color: "#e74c3c",

    fontSize: 14,

    fontWeight: "700",
  },

  version: {
    textAlign: "center",

    color: "#b0b4bb",

    fontSize: 10.5,

    marginTop: 18,
  },

  /*
   * ===================================================
   * AUTH
   * ===================================================
   */

  authContainer: {
    paddingHorizontal: 16,

    flexGrow: 1,

    justifyContent: "center",
  },

  authLogo: {
    alignItems: "center",

    marginBottom: 28,
  },

  logoCircle: {
    width: 62,
    height: 62,

    borderRadius: 20,

    backgroundColor: "#00a884",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#00a884",
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 5,
  },

  logoText: {
    color: "#171717",

    fontSize: 27,
    fontWeight: "900",

    marginTop: 9,
  },

  logoSubtitle: {
    color: "#9a9ea6",

    fontSize: 12,

    marginTop: 3,
  },

  /*
   * ===================================================
   * AUTH CARD
   * ===================================================
   */

  authCard: {
    backgroundColor: "#fff",

    borderRadius: 22,

    padding: 20,

    borderWidth: 1,
    borderColor: "#edf0f2",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 2,
  },

  authTitle: {
    color: "#171717",

    fontSize: 22,
    fontWeight: "800",

    textAlign: "right",
  },

  authSubtitle: {
    color: "#969aa2",

    fontSize: 12.5,

    marginTop: 5,
    marginBottom: 18,

    textAlign: "right",
  },

  /*
   * ===================================================
   * INPUTS
   * ===================================================
   */

  label: {
    color: "#555b65",

    fontSize: 12.5,
    fontWeight: "700",

    marginTop: 10,
    marginBottom: 6,

    textAlign: "right",
  },

  inputWrap: {
    flexDirection: "row",

    alignItems: "center",

    minHeight: 50,

    borderWidth: 1,
    borderColor: "#e3e6ea",

    borderRadius: 12,

    paddingHorizontal: 13,

    backgroundColor: "#fafbfc",

    gap: 9,
  },

  input: {
    flex: 1,

    color: "#171717",

    fontSize: 14,

    paddingVertical: 10,
  },

  /*
   * ===================================================
   * FORGOT
   * ===================================================
   */

  forgotButton: {
    alignSelf: "flex-end",

    marginTop: 9,
  },

  forgotText: {
    color: "#00a884",

    fontSize: 11.5,
    fontWeight: "600",
  },

  /*
   * ===================================================
   * SUBMIT
   * ===================================================
   */

  submitButton: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    backgroundColor: "#00a884",

    minHeight: 51,

    borderRadius: 12,

    marginTop: 20,

    shadowColor: "#00a884",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 3,
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitText: {
    color: "#fff",

    fontSize: 14.5,
    fontWeight: "800",
  },

  /*
   * ===================================================
   * SWITCH
   * ===================================================
   */

  switchButton: {
    flexDirection: "row",

    justifyContent: "center",

    marginTop: 18,
  },

  switchText: {
    color: "#858a93",

    fontSize: 12.5,
  },

  switchAction: {
    color: "#00a884",

    fontSize: 12.5,
    fontWeight: "800",
  },

  /*
   * ===================================================
   * FOOTER
   * ===================================================
   */

  authFooter: {
    color: "#a5a9b0",

    fontSize: 11,

    lineHeight: 17,

    textAlign: "center",

    marginTop: 18,

    paddingHorizontal: 25,
  },
});