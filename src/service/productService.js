const Product = require('../model/ProductModel');
const ProductRating = require('../model/ProductRatingModel');

class productService {
    async getProducts() {
        try {
            const result = await Product.find().lean();
            return result;
        } catch (err) {
            console.log("Error in getting all products", err);
        }
    }
}
module.exports = { productService }  
