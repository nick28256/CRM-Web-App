import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../../lib/firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            if (user) {
                const idToken = await user.getIdToken(true);
                console.log("ID Token:", idToken);
            }
            router.replace("../");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.bg}>
            <View style={styles.card}>
                <Text style={styles.logo}>🔐</Text>
                <Text style={styles.title}>Autentificare</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Parolă"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && { backgroundColor: "#2648b8" }
                    ]}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? "Se autentifică..." : "Autentificare"}
                    </Text>
                </Pressable>
                {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bg: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        justifyContent: "center",
        alignItems: "center",
        minHeight: Dimensions.get("window").height,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 18,
        padding: 36,
        width: "100%",
        maxWidth: 380,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        borderWidth: 1,
        borderColor: "#e0e1dd",
    },
    logo: {
        fontSize: 40,
        marginBottom: 10,
        textAlign: "center",
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 24,
        color: "#22223b",
        textAlign: "center",
        letterSpacing: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: "#c9c9c9",
        borderRadius: 8,
        padding: 14,
        marginBottom: 18,
        backgroundColor: "#f9f9fb",
        fontSize: 16,
        width: "100%",
    },
    button: {
        backgroundColor: "#3a86ff",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
        width: "100%",
        transitionProperty: "background-color",
        transitionDuration: "0.2s",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
    error: {
        color: "#d90429",
        marginBottom: 10,
        textAlign: "center",
        fontWeight: "bold",
    },
});