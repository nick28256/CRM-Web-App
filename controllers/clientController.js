const Client = require("../models/Client");


// Creare client nou
const createClient = async (req, res) => {
  try {
    const { name, email, phone, company, status, notes } = req.body;

    // Validare minimă
    if (!name || !email) {
      return res.status(400).json({ message: "Numele și emailul sunt obligatorii." });
    }

    // Creare client
    const client = new Client({ name, email, phone, company, status, notes });
    await client.save();

    res.status(201).json(client);
  } catch (error) {
    console.error("Eroare la crearea clientului:", error);
    res.status(500).json({ message: "Eroare la salvarea clientului." });
  }
};

// GET /api/clients
const getClients = async (req, res) => {
    try {
      const clients = await Client.find().sort({ createdAt: -1 });
      res.status(200).json(clients);
    } catch (error) {
      res.status(500).json({ message: "Eroare la preluarea clienților", error });
    }
  };

  const getClientById = async (req, res) => {
    try {
      const client = await Client.findById(req.params.id);
      if (!client) {
        return res.status(404).json({ message: "Clientul nu a fost găsit" });
      }
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ message: "Eroare la căutarea clientului", error });
    }
  };

  const updateClient = async (req, res) => {
    try {
      const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // returnează documentul actualizat
        runValidators: true, // validează în funcție de model
      });
  
      if (!client) {
        return res.status(404).json({ message: "Clientul nu a fost găsit" });
      }
  
      res.status(200).json(client);
    } catch (error) {
      res.status(500).json({ message: "Eroare la actualizarea clientului", error });
    }
  };

  const deleteClient = async (req, res) => {
    try {
      const client = await Client.findByIdAndDelete(req.params.id);
  
      if (!client) {
        return res.status(404).json({ message: "Clientul nu a fost găsit" });
      }
      await Order.deleteMany({ clientId: req.params.id }); // opțional: șterge comenzile clientului
      res.status(200).json({ message: "Client șters cu succes" });
    } catch (error) {
      res.status(500).json({ message: "Eroare la ștergerea clientului", error });
    }
  };
  
  
  

module.exports = {
  createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
};
