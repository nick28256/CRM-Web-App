/*const express = require("express");
const router = express.Router();
const { createClient, getClients, getClientById, updateClient, deleteClient } = require("../controllers/clientController");

// POST /api/clients
router.post("/", createClient);
// GET /api/clients
router.get("/", getClients);
// GET /api/clients/:id
router.get("/:id", getClientById);
// PUT /api/clients/:id
router.put("/:id", updateClient);
// DELETE /api/clients/:id
router.delete("/:id", deleteClient);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const Client = require("../models/Client");
const Order = require('../models/Order');
const { deleteClient } = require('../controllers/clientController');


// GET /api/clients
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } }
      ];
    }
    const clients = await Client.find(filter);
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: "Eroare la preluarea clienților", error: err });
  }
});

// GET /api/clients/:id
router.get("/:id", async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Clientul nu a fost găsit." });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: "Eroare la preluarea clientului", error: err });
  }
});

// GET /api/clients/:id/orders
router.get('/:id/orders', async (req, res) => {
  try {
    const orders = await Order.find({ clientId: req.params.id });
    res.json(orders);
  } catch (err) {
    console.error("Eroare la preluarea comenzilor:", err);
    res.status(500).json({ message: 'Eroare la preluarea comenzilor' });
  }
});

// Actualizare client
router.put("/:id", async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!client) {
      return res.status(404).json({ message: "Clientul nu a fost găsit" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Eroare la actualizarea clientului", error });
  }
});

// Adaugă un client nou
router.post("/", async (req, res) => {
  try {
    const newClient = new Client({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company,
      status: req.body.status || "activ",
      notes: req.body.notes || "",
    });

    const savedClient = await newClient.save();
    res.status(201).json(savedClient);
  } catch (err) {
    console.error("Eroare la salvarea clientului:", err);
    res.status(500).json({ message: "Eroare la adăugarea clientului." });
  }
});

// DELETE /api/clients/:id
router.delete("/:id", async (req, res) => {
  try {
    const clientId = req.params.id;

    // Șterge toate comenzile asociate clientului
    await Order.deleteMany({ clientId });

    // Apoi șterge clientul
    await Client.findByIdAndDelete(clientId);

    res.status(200).json({ message: "Client șters cu succes." });
  } catch (err) {
    console.error("Eroare la ștergerea clientului:", err);
    res.status(500).json({ error: "Eroare la ștergerea clientului." });
  }
});

router.delete("/:id", deleteClient);

module.exports = router;