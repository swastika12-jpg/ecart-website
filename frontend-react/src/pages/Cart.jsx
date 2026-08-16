import { useState } from "react";

function Cart({ cart, setCart, user, setPage, addToast }) {
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 150; // free shipping over 5k
  const total = subtotal + shipping;

  const updateQty = (id, newQty) => {
    if (newQty < 1) return;
    const item = cart.find((i) => i.product === id);
    if (item && newQty > item.stock) {
      addToast(`Cannot exceed stock limit of ${item.stock} items.`, "error");
      return;
    }
    setCart(
      cart.map((i) => (i.product === id ? { ...i, qty: newQty } : i))
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((i) => i.product !== id));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      addToast("Please provide a shipping address.", "error");
      return;
    }

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        product: item.product,
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
      }));

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          totalPrice: total,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addToast("Order placed successfully! Redirecting... 💳", "success");
        setCart([]); // Clear cart
        localStorage.removeItem("cart");
        setTimeout(() => {
          setPage("orders");
        }, 1500);
      } else {
        addToast(data.message || "Failed to place order. Please try again.", "error");
      }
    } catch (err) {
      console.error(err);
      addToast("Cannot connect to server. Please try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Explore our catalog and add items to your cart!
        </p>
        <button onClick={() => setPage("home")}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Your Shopping Cart</h2>

      {/* Notifications handled by slide-in toast container */}

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.product} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p className="price">₹{item.price.toLocaleString("en-IN")}</p>
              </div>

              <div className="cart-quantity-controls">
                <button onClick={() => updateQty(item.product, item.qty - 1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.product, item.qty + 1)}>+</button>
              </div>

              <button className="btn btn-secondary btn-danger" onClick={() => removeItem(item.product)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Summary and Checkout */}
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          {user ? (
            <form onSubmit={handleCheckout} style={{ marginTop: "1rem" }}>
              <div className="form-group">
                <label htmlFor="address">Shipping Address</label>
                <textarea
                  id="address"
                  rows="3"
                  placeholder="Enter full delivery address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    background: "var(--bg-surface-elevated)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-main)",
                    outline: "none",
                    resize: "none"
                  }}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-accent"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Placing Order..." : "Place Order 💳"}
              </button>
            </form>
          ) : (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                You must login to proceed to checkout.
              </p>
              <button className="btn" style={{ width: "100%" }} onClick={() => setPage("login")}>
                Login to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
