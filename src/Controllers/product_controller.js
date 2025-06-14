
const { productService } = require('../service/productService');
const ProductRating = require('../model/ProductRatingModel');

async function getAllProducts(req, res) {
    try {
        const product = new productService();

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
        console.log("Error in fetching all products:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
}

module.exports = { getAllProducts };
