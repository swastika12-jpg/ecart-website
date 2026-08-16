function Navbar({ cart, setPage, user, handleLogout, currentPage, theme, toggleTheme }) {
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <nav>
      <div className="brand" onClick={() => setPage("home")}>
        ⚡ SWASTUUU E-Cart
      </div>

      <div className="nav-links">
        <button
          className={`nav-btn ${currentPage === "home" ? "active" : ""}`}
          onClick={() => setPage("home")}
        >
          Home
        </button>

        <button
          className={`nav-btn ${currentPage === "cart" ? "active" : ""}`}
          onClick={() => setPage("cart")}
        >
          Cart ({cartItemCount})
        </button>

        {user && (
          <button
            className={`nav-btn ${currentPage === "orders" ? "active" : ""}`}
            onClick={() => setPage("orders")}
          >
            My Orders
          </button>
        )}

        {user && user.role === "admin" && (
          <button
            className={`nav-btn ${currentPage === "admin" ? "active" : ""}`}
            onClick={() => setPage("admin")}
          >
            💻 Admin Panel
          </button>
        )}

        <button 
          className="btn btn-secondary theme-toggle-btn" 
          onClick={toggleTheme} 
          style={{ padding: "0.5rem", borderRadius: "50%", width: "40px", height: "40px", display: "inline-flex", justifyContent: "center", alignItems: "center", fontSize: "1.1rem" }}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Hi, <strong>{user.name}</strong>
            </span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button
            className={`btn ${currentPage === "login" ? "active" : ""}`}
            onClick={() => setPage("login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
