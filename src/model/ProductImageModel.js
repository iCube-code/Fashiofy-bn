const mongoose = require("mongoose");


const ProductImageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        trim: true,
    },
    fk_product_id: {
        ref: "Product",
        type: mongoose.Schema.Types.ObjectId,
    },
},{timestamps:true});


const ProductImage = mongoose.model("ProductImage", ProductImageSchema);
module.exports = ProductImage;