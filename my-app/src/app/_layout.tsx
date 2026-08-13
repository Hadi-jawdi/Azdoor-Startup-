
import { Stack } from "expo-router";
import { setupRTL } from "../utils/rtl";
import { AuthProvider } from "../context/AuthContext";

setupRTL();

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerStyle: { backgroundColor: "#00a884" }, headerTintColor: "#fff" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="listing/[id]" options={{ title: "جزئیات اعلان" }} /> */}
        <Stack.Screen name="listing/[id]" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}