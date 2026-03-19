import React from "react";

function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-8">StockMind</h2>

        <ul className="space-y-4">
          <li className="hover:text-gray-200 cursor-pointer">
            Dashboard
          </li>
          <li className="hover:text-gray-200 cursor-pointer">
            My Licenses
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-white">
        {children}
      </div>
    </div>
  );
}

export default UserLayout;