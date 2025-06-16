import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../lib/AuthProvider";
import { auth } from "../../lib/firebase";

export default function Profile() {
    const { user, loading } = useAuth();
    const router = useRouter();

    if (loading) return null;

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.info}>Nu ești autentificat.</Text>
            </View>
        );
    }

    const handleLogout = async () => {
        await signOut(auth);
        router.replace("../(auth)/login");
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user.email?.[0]?.toUpperCase() || "U"}
                    </Text>
                </View>
                <Text style={styles.title}>Profil utilizator</Text>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
                <Pressable style={styles.button} onPress={handleLogout}>
                    <Text style={styles.buttonText}>Deconectare</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 32,
        width: "100%",
        maxWidth: 400,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: "#3a86ff",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },
    avatarText: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "bold",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 18,
        color: "#22223b",
        letterSpacing: 1,
        textAlign: "center",
    },
    infoLabel: {
        fontSize: 16,
        color: "#4a4e69",
        fontWeight: "600",
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 17,
        color: "#22223b",
        marginBottom: 18,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#d90429",
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 32,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
    info: {
        fontSize: 18,
        marginBottom: 16,
        color: "#22223b",
        textAlign: "center",
    },
});