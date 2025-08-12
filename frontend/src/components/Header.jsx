import React, { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { FaHome, FaBoxOpen, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Header = () => {
  const { user } = useAuthStore();
  const [nav, setNav] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  const navItems = [
    { id: 1, text: "Home", path: "/", icon: <FaHome className="inline-block mr-2" /> },
    { id: 2, text: "Products", path: "/product", icon: <FaBoxOpen className="inline-block mr-2" /> },
  ];

  return (
    <nav className="bg-[#0a192f] shadow-md z-[99999]">
      <div className="flex justify-between items-center h-16 max-w-[1240px] mx-auto px-4 text-white">
        <h1 className="text-3xl font-bold text-green-400">Auction System</h1>
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.id} className="p-2 hover:text-green-300 transition duration-300">
                <Link to={item.path}>{item.icon}{item.text}</Link>
              </li>
            ))}
          </ul>
          {user && (
            <>
              <div className="px-4 py-2 bg-gray-900 text-green-300 rounded-lg shadow-md text-sm font-semibold">
                Wallet: ₹{user.walletBalance.toFixed(2)}
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-green-600 rounded-md shadow hover:bg-green-500 transition text-sm font-semibold"
                >
                  Dashboard
                </Link>
                
              </div>
            </>
          )}
        </div>
        <div className="md:hidden cursor-pointer" onClick={handleNav}>
          {nav ? <AiOutlineClose size={25} className="text-green-400" /> : <AiOutlineMenu size={25} className="text-green-400" />}
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-[#0a192f] text-white shadow-md transform ${
          nav ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden z-[9999]`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-green-400">KL UNIVERSITY</h1>
            <AiOutlineClose size={25} className="cursor-pointer text-green-400" onClick={() => setNav(false)} />
          </div>
          <ul className="space-y-6">
            {navItems.map((item) => (
              <li key={item.id} className="text-xl hover:text-green-300 transition duration-300">
                <Link to={item.path} onClick={() => setNav(false)}>
                  {item.icon}{item.text}
                </Link>
              </li>
            ))}
          </ul>
          {user && (
            <>
              <div className="mt-6 text-center bg-gray-900 text-green-300 py-2 px-4 rounded-lg shadow-md text-lg font-semibold">
                Wallet: ₹{user.walletBalance.toFixed(2)}
              </div>
              <div className="mt-4 space-y-4">
                <Link
                  to="/dashboard"
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition"
                  onClick={() => setNav(false)}
                >
                  Dashboard
                </Link>
                
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
