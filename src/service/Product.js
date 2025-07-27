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
    try {
      if (!userId || !productId) {
        logger.warn("Missing required parameters: userId or productId");
        return {
          success: false,
          message: "User ID and Product ID are required",
        };
      }

      const existingOrder = await Orders.findOne({
        fk_product_id: productId,
        fk_user_id: userId,
      }).lean();

      if (existingOrder) {
        logger.warn(
          `Order already exists for user ${userId} and product ${productId}`
        );
        return { success: false, message: "Order already exists" };
      }

      const [user, product] = await Promise.all([
        User.findById(userId).select("_id").lean(),
        Product.findById(productId).select().lean(),
      ]);

      if (!user) {
        logger.warn(`User not found: ${userId}`);
        return { success: false, message: "User not found" };
      }

      if (!product) {
        logger.warn(`Product not found: ${productId}`);
        return { success: false, message: "Product not available" };
      }

      const newOrder = await Orders.create({
        status: "Ordered",
        price: product.originalPrice,
        fk_product_id: productId,
        fk_user_id: userId,
      });

      logger.info(`Order created successfully: ${newOrder._id}`);
      return {
        success: true,
        message: "Order created successfully",
        data: newOrder,
      };
    } catch (error) {
      logger.error(`Error in orderProduct: ${error.message}`, error);
      return {
        success: false,
        message: "Internal server error occurred while creating order",
      };
    }
  };

  getAllOrders = async (userId) => {
    try {
      if (!userId) {
        logger.warn("Missing required parameter: userId");
        return {
          success: false,
          message: "User ID is required",
        };
      }
      const orders = await Orders.find({
        fk_user_id: userId,
      }).lean();
      return orders;
    } catch (err) {
      logger.error(`Internal server error ${err.mesage}`);
      return res.status(500).json({
        success: false,
        mesage: "Internal server error",
      });
    }
  };

  addProduct = async (
    productName,
    productBrand,
    productDescription,
    productCategory,
    productPrice,
    productMrp,
    productSize,
    productStock,
    productImages,
    sellerId
  ) => {
    try {
      if (
        !productName ||
        !productBrand ||
        !productDescription ||
        !productCategory ||
        !productPrice ||
        !productMrp ||
        !productSize ||
        !productStock ||
        !sellerId
      ) {
        throw new Error("All fields are required");
      }

      if (!productImages || productImages.length === 0) {
        throw new Error("At least one image is required");
      }
      if (productImages.length > 5) {
        throw new Error("Maximum 5 images allowed");
      }

      const newProduct = new Product({
        name: productName,
        brand: productBrand,
        description: productDescription,
        category: productCategory,
        price: parseFloat(productPrice),
        originalPrice: parseFloat(productMrp),
        size: productSize,
        stock: parseInt(productStock),
        fk_user_id: sellerId,
      });

      await newProduct.save();

      const imagePromises = productImages.map((base64Image) =>
        new ProductImage({
          image: base64Image,
          fk_product_id: newProduct._id,
        }).save()
      );
      await Promise.all(imagePromises);

      return {
        status: 201,
        message: "Product added",
        productId: newProduct._id,
      };
    } catch (error) {
      console.error(`Error Adding Product: ${error.message}`, { error });
      return {
        status:
          error.message === "All fields are required" ||
          error.message === "At least one image is required" ||
          error.message === "Maximum 5 images allowed"
            ? 400
            : 500,
        message: error.message,
        error: error.message,
      };
    }
  };
}

module.exports = ProductService;
