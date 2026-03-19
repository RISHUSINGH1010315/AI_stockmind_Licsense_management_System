import { useEffect, useState } from "react";
import API from "../../api/axios";

function Payments() {

  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {

    try {

      const res = await API.get("/payments/all");

      setPayments(res.data);

    } catch (error) {

      console.log("Failed to load payments", error);

    }

  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-black">
        Payment History
      </h1>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50">

            <tr className="text-left text-black">

              <th className="p-4">Company</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Payment Date</th>
              <th className="p-4">Status</th>

            </tr>

          </thead>

          <tbody>

            {payments.length === 0 && (

              <tr>

                <td colSpan="5" className="p-8 text-center text-gray-500">

                  No payments found

                </td>

              </tr>

            )}

            {payments.map((p) => (

              <tr key={p.id} className="border-b hover:bg-gray-50">

                <td className="p-4 text-black">
                  {p.company || "-"}
                </td>

                <td className="p-4 text-black">
                  {p.plan || "-"}
                </td>

                <td className="p-4 text-black">
                  ₹ {p.amount}
                </td>

                <td className="p-4 text-black">
                  {p.payment_date
                    ? new Date(p.payment_date).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-4">

                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">

                    {p.status}

                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Payments;