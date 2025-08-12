import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../store/useProductStore";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const ProductList = () => {
    const { products, fetchProducts } = useProductStore();
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("name");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortOption]);

    const filteredProducts = useMemo(() => {
        return products?.length
            ? products.filter((product) =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : [];
    }, [products, searchTerm]);

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) =>
            sortOption === "currentBid"
                ? b.currentBid - a.currentBid
                : a.name.localeCompare(b.name)
        );
    }, [filteredProducts, sortOption]);

    const indexOfLastProduct = currentPage * itemsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8 ">
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto px-6">
                <h1 className="text-4xl font-bold mb-6 text-center text-green-400">Product Listings</h1>

                
                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6 ">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none w-full sm:w-2/3"
                    />
                    <select
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-green-500 outline-none"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="currentBid">Sort by Current Bid</option>
                    </select>
                </div>

                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                        <Link key={product._id} to={`/product/${product._id}`}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                whileHover={{ scale: 1.02, borderColor: "rgb(34, 197, 94)" }}
                                className="bg-gray-800 p-4 rounded-xl shadow-lg transition border border-gray-700 hover:shadow-xl hover:border-green-400 h-full flex flex-col"
                            >
                                
                                {product.images && product.images.length > 0 && (
                                    <motion.img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-56 object-cover rounded-lg shadow-md hover:shadow-lg"
                                        whileHover={{ scale: 1.03 }}
                                    />
                                )}

                                
                                <div className="flex flex-col flex-grow mt-2">
                                    <h2 className="text-lg font-semibold text-green-400">{product.name}</h2>
                                    <p className="text-gray-300 text-sm mt-1 line-clamp-2">{product.description}</p>

                                    
                                    <p className="text-gray-300 text-sm mt-auto font-semibold">
                                        Current Bid: <span className="text-green-300">${product.currentBid}</span>
                                    </p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-4 py-2 mx-1 border rounded-lg ${
                                    currentPage === index + 1
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-800 text-green-400 border-gray-700"
                                } hover:bg-green-600 transition`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
