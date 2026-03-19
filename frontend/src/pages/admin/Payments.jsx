import { useEffect, useState } from "react";
import API from "../../api/axios";

function Payments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await API.get("/admin/payments");
      setPayments(res.data);
    };
    fetchPayments();
  }, []);

  // ⭐ FIXED — secure invoice download with token
  const downloadInvoice = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `http://localhost:5000/api/admin/invoice/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();
    } catch (err) {
      alert("Invoice download failed");
    }
  };

  // ⭐ Export full payments report
  const downloadReport = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/admin/export/payments",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "payments-report.pdf";
      a.click();
    } catch (err) {
      alert("Download failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">
            Payment History
          </h1>

          <button
            onClick={downloadReport}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow font-semibold"
          >
            Export Payments Report
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-black">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="py-4 px-6 text-left">Employee</th>
                <th className="py-4 px-6 text-left">License</th>
                <th className="py-4 px-6 text-left">Amount</th>
                <th className="py-4 px-6 text-left">Date</th>
                <th className="py-4 px-6 text-center">Invoice</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{p.employee_name}</td>
                  <td className="py-4 px-6">{p.product_name}</td>
                  <td className="py-4 px-6 font-semibold text-green-600">₹ {p.price}</td>
                  <td className="py-4 px-6">
                    {new Date(p.paid_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => downloadInvoice(p.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
                    >
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}

export default Payments;