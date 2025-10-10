import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Create the context
const AuthContext = createContext();

// Custom hook for easy access in any component
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);
  const [mounted, setMounted] = useState(false); // Wait for auth before rendering
  const navigate = useNavigate();

  // Make checkAuth available to callers (Login, etc.)
  const checkAuth = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      // No token: update state and mark ready
      console.log("No auth token found");
      setIsLoggedIn(false);
      setEmail(null);
      setMounted(true);
      return false;
    }

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/auth/verify_token/${encodeURIComponent(token)}`,
        { method: "GET" }
      );

      if (res.ok) {
        // optionally read returned user info
        const data = await res.json();
        setIsLoggedIn(true);
        setEmail(data.email);
        console.log("Token valid for user:", email, "with data :", data);
        setMounted(true);
        return true;
      } else {
        console.log("Token invalid, logging out");
        localStorage.removeItem("authToken");
        setIsLoggedIn(false);
        setEmail(null);
        setMounted(true);
        return false;
      }
    } catch (err) {
      console.error("Token verification error:", err);
      setIsLoggedIn(false);
      setEmail(null);
      setMounted(true);
      return false;
    }
  };

  // Run once on mount
  useEffect(() => {
    checkAuth();
    // intentionally empty deps so it runs only on mount
  }, []);

  const logout = () => {
    console.log("Logging out user:", email);
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setEmail(null);
    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, email, mounted, setEmail, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
