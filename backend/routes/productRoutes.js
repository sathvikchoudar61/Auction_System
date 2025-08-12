import express from "express";
import { upload } from "../utils/cloudinary.js"; // Assuming you are using cloudinary for file uploads
import { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct, 
  placeBid, 
  getUserBids 
} from "../controllers/productController.js";

const router = express.Router();

// Define your routes
router.route("/")
  .get(getProducts)
  .post(upload.array("images", 5), createProduct);

router.route("/:id")
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/:id/bid")
  .post(placeBid);

router.route("/user/bids")
  .get(getUserBids);

// Export the router
export default router;
