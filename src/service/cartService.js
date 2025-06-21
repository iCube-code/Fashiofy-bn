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
