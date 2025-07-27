const mongoose = require("mongoose");

const ProductImageSchema = new mongoose.Schema(
  {
    image: {
      type: [String],
      required: true,
      trim: true,
      validate: {
        validator: function (img) {
          return img.length >= 1 && img.length <= 5;
        },
        message: "You can only upload Images Between 1 to 5",
      },
    },
    fk_product_id: {
      ref: "Product",
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const ProductImage = mongoose.model("ProductImage", ProductImageSchema);
module.exports = ProductImage;
