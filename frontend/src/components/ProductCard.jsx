import React from "react";
const ProductCard = ({ product }) => {
  return (
    <div className='p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700'>
      <h3 className='text-xl font-semibold text-green-400 mb-3'>{product.name}</h3>
      <p className='text-gray-300'>Bid Amount: ${product.amount}</p>
    </div>
  );
};
export default ProductCard;
