import { useState, useEffect } from "react";

function Orders({ user, setPage, addToast }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/orders/myorders", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        const errorData = await response.json();
        addToast(errorData.message || "Failed to load order history.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Cannot connect to server. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
        <h2>Access Denied</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Please log in to view your order history.
        </p>
        <button onClick={() => setPage("login")}>Login Page</button>
      </div>
    );
  }

  const getStepClass = (status, stepName) => {
    if (status === "delivered") {
      return "completed";
    }
    if (status === "shipped") {
      if (stepName === "placed") return "completed";
      if (stepName === "shipped") return "active";
      return "";
    }
    // pending
    if (stepName === "placed") return "active";
    return "";
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Your Orders</h2>
        <button className="btn btn-secondary" onClick={fetchOrders} disabled={loading}>
          {loading ? "Refreshing..." : "🔄 Refresh Status"}
        </button>
      </div>

      {/* Errors handled by slide-in toast container */}

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
          <p>Loading order history...</p>
        </div>
      )}

      {!loading && orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
          <h3>No Orders Placed Yet</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
            Add items from our store and place your first order.
          </p>
          <button onClick={() => setPage("home")}>Go Shop</button>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-box">
              <div className="order-box-header">
                <div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>ORDER ID:</span>{" "}
                  <span className="order-id">{order._id}</span>
                </div>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                  <span className={`order-status ${order.status}`}>{order.status}</span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ margin: "1rem 0" }}>
                {order.orderItems.map((item) => (
                  <div
                    key={item._id || item.product}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0",
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }}
                      />
                      <div>
                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginLeft: "1rem" }}>
                          Qty: {item.qty}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 600 }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>

              {/* Address & Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  padding: "0.5rem 0",
                }}
              >
                <div>
                  <strong>Shipping Address:</strong> {order.shippingAddress}
                </div>
                <div>
                  <span style={{ fontSize: "1rem", color: "var(--text-main)", fontWeight: 700 }}>
                    Total: ₹{order.totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Stepper tracking */}
              <div className="progress-stepper">
                <div className={`step ${getStepClass(order.status, "placed")}`}>
                  <div className="step-dot">✓</div>
                  <div className="step-label">Order Placed</div>
                </div>
                <div className={`step ${getStepClass(order.status, "shipped")}`}>
                  <div className="step-dot">📦</div>
                  <div className="step-label">Shipped</div>
                </div>
                <div className={`step ${getStepClass(order.status, "delivered")}`}>
                  <div className="step-dot">🏠</div>
                  <div className="step-label">Delivered</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
