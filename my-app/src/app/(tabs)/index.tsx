// // import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// // import { listings } from "../../data/listings";

// // export default function Home() {
// //   return (
// //     <View style={styles.container}>
// //       <FlatList
// //         data={listings}
// //         keyExtractor={(item) => item.id}
// //         contentContainerStyle={{ padding: 12 }}
// //         renderItem={({ item }) => (
// //           <TouchableOpacity style={styles.card}>
// //             <Text style={styles.title}>{item.title}</Text>
// //             <Text style={styles.price}>{item.price}</Text>
// //             <View style={styles.metaRow}>
// //               <Text style={styles.meta}>{item.location}</Text>
// //               <Text style={styles.meta}>{item.category}</Text>
// //             </View>
// //           </TouchableOpacity>
// //         )}
// //       />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: "#f5f5f5" },
// //   card: {
// //     backgroundColor: "#fff",
// //     borderRadius: 10,
// //     padding: 14,
// //     marginBottom: 10,
// //     elevation: 2,
// //   },
// //   title: { fontSize: 16, fontWeight: "600", textAlign: "right" },
// //   price: { fontSize: 15, color: "#00a884", marginTop: 6, textAlign: "right" },
// //   metaRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginTop: 8 },
// //   meta: { fontSize: 12, color: "#888" },
// // });
// import { View, FlatList, StyleSheet } from "react-native";
// import { listings } from "../../data/listings";
// import ListingCard from "../../components/ListingCard";

// export default function Home() {
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={listings}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ padding: 12 }}
//         renderItem={({ item }) => <ListingCard item={item} />}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#f5f5f5" } });

import { useCallback, useState } from "react";
import { View, FlatList, ActivityIndicator, Text, StyleSheet, RefreshControl } from "react-native";
import { useFocusEffect } from "expo-router";
import { getListings } from "../../utils/listings";
import ListingCard from "../../components/ListingCard";

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const data = await getListings();
      setListings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load().finally(() => setLoading(false));
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00a884" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>خطا در بارگذاری اعلان‌ها: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => <ListingCard item={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>هنوز اعلانی ثبت نشده است.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 40, color: "#888" },
});