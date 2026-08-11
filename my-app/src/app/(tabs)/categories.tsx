import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { categories } from "../../data/categories";

export default function Categories() {
  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tile}
            onPress={() => router.push({ pathname: "/", params: { categoryId: item.id } })}
          >
            <Ionicons name={item.icon} size={28} color="#00a884" />
            <Text style={styles.tileText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  tile: {
    flex: 1,
    margin: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 24,
    alignItems: "center",
    elevation: 2,
  },
  tileText: { marginTop: 8, fontSize: 14, fontWeight: "500" },
});