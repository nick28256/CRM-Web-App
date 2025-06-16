import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Toast from "react-native-toast-message";
import Login from "../(auth)/login";
import { useAuth } from "../../lib/AuthProvider";

const screenWidth = Dimensions.get("window").width;
const API_URL = "http://localhost:5000/api"; // Schimbă cu IP-ul real dacă testezi pe telefon

export default function Dashboard() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${API_URL}/stats`);
                setStats(res.data);
                console.log("Stats data:", res.data); // Add this line
            } catch (err) {
                console.error("Eroare la preluarea statisticilor:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (authLoading) return null; // sau un spinner de încărcare

    if (!user) return <Login />;

    if (loading) {
        return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
    }

    if (!stats) {
        return <Text style={styles.errorText}>Eroare la încărcarea statisticilor.</Text>;
    }

    const formatLabels = (data: any[]) => data.map((item) => item.date.slice(5)); // MM-DD

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.greeting}>Salut,</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.title}>📊 Dashboard</Text>

            <View style={styles.cards}>
                <Pressable
                    style={({ hovered }) => [
                        styles.card,
                        { backgroundColor: "#007AFF", transform: hovered ? [{ scale: 1.04 }] : [{ scale: 1 }] }
                    ]}
                    onPress={() => router.push("/clients")}
                >
                    <Text style={styles.cardTitle}>👥 Clienți</Text>
                    <Text style={styles.cardValue}>{stats.totalClients}</Text>
                </Pressable>

                <Pressable
                    style={({ hovered }) => [
                        styles.card,
                        { backgroundColor: "#FFA500", transform: hovered ? [{ scale: 1.04 }] : [{ scale: 1 }] }
                    ]}
                    onPress={() => router.push("/orders")}
                >
                    <Text style={styles.cardTitle}>📦 Comenzi</Text>
                    <Text style={styles.cardValue}>{stats.totalOrders}</Text>
                </Pressable>
            </View>

            <Text style={styles.chartTitle}>📅 Comenzi pe ultimele 7 zile</Text>
            <LineChart
                data={{
                    labels: Array.isArray(stats.ordersPerDay) ? formatLabels(stats.ordersPerDay) : [],
                    datasets: [{ data: Array.isArray(stats.ordersPerDay) ? stats.ordersPerDay.map((d: any) => d.count) : [] }],
                }}
                width={screenWidth - 40}
                height={200}
                chartConfig={chartConfig}
                style={styles.chart}
            />

            <Text style={styles.chartTitle}>💸 Suma totală pe ultimele 7 zile</Text>
            <LineChart
                data={{
                    labels: Array.isArray(stats.totalAmountPerDay) ? formatLabels(stats.totalAmountPerDay) : [],
                    datasets: [{ data: Array.isArray(stats.totalAmountPerDay) ? stats.totalAmountPerDay.map((d: any) => d.amount) : [] }],
                }}
                width={screenWidth - 40}
                height={200}
                chartConfig={chartConfig}
                style={styles.chart}
            />

            <Text style={styles.chartTitle}>👤 Clienți noi pe ultimele 7 zile</Text>
            <LineChart
                data={{
                    labels: Array.isArray(stats.clientsPerDay) ? formatLabels(stats.clientsPerDay) : [],
                    datasets: [{ data: Array.isArray(stats.clientsPerDay) ? stats.clientsPerDay.map((d: any) => d.count) : [] }],
                }}
                width={screenWidth - 40}
                height={200}
                chartConfig={chartConfig}
                style={styles.chart}
            />
            <View style={styles.exportButtonsContainer}>
                <Pressable
                    style={[styles.exportButton, { backgroundColor: "#34C759" }]}
                    onPress={async () => {
                        setLoading(true);
                        try {
                            const res = await axios.get(`${API_URL}/export/clients`, {
                                responseType: "blob",
                            });
                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "clients.csv");
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            Toast.show({ type: "success", text1: "Export clienți reușit" });
                        } catch (err) {
                            console.error(err);
                            Toast.show({ type: "error", text1: "Eroare la export clienți" });
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    <Text style={styles.exportButtonText}>⬇️ Exportă Clienți</Text>
                </Pressable>

                <Pressable
                    style={[styles.exportButton, { backgroundColor: "#FF9500" }]}
                    onPress={async () => {
                        setLoading(true);
                        try {
                            const res = await axios.get(`${API_URL}/export/orders`, {
                                responseType: "blob",
                            });
                            const url = window.URL.createObjectURL(new Blob([res.data]));
                            const link = document.createElement("a");
                            link.href = url;
                            link.setAttribute("download", "orders.csv");
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            Toast.show({ type: "success", text1: "Export comenzi reușit" });
                        } catch (err) {
                            console.error(err);
                            Toast.show({ type: "error", text1: "Eroare la export comenzi" });
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    <Text style={styles.exportButtonText}>⬇️ Exportă Comenzi</Text>
                </Pressable>
            </View>

            {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}

        </ScrollView>
    );
}

const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
    labelColor: () => "#333",
    propsForDots: { r: "5", strokeWidth: "2", stroke: "#007AFF" },
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        paddingBottom: 50,
        backgroundColor: "#f4f6f8",
        minHeight: "100%",
    },
    greeting: {
        fontSize: 18,
        color: "#4a4e69",
        marginBottom: 2,
        fontWeight: "600",
        textAlign: "center",
    },
    userEmail: {
        fontSize: 16,
        color: "#22223b",
        marginBottom: 18,
        textAlign: "center",
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 18,
        color: "#22223b",
        textAlign: "center",
        letterSpacing: 1,
    },
    cards: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 32,
        gap: 20,
    },
    card: {
        flex: 1,
        borderRadius: 18,
        padding: 28,
        marginHorizontal: 4,
        shadowColor: "#000",
        shadowOpacity: 0.10,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 5,
        alignItems: "center",
        justifyContent: "center",
        transitionProperty: "transform",
        transitionDuration: "0.2s",
    },
    cardTitle: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "700",
        marginBottom: 6,
        letterSpacing: 0.5,
    },
    cardValue: {
        fontSize: 34,
        color: "#fff",
        fontWeight: "bold",
        marginTop: 2,
        marginBottom: 2,
        letterSpacing: 1,
    },
    chartTitle: {
        fontSize: 19,
        fontWeight: "700",
        marginTop: 28,
        marginBottom: 12,
        color: "#22223b",
        textAlign: "center",
    },
    chart: {
        borderRadius: 16,
        backgroundColor: "#fff",
        paddingVertical: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    errorText: {
        padding: 20,
        fontSize: 16,
        color: "#d90429",
        textAlign: "center",
    },
    exportButtonsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 18,
        marginTop: 36,
        marginBottom: 20,
    },
    exportButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 22,
        borderRadius: 14,
        elevation: 3,
        marginHorizontal: 6,
    },
    exportButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15,
        letterSpacing: 1,
    },
});
