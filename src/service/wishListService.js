const WishList = require("../model/wishListModel");
const logger = require("../utils/logger");

class WishListService {
  async getWishlist(userId) {
    const wishlist = await WishList.find({ fk_user_id: userId }).populate({
      path: "fk_product_id",
    }).lean();
    return wishlist;
  }
  async addToWishList(productId, userId) {
    const wish = new WishList({
      fk_product_id: productId,
      fk_user_id: userId,
    });

    return await wish.save();
  }
  async getWishListItems(userId) {
    try {
      const fetchedWishList = await WishList.find({ fk_user_id: userId });

      if (!fetchedWishList || fetchedWishList.length === 0) {
        logger.warn(`Wishlist not found for UserId: ${userId}`);
        return {
          status: 404,
          message: "WishList Not Available",
          data: [],
        };
      }

      return {
        status: 200,
        message: "Fetched WishList Products",
        data: fetchedWishList,
      };
    } catch (error) {
      logger.error("Internal Server Error", error);
      return {
        status: 500,
        message: "Something Went Wrong",
      };
    }
  }
}

module.exports = { WishListService };
