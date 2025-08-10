const mongoose = require("mongoose");

const OrderModel = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    payment_intent: {
      type: String,
      required: true,
    },
    price:{
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderModel);
