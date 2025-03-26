import mongoose from "mongoose";
import productModel from "../../models/productModel.js";

const getFilteredProducts = async (req, res) => {
  try {
    // Extract parameters from the request query
    const { category, priceRange, ratings } = req.query;

    // Build a query object to use in the database query
    const query = {};

    if (category) {
      // Validate that category is a valid ObjectId
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = new mongoose.Types.ObjectId(category);
      } else {
        return res.status(400).send({
          success: false,
          message: "Invalid category id",
        });
      }
    }

    if (priceRange && priceRange.length === 2) {
      // Convert the priceRange values to numbers
      const [minPrice, maxPrice] = priceRange.map(Number);
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (ratings) {
      query.ratings = { $gte: Number(ratings) };
    }

    // Query the database with the built query object
    const products = await productModel.find(query).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No Products Found!",
        errorType: "productNotFound",
      });
    }
    res.status(201).send({ success: true, products });
  } catch (error) {
    console.log("Filter Products Error: " + error);
    res.status(500).send({
      success: false,
      message: "Error in getting Filtered Products",
      error,
    });
  }
};

export default getFilteredProducts;
