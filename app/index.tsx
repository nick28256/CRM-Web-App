import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../lib/AuthProvider";
import Login from "./(auth)/login";

export default function Home() {
    const router = useRouter();
    const { user, loading } = useAuth();

    if (loading) return null;
    if (!user) return <Login />;

    return (
        <View style={styles.gradientBg}>
            <View style={styles.container}>
                <Text style={styles.logo}>🚀</Text>
                <Pressable
                    style={({ pressed }) => [
                        styles.dashboardButton,
                        pressed && { backgroundColor: "#4361ee" }
                    ]}
                    onPress={() => router.push("/dashboard")}
                >
                    <Text style={styles.dashboardButtonText}>📊 Dashboard</Text>
                </Pressable>
                <View style={styles.card}>
                    <Text style={styles.welcome}>Bine ai venit,</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.subtitle}>Ce vrei să faci azi?</Text>
                    <View style={styles.buttonRow}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                pressed && { backgroundColor: "#2648b8" }
                            ]}
                            onPress={() => router.push("/clients")}
                        >
                            <Text style={styles.buttonText}>👥 Clienți</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                pressed && { backgroundColor: "#2648b8" }
                            ]}
                            onPress={() => router.push("/orders")}
                        >
                            <Text style={styles.buttonText}>📦 Comenzi</Text>
                        </Pressable>
                    </View>
                    <View style={styles.buttonRow}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.buttonSecondary,
                                pressed && { backgroundColor: "#d1dbe6" }
                            ]}
                            onPress={() => router.push("/profile")}
                        >
                            <Text style={styles.buttonSecondaryText}>👤 Profilul meu</Text>
                        </Pressable>
                        <Pressable
                            style={({ pressed }) => [
                                styles.buttonSecondary,
                                pressed && { backgroundColor: "#d1dbe6" }
                            ]}
                            onPress={() => router.push("/admin-panel")}
                        >
                            <Text style={styles.buttonSecondaryText}>🛠️ Admin Panel</Text>
                        </Pressable>
                    </View>
                </View>
                <Text style={styles.footer}>CRM App &copy; {new Date().getFullYear()}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    gradientBg: {
        flex: 1,
        backgroundColor: "#a8c0ff", // Replace with a solid color or use a gradient library
        minHeight: Dimensions.get("window").height,
        minWidth: Dimensions.get("window").width,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    logo: {
        fontSize: 48,
        marginBottom: 18,
        textAlign: "center",
        textShadowColor: "#3a86ff33",
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    dashboardButton: {
        backgroundColor: "#3a86ff",
        borderRadius: 10,
        paddingVertical: 14,
        paddingHorizontal: 36,
        marginBottom: 24,
        alignItems: "center",
        shadowColor: "#3a86ff",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    dashboardButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 36,
        width: "100%",
        maxWidth: 440,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#e0e1dd",
    },
    welcome: {
        fontSize: 22,
        color: "#4a4e69",
        fontWeight: "600",
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 20,
        color: "#22223b",
        fontWeight: "bold",
        marginBottom: 18,
    },
    subtitle: {
        fontSize: 18,
        color: "#22223b",
        marginBottom: 24,
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 14,
    },
    button: {
        backgroundColor: "#3a86ff",
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 28,
        alignItems: "center",
        marginHorizontal: 4,
        minWidth: 120,
        shadowColor: "#3a86ff",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        transitionProperty: "background-color",
        transitionDuration: "0.2s",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
    buttonSecondary: {
        backgroundColor: "#e0e1dd",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: "center",
        marginHorizontal: 4,
        minWidth: 120,
        transitionProperty: "background-color",
        transitionDuration: "0.2s",
    },
    buttonSecondaryText: {
        color: "#22223b",
        fontWeight: "bold",
        fontSize: 15,
        letterSpacing: 1,
    },
    footer: {
        marginTop: 12,
        color: "#999",
        fontSize: 14,
        textAlign: "center",
    },
});
