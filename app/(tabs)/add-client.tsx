import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";



const API_URL = "http://localhost:5000/api";

export default function AddClient() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");
    const [status, setStatus] = useState("activ");
    const [notes, setNotes] = useState("");

    const validateForm = () => {
        if (!name.trim() || !email.trim() || !phone.trim() || !company.trim() || !status.trim()) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Toate câmpurile sunt obligatorii.",
            });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Adresa de email nu este validă.",
            });
            return false;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Numărul de telefon trebuie să conțină 10 cifre.",
            });
            return false;
        }
        if (status !== "activ" && status !== "inactiv") {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Statusul trebuie să fie 'activ' sau 'inactiv'.",
            });
            return false;
        }
        return true;
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            await axios.post(`${API_URL}/clients`, {
                name,
                email,
                phone,
                company,
                status,
                notes
            });

            Toast.show({
                type: "success",
                text1: "Succes",
                text2: "Clientul a fost adăugat.",
            });
            router.push("/clients");
        } catch (err) {
            Toast.show({
                type: "error",
                text1: "Eroare",
                text2: "Adăugarea clientului a eșuat.",
            });
            console.error(err);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Adaugă client nou</Text>

                <TextInput placeholder="Nume complet *" value={name} onChangeText={setName} style={styles.input} />
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
                <TextInput placeholder="Telefon" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
                <TextInput placeholder="Companie" value={company} onChangeText={setCompany} style={styles.input} />
                <Text style={styles.label}>Status</Text>
                <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={styles.input}
                >
                    <Picker.Item label="Activ" value="activ" />
                    <Picker.Item label="Inactiv" value="inactiv" />
                    <Picker.Item label="În așteptare" value="în așteptare" />
                </Picker>
                <TextInput placeholder="Note (opțional)" value={notes} onChangeText={setNotes} style={[styles.input, { height: 80 }]} multiline />

                <Pressable onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>Adaugă Client</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
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

