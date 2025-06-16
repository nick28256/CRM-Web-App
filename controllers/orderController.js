const Order = require("../models/Order");

// Create
const createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Eroare la creare comandă", error });
  }
};

// Get all
const getOrders = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter).populate("clientId", "name email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Eroare la preluare comenzi", error });
  }
};


// Get one
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("clientId");
    if (!order) return res.status(404).json({ message: "Comanda nu a fost găsită" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Eroare la căutare comandă", error });
  }
};

// Update
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!order) return res.status(404).json({ message: "Comanda nu a fost găsită" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Eroare la actualizare comandă", error });
  }
};

// Delete
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Comanda nu a fost găsită" });
    res.status(200).json({ message: "Comandă ștearsă cu succes" });
  } catch (error) {
    res.status(500).json({ message: "Eroare la ștergere comandă", error });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
