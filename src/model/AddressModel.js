const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  landmark: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  pincode: {
    type: Number,
    required: true,
  },
  fk_user_id: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
  },
}, { timestamps: true });


const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
