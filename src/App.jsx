import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ItemProvider } from "./context/ItemContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Library from "./pages/Library";
import LostFound from "./pages/LostFound";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <ItemProvider>
            <div className="min-h-screen bg-gray-50 font-sans antialiased">
              <Navbar />
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/library" element={<Library />} />
              <Route path="/lost-found" element={<LostFound />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toast />
          </div>
        </ItemProvider>
      </AuthProvider>
    </ToastProvider>
  </Router>
  );
}

export default App;
