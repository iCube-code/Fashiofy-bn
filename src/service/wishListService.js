const WishList = require("../model/wishListModel");
const logger = require("../utils/logger");

class WishListService {
  async getWishlist(userId) {
    const wishlist = await WishList.find({ fk_user_id: userId }).populate({
      path: "fk_product_id",
      select: "_id name brand price size",
    });
    return wishlist;
  }
  async addToWishList(productId, userId) {
    const wish = new WishList({
      fk_product_id: productId,
      fk_user_id: userId,
    });

    return await wish.save();
  }
}

module.exports = { WishListService };
