import React, { useState, useEffect } from "react";

const ProductModal = ({ isOpen, onClose, onSubmit, editProduct }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    if (editProduct) setForm(editProduct);
  }, [editProduct]);

  const handleChange = (e) => {
    if (e.target.name === "image")
      setForm({ ...form, image: e.target.files[0] });
    else setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-slate-900 p-8 rounded-2xl w-[400px] space-y-4 shadow-2xl">
        <h2 className="text-2xl font-bold text-center">
          {editProduct ? "Edit Product" : "Add Product"}
        </h2>

        <input className="input" name="name" placeholder="Name" onChange={handleChange} value={form.name}/>
        <input className="input" name="price" placeholder="Price" onChange={handleChange} value={form.price}/>
        <input className="input" name="category" placeholder="Category" onChange={handleChange} value={form.category}/>
        <input className="input" name="stock" placeholder="Stock" onChange={handleChange} value={form.stock}/>
        <input type="file" onChange={handleChange} name="image"/>

        <div className="flex gap-3 pt-3">
          <button onClick={handleSubmit} className="flex-1 bg-indigo-600 py-2 rounded-lg">Save</button>
          <button onClick={onClose} className="flex-1 bg-gray-700 py-2 rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;