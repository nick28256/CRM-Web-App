import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";

const API_URL = "http://localhost:5000/api"; // ← Înlocuiește cu IP-ul tău real

export default function ClientList() {
    const router = useRouter();
    interface Client {
        _id: string;
        name: string;
        email: string;
        company: string;
    }

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchClients = async (searchTerm = "") => {
        try {
            const res = await axios.get(`${API_URL}/clients`, {
                params: { search: searchTerm },
            });
            setClients(res.data);
        } catch (err) {
            console.error("Eroare la încărcarea clienților:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients(search);
    }, [search]);

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    return (
        <View style={styles.container}>
            {/* Header cu titlu și buton */}
            <View style={styles.header}>
                <Text style={styles.title}>Clienți</Text>
                <Pressable onPress={() => router.push("/add-client")} style={styles.addButton}>
                    <Text style={styles.addButtonText}>＋</Text>
                </Pressable>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Caută după nume sau companie..."
                value={search}
                onChangeText={setSearch}
            />

            {/* Lista de clienți */}
            <FlatList
                data={clients}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => router.push(`/clients/${item._id}`)}
                        style={styles.card}
                    >
                        <Text style={styles.clientName}>{item.name}</Text>
                        <Text style={styles.clientInfo}>📧 {item.email}</Text>
                        <Text style={styles.clientInfo}>🏢 {item.company}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        padding: 32,
    },
    header: {
        flexDirection: "row" as const,
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold" as const,
        color: "#22223b",
        letterSpacing: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: "#c9c9c9",
        borderRadius: 8,
        padding: 14,
        marginBottom: 20,
        backgroundColor: "#fff",
        fontSize: 16,
    },
    addButton: {
        backgroundColor: "#3a86ff",
        borderRadius: 20,
        width: 44,
        height: 44,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "bold" as const,
        marginTop: -2,
    },
    card: {
        backgroundColor: "#fff",
        padding: 22,
        borderRadius: 14,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    clientName: {
        fontSize: 20,
        fontWeight: "700" as const,
        marginBottom: 6,
        color: "#22223b",
    },
    clientInfo: {
        fontSize: 15,
        color: "#4a4e69",
        marginBottom: 2,
    },
};
