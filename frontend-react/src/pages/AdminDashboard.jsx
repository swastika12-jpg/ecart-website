import { useState, useEffect } from "react";
import { API_URL } from "../config";

function AdminDashboard({ user, products, refreshProducts, addToast }) {
  const [activeTab, setActiveTab] = useState("products"); // 'products' or 'orders'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const fetchOrders = async () => {
    if (!user || user.role !== "admin") return;
    setLoadingOrders(true);
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        addToast("Failed to fetch system orders.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Cannot connect to server. Check if backend is active.", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  if (!user || user.role !== "admin") {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
        <h2>Access Denied</h2>
        <p style={{ color: "var(--text-danger)", fontWeight: 600 }}>
          You do not have administrative privileges to access this area.
        </p>
      </div>
    );
  }

  // Handle Add Click
  const handleAddClick = () => {
    setIsEditing(false);
    setEditingId("");
    setName("");
    setPrice("");
    setImage("");
    setDescription("");
    setCategory("");
    setStock("");
    setShowModal(true);
  };

  // Handle Edit Click
  const handleEditClick = (prod) => {
    setIsEditing(true);
    setEditingId(prod._id);
    setName(prod.name);
    setPrice(prod.price);
    setImage(prod.image);
    setDescription(prod.description);
    setCategory(prod.category);
    setStock(prod.stock);
    setShowModal(true);
  };

  // Submit Product Form
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      price: Number(price),
      image,
      description,
      category,
      stock: Number(stock),
    };

    const url = isEditing
      ? `${API_URL}/api/products/${editingId}`
      : `${API_URL}/api/products`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        addToast(isEditing ? "Product updated successfully! ✨" : "Product created successfully! 🚀", "success");
        setShowModal(false);
        refreshProducts();
      } else {
        const data = await response.json();
        addToast(data.message || "Failed to save product.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Server connection failed.", "error");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        addToast("Product deleted successfully! 🗑️", "success");
        refreshProducts();
      } else {
        const data = await response.json();
        addToast(data.message || "Failed to delete product.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Server connection failed.", "error");
    }
  };

  // Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        addToast("Order status updated successfully! 📦", "success");
        fetchOrders();
      } else {
        const data = await response.json();
        addToast(data.message || "Failed to update order status.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Server connection failed.", "error");
    }
  };

  return (
    <div>
      <h2>Admin Control Panel</h2>

      {/* Tabs */}
      <div className="admin-tabs">
        <div
          className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          Manage Products
        </div>
        <div
          className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Manage Orders
        </div>
      </div>

      {/* Notifications are handled by the slide-in toast container */}

      {/* TAB 1: PRODUCTS MANAGER */}
      {activeTab === "products" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <h3>Product Catalog List</h3>
            <button className="btn btn-accent" onClick={handleAddClick}>
              + Add New Product
            </button>
          </div>

          <div className="admin-table-container">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                      />
                    </td>
                    <td>
                      <strong>{prod.name}</strong>
                    </td>
                    <td>{prod.category}</td>
                    <td>₹{prod.price.toLocaleString("en-IN")}</td>
                    <td>{prod.stock}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEditClick(prod)}
                        style={{ marginRight: "0.5rem", padding: "0.4rem 0.8rem" }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-secondary btn-danger"
                        onClick={() => handleDeleteProduct(prod._id)}
                        style={{ padding: "0.4rem 0.8rem" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGER */}
      {activeTab === "orders" && (
        <div>
          <h3>All Placed Orders</h3>
          {loadingOrders ? (
            <p style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p style={{ padding: "2rem", color: "var(--text-muted)" }}>No orders found in the database.</p>
          ) : (
            <div className="admin-table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Info</th>
                    <th>Ordered Items</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Update Tracking</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord._id}>
                      <td>
                        <span style={{ fontSize: "0.85rem", fontFamily: "monospace" }}>{ord._id}</span>
                      </td>
                      <td>
                        <div>{ord.user?.name || "Deleted User"}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{ord.user?.email}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: "0.85rem" }}>
                          {ord.orderItems.map((item) => (
                            <div key={item._id}>
                              • {item.name} (x{item.qty})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong>₹{ord.totalPrice.toLocaleString("en-IN")}</strong>
                      </td>
                      <td>
                        <span className={`order-status ${ord.status}`}>{ord.status}</span>
                      </td>
                      <td>
                        <select
                          value={ord.status}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          style={{
                            padding: "0.4rem",
                            borderRadius: "6px",
                            background: "var(--bg-surface-elevated)",
                            color: "var(--text-main)",
                            border: "1px solid var(--border-color)",
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL DIALOG POPUP */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ✕
            </button>
            <h3>{isEditing ? "Edit Product Details" : "Create New Product"}</h3>

            <form onSubmit={handleProductSubmit} style={{ marginTop: "1rem" }}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Keyboard"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="e.g. Peripherals"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Qty</label>
                  <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  placeholder="Add item details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-main)",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <button type="submit" className="btn btn-accent" style={{ width: "100%", marginTop: "1rem" }}>
                {isEditing ? "Save Product Settings" : "Publish Product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
