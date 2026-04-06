import React from "react";

export default function Medicines() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Medicine</h1>

      <form className="space-y-4">
        {/* Medicine Name */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Medicine Name</label>
          <input
            type="text"
            name="name"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Batch Number */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Batch Number</label>
          <input
            type="text"
            name="batch_number"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Unit Price */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Unit Price (EGP)</label>
          <input
            type="number"
            name="price"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Category</label>
          <select
            name="category"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Antibiotics">Antibiotics</option>
            <option value="Analgesics">Analgesics</option>
            <option value="Vitamins">Vitamins</option>
            <option value="Antifungals">Antifungals</option>
          </select>
        </div>

        {/* Expiry Date */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Expiry Date</label>
          <input
            type="date"
            name="expiry_date"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Quantity in Stock */}
        <div className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Quantity in Stock</label>
          <input
            type="number"
            name="quantity"
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Add Medicine
          </button>
        </div>
      </form>
    </div>
  );
}