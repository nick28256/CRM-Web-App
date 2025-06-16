import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

const API_URL = "http://localhost:5000/api"; // modifică cu IP real dacă testezi pe telefon

export default function OrderDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [client, setClient] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderRes = await axios.get(`${API_URL}/orders/${id}`);
                setOrder(orderRes.data);

                // Fetch client if needed
                const clientId = orderRes.data.clientId;
                if (clientId && typeof clientId === "string") {
                    const clientData = await axios.get(`${API_URL}/clients/${clientId}`);
                    setClient(clientData.data);
                } else {
                    setClient(clientId); // Already populated
                }
            } catch (err) {
                console.error("Eroare la preluarea comenzii:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/orders/${Array.isArray(id) ? id[0] : id}`);
            setShowDeleteModal(false);
            router.replace("../orders");
        } catch (err) {
            setShowDeleteModal(false);
            // Optionally show a toast or error message here
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    if (!order) {
        Toast.show({
            type: "error",
            text1: "Eroare",
            text2: "Comanda nu a fost găsită.",
        });
        return <Text style={styles.errorText}>Comanda nu a fost găsită.</Text>;
    }

    return (
        <View style={styles.container}>

            <View style={styles.section}>
                <Text style={styles.title}>📦 Detalii Comandă</Text>

                <Text style={styles.label}>Descriere:</Text>
                <Text style={styles.value}>{order.description}</Text>

                <Text style={styles.label}>Suma:</Text>
                <Text style={styles.value}>{order.amount} RON</Text>

                <Text style={styles.label}>Status:</Text>
                <Text style={styles.value}>{order.status}</Text>

                <Text style={styles.label}>Data creării:</Text>
                <Text style={styles.value}>
                    {new Date(order.createdAt).toLocaleDateString("ro-RO")}
                </Text>
            </View>

            {client && (
                <View style={styles.section}>
                    <Text style={styles.subtitle}>Client</Text>
                    <Text style={styles.value}>👤 {client.name}</Text>
                    <Text style={styles.value}>📧 {client.email}</Text>
                    <Text style={styles.value}>📞 {client.phone}</Text>
                    <Text style={styles.value}>📝 {client.notes}</Text>
                </View>
            )}

            <View style={styles.buttons}>
                <Pressable
                    style={[styles.button, { backgroundColor: "#FFA500" }]}
                    onPress={() => router.push({ pathname: "/edit-order/[id]", params: { id: Array.isArray(id) ? id[0] : id } })}
                >
                    <Text style={styles.buttonText}>✏️ Editează</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, { backgroundColor: "#007AFF" }]}
                    onPress={() => router.push("../")}
                >
                    <Text style={styles.buttonText}>↩️ Înapoi</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, { backgroundColor: "#d90429" }]}
                    onPress={() => setShowDeleteModal(true)}
                >
                    <Text style={styles.buttonText}>🗑️ Șterge</Text>
                </Pressable>
            </View>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.content}>
                        <Text style={modalStyles.title}>Confirmare ștergere</Text>
                        <Text style={modalStyles.text}>Sigur vrei să ștergi această comandă?</Text>
                        <View style={modalStyles.row}>
                            <Pressable
                                style={[modalStyles.button, { backgroundColor: "#e0e1dd" }]}
                                onPress={() => setShowDeleteModal(false)}
                            >
                                <Text style={{ color: "#22223b", fontWeight: "bold" }}>Anulează</Text>
                            </Pressable>
                            <Pressable
                                style={[modalStyles.button, { backgroundColor: "#d90429" }]}
                                onPress={handleDelete}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold" }}>Șterge</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        padding: 32,
    },
    section: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 28,
        marginBottom: 24,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 18,
        color: "#22223b",
        textAlign: "center",
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        color: "#4a4e69",
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
        color: "#4a4e69",
    },
    value: {
        fontSize: 16,
        color: "#22223b",
        marginBottom: 2,
    },
    errorText: {
        padding: 20,
        fontSize: 16,
        color: "#d90429",
        textAlign: "center",
    },
    buttons: {
        marginTop: 30,
        flexDirection: "row",
        gap: 16,
        justifyContent: "center",
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
        marginHorizontal: 4,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
});

const modalStyles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
    },
    content: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 32,
        width: "90%",
        maxWidth: 400,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#22223b",
        textAlign: "center",
    },
    text: {
        fontSize: 16,
        color: "#22223b",
        marginBottom: 24,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        gap: 16,
        justifyContent: "center",
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 8,
        marginHorizontal: 6,
        alignItems: "center",
        minWidth: 100,
    },
});
