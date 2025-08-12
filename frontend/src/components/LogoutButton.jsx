// src/components/LogoutButton.jsx
import React from "react";
import { motion } from "framer-motion";

const LogoutButton = ({ handleLogout }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className='mt-4'
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700'
      >
        Logout
      </motion.button>
    </motion.div>
  );
};

export default LogoutButton;
