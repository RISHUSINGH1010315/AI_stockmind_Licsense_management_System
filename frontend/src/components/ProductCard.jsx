import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition">
      
      <img
        src={product.imageUrl}
        alt=""
        className="h-44 w-full object-cover"
      />

      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{product.name}</h2>

        <p className="text-indigo-400 font-bold text-xl">₹ {product.price}</p>

        <div className="flex justify-between text-sm text-gray-400">
          <span>{product.category}</span>
          <span>Stock: {product.stock}</span>
        </div>

        <div className="flex gap-2 pt-3">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Pencil size={16}/> Edit
          </button>

          <button
            onClick={() => onDelete(product._id)}
            className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded-lg flex items-center justify-center gap-2"
          >
            <Trash2 size={16}/> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;