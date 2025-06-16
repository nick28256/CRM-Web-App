const Client = require("../models/Client");
const Order = require("../models/Order");

// Total clienți + comenzi + valoare totală per client
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      return d;
    }).reverse();

    // Total comenzi și clienți
    const totalOrders = await Order.countDocuments();
    const totalClients = await Client.countDocuments();

    // Comenzi pe ultimele 7 zile + suma totală
    const orders = await Order.find({
      createdAt: { $gte: last7Days[0] }
    });

    const ordersPerDay = last7Days.map((day, i) => {
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      const dailyOrders = orders.filter(order =>
        order.createdAt >= day && order.createdAt < nextDay
      );
      return {
        date: day.toISOString().split("T")[0],
        count: dailyOrders.length,
        totalAmount: dailyOrders.reduce((sum, o) => sum + o.amount, 0)
      };
    });

    // Clienți noi pe ultimele 7 zile
    const clients = await Client.find({ createdAt: { $gte: last7Days[0] } });
    const clientsPerDay = last7Days.map((day, i) => {
      const nextDay = new Date(day);
      nextDay.setDate(day.getDate() + 1);
      const dailyClients = clients.filter(client =>
        client.createdAt >= day && client.createdAt < nextDay
      );
      return {
        date: day.toISOString().split("T")[0],
        count: dailyClients.length,
      };
    });

    res.json({
      totalOrders,
      totalClients,
      ordersPerDay,
      totalAmountPerDay: ordersPerDay.map(o => ({
        date: o.date,
        amount: o.totalAmount
      })),
      clientsPerDay,
    });

  } catch (error) {
    console.error("Eroare la preluarea statisticilor:", error);
    res.status(500).json({ message: "Eroare la preluarea statisticilor" });
  }
};

module.exports = { getDashboardStats };