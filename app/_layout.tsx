import { Link, Stack } from "expo-router";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../lib/AuthProvider";

function Sidebar() {

  return (
    <View style={styles.sidebar}>
      <Text style={styles.logo}>🚀 CRM</Text>
      <Link href="/" asChild>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>🏠 Acasă</Text>
        </Pressable>
      </Link>
      <Link href="/dashboard" asChild>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>📊 Dashboard</Text>
        </Pressable>
      </Link>
      <Link href="/clients" asChild>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>👥 Clienți</Text>
        </Pressable>
      </Link>
      <Link href="/orders" asChild>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>📦 Comenzi</Text>
        </Pressable>
      </Link>
      <Link href="/profile" asChild>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>👤 Profil</Text>
        </Pressable>
      </Link>
      <Link href="/admin-panel" asChild>
        <Pressable style={styles.navButton}>
          <Text style={styles.navButtonText}>🛠️ Admin Panel</Text>
        </Pressable>
      </Link>
    </View>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <View style={styles.root}>
        <Sidebar />
        <View style={styles.content}>
          <Stack screenOptions={{ headerShown: false }} />
          {children}
        </View>
      </View>
      <Toast />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    minHeight: Dimensions.get("window").height,
    backgroundColor: "#f4f6f8",
  },
  sidebar: {
    width: 220,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#e0e1dd",
    paddingVertical: 32,
    paddingHorizontal: 18,
    alignItems: "flex-start",
    gap: 10,
    boxShadow: "2px 0 12px #0001",
    minHeight: Dimensions.get("window").height,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    color: "#3a86ff",
    letterSpacing: 1,
    alignSelf: "center",
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 6,
    width: "100%",
    alignItems: "flex-start",
    backgroundColor: "#f4f6f8",
    transitionProperty: "background-color",
    transitionDuration: "0.2s",
  },
  navButtonText: {
    fontSize: 16,
    color: "#22223b",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  logoutButton: {
    marginTop: 24,
    backgroundColor: "#d90429",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: "100%",
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 0,
    minHeight: Dimensions.get("window").height,
  },
});