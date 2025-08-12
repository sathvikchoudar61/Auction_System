import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

const ProductDetail = () => {
  const { user } = useAuthStore();
  const { id } = useParams(); // Get product id from URL params
  const [product, setProduct] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        toast.error("Error fetching product.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Handle bid submission
  const handleBid = async () => {
    const bidAmountNum = parseFloat(bidAmount);  // Ensure bid is a valid number
    if(user.walletBalance < bidAmountNum) {
      alert("Insufficient balance in the wallet to place this bid.");
      return;
    }


    if (isNaN(bidAmountNum) || bidAmountNum <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }
    

    setIsPlacingBid(true);  

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}/bid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add your Authorization token if needed
        },
        body: JSON.stringify({ bidAmount: bidAmountNum }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);

        // Re-fetch the product details after placing the bid
        const updatedProductRes = await fetch(`http://localhost:5000/api/products/${id}`);
        if (updatedProductRes.ok) {
          const updatedProduct = await updatedProductRes.json();
          setProduct(updatedProduct); // Update product state with the new data
        } else {
          toast.error("Failed to fetch updated product.");
        }
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
      alert("Failed to place bid");
    } finally {
      setIsPlacingBid(false);  // Reset loading state after the request
    }
  };

  if (isLoading || !product)
    return <div className="text-center text-gray-400 text-xl py-20">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white flex items-center justify-center p-6 z-[99999]">
      <Toaster position="top-center" reverseOrder={false} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700"
      >
        <div className="col-span-1 flex items-center justify-center p-4 bg-gray-900 rounded-lg border border-gray-700">
          {product.images?.length > 0 && (
            <div className="flex justify-center w-full">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full max-w-xs sm:max-w-sm md:max-w-md h-96 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
        <div className="col-span-3 grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <h1 className="text-4xl font-bold text-green-400">{product.name}</h1>
            <p className="text-gray-300 mt-2 text-lg">{product.description}</p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-lg">
              <span className="text-green-300 font-semibold">Category:</span>{" "}
              {product.category}
            </p>
            <p className="text-gray-400 text-lg">
              <span className="text-green-300 font-semibold">Seller:</span>{" "}
              {product.seller}
            </p>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-lg">
              <span className="text-green-300 font-semibold">Bid Increment:</span> ₹{product.bidIncrement}
            </p>
            <p className="text-gray-400 text-lg">
              <span className="text-green-300 font-semibold">Ends:</span>{" "}
              {new Date(product.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className="col-span-2 bg-gray-900 p-6 rounded-lg border border-gray-700 text-center">
            <p className="text-2xl font-semibold">
              Current Bid:{" "}
              <span className="text-green-300">₹{product.currentBid}</span>
            </p>
          </div>
          <div className="col-span-2 flex flex-col sm:flex-row items-center gap-4 mt-2">
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter bid amount"
              className="p-4 w-full sm:w-2/3 rounded-lg bg-gray-700 text-white outline-none border border-gray-600 focus:ring-2 focus:ring-green-500 text-lg"
            />
            <motion.button
              onClick={handleBid}
              disabled={isPlacingBid}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-green-500 text-white text-lg rounded-lg shadow-md hover:bg-green-600 transition"
            >
              {isPlacingBid ? "Placing Bid..." : "Place Bid"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProductDetail;
