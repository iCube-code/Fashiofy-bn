const { Types } = require("mongoose");
const ProductService = require("../service/Product.js");
const ProductRating = require('../model/ProductRatingModel.js');
const logger = require("../utils/logger.js");


// API for Fetch Product By ID
const getProductById = async (req, res) => {
  try {
    const productService = new ProductService();

    // Product ID must be a valid UUID
    const { id } = req.params;

    // Validate the ID
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }

    // Check the Product Exists Or not
    const product = await productService.getProductById(id);
    if (!product) {
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
    const comments = ratingsAndCommentsOfProduct.map((comment) => ({
      comment: comment.comment,
      rating: comment.rating,
      user_id: comment.fk_user_id,
    }));

    // Product Images
    const images = await productService.getProductImagesById(id);

    return res.json({
      message: `Fetched Product Successfully`,
      data: {
        ...product,
        totalReviews: ratingsAndCommentsOfProduct.length,
         rating: Number(avgRating.toFixed(1)),
        images,
        comments,
      },
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: e.message });
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
                    _id: '$fk_product_id',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            }
        ]);
        const allProducts = productsList.map(prod => {
            const matchedRating = ratings.find(r => r._id.toString() === prod._id.toString());
            return {
                ...prod,
                rating: matchedRating ? matchedRating.averageRating.toFixed(1) : 0,
                reviews: matchedRating ? matchedRating.totalReviews : 0
            };
        });

        res.status(200).json({
            success: true,
            message: "Fetched all products successfully!",
            data: {
                allProducts
            }
        });

    } catch (err) {
        logger.error("Error in fetching all products:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = { getProductById,getAllProducts };
