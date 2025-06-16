import axios from "axios";
import { auth } from "./firebase";

const API_URL = "http://localhost:5000/api/admin/users"; // Change to your backend URL

async function getIdToken() {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");
    return await user.getIdToken(true);
}

export async function listUsers() {
    const idToken = await getIdToken();
    const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${idToken}` }
    });
    return res.data;
}

export async function createUser(email: string, password: string, displayName?: string) {
    const idToken = await getIdToken();
    const res = await axios.post(API_URL, { email, password, displayName }, {
        headers: { Authorization: `Bearer ${idToken}` }
    });
    return res.data;
}

export async function updateUser(uid: string, updates: any) {
    const idToken = await getIdToken();
    const res = await axios.put(`${API_URL}/${uid}`, updates, {
        headers: { Authorization: `Bearer ${idToken}` }
    });
    return res.data;
}

export async function deleteUser(uid: string) {
    const idToken = await getIdToken();
    const res = await axios.delete(`${API_URL}/${uid}`, {
        headers: { Authorization: `Bearer ${idToken}` }
    });
    return res.data;
}