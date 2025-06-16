import { auth } from "./firebase";

export async function isAdminUser(): Promise<boolean> {
    const user = auth.currentUser;
    if (!user) return false;
    const idTokenResult = await user.getIdTokenResult();
    return !!idTokenResult.claims.admin;
}