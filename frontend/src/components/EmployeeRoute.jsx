import { Navigate, Outlet } from "react-router-dom";

function EmployeeRoute() {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "employee") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default EmployeeRoute;