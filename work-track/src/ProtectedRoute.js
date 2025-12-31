

import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin-dashboard" replace />;
    if (user.role === "teamleader") return <Navigate to="/team-leader-dashboard" replace />;
    if (user.role === "employee") return <Navigate to="/employee-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;








