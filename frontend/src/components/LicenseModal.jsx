import { useState } from "react";
import axios from "axios";

function LicenseModal({ product, closeModal }) {
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState(24);
  const token = localStorage.getItem("token");

  const bookLicense = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/admin/assign-license",
        {
          employeeId,
          productId,
          expiryDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        }
      );

      alert("License assigned!");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">

      {/* Modal Card */}
      <div className="bg-white w-[420px] rounded-2xl shadow-2xl p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Book License
        </h2>
        <p className="text-gray-500 mb-6">{product.name}</p>

        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 ring-indigo-500"
        />

        <input
          type="number"
          placeholder="Duration Hours"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 ring-indigo-500"
        />

        <button
          onClick={bookLicense}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg mb-3"
        >
          Confirm
        </button>

        <button
          onClick={closeModal}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg"
        >
          Cancel
        </button>

      </div>
    </div>
  );
}

export default LicenseModal;