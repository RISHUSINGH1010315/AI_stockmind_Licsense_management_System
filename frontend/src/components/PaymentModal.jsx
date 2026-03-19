import { useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function PaymentModal({ licenseId, amount, close }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // fake payment api
      const res = await API.post("/payment/mock-pay", {
        licenseId,
        amount,
      });

      const paymentId = res.data.paymentId;

      // save payment in DB
      await API.post("/payment/save", {
        licenseId,
        amount,
        paymentId,
      });

      toast.success("Payment Successful 🎉");
      close();

    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl w-[400px]">
        <h2 className="text-xl font-bold mb-4">Confirm Payment</h2>

        <p className="mb-6">Amount: ₹{amount}</p>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <button
          onClick={close}
          className="mt-3 text-gray-500 w-full"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PaymentModal;