const { Types } = require("mongoose");
const { CartService } = require("../service/cartService");
const ProductService = require("../service/Product");
const logger = require("../utils/logger");

const addToCart = async (req, res) => {
  try {
    const cartService = new CartService();
    const productService = new ProductService();

    // Validate the Req body
    const { productId, userId } = req.body;

    // Validate the Product ID
    if (!productId) {
      logger.error("Product Id is required");
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (!Types.ObjectId.isValid(productId)) {
      logger.error("Invalid Product Id");
      return res.status(400).json({ message: "Something went wrong" });
    }

    // Validate User ID
    if (!userId) {
      logger.error("User Id is required");
      return res.status(400).json({ message: "Something went wrong" });
    }

    if (!Types.ObjectId.isValid(userId)) {
      logger.error("Invalid User Id");
      return res.status(400).json({ message: "Something went wrong" });
    }

    // Check the Product Exists or not in DB
    const existingProduct = await productService.getProductById(productId);
    if (!existingProduct) {
      logger.error("Product Not Found");
      return res.status(404).json({ message: "Something went wrong" });
    }

    // Check Product Stock Availability
    if (existingProduct.stock <= 0) {
      logger.error("Product Out of Stock");
      return res.status(400).json({ message: "Something went wrong" });
    }

    // Get User Cart
    const cart = await cartService.getUserCartById(userId);

    // Check the Product exists before in user cart
    const existingProductInCart = cart.find(
      (item) => item.fk_product_id.id === productId
    );

    //  Add Product to Cart
    if (!existingProductInCart) {
      await cartService.addToCart(productId, userId);
      return res.json({
        message: "Product added to cart",
      });
    }

    // If product exists and its size matches Increment Quantity
    existingProductInCart.count += 1;
    await cartService.updateCart(existingProductInCart);

    return res.json({
      message: "Product added to cart",
    });
  } catch (e) {
    logger.error("ERROR IN ADDING TO CART", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//function to get all products in the cart for a user
async function getCartProducts(req, res) {
  const { userId } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cartService = new CartService();
    const cartProducts = await cartService.getCartProducts(userId);

    if (cartProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in the cart",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched cart products successfully",
      data: cartProducts,
    });
  } catch (error) {
    logger.error(
      `Internal server error in getCartProducts controller: ${error.message}`,
      { userId, error: error.stack }
    );

    return res.status(500).json({
      success: false,
      message: "Internal server error occurred while fetching cart products",
    });
  }
}

module.exports = { addToCart, getCartProducts };
