import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function ListingCard({ item }) {
  return (
    <Link href={`/listing/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{item.location}</Text>
          <Text style={styles.meta}>{item.category}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 14, marginBottom: 10, elevation: 2 },
//   title: { fontSize: 16, fontWeight: "600", textAlign: "right" },
  title: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 15, color: "#00a884", marginTop: 6, textAlign: "right" },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
//   metaRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginTop: 8 },
  meta: { fontSize: 12, color: "#888" },
});