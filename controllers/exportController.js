const { Parser } = require("json2csv");
const Client = require("../models/Client");
const Order = require("../models/Order");

const exportClients = async (req, res) => {
    try {
      const clients = await Client.find().lean();
      const fields = ["name", "email", "phone", "company"];
      const parser = new Parser({ fields });
      const csv = parser.parse(clients);
  
      // Adaugă BOM pentru a afișa corect diacriticele în Excel
      const csvWithBOM = '\uFEFF' + csv;
  
      res.header("Content-Type", "text/csv; charset=utf-8");
      res.attachment("clients.csv");
      return res.send(csvWithBOM);
    } catch (err) {
      res.status(500).json({ message: "Eroare la export clienți", error: err });
    }
  };
  

  const exportOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate("clientId", "name email").lean();
  
      console.log("Comenzi găsite:", orders.length);
  
      const formattedOrders = orders.map((order) => ({
        clientName: order.clientId?.name || "N/A",
        clientEmail: order.clientId?.email || "N/A",
        totalAmount: order.amount ?? 0,
        date: order.createdAt ? new Date(order.createdAt).toLocaleDateString("ro-RO") : "N/A",
        Description: order.description || "N/A",
        status: order.status || "N/A",
      }));
  
      const fields = ["clientName", "clientEmail", "totalAmount", "date", "Description", "Status"];
      const parser = new Parser({ fields });
      const csv = parser.parse(formattedOrders);
  
      // Adaugă BOM pentru suport UTF-8 în Excel
      const csvWithBOM = '\uFEFF' + csv;
  
      res.header("Content-Type", "text/csv; charset=utf-8");
      res.attachment("orders.csv");
      return res.send(csvWithBOM);
    } catch (err) {
      console.error("Eroare la export comenzi:", err);
      res.status(500).json({ message: "Eroare la export comenzi", error: err });
    }
  };
  
  

module.exports = {
  exportClients,
  exportOrders,
};
