import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { getMessages, sendMessage } from "../../utils/chat";

export default function Chat() {
  const { id } = useLocalSearchParams();
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const pollRef = useRef<any>(null);

  const load = useCallback(async () => {
    try {
      const data = await getMessages(id as string, token);
      setMessages(data);
    } catch {}
  }, [id, token]);

  useEffect(() => {
    load().finally(() => setLoading(false));
    pollRef.current = setInterval(load, 3000);
    return () => clearInterval(pollRef.current);
  }, [load]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;
    const body = text.trim();
    setText("");
    setSending(true);
    try {
      const newMsg = await sendMessage(id as string, body, token);
      setMessages((prev) => [...prev, newMsg]);
    } catch {
      setText(body);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00a884" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
    >
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-forward" size={20} color="#1a1a1a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>گفتگو</Text>
          <View style={{ width: 38 }} />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(m) => String(m.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const mine = item.sender === user?.id;
            return (
              <View style={[styles.bubbleRow, mine ? styles.bubbleRowMine : styles.bubbleRowTheirs]}>
                <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                  <Text style={[styles.bubbleText, mine && styles.bubbleTextMine]}>{item.text}</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>پیامی ارسال نشده. اولین پیام را بفرستید.</Text>
            </View>
          }
        />

        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="پیام خود را بنویسید..."
            placeholderTextColor="#b6b9bf"
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={sending}>
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f8fa" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eef0f2",
  },
  backButton: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: "#f4f5f7",
    justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },

  listContent: { padding: 16, gap: 8 },
  bubbleRow: { flexDirection: "row" },
  bubbleRowMine: { justifyContent: "flex-start" },
  bubbleRowTheirs: { justifyContent: "flex-end" },
  bubble: { maxWidth: "78%", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { backgroundColor: "#00a884", borderBottomLeftRadius: 4 },
  bubbleTheirs: { backgroundColor: "#fff", borderBottomRightRadius: 4, borderWidth: 1, borderColor: "#eef0f2" },
  bubbleText: { fontSize: 14, color: "#1a1a1a", lineHeight: 20 },
  bubbleTextMine: { color: "#fff" },

  emptyWrap: { marginTop: 60, alignItems: "center" },
  emptyText: { color: "#9a9ea6", fontSize: 13.5 },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eef0f2",
  },
  input: {
    flex: 1,
    backgroundColor: "#f4f5f7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
    color: "#1a1a1a",
  },
  sendButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#00a884",
    justifyContent: "center", alignItems: "center",
  },
});