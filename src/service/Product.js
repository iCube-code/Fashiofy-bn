const Product = require("../model/ProductModel");
const ProductRating = require("../model/ProductRatingModel");
const ProductImage = require("../model/ProductImageModel");
const { default: mongoose } = require("mongoose");
const logger = require("../utils/logger");

class ProductService {
   async getProducts() {
        try {
            const result = await Product.find().lean();
            return result;
        } catch (err) {
           logger.error("Error in getting all products", err);
        }
    }
  getProductById = async (id) => {
    const product = await Product.findOne({ _id: id }, { fk_user_id: 0 })
      .lean();
    return product;
  };

  getRatingsAndCommentsOfProduct = async (productId) => {
    const ratingsAndComments = await ProductRating.find({
      fk_product_id: new mongoose.Types.ObjectId(productId),
    });
    return ratingsAndComments;
  };

  getProductImagesById = async (productId) => {
    const productImages = (
      await ProductImage.find({ fk_product_id: new mongoose.Types.ObjectId(productId) })
    ).map((eachImg) => eachImg.image);
    return productImages;
  };
}

module.exports = ProductService;
