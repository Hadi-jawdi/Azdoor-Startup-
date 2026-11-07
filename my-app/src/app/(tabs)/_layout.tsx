


// import { Tabs } from "expo-router";
// import { View, StyleSheet, Platform } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const BRAND = "#1F3F66";
// const BRAND_LIGHT = "#E3EAF2";
// const TEXT_MUTED = "#9A9FA8";

// function TabIcon({
//   name,
//   focused,
// }: {
//   name: keyof typeof Ionicons.glyphMap;
//   focused: boolean;
// }) {
//   return (
//     <View style={[styles.iconPill, focused && styles.iconPillActive]}>
//       <Ionicons
//         name={name}
//         size={21}
//         color={focused ? BRAND : TEXT_MUTED}
//       />
//     </View>
//   );
// }

// export default function TabsLayout() {
//   const insets = useSafeAreaInsets();

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: BRAND,
//         tabBarInactiveTintColor: TEXT_MUTED,
//         tabBarShowLabel: false,
//         tabBarLabelStyle: styles.tabLabel,
//         tabBarStyle: [
//           styles.tabBar,
//           {
//             height: 64 + insets.bottom * 0.5,
//             paddingBottom: Math.max(insets.bottom * 0.5, 8),
//           },
//         ],
//         tabBarItemStyle: styles.tabItem,
//       }}
//     >
//       {/* 1. All listings — rightmost */}
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "همه آگهی‌ها",
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               name={focused ? "home" : "home-outline"}
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* 2. Videos */}
//       <Tabs.Screen
//         name="reels"
//         options={{
//           title: "ویدیوها",
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               name={focused ? "play-circle" : "play-circle-outline"}
//               focused={focused}
//             />
//           ),
//           tabBarStyle: { display: "none" },
//         }}
//       />

//       {/* 3. Create listing — center */}
//       <Tabs.Screen
//         name="post"
//         options={{
//           title: "",
//           tabBarLabel: () => null,
//           tabBarIcon: ({ focused }) => (
//             <View style={styles.postButtonWrap}>
//               <LinearGradient
//                 colors={["#00d6a8", "#00a884", "#00806a"]}
//                 locations={[0, 0.5, 1]}
//                 start={{ x: 0.2, y: 0 }}
//                 end={{ x: 0.9, y: 1 }}
//                 style={[
//                   styles.postButton,
//                   focused && styles.postButtonActive,
//                 ]}
//               >
//                 <View style={styles.postButtonHighlight} />
//                 <Ionicons name="add" size={30} color="#fff" />
//               </LinearGradient>
//             </View>
//           ),
//           tabBarStyle: { display: "none" },
//         }}
//       />

//       {/* 4. Categories */}
//       <Tabs.Screen
//         name="categories"
//         options={{
//           title: "دسته‌بندی",
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               name={focused ? "grid" : "grid-outline"}
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* 5. Profile — leftmost */}
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "پروفایل",
//           tabBarIcon: ({ focused }) => (
//             <TabIcon
//               name={focused ? "person" : "person-outline"}
//               focused={focused}
//             />
//           ),
//         }}
//       />

//       {/* Hidden route: still accessible using router.push */}
//       <Tabs.Screen
//         name="favorites"
//         options={{
//           href: null,
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     position: "absolute",
//     backgroundColor: "#fff",
//     borderTopWidth: 0,
//     elevation: 12,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowRadius: 14,
//     shadowOffset: { width: 0, height: -4 },
//     ...(Platform.OS === "android" ? { elevation: 12 } : {}),
//   },
//   tabItem: {
//     paddingTop: 6,
//   },
//   tabLabel: {
//     fontSize: 11,
//     fontWeight: "600",
//     marginTop: 2,
//   },
//   iconPill: {
//     width: 46,
//     height: 30,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   iconPillActive: {
//     backgroundColor: BRAND_LIGHT,
//   },
//   postButtonWrap: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   postButton: {
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     marginTop: -28,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#00806a",
//     shadowOpacity: 0.5,
//     shadowRadius: 12,
//     shadowOffset: { width: 0, height: 7 },
//     elevation: 9,
//     borderWidth: 3,
//     borderColor: "#fff",
//     overflow: "hidden",
//   },
//   postButtonHighlight: {
//     position: "absolute",
//     top: -14,
//     left: -6,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "rgba(255,255,255,0.35)",
//   },
//   postButtonActive: {
//     transform: [{ scale: 1.06 }],
//   },
// });

import { Tabs, router } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BRAND = "#1F3F66";
const BRAND_LIGHT = "#E3EAF2";
const TEXT_MUTED = "#9A9FA8";

function TabIcon({
  name,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
}) {
  return (
    <View style={[styles.iconPill, focused && styles.iconPillActive]}>
      <Ionicons
        name={name}
        size={21}
        color={focused ? BRAND : TEXT_MUTED}
      />
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: BRAND,
        tabBarInactiveTintColor: TEXT_MUTED,
        tabBarShowLabel: false,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 64 + insets.bottom * 0.5,
            paddingBottom: Math.max(insets.bottom * 0.5, 8),
          },
        ],
        tabBarItemStyle: styles.tabItem,
      }}
    >
      {/* 1. All listings — rightmost */}
      <Tabs.Screen
        name="index"
        options={{
          title: "همه آگهی‌ها",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "home" : "home-outline"}
              focused={focused}
            />
          ),
        }}
      />

      {/* 2. Videos */}
      <Tabs.Screen
        name="reels"
        options={{
          title: "ویدیوها",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "play-circle" : "play-circle-outline"}
              focused={focused}
            />
          ),
          tabBarStyle: { display: "none" },
        }}
      />

      {/* 3. Create listing — center */}
      <Tabs.Screen
        name="post"
        options={{
          title: "",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <View style={styles.postButtonWrap}>
              <LinearGradient
                colors={["#00d6a8", "#00a884", "#00806a"]}
                locations={[0, 0.5, 1]}
                start={{ x: 0.2, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={[
                  styles.postButton,
                  focused && styles.postButtonActive,
                ]}
              >
                <View style={styles.postButtonHighlight} />
                <Ionicons name="add" size={30} color="#fff" />
              </LinearGradient>
            </View>
          ),
          tabBarStyle: { display: "none" },
        }}
      />


      <Tabs.Screen
        name="messages"
        options={{
          title: "پیام‌ها",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              focused={focused}
            />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push("/conversations");
          },
        }}
      />

      {/* 5. Profile — leftmost */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "پروفایل",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "person" : "person-outline"}
              focused={focused}
            />
          ),
        }}
      />

      {/* Hidden route: still accessible using router.push */}
      <Tabs.Screen
        name="favorites"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#fff",
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    ...(Platform.OS === "android" ? { elevation: 12 } : {}),
  },
  tabItem: {
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  iconPill: {
    width: 46,
    height: 30,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  iconPillActive: {
    backgroundColor: BRAND_LIGHT,
  },
  postButtonWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  postButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginTop: -28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00806a",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
    elevation: 9,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
  },
  postButtonHighlight: {
    position: "absolute",
    top: -14,
    left: -6,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  postButtonActive: {
    transform: [{ scale: 1.06 }],
  },
});