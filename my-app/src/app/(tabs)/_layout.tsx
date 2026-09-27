

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00a884",
        tabBarInactiveTintColor: "#9a9ea6",
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [
          styles.tabBar,
          { height: 62 + insets.bottom * 0.5, paddingBottom: Math.max(insets.bottom * 0.5, 8) },
        ],
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "همه آگهی ها",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} color={color} size={22} />
          ),
        }}
      />

      <Tabs.Screen
        name="reels"
        options={{
          title: "reels",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} color={color} size={22} />
          ),
        }}
      />


      <Tabs.Screen
        name="categories"
        options={{
          title: "دسته‌بندی",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "grid" : "grid-outline"} color={color} size={21} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "علاقه‌مندی‌ها",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "heart" : "heart-outline"} color={color} size={21} />
          ),
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          title: "ثبت اعلان",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "add-circle-outline"}
              color={focused ? "#00a884" : color}
              size={26}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "پروفایل",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={21} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = {
  tabBar: {
    position: "absolute" as const,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    ...(Platform.OS === "android" ? { elevation: 12 } : {}),
  },
  tabItem: { paddingTop: 6 },
  tabLabel: { fontSize: 11, fontWeight: "600" as const, marginTop: 2 },
};