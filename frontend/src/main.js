console.log("MAIN JS UPDATED");
 
const container = document.getElementById("products");
const cartCount = document.getElementById("cart-count");

let cart = 0;

fetch("http://localhost:5000/api/products")
  .then(res => res.json())
  .then(data => {
    container.innerHTML = data.map(p => `
      <div class="card">
        <img src="${p.image}" />
        
        <h3>${p.name}</h3>

        <p>₹${p.price}</p>
        <button onclick="addToCart()">Add to Cart</button>
      </div>
    `).join("");
  });

window.addToCart = function () {
  cart++;
  cartCount.innerText = cart;
};
