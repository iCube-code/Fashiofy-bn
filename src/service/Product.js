const Product = require("../model/ProductModel");
const ProductRating = require("../model/ProductRatingModel");
const ProductImage = require("../model/ProductImageModel");
const { default: mongoose } = require("mongoose");
const logger = require("../utils/logger");
const User = require("../model/UserModel");
const Orders = require("../model/ordersModel");
const Role = require("../model/roleModel");

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
      }).populate(
        "fk_product_id"
      ).lean();
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

      const user = await User.findById(sellerId).populate("fk_role_id");
      if (!user) throw new Error("Invalid seller");

      const roleName =
        user.fk_role_id?.roleName ||
        (await Role.findById(user.fk_role_id))?.roleName;

      if (roleName !== "Seller") {
        logger.warn(`Unauthorized role attempt: ${sellerId}`);
        throw new Error("You must be seller to add products");
      }

      if (!Array.isArray(productSize) || productSize.length === 0) {
        throw new Error("Product size must be a non-empty array");
      }

      if (!Array.isArray(productImages) || productImages.length === 0) {
        throw new Error("At least one image is required");
      }

      if (productImages.length > 5) {
        throw new Error("Maximum 5 images allowed");
      }

      const price = parseFloat(productPrice);
      const mrp = parseFloat(productMrp);
      const stock = parseInt(productStock);

      if (isNaN(price) || price <= 0) throw new Error("Invalid product price");
      if (isNaN(mrp) || mrp <= 0) throw new Error("Invalid product MRP");
      if (price > mrp)
        throw new Error("Product price cannot be greater than MRP");
      if (isNaN(stock) || stock < 0) throw new Error("Invalid product stock");

      const newProduct = new Product({
        name: productName.trim(),
        brand: productBrand.trim(),
        description: productDescription.trim(),
        category: productCategory.trim(),
        price,
        originalPrice: mrp,
        size: productSize.map((size) => size.toString().trim()),
        stock,
        fk_user_id: sellerId,
      });

      const savedProduct = await newProduct.save();

      const imagePromises = productImages.map(async (base64Image, index) => {
        if (
          !base64Image ||
          typeof base64Image !== "string" ||
          base64Image.length < 100
        ) {
          throw new Error(`Invalid image data at index ${index}`);
        }

        if (!base64Image.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
          throw new Error(`Invalid base64 format for image at index ${index}`);
        }

        return new ProductImage({
          image: base64Image,
          fk_product_id: savedProduct._id,
        }).save();
      });

      await Promise.all(imagePromises);

      logger.info(`Product added: ${savedProduct._id} by ${sellerId}`);

      return {
        status: 201,
        message: "Product added successfully",
        data: { productId: savedProduct._id },
      };
    } catch (error) {
      logger.error(`Error adding product: ${error.message}`, {
        sellerId,
        productName,
      });

      if (error.name === "ValidationError") {
        return {
          status: 400,
          message: "Validation failed",
          errors: Object.values(error.errors).map((err) => err.message),
        };
      }

      if (error.code === 11000) {
        return {
          status: 409,
          message: "Product with similar details already exists",
        };
      }

      const businessErrors = [
        "All fields are required",
        "Product size must be a non-empty array",
        "At least one image is required",
        "Maximum 5 images allowed",
        "Invalid product price",
        "Invalid product MRP",
        "Product price cannot be greater than MRP",
        "Invalid product stock",
        "Invalid seller",
        "You must be seller to add products",
      ];

      if (
        businessErrors.includes(error.message) ||
        error.message.includes("Invalid image data") ||
        error.message.includes("Invalid base64 format")
      ) {
        return { status: 400, message: error.message };
      }

      return {
        status: 500,
        message: "Failed to add product. Please try again later.",
      };
    }
  };
  getProduct = async(id)=>{
    const product = await Product.find(
      { fk_user_id: id }
    ).lean();
    return product;
  }
}

module.exports = ProductService;
