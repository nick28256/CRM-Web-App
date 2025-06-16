import axios from "axios";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

const API_URL = "http://localhost:5000/api"; // înlocuiește cu IP real dacă testezi pe telefon

export default function ClientDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [client, setClient] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showDeleteOrderModal, setShowDeleteOrderModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

    const [showDeleteClientModal, setShowDeleteClientModal] = useState(false);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const clientRes = await axios.get(`${API_URL}/clients/${id}`);
                setClient(clientRes.data);
            } catch (err: any) {
                setClient(null);
                setLoading(false);
                if (err.response?.status === 404) {
                    Toast.show({ type: "error", text1: "Clientul nu a fost găsit." });
                } else {
                    Toast.show({ type: "error", text1: "Eroare la fetch client." });
                }
                return;
            }

            try {
                const ordersRes = await axios.get(`${API_URL}/clients/${id}/orders`);
                setOrders(ordersRes.data);
            } catch (err) {
                setOrders([]);
                Toast.show({ type: "error", text1: "Eroare la fetch comenzi." });
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchClientData();
    }, [id]);

    const handleConfirmDeleteOrder = async () => {
        if (!orderToDelete) return;
        try {
            await axios.delete(`${API_URL}/orders/${orderToDelete}`);
            setOrders((prev) => prev.filter((order) => order._id !== orderToDelete));
            Toast.show({ type: "success", text1: "Comanda a fost ștearsă" });
        } catch (err) {
            console.error("Eroare la ștergerea comenzii:", err);
            Toast.show({ type: "error", text1: "Eroare la ștergerea comenzii" });
        } finally {
            setShowDeleteOrderModal(false);
            setOrderToDelete(null);
        }
    };

    const handleDeleteClient = async () => {
        try {
            await axios.delete(`${API_URL}/clients/${id}`);
            Toast.show({ type: "success", text1: "Client șters cu succes" });
            router.replace("/");
        } catch (err) {
            console.error("Eroare la ștergerea clientului:", err);
            Toast.show({ type: "error", text1: "Eroare la ștergerea clientului" });
        } finally {
            setShowDeleteClientModal(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    if (!client) return <Text style={styles.errorText}>Clientul nu a fost găsit.</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.name}>{client.name}</Text>
            <Text style={styles.info}>📧 {client.email}</Text>
            <Text style={styles.info}>📞 {client.phone}</Text>
            <Text style={styles.info}>🏢 {client.company}</Text>

            <View style={styles.actions}>
                <Pressable
                    style={styles.actionButton}
                    onPress={() => router.push(`/edit-client/${client._id}`)}
                >
                    <Text style={styles.actionButtonText}>✏️ Editează</Text>
                </Pressable>

                <Pressable
                    style={[styles.actionButton, { backgroundColor: "#28a745" }]}
                    onPress={() => router.push(`/add-order/${client._id}`)}
                >
                    <Text style={styles.actionButtonText}>➕ Comandă</Text>
                </Pressable>

                <Pressable
                    style={[styles.actionButton, { backgroundColor: "#DC3545" }]}
                    onPress={() => setShowDeleteClientModal(true)}
                >
                    <Text style={styles.actionButtonText}>🗑️ Șterge clientul</Text>
                </Pressable>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Comenzi ({orders.length})</Text>
                {orders.map((order) => (
                    <View key={order._id}>
                        <Link
                            href={{ pathname: "/order/[id]", params: { id: order._id } }}
                            asChild
                        >
                            <Pressable style={styles.card}>
                                <Text style={styles.orderDescription}>{order.description}</Text>
                                <Text style={styles.orderDetail}>💰 {order.amount} RON</Text>
                                <Text style={styles.orderDetail}>
                                    📅 {new Date(order.createdAt).toLocaleDateString("ro-RO")}
                                </Text>
                                <Text style={styles.orderStatus}>📝 Status: {order.status}</Text>
                            </Pressable>
                        </Link>
                        <View style={styles.orderButtonsRow}>
                            <Pressable
                                style={[styles.orderButton, { backgroundColor: "#FFA500" }]}
                                onPress={() =>
                                    router.push({
                                        pathname: "../edit-order/[id]",
                                        params: { id: order._id },
                                    })
                                }
                            >
                                <Text style={styles.orderButtonText}>✏️ Editează</Text>
                            </Pressable>

                            <Pressable
                                style={[styles.orderButton, { backgroundColor: "#DC3545" }]}
                                onPress={() => {
                                    setOrderToDelete(order._id);
                                    setShowDeleteOrderModal(true);
                                }}
                            >
                                <Text style={styles.orderButtonText}>🗑️ Șterge</Text>
                            </Pressable>
                        </View>
                    </View>
                ))}
            </View>

            {/* Modal ștergere comandă */}
            <Modal visible={showDeleteOrderModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 15 }}>
                            Ești sigur că vrei să ștergi comanda?
                        </Text>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                                onPress={() => setShowDeleteOrderModal(false)}
                            >
                                <Text>Anulează</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: "#DC3545" }]}
                                onPress={handleConfirmDeleteOrder}
                            >
                                <Text style={{ color: "#fff" }}>Șterge</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal ștergere client */}
            <Modal visible={showDeleteClientModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent} role="dialog" aria-modal={true}>
                        <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 15 }}>
                            Ești sigur că vrei să ștergi acest client?
                        </Text>
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                                onPress={() => setShowDeleteClientModal(false)}
                            >
                                <Text>Anulează</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: "#DC3545" }]}
                                onPress={handleDeleteClient}
                            >
                                <Text style={{ color: "#fff" }}>Șterge</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        padding: 32,
    },
    name: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#22223b",
        textAlign: "center",
        letterSpacing: 1,
    },
    info: {
        fontSize: 16,
        marginBottom: 4,
        color: "#4a4e69",
        textAlign: "center",
    },
    section: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
        color: "#22223b",
        letterSpacing: 0.5,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    orderDescription: {
        fontSize: 17,
        fontWeight: "bold",
        marginBottom: 6,
        color: "#22223b",
    },
    orderDetail: {
        fontSize: 15,
        color: "#4a4e69",
    },
    orderStatus: {
        fontSize: 15,
        fontStyle: "italic",
        color: "#3a86ff",
        marginTop: 6,
    },
    errorText: {
        padding: 20,
        fontSize: 16,
        color: "#d90429",
        textAlign: "center",
    },
    actions: {
        flexDirection: "row",
        marginTop: 24,
        marginBottom: 24,
        gap: 14,
        flexWrap: "wrap",
        justifyContent: "center",
    },
    actionButton: {
        backgroundColor: "#3a86ff",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginHorizontal: 2,
        marginBottom: 6,
        alignItems: "center",
        minWidth: 120,
    },
    actionButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
        textAlign: "center",
    },
    orderButtonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
        gap: 10,
    },
    orderButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: "center",
        marginHorizontal: 2,
    },
    orderButtonText: {
        color: "#fff",
        fontWeight: "700",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        paddingVertical: 32,
        paddingHorizontal: 32,
        borderRadius: 16,
        width: "90%",
        maxWidth: 420,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    modalButton: {
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 8,
        marginHorizontal: 6,
        marginTop: 10,
        alignItems: "center",
    },
});
