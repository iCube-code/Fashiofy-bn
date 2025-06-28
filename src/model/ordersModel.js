const mongoose = require("mongoose");

const ordersSchema = new mongoose.Schema(
  {
    orderTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    deliveryTime: {
      type: Date,
      default: Date.now,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Ordered", "Shipped", "Delivered", "Cancelled"],
      default: "Ordered",
    },
    price: {
      type: Number,
      required: true,
    },
    count: {
      type: Number,
      required: true,
      default: 1,
    },
    delivaryCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    fk_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    fk_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", ordersSchema);
module.exports = Orders;
