const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["în așteptare", "confirmată", "anulată"],
      default: "în așteptare",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
