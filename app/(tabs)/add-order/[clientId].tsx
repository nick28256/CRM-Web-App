import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import Toast from "react-native-toast-message";

const API_URL = "http://localhost:5000/api";

export default function AddOrder() {
    const { clientId } = useLocalSearchParams();
    const router = useRouter();

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState("în așteptare");

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
            await axios.post(`${API_URL}/orders`, {
                clientId,
                description,
                amount: Number(amount),
                status,
            });
            Toast.show({
                type: "success",
                text1: "Succes",
                text2: "Comanda a fost adăugată.",
            });
            router.push(`/clients/${clientId}`);
        } catch (error) {
            console.error("Eroare la adăugare comandă:", error);
            alert("A apărut o eroare. Încearcă din nou.");
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Adaugă Comandă</Text>

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

                <Text style={styles.label}>Status:</Text>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={styles.input}
                >
                    <Picker.Item label="În așteptare" value="în așteptare" />
                    <Picker.Item label="Confirmată" value="confirmată" />
                    <Picker.Item label="Anulată" value="anulată" />
                </Picker>

                <View style={styles.button}>
                    <Text style={styles.buttonText} onPress={handleSubmit}>
                        Salvează Comanda
                    </Text>
                </View>
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
