import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login"; // Note: verified case sensitivity
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./components/Chatbot";
import { API_URL } from "./config";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme : "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out from server:", error);
    }
    localStorage.removeItem("user");
    setUser(null);
    setPage("home");
  };

  return (
    <>
      <Navbar
        cart={cart}
        setPage={setPage}
        user={user}
        handleLogout={handleLogout}
        currentPage={page}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="container">
        {page === "home" && (
          <Home
            products={products}
            cart={cart}
            setCart={setCart}
            addToast={addToast}
          />
        )}
        {page === "cart" && (
          <Cart
            cart={cart}
            setCart={setCart}
            user={user}
            setPage={setPage}
            addToast={addToast}
          />
        )}
        {page === "login" && (
          <Login
            setUser={setUser}
            setPage={setPage}
            addToast={addToast}
          />
        )}
        {page === "orders" && (
          <Orders
            user={user}
            setPage={setPage}
            addToast={addToast}
          />
        )}
        {page === "admin" && (
          <AdminDashboard
            user={user}
            products={products}
            refreshProducts={fetchProducts}
            addToast={addToast}
          />
        )}
      </main>

      {/* Toast Notification Container */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-banner ${toast.type}`}>
            <span className="toast-icon">
              {toast.type === "success" ? "✨" : "⚠️"}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button 
              className="toast-close-btn"
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <Chatbot products={products} setPage={setPage} />
    </>
  );
}

export default App;
