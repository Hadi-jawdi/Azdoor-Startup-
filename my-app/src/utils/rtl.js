import { I18nManager, DevSettings, Platform } from "react-native";

export function setupRTL() {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);

    // Forces a JS reload so the new direction actually takes effect.
    // Works in Expo Go / dev builds. For a production build later,
    // you'll need expo-updates' Updates.reloadAsync() instead.
    if (__DEV__ && Platform.OS !== "web") {
      DevSettings.reload();
    }
  }
}