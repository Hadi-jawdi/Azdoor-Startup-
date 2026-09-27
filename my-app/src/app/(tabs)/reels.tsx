// import { useCallback, useRef, useState } from "react";
// import { View, FlatList, Dimensions, ActivityIndicator, ViewToken, StyleSheet } from "react-native";
// import { useFocusEffect } from "expo-router";
// import VideoReelCard from "../../components/VideoReelCard";
// import { getVideoListings, toggleFavorite as apiToggleFavorite } from "../../utils/listings";

// const { height: SCREEN_HEIGHT } = Dimensions.get("window");

// export default function Reels() {
//   const [listings, setListings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);

//   useFocusEffect(
//     useCallback(() => {
//       getVideoListings()
//         .then(setListings)
//         .catch(() => {})
//         .finally(() => setLoading(false));
//     }, [])
//   );

//   const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
//     if (viewableItems.length > 0 && viewableItems[0].index != null) {
//       setActiveIndex(viewableItems[0].index);
//     }
//   }).current;

//   const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

//   const handleToggleFavorite = (id: number, favorited: boolean) => {
//     setListings((prev) => prev.map((l) => (l.id === id ? { ...l, is_favorited: favorited } : l)));
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#fff" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={listings}
//         keyExtractor={(item) => String(item.id)}
//         renderItem={({ item, index }) => (
//           <VideoReelCard item={item} isActive={index === activeIndex} onToggleFavorite={handleToggleFavorite} />
//         )}
//         pagingEnabled
//         snapToInterval={SCREEN_HEIGHT}
//         decelerationRate="fast"
//         showsVerticalScrollIndicator={false}
//         onViewableItemsChanged={onViewableItemsChanged}
//         viewabilityConfig={viewabilityConfig}
//         windowSize={3}
//         removeClippedSubviews
//         initialNumToRender={2}
//         maxToRenderPerBatch={2}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#000" },
//   centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
// });



import { useCallback, useRef, useState } from "react";
import { View, FlatList, Dimensions, ActivityIndicator, ViewToken, StyleSheet } from "react-native";
import { useFocusEffect } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import VideoReelCard from "../../components/VideoReelCard";
import { getVideoListings, toggleFavorite as apiToggleFavorite } from "../../utils/listings";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Reels() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      getVideoListings()
        .then(setListings)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [])
  );

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

  const handleToggleFavorite = (id: number, favorited: boolean) => {
    setListings((prev) => prev.map((l) => (l.id === id ? { ...l, is_favorited: favorited } : l)));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <VideoReelCard item={item} isActive={isFocused && index === activeIndex} onToggleFavorite={handleToggleFavorite} />
        )}
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        windowSize={3}
        removeClippedSubviews
        initialNumToRender={2}
        maxToRenderPerBatch={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
});