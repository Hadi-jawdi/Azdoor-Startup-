import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { listings } from "../../data/listings";

export default function ListingDetail() {
  const { id } = useLocalSearchParams();
  const item = listings.find((l) => l.id === id);

  if (!item) return <Text style={{ padding: 20 }}>اعلان یافت نشد.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>📍 {item.location}</Text>
        <Text style={styles.meta}>🏷️ {item.category}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700", textAlign: "right" },
  price: { fontSize: 18, color: "#00a884", marginTop: 8, textAlign: "right" },
  description: { fontSize: 15, marginTop: 16, lineHeight: 22, textAlign: "right" },
  metaRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginTop: 24 },
  meta: { fontSize: 13, color: "#666" },
});