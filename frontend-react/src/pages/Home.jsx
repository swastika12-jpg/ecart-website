import { useState } from "react";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";

function Home({ products, cart, setCart, addToast }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(0);

  // Extract unique categories dynamically
  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean);

  const addToCart = (product) => {
    // Check stock
    if (product.stock <= 0) {
      addToast(`"${product.name}" is out of stock!`, "error");
      return;
    }

    const existingItem = cart.find((item) => item.product === product._id);

    if (existingItem) {
      if (existingItem.qty >= product.stock) {
        addToast(`Cannot add more. Only ${product.stock} items in stock.`, "error");
        return;
      }
      setCart(
        cart.map((item) =>
          item.product === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
          stock: product.stock,
        },
      ]);
    }

    addToast(`Added "${product.name}" to cart! 🛒`, "success");
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    const matchesPrice = maxPrice === 0 || p.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>Explore Products</h2>
      </div>

      <div className="catalog-layout">
        <Filters
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          categories={categories}
        />

        <div className="products-list-wrapper">
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
              <h3>No products found</h3>
              <p>Try modifying your filters or search terms.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
