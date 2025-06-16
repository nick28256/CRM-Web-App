const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";
// const API_URL = "http://localhost:5000/api"; // for local development

export async function getDashboardData() {
  const res = await fetch(`${API_URL}/dashboard/overview`);
  return await res.json();
}
