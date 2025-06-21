const { Types } = require("mongoose");
const { CartService } = require("../service/cartService");
const ProductService = require("../service/Product");
const logger = require("../utils/logger");

const addToCart = async (req, res) => {
  try {
    const cartService = new CartService();
    const productService = new ProductService();

    // Logged In User
    const { user } = req;

    // Get User Cart
    const cart = await cartService.getUserCartById(user.id);

    // Validate the Req body
    const { productId } = req.body;

    if (!productId) {
      logger.error("Product Id is required");
      return res.status(400).json({ message: "Product Id is required" });
    }

    if (!Types.ObjectId.isValid(productId)) {
      logger.error("Invalid Product Id");
      return res.status(400).json({ message: "Invalid Product Id" });
    }

    // Check the Product Exists or not in DB
    const existingProduct = await productService.getProductById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    // Check Product Stock Availability
    if (existingProduct.stock <= 0) {
      return res.status(400).json({ message: "Product Out of Stock" });
    }

    // Check the Product exists before in user cart
    const existingProductInCart = cart.find(
      (item) => item.fk_product_id.id === productId
    );
    
    //  Add Product to Cart
    if (!existingProductInCart) {
      await cartService.addToCart(productId, user.id);
      return res.json({
        message:'Product added to cart'
      })
    }

    // If product exists and its size matches Increment Quantity
    existingProductInCart.count += 1;
    await cartService.updateCart(existingProductInCart);
    
    return res.json({
      message:"Product added to cart",
    });

  } catch (e) {
    logger.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addToCart };
