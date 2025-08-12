// src/components/ProductShowMore.jsx
import React, { useState } from "react";
import ProductCard from "./ProductCard";

const ProductShowMore = ({ products }) => {
  const [visibleCount, setVisibleCount] = useState(3);

  const showMore = () => {
    setVisibleCount(visibleCount + 3); // Load more 3 products
  };

  return (
    <div className='space-y-4'>
      {products.slice(0, visibleCount).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {visibleCount < products.length && (
        <button
          onClick={showMore}
          className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700'
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default ProductShowMore;
