
// import { Stack } from "expo-router";
// import { setupRTL } from "../utils/rtl";

// setupRTL();

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerStyle: { backgroundColor: "#00a884" }, headerTintColor: "#fff" }}>
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       <Stack.Screen name="listing/[id]" options={{ title: "جزئیات اعلان" }} />
//     </Stack>
//   );
// }
import { Stack } from "expo-router";
import { setupRTL } from "../utils/rtl";
import { AuthProvider } from "../context/AuthContext";

setupRTL();

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerStyle: { backgroundColor: "#00a884" }, headerTintColor: "#fff" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="listing/[id]" options={{ title: "جزئیات اعلان" }} />
      </Stack>
    </AuthProvider>
  );
}