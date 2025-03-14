import { useAuth } from "@/UserContext"; // Assuming the UserContext is in the root folder
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRole }) => {
  const { user, loading, role } = useAuth(); // Get user, loading state, and role from context

  if (loading) return <div>Loading...</div>; // Show loading while checking auth state

  if (!user) return <Navigate to="/role" />; // Redirect to login if user is not authenticated
  // Check if a specific role is required, if so, and the user doesn't have it
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/unauthorized" />; // Redirect if the role doesn't match
  }

  return <Outlet />; // Render the protected route if everything is good
};

export default ProtectedRoute;
