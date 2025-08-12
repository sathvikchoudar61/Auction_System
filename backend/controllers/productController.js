import mongoose from 'mongoose';
import { Product } from "../models/productModel.js";

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("bids.bidder", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product details" });
  }
};

// Create a product (with images)
export const createProduct = async (req, res) => {
  try {
    const { name, description, startingBid, bidIncrement, endDate, seller, category } = req.body;

    // Extract image URLs from uploaded files
    const imageUrls = req.files.map((file) => file.path);

    const newProduct = new Product({
      name,
      description,
      startingBid,
      currentBid: 0,
      bidIncrement,
      endDate,
      seller,
      category,
      images: imageUrls,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({ message: "Error creating product" });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error updating product" });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};




// Get all bids by the logged-in user
export const getUserBids = async (req, res) => {
  try {
    const userId = req.user._id;

    const products = await Product.find({
      "bids.bidder": userId,
    }).select("name currentBid bids").lean();

    const userBids = products.map((product) => {
      const yourBid = product.bids.find(b => b.bidder.toString() === userId.toString());
      return {
        _id: product._id,
        name: product.name,
        currentBid: product.currentBid,
        yourBid: yourBid ? yourBid.bidAmount : null,
      };
    });

    res.json(userBids);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your bids" });
  }
};




export const placeBid = async (req, res) => {
  try {
    const { bidAmount } = req.body;
    let userId = req.user?._id;  // Assuming you're using JWT-based authentication
    
    if (!userId) {
      userId = new mongoose.Types.ObjectId();  // Create a temporary ObjectId for testing
    }

    // Validate the bid amount
    if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
      return res.status(400).json({ message: "Invalid bid amount" });
    }

    // Find the product by its ID
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the new bid is higher than the current bid
    if (Number(bidAmount) <= product.currentBid) {
      return res.status(400).json({ message: "Bid must be higher than the current bid" });
    }

    // Update the current bid and push the new bid to the bids array
    product.currentBid = Number(bidAmount);
    product.bids.push({
      bidder: userId,  // Ensure this is a valid ObjectId
      bidAmount: Number(bidAmount)
    });

    // Save the product with the updated bid information
    await product.save();

    // Respond with success
    return res.json({ message: "Bid placed successfully", product });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
