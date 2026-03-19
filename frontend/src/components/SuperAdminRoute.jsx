import { Navigate, Outlet } from "react-router-dom";

function SuperAdminRoute() {

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default SuperAdminRoute;