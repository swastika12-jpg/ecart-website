function ProductCard({ product, onAddToCart }) {
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="card">
      <span className={`stock-badge ${isOutOfStock ? "out-of-stock" : ""}`}>
        {isOutOfStock ? "Out of Stock" : `${product.stock} In Stock`}
      </span>
      <img src={product.image} alt={product.name} />
      <div className="card-content">
        <h3>{product.name}</h3>
        <p className="description">{product.description || "No description available."}</p>
        <div className="card-footer">
          <span className="price">₹{product.price.toLocaleString("en-IN")}</span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`btn ${isOutOfStock ? "btn-secondary" : ""}`}
            style={isOutOfStock ? { cursor: "not-allowed", opacity: 0.6 } : {}}
          >
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
