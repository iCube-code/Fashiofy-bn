const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
  {
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
  {
    timestamps: true,
  }
);

const WishList = mongoose.model("WishList", wishListSchema);
module.exports = WishList;
