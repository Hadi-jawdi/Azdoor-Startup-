// import { View, Text, StyleSheet } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { listings } from "../../data/listings";

// export default function ListingDetail() {
//   const { id } = useLocalSearchParams();
//   const item = listings.find((l) => l.id === id);

//   if (!item) return <Text style={{ padding: 20 }}>اعلان یافت نشد.</Text>;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{item.title}</Text>
//       <Text style={styles.price}>{item.price}</Text>
//       <Text style={styles.description}>{item.description}</Text>
//       <View style={styles.metaRow}>
//         <Text style={styles.meta}>📍 {item.location}</Text>
//         <Text style={styles.meta}>🏷️ {item.category}</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#fff" },
//   title: { fontSize: 20, fontWeight: "700", textAlign: "right" },
//   price: { fontSize: 18, color: "#00a884", marginTop: 8, textAlign: "right" },
//   description: { fontSize: 15, marginTop: 16, lineHeight: 22, textAlign: "right" },
//   metaRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginTop: 24 },
//   meta: { fontSize: 13, color: "#666" },
// });

import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getListing } from "../../utils/listings";

export default function ListingDetail() {
  const { id } = useLocalSearchParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getListing(id)
      .then(setItem)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#00a884" />;
  if (error) return <Text style={{ padding: 20 }}>خطا: {error}</Text>;
  if (!item) return <Text style={{ padding: 20 }}>اعلان یافت نشد.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>{item.price}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>📍 {item.location}</Text>
        <Text style={styles.meta}>🏷️ {item.category_display}</Text>
      </View>
      {item.owner_name ? <Text style={styles.owner}>ثبت شده توسط {item.owner_name}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "700" },
  price: { fontSize: 18, color: "#00a884", marginTop: 8 },
  description: { fontSize: 15, marginTop: 16, lineHeight: 22 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 24 },
  meta: { fontSize: 13, color: "#666" },
  owner: { fontSize: 13, color: "#999", marginTop: 12 },
});