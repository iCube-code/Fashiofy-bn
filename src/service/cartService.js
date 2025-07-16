const Cart = require("../model/cartModel");
const logger = require("../utils/logger");

class CartService {
  async getUserCartById(id) {
    const cart = await Cart.find({ fk_user_id: id })
      .populate({
        path: "fk_product_id",
        select: "_id name brand price size",
      })
      .select("fk_product_id count");
    return cart;
  }

  async getCartProducts(userId) {
    try {
      if (!userId) {
        logger.warn("User ID is required to fetch cart products");
        return { success: false, message: "User ID is required" };
      }

      const cartProducts = await Cart.find({ fk_user_id: userId }).populate(
        "fk_product_id"
      ).lean();

      return cartProducts;
    } catch (error) {
      logger.error(`Error in getCartProducts: ${error.message}`, error);
      return {
        success: false,
        message: "Internal server error occurred while fetching cart products",
      };
    }
  }

  async addToCart(productId, userId) {
    const cartItem = {
      fk_product_id: productId,
      fk_user_id: userId,
      count: 1,
    };
    const cart = await Cart.create(cartItem);
  }

  async updateCart(data) {
    await data.save();
  }
}

module.exports = { CartService };
