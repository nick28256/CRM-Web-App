import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

const API_URL = "http://localhost:5000/api"; // înlocuiește cu IP-ul real pe telefon

export default function Orders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/orders`, {
                params: {
                    status: statusFilter || undefined,
                },
            });
            setOrders(res.data);
        } catch (err) {
            console.error("Eroare la preluarea comenzilor:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <Pressable
            style={styles.card}
            onPress={() => router.push({ pathname: "/order/[id]", params: { id: item._id } })}
        >
            <Text style={styles.title}>📦 {item.description}</Text>
            <Text style={styles.label}>Suma: {item.amount} RON</Text>
            <Text style={styles.label}>Status: {item.status}</Text>
            <Text style={styles.label}>Creată: {new Date(item.createdAt).toLocaleDateString("ro-RO")}</Text>
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>🗂️ Comenzi</Text>

            <Text style={styles.filterLabel}>Filtrează după status:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={statusFilter}
                    onValueChange={(value) => setStatusFilter(value)}
                    style={styles.picker}
                >
                    <Picker.Item label="Toate comenzile" value="" />
                    <Picker.Item label="În așteptare" value="în așteptare" />
                    <Picker.Item label="Confirmate" value="confirmată" />
                    <Picker.Item label="Anulate" value="anulată" />
                </Picker>
            </View>

            {loading ? (
                <ActivityIndicator size="large" style={{ marginTop: 40 }} />
            ) : orders.length === 0 ? (
                <Text style={styles.emptyText}>Nu există comenzi pentru acest filtru.</Text>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
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
    pageTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 24,
        color: "#22223b",
        letterSpacing: 1,
        textAlign: "center",
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8,
        color: "#4a4e69",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#c9c9c9",
        borderRadius: 8,
        marginBottom: 24,
        backgroundColor: "#fff",
        overflow: "hidden",
    },
    picker: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontSize: 16,
        backgroundColor: "#fff",
        color: "#22223b",
        borderRadius: 8,
        borderWidth: 0,
    },
    card: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 16,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#22223b",
        marginBottom: 6,
    },
    label: {
        fontSize: 15,
        color: "#4a4e69",
        marginBottom: 2,
    },
    emptyText: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 16,
        color: "#999",
    },
});
