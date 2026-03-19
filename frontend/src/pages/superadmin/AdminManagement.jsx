import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { Shield, Ban, Trash, Search } from "lucide-react";

function AdminManagement() {

  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const adminsPerPage = 6;

  ////////////////////////////////////////////////////////
  // FETCH ADMINS
  ////////////////////////////////////////////////////////

  const fetchAdmins = async () => {

    try {

      const res = await API.get("/super-admin/admins");

      const data = res.data || [];

      setAdmins(data);
      setFilteredAdmins(data);

    } catch (err) {

      console.error(err);
      toast.error("Failed to load admins");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchAdmins();

  }, []);

  ////////////////////////////////////////////////////////
  // SEARCH
  ////////////////////////////////////////////////////////

  useEffect(() => {

    const filtered = admins.filter((a) =>
      (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(search.toLowerCase())
    );

    setFilteredAdmins(filtered);
    setCurrentPage(1);

  }, [search, admins]);

  ////////////////////////////////////////////////////////
  // PAGINATION
  ////////////////////////////////////////////////////////

  const indexOfLast = currentPage * adminsPerPage;
  const indexOfFirst = indexOfLast - adminsPerPage;

  const currentAdmins = filteredAdmins.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

  ////////////////////////////////////////////////////////
  // SELECT ADMIN
  ////////////////////////////////////////////////////////

  const toggleSelect = (id) => {

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );

  };

  ////////////////////////////////////////////////////////
  // SELECT ALL
  ////////////////////////////////////////////////////////

  const selectAll = () => {

    const currentIds = currentAdmins.map((a) => a.id);

    const allSelected = currentIds.every((id) =>
      selected.includes(id)
    );

    if (allSelected) {

      setSelected(selected.filter((id) => !currentIds.includes(id)));

    } else {

      setSelected([...new Set([...selected, ...currentIds])]);

    }

  };

  ////////////////////////////////////////////////////////
  // DELETE ADMIN
  ////////////////////////////////////////////////////////

  const deleteAdmin = async (id) => {

    try {

      await API.delete(`/super-admin/admins/${id}`);

      toast.success("Admin deleted");

      setSelected((prev) => prev.filter((i) => i !== id));

      fetchAdmins();

    } catch {

      toast.error("Delete failed");

    }

  };

  ////////////////////////////////////////////////////////
  // BULK DELETE
  ////////////////////////////////////////////////////////

  const deleteSelected = async () => {

    try {

      await Promise.all(
        selected.map((id) =>
          API.delete(`/super-admin/admins/${id}`)
        )
      );

      toast.success("Selected admins deleted");

      setSelected([]);

      fetchAdmins();

    } catch {

      toast.error("Bulk delete failed");

    }

  };

  ////////////////////////////////////////////////////////
  // SUSPEND ADMIN
  ////////////////////////////////////////////////////////

  const suspendAdmin = async (id) => {

    try {

      await API.put(`/super-admin/admins/${id}/suspend`);

      toast.success("Admin status updated");

      fetchAdmins();

    } catch {

      toast.error("Action failed");

    }

  };

  ////////////////////////////////////////////////////////
  // LOADING
  ////////////////////////////////////////////////////////

  if (loading) {

    return (

      <div className="flex justify-center items-center h-[70vh]">

        <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-indigo-600"></div>

      </div>

    );

  }

  ////////////////////////////////////////////////////////
  // UI
  ////////////////////////////////////////////////////////

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-black">
            Admin Management
          </h1>

          <p className="text-black">
            Manage platform administrators
          </p>

        </div>

        {selected.length > 0 && (

          <button
            onClick={deleteSelected}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >

            <Trash size={16} />
            Delete Selected ({selected.length})

          </button>

        )}

      </div>


      {/* SEARCH */}

      <div className="relative w-80">

        <Search
          size={18}
          className="absolute left-3 top-2.5 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search admin..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg pl-10 pr-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

      </div>


      {/* TABLE */}

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-50 border-b">

            <tr className="text-left text-sm text-black">

              <th className="p-4">
                <input
                  type="checkbox"
                  onChange={selectAll}
                  checked={
                    currentAdmins.length > 0 &&
                    currentAdmins.every((a) => selected.includes(a.id))
                  }
                />
              </th>

              <th className="p-4 font-semibold">Admin</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Created</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Action</th>

            </tr>

          </thead>

          <tbody>

            {currentAdmins.length === 0 ? (

              <tr>

                <td colSpan="6" className="text-center p-8 text-black">

                  No admins found

                </td>

              </tr>

            ) : (

              currentAdmins.map((admin) => (

                <tr
                  key={admin.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-4">

                    <input
                      type="checkbox"
                      checked={selected.includes(admin.id)}
                      onChange={() => toggleSelect(admin.id)}
                    />

                  </td>

                  <td className="p-4 flex items-center gap-3">

                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                      <Shield size={18} />
                    </div>

                    <span className="font-medium text-black">
                      {admin.name}
                    </span>

                  </td>

                  <td className="p-4 text-black">
                    {admin.email}
                  </td>

                  <td className="p-4 text-black">
                    {admin.created_at
                      ? new Date(admin.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        admin.role === "admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >

                      {admin.role === "admin"
                        ? "Active"
                        : "Suspended"}

                    </span>

                  </td>

                  <td className="p-4 flex gap-2 justify-end">

                    <button
                      onClick={() => suspendAdmin(admin.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-white ${
                        admin.role === "admin"
                          ? "bg-yellow-500 hover:bg-yellow-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >

                      <Ban size={14} />

                      {admin.role === "admin"
                        ? "Suspend"
                        : "Activate"}

                    </button>

                    <button
                      onClick={() => deleteAdmin(admin.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >

                      <Trash size={14} />
                      Delete

                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="flex justify-center gap-2">

          {[...Array(totalPages)].map((_, i) => (

            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-lg text-black ${
                currentPage === i + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
            >

              {i + 1}

            </button>

          ))}

        </div>

      )}

    </div>

  );

}

export default AdminManagement;