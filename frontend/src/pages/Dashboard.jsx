import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, isAuthenticated, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleAddMoney = () => {
    navigate("/wallet/add");
  };

  const handleAddProduct = () => {
    navigate("/product/add");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a192f] to-[#112240]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white text-2xl font-semibold"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a192f] to-[#112240]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-2xl font-semibold"
        >
          Error: {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-52 bg-gradient-to-br from-[#0a192f] to-[#112240] text-white p-6 md:p-10">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold mb-8 text-green-400 text-center"
      >
        Welcome, {user?.name}!
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* User Information Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50"
        >
          <h3 className="text-2xl font-semibold text-green-400 mb-4">Your Profile</h3>
          <div className="space-y-3 text-gray-200">
            <p>
              <strong>Name:</strong> {user?.name}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phonenumber}
            </p>
            <p>
              <strong>Wallet Balance:</strong> ₹{user?.walletBalance?.toFixed(2)}
            </p>
          </div>
        </motion.div>

        {/* Actions Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50"
        >
          <h3 className="text-2xl font-semibold text-green-400 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddMoney}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
              aria-label="Add money to wallet"
            >
              Add Money to Wallet
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              aria-label="Add a new product"
            >
              Add Product
            </motion.button>
          </div>
        </motion.div>

        {/* Additional Info Card (Visible on Larger Screens) */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50 hidden lg:block"
        >
          <h3 className="text-2xl font-semibold text-green-400 mb-4">What's New</h3>
          <p className="text-gray-200">
            Stay tuned for upcoming features like account settings, notifications, and more!
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;