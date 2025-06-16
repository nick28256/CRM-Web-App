const express = require("express");
const router = express.Router();
const { exportClients, exportOrders } = require("../controllers/exportController");

router.get("/clients", exportClients);
router.get("/orders", exportOrders);

module.exports = router;
