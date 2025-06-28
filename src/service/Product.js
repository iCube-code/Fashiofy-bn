const Product = require("../model/ProductModel");
const ProductRating = require("../model/ProductRatingModel");
const ProductImage = require("../model/ProductImageModel");
const { default: mongoose } = require("mongoose");
const logger = require("../utils/logger");
const User = require("../model/UserModel");
const Orders = require("../model/ordersModel");

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
    const product = await Product.findOne(
      { _id: id },
      { fk_user_id: 0 }
    ).lean();
    return product;
  };

  getRatingsAndCommentsOfProduct = async (productId) => {
    const ratingsAndComments = await ProductRating.find({
      fk_product_id: new mongoose.Types.ObjectId(productId),
    }).populate("fk_user_id", "firstName lastName -_id");
    return ratingsAndComments;
  };

  getProductImagesById = async (productId) => {
    const productImages = (
      await ProductImage.find({
        fk_product_id: new mongoose.Types.ObjectId(productId),
      })
    ).map((eachImg) => eachImg.image);
    return productImages;
  };

  orderProduct = async (userId, productId) => {
    const isUserExists = await User.findById({ _id: userId })
      .select("_id")
      .lean();

    if (!isUserExists) {
      logger.warn("UserId not found");
      return "User with this ID not found";
    }

    const isProductAvailable = await Product.findById({
      _id: productId,
    }).lean();

    if (!isProductAvailable) {
      logger.warn("Product with ID not found");
      return "Product is not available";
    }

    const insertOrderIntoDb = await Orders.create({
      status: "Ordered",
      price: isProductAvailable.originalPrice,
      fk_product_id: isProductAvailable._id,
      fk_user_id: isUserExists._id,
    });

    if (!insertOrderIntoDb) {
      logger.warn("Something went wrong while creating order");
      return "Error creating order";
    }

    return insertOrderIntoDb;
  };
}

module.exports = ProductService;
