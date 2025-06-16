import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import Toast from "react-native-toast-message";

const API_URL = "http://localhost:5000/api"; // Înlocuiește cu IP-ul tău real dacă e nevoie

export default function EditOrder() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("în așteptare");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`${API_URL}/orders/${id}`);
                const order = res.data;
                setDescription(order.description);
                setAmount(order.amount.toString());
                setStatus(order.status);
                setError(""); // clear error if found
            } catch (error) {
                setError("Comanda nu a fost găsită.");
                Toast.show({
                    type: "error",
                    text1: "Eroare",
                    text2: "Nu s-au putut încărca detaliile comenzii.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const validateForm = () => {
        if (!description.trim() || !amount || !status.trim()) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Toate câmpurile sunt obligatorii.",
            });
            return false;
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Suma trebuie să fie un număr valid.",
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(`${API_URL}/orders/${id}`, {
                description,
                amount,
                status,
            });

            Toast.show({
                type: "success",
                text1: "Succes",
                text2: "Comanda a fost actualizată.",
            });

            router.back();
        } catch (error) {
            console.error("Eroare la actualizare:", error);
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Actualizarea a eșuat.",
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Se încarcă...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Editează Comanda</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Descriere"
                    value={description}
                    onChangeText={setDescription}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Suma (RON)"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <Text style={styles.label}>Status</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={status}
                        onValueChange={(itemValue) => setStatus(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="În așteptare" value="în așteptare" />
                        <Picker.Item label="Confirmată" value="confirmată" />
                        <Picker.Item label="Anulată" value="anulată" />
                    </Picker>
                </View>

                <Pressable style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Salvează modificările</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f6f8",
        padding: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 32,
        width: "100%",
        maxWidth: 420,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
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
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
        color: "#4a4e69",
        fontWeight: "600",
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: "#c9c9c9",
        borderRadius: 8,
        marginBottom: 18,
        backgroundColor: "#f9f9fb",
        overflow: "hidden",
    },
    picker: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontSize: 16,
        backgroundColor: "#f9f9fb",
        color: "#22223b",
        borderRadius: 8,
        borderWidth: 0,
    },
    button: {
        backgroundColor: "#3a86ff",
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
        letterSpacing: 1,
    },
});
