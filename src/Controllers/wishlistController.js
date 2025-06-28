const { Types } = require("mongoose");
const logger = require("../utils/logger");
const ProductService = require("../service/Product");

const { WishListService } = require("../service/wishListService")

const addToWishList = async (req, res) => {
    try {
        const wishlistService = new WishListService();
        const productService = new ProductService();

        const { userId, productId } = req.body;
        if (!productId) {
            logger.error("Product Id is required");
            return res.status(400).json({ message: "something went wrong" });
        }
        if (!Types.ObjectId.isValid(productId)) {
            logger.error("Invalid Product Id");
            return res.status(400).json({ message: "Something went wrong" });
        }
        if (!userId) {
            logger.error("User Id is required");
            return res.status(400).json({ message: "Something went wrong" });
        }
        if (!Types.ObjectId.isValid(userId)) {
            logger.error("Invalid User Id");
            return res.status(400).json({ message: "Something went wrong" });
        }

        const existingProduct = await productService.getProductById(productId);
        if (!existingProduct) {
            logger.error("Product Not Found");
            return res.status(404).json({ message: "Something went wrong" });
        }
        const wishList = await wishlistService.getWishlist(userId);
        const existingWishList = wishList.find(
            (item) => item.fk_product_id._id.toString() === productId
        );
        if (existingWishList) {
            return res.status(400).json({ message: "Product already in wishlist." });
        }
        //  Add Product to wishlist
        if (!existingWishList) {
            await wishlistService.addToWishList(productId, userId);
            return res.json({
                message: "Product added to wishlist",
            });
        }

    } catch (err) {
        logger.error("error in adding to wishlist", err);
        res.status(500).json({ message: "Internal server error" });
    }

};
module.exports = { addToWishList };