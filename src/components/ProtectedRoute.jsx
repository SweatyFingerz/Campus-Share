import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-indigo-500" />
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
