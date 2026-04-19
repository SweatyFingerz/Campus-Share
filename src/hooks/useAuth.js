import { useAuthContext } from "../context/AuthContext";

/**
 * Custom hook to access authentication state and methods.
 * Wraps the AuthContext for a cleaner API.
 */
export function useAuth() {
  const { user, loading, register, login, logout } = useAuthContext();

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
  };
}
