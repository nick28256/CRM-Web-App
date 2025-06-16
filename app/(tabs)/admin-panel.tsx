import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { createUser, deleteUser, listUsers, updateUser } from "../../lib/adminApi";
import { isAdminUser } from "../../lib/authUtils";
import { auth } from "../../lib/firebase";

export default function AdminPanel() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [admin, setAdmin] = useState(false);

    // For updating
    const [editUid, setEditUid] = useState<string | null>(null);
    const [editDisplayName, setEditDisplayName] = useState("");
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [editPassword, setEditPassword] = useState("");

    // For deleting
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    // For creating
    const [showCreateUserModal, setShowCreateUserModal] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError("");
            try {
                const isAdmin = await isAdminUser();
                setAdmin(isAdmin);
                if (isAdmin) {
                    await fetchUsers();
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await listUsers();
            setUsers(data.users || data); // Adjust based on backend response
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        setLoading(true);
        setError("");
        try {
            await createUser(email, password, displayName);
            setEmail("");
            setPassword("");
            setDisplayName("");
            await fetchUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!editUid) return;
        setLoading(true);
        setError("");
        try {
            const updates: any = { displayName: editDisplayName };
            if (editPassword) updates.password = editPassword;
            await updateUser(editUid, updates);
            await fetchUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (uid: string) => {
        setLoading(true);
        setError("");
        try {
            await deleteUser(uid);
            await fetchUsers();
            Toast.show({
                type: "success",
                text1: "Utilizator șters cu succes",
            });
        } catch (err: any) {
            setError(err.message);
            Toast.show({
                type: "error",
                text1: "Eroare la ștergere",
                text2: err.message,
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

    if (!admin) {
        return (
            <View style={styles.container}>
                <Text style={styles.error}>Nu ai drepturi de administrator.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Panou Administrator</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Create User */}
            <Button
                title="Creează utilizator"
                onPress={() => setShowCreateUserModal(true)}
                color="#3a86ff"
            />

            {/* List Users */}
            <Text style={styles.subtitle}>Utilizatori existenți</Text>
            <FlatList
                data={users.filter(u => u.uid !== auth.currentUser?.uid)}
                keyExtractor={item => item.uid}
                renderItem={({ item }) => (
                    <View style={styles.userRow}>
                        <Text style={styles.userInfo}>{item.email} {item.displayName ? `(${item.displayName})` : ""}</Text>
                        <View style={styles.buttonGroup}>
                            <Pressable
                                style={[styles.actionButton, styles.deleteButton]}
                                onPress={() => {
                                    setUserToDelete(item.uid);
                                    setShowDeleteUserModal(true);
                                }}
                            >
                                <Text style={styles.actionButtonText}>Șterge</Text>
                            </Pressable>
                            <Pressable
                                style={styles.actionButton}
                                onPress={() => {
                                    setEditUid(item.uid);
                                    setEditDisplayName(item.displayName || "");
                                    setEditPassword(""); // clear password field
                                    setShowEditUserModal(true);
                                }}
                            >
                                <Text style={styles.actionButtonText}>Editează</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            />

            {/* Delete User Confirmation Modal */}
            <Modal visible={showDeleteUserModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 18, color: "#22223b" }}>
                            Ești sigur că vrei să ștergi acest utilizator?
                        </Text>
                        <View style={styles.modalButtonRow}>
                            <Pressable
                                style={[styles.modalButton, styles.modalCancel]}
                                onPress={() => setShowDeleteUserModal(false)}
                            >
                                <Text style={{ color: "#22223b", fontWeight: "bold" }}>Anulează</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, styles.modalDelete]}
                                onPress={async () => {
                                    if (userToDelete) {
                                        await handleDelete(userToDelete);
                                    }
                                    setShowDeleteUserModal(false);
                                    setUserToDelete(null);
                                }}
                            >
                                <Text style={styles.modalDeleteText}>Șterge</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Create User Modal */}
            <Modal visible={showCreateUserModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContentWide}>
                        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 22, color: "#22223b", textAlign: "center" }}>
                            Creează utilizator nou
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Parolă"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Nume afișat"
                            value={displayName}
                            onChangeText={setDisplayName}
                        />
                        <View style={styles.modalButtonRow}>
                            <Pressable
                                style={[styles.modalButton, styles.modalCancel]}
                                onPress={() => {
                                    setShowCreateUserModal(false);
                                    setEmail("");
                                    setPassword("");
                                    setDisplayName("");
                                }}
                            >
                                <Text style={{ color: "#22223b", fontWeight: "bold" }}>Anulează</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: "#3a86ff" }]}
                                onPress={async () => {
                                    await handleCreate();
                                    setShowCreateUserModal(false);
                                }}
                                disabled={loading || !email || !password}
                            >
                                <Text style={styles.modalDeleteText}>Creează</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Edit User Modal */}
            <Modal visible={showEditUserModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContentWide}>
                        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 22, color: "#22223b", textAlign: "center" }}>
                            Editează utilizator
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nume afișat nou"
                            value={editDisplayName}
                            onChangeText={setEditDisplayName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Parolă nouă (opțional)"
                            value={editPassword}
                            onChangeText={setEditPassword}
                            secureTextEntry
                        />
                        <View style={styles.modalButtonRow}>
                            <Pressable
                                style={[styles.modalButton, styles.modalCancel]}
                                onPress={() => {
                                    setShowEditUserModal(false);
                                    setEditUid(null);
                                    setEditDisplayName("");
                                    setEditPassword("");
                                }}
                            >
                                <Text style={{ color: "#22223b", fontWeight: "bold" }}>Anulează</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: "#3a86ff" }]}
                                onPress={async () => {
                                    await handleUpdate();
                                    setShowEditUserModal(false);
                                    setEditUid(null);
                                    setEditDisplayName("");
                                    setEditPassword("");
                                }}
                                disabled={loading || !editUid}
                            >
                                <Text style={styles.modalDeleteText}>Salvează</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
        backgroundColor: "#f4f6f8",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 24,
        color: "#22223b",
        letterSpacing: 1,
        textAlign: "center",
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "600",
        marginTop: 32,
        marginBottom: 12,
        color: "#4a4e69",
    },
    input: {
        borderWidth: 1,
        borderColor: "#c9c9c9",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: "#fff",
        fontSize: 16,
    },
    error: {
        color: "#d90429",
        marginBottom: 16,
        textAlign: "center",
        fontWeight: "bold",
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    userInfo: {
        flex: 1,
        fontSize: 16,
        color: "#22223b",
    },
    buttonGroup: {
        flexDirection: "row",
        gap: 8,
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 6,
        marginLeft: 8,
        backgroundColor: "#3a86ff",
        alignItems: "center",
        justifyContent: "center",
    },
    actionButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    deleteButton: {
        backgroundColor: "#d90429",
    },
    editBox: {
        marginTop: 24,
        padding: 16,
        borderWidth: 1,
        borderColor: "#c9c9c9",
        borderRadius: 8,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modalContent: {
        width: "90%",
        maxWidth: 480,
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 32,
        paddingHorizontal: 32,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    modalContentWide: {
        width: "90%",
        maxWidth: 480,
        backgroundColor: "#fff",
        borderRadius: 16,
        paddingVertical: 32,
        paddingHorizontal: 32,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    modalButtonRow: {
        flexDirection: "row",
        gap: 16,
        marginTop: 18,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    modalCancel: {
        backgroundColor: "#e0e1dd",
    },
    modalDelete: {
        backgroundColor: "#d90429",
    },
    modalDeleteText: {
        color: "#fff",
        fontWeight: "bold",
    },
});