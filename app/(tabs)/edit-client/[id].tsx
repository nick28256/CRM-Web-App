import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";



const API_URL = "http://localhost:5000/api";

export default function EditClient() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [client, setClient] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        notes: "",
        status: "",
    });
    const [status, setStatus] = useState(client?.status || "activ");


    useEffect(() => {
        axios.get(`${API_URL}/clients/${id}`)
            .then((res) => setClient(res.data))
            .catch((err) => Alert.alert("Eroare", "Nu s-a putut încărca clientul"));
    }, [id]);

    const validateForm = () => {
        if (!client.name.trim() || !client.email.trim() || !client.phone.trim() || !client.company.trim() || !client.status.trim()) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Toate câmpurile sunt obligatorii.",
            });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(client.email)) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Adresa de email nu este validă.",
            });
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(client.phone)) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Numărul de telefon trebuie să conțină 10 cifre.",
            });
            return false;
        }

        return true;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            await axios.put(`${API_URL}/clients/${id}`, {
                name: client.name,
                email: client.email,
                phone: client.phone,
                company: client.company,
                status: client.status,
            });
            Toast.show({
                type: "success",
                text1: "Succes",
                text2: "Clientul a fost actualizat.",
            });
            router.push("/clients");
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Actualizarea clientului a eșuat.",
            });
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Editează Client</Text>
                <TextInput
                    placeholder="Nume"
                    value={client.name}
                    onChangeText={(val) => setClient({ ...client, name: val })}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Email"
                    value={client.email}
                    onChangeText={(val) => setClient({ ...client, email: val })}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Telefon"
                    value={client.phone}
                    onChangeText={(val) => setClient({ ...client, phone: val })}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Companie"
                    value={client.company}
                    onChangeText={(val) => setClient({ ...client, company: val })}
                    style={styles.input}
                />
                <Text style={styles.label}>Status</Text>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => {
                        setStatus(itemValue);
                        setClient({ ...client, status: itemValue });
                    }}
                    style={styles.input}
                >
                    <Picker.Item label="Activ" value="activ" />
                    <Picker.Item label="Inactiv" value="inactiv" />
                    <Picker.Item label="În așteptare" value="în așteptare" />
                </Picker>
                <TextInput
                    placeholder="Note"
                    value={client.notes}
                    onChangeText={(val) => setClient({ ...client, notes: val })}
                    style={styles.input}
                />
                <View style={styles.button}>
                    <Text style={styles.buttonText} onPress={handleSubmit}>
                        Salvează modificările
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
