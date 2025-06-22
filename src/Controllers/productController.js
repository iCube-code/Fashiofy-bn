const { Types } = require("mongoose");
const ProductService = require("../service/Product.js");
const ProductRating = require("../model/ProductRatingModel.js");
const ProductImage = require("../model/ProductImageModel");
const logger = require("../utils/logger.js");

// API for Fetch Product By ID
const getProductById = async (req, res) => {
  try {
    const productService = new ProductService();

    // Product ID must be a valid UUID
    const { id } = req.params;

    // TODO Validate the ID
    if (!id) {
      logger.error("Product ID is required");
      return res.status(400).json({
        message: "Something went wrong",
      });
    }

    // Validate the ID
    if (!Types.ObjectId.isValid(id)) {
      logger.error("Invalid Product ID");
      return res.status(400).json({
        message: "Something went wrong",
      });
    }

    // Check the Product Exists Or not
    const product = await productService.getProductById(id);
    if (!product) {
      logger.error("Product Not Found");
      return res.status(404).json({
        message: "Product Not Found",
      });
    }

    // Get all reviews and ratings of Product By ID
    const ratingsAndCommentsOfProduct =
      await productService.getRatingsAndCommentsOfProduct(id);

    // Avg rating of the Product
    let avgRating = 0;
    if (ratingsAndCommentsOfProduct.length > 0) {
      avgRating =
        ratingsAndCommentsOfProduct.reduce(
          (acc, rating) => acc + rating.rating,
          0
        ) / ratingsAndCommentsOfProduct.length;
    }

    // User Comments on Product
    const comments = ratingsAndCommentsOfProduct.map((eachComment) => {
      return {
        _id: eachComment._id,
        comment: eachComment.comment,
        rating: eachComment.rating,
        user:
          eachComment.fk_user_id.firstName +
          " " +
          eachComment.fk_user_id.lastName,
      };
    });

    // Product Images
    const images = await productService.getProductImagesById(id);

    return res.json({
      message: `Fetched Product Successfully`,
      data: {
        ...product,
        rating: Number(avgRating.toFixed(1)),
        reviews: ratingsAndCommentsOfProduct.length,
        images,
        comments,
      },
    });
  } catch (e) {
    logger.error("ERROR IN GETTING PRODUCT BY ID: ",e);
    return res
      .status(500)
      .json({ message: "Internal Server Error" });
  }
};
// get all products
async function getAllProducts(req, res) {
  try {
    const product = new ProductService();

    //  all products
    const productsList = await product.getProducts();

    //  aggregated ratings per product
    const ratings = await ProductRating.aggregate([
      {
        $group: {
          _id: "$fk_product_id",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const images = await ProductImage.find();
    const allProducts = productsList.map((prod) => {
      const matchedRating = ratings.find(
        (r) => r._id.toString() === prod._id.toString()
      );
      const productImages = images
        .filter((i) => i.fk_product_id.toString() === prod._id.toString())
        .map((img) => img.image);
      const { fk_user_id, ...productData } = prod;
      return {
        ...productData,
        rating: matchedRating ? matchedRating.averageRating.toFixed(1) : 0,
        reviews: matchedRating ? matchedRating.totalReviews : 0,
        images: productImages,
      };
    });

    res.status(200).json({
      success: true,
      message: "Fetched all products successfully!",
      data: allProducts,
    });
  } catch (err) {
    logger.error("Error in fetching all products:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
}

module.exports = { getProductById, getAllProducts };
