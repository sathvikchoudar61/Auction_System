import React, { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore"; // Make sure you have this store to get the user details

const AddProduct = () => {
  const { user } = useAuthStore(); // Accessing the user from Zustand store

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [bidIncrement, setBidIncrement] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    // Append the product data to formData
    formData.append("name", name);
    formData.append("description", description);
    formData.append("startingBid", startingBid);
    formData.append("currentBid", startingBid); // currentBid defaults to 0
    formData.append("bidIncrement", bidIncrement);
    formData.append("endDate", endDate);
    formData.append("seller", user?.name || "12345"); // Use the user.name instead of _name
 // Use the user._id from Zustand store
    formData.append("category", category);
    
    // Append images to formData
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      // Send the form data to your backend
      await axios.post("http://localhost:5000/api/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product Added!");
      setLoading(false);
      // Reset form
      setName("");
      setDescription("");
      setStartingBid("");
      setBidIncrement("");
      setEndDate("");
      setCategory("");
      setImages([]);
    } catch (error) {
      setLoading(false);
      alert("Error adding product");
      console.error(error);
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <div className="min-h-screen bg-[#0a192f] text-white py-12 px-4 md:px-16">
      <div className="w-full max-w-full bg-[#111827] rounded-3xl p-8 shadow-xl border border-gray-800">
        <h2 className="text-3xl font-bold text-green-500 mb-6 text-center">
          Add Product Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Name */}
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-between">
              <label className="text-gray-300 text-sm" htmlFor="name">
                Product Name:
              </label>
              <span className="text-gray-400 text-sm">(e.g., Laptop, Phone)</span>
            </div>
            <input
              id="name"
              type="text"
              placeholder="Enter product name"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Product Description */}
          <div className="grid grid-cols-1 gap-6">
            <div className="flex justify-between">
              <label className="text-gray-300 text-sm" htmlFor="description">
                Product Description:
              </label>
              <span className="text-gray-400 text-sm">(A brief product description)</span>
            </div>
            <textarea
              id="description"
              placeholder="Enter product description"
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Category and Starting Bid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 text-sm" htmlFor="category">
                Category:
              </label>
              <input
                id="category"
                type="text"
                placeholder="Enter product category"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm" htmlFor="startingBid">
                Starting Bid (₹):
              </label>
              <input
                id="startingBid"
                type="number"
                placeholder="Enter starting bid"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Bid Increment and End Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 text-sm" htmlFor="bidIncrement">
                Bid Increment (₹):
              </label>
              <input
                id="bidIncrement"
                type="number"
                placeholder="Enter bid increment"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                value={bidIncrement}
                onChange={(e) => setBidIncrement(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm" htmlFor="endDate">
                Auction End Date:
              </label>
              <input
                id="endDate"
                type="datetime-local"
                placeholder="Enter end date"
                className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="grid grid-cols-1 gap-6">
            <label className="text-gray-300 text-sm" htmlFor="images">
              Product Images:
            </label>
            <input
              id="images"
              type="file"
              multiple
              className="block w-full px-4 py-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500"
              onChange={handleImageChange}
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-400 text-white font-bold py-3 px-6 rounded-lg focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              {loading ? "Adding..." : "Submit Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
