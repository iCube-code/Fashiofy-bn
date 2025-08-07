const { Types, Promise } = require("mongoose");
const logger = require("../utils/logger");
const ProductService = require("../service/Product");

const { WishListService } = require("../service/wishListService");
const ProductImage = require("../model/ProductImageModel");

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

const getWishList = async (req, res) => {
  try {
    const user = req.user;

    const wishListService = new WishListService();
    const productService = new ProductService();
    const wishListResult = await wishListService.getWishlist(user._id);

    const images = await ProductImage.find();

    const wishlistProducts = wishListResult.map((prod) => {
      const wishlistProdImages = images
        .filter((i) => i.fk_product_id.toString() === prod.fk_product_id._id.toString())
        .map((img) => img.image);
      const { fk_user_id, ...productData } = prod;
      return {
        ...productData,
        images: wishlistProdImages,
      };
    });

    if (wishlistProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in the wishlist",
      });
    }
    // let wishListProducts = [];

    // if (wishListResult.data && wishListResult.data.length > 0) {
    //   for (let i = 0; i < wishListResult.data.length; i++) {
    //     const product = await productService.getProductById(
    //       wishListResult.data[i].fk_product_id
    //     );

    //     const reviewsAndRating =
    //       await productService.getRatingsAndCommentsOfProduct(
    //         wishListResult.data[i].fk_product_id
    //       );

    //     let averageRating = 0;
    //     let reviewsCount = 0;

    //     if (reviewsAndRating && reviewsAndRating.length > 0) {
    //       const totalRating = reviewsAndRating.reduce(
    //         (sum, review) => sum + review.rating,
    //         0
    //       );
    //       averageRating =
    //         Math.round((totalRating / reviewsAndRating.length) * 10) / 10;
    //       reviewsCount = reviewsAndRating.length;
    //     }

    //     const productImage = await productService.getProductImagesById(
    //       wishListResult.data[i].fk_product_id
    //     );

    //     wishListProducts.push({
    //       _id: product._id,
    //       name: product.name,
    //       brand: product.brand,
    //       category: product.category,
    //       price: product.price,
    //       originalPrice: product.originalPrice,
    //       description: product.description,
    //       size: product.size,
    //       stock: product.stock,
    //       rating: averageRating,
    //       reviews: reviewsCount,
    //       images: productImage || [],
    //     });
    //   }
    // }

    res
      .status(200)
      .json({ message: wishListResult.message, data: wishlistProducts });
  } catch (error) {
    logger.error("Internal Server Error", error);
    res.status(500).json({
      message: "Something Went Wrong",
    });
  }
};

module.exports = { addToWishList, getWishList };
