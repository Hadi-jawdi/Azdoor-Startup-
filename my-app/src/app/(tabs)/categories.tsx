// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { categories } from "../../data/categories";

// export default function Categories() {
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={categories}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         contentContainerStyle={{ padding: 10 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={styles.tile}
//             onPress={() => router.push({ pathname: "/", params: { categoryId: item.id } })}
//           >
//             <Ionicons name={item.icon} size={28} color="#00a884" />
//             <Text style={styles.tileText}>{item.title}</Text>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f5f5f5" },
//   tile: {
//     flex: 1,
//     margin: 6,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     paddingVertical: 24,
//     alignItems: "center",
//     elevation: 2,
//   },
//   tileText: { marginTop: 8, fontSize: 14, fontWeight: "500" },
// });

import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { categories } from "../../data/categories";

export default function Categories() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 14 }]}>
        <Text style={styles.headerTitle}>دسته‌بندی‌ها</Text>
        <Text style={styles.headerSubtitle}>آنچه نیاز داری را در دسته‌بندی‌ها پیدا کن</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tile}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: "/", params: { categoryId: item.id } })}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon as any} size={26} color="#00a884" />
            </View>
            <Text style={styles.tileText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },

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
    marginBottom: 6,
  },
  headerTitle: { fontSize: 21, fontWeight: "700", color: "#1a1a1a" },
  headerSubtitle: { fontSize: 13, color: "#9a9ea6", marginTop: 3 },

  listContent: { padding: 16 },
  tile: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eef0f2",
  },
  iconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#e1f5ee",
    justifyContent: "center", alignItems: "center",
    marginBottom: 10,
  },
  tileText: { fontSize: 13.5, fontWeight: "600", color: "#1a1a1a" },
});