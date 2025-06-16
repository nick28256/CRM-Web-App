import { Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import Login from "../(auth)/login";
import { useAuth } from "../../lib/AuthProvider";

export default function TabsLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#3a86ff" />
            </View>
        );
    }

    if (!user) return <Login />;

    return (
        <>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: { display: "none" }, // Hide the tab bar
                }}
            />
            <Toast />
        </>
    );
}
