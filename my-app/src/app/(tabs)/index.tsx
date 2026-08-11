// import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import { listings } from "../../data/listings";

// export default function Home() {
//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={listings}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ padding: 12 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.card}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text style={styles.price}>{item.price}</Text>
//             <View style={styles.metaRow}>
//               <Text style={styles.meta}>{item.location}</Text>
//               <Text style={styles.meta}>{item.category}</Text>
//             </View>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f5f5f5" },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 14,
//     marginBottom: 10,
//     elevation: 2,
//   },
//   title: { fontSize: 16, fontWeight: "600", textAlign: "right" },
//   price: { fontSize: 15, color: "#00a884", marginTop: 6, textAlign: "right" },
//   metaRow: { flexDirection: "row-reverse", justifyContent: "space-between", marginTop: 8 },
//   meta: { fontSize: 12, color: "#888" },
// });
import { View, FlatList, StyleSheet } from "react-native";
import { listings } from "../../data/listings";
import ListingCard from "../../components/ListingCard";

export default function Home() {
  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => <ListingCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: "#f5f5f5" } });