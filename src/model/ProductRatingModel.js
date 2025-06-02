const mongoose = require("mongoose");

const productRatingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    fk_product_id: {
      ref: "Product",
      type: mongoose.Schema.Types.ObjectId,
    },
    fk_user_id: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);


const ProductRating = mongoose.model("ProductRating", productRatingSchema);
module.exports = ProductRating;