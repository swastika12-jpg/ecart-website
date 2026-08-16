const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, postman, curl)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5000",
        "http://localhost:3000",
        process.env.FRONTEND_URL
      ];

      const isVercel = origin.endsWith(".vercel.app");
      const isLocal = origin.startsWith("http://localhost");

      if (allowedOrigins.includes(origin) || isVercel || isLocal) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json()); // Allow JSON body parsing

// Route Imports
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Route Middleware
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Seed Products Function
const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log("No products found in DB. Seeding initial products...");
      const initialProducts = [
        {
          name: "AeroPro High Performance Laptop",
          price: 74999,
          image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
          description: "15-inch screen, Intel i7 Processor, 16GB RAM, 512GB SSD. Perfect for development and creative work.",
          category: "Electronics",
          stock: 12
        },
        {
          name: "Titan V14 Smart Phone",
          price: 34999,
          image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
          description: "6.5-inch OLED display, triple-lens 64MP camera, 5G enabled with 128GB storage.",
          category: "Electronics",
          stock: 25
        },
        {
          name: "AcousticWave Wireless Headphones",
          price: 4999,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
          description: "Over-ear active noise-cancelling Bluetooth headphones with 40-hour battery life.",
          category: "Audio",
          stock: 35
        },
        {
          name: "Nexus Precision Gaming Mouse",
          price: 2499,
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80",
          description: "Ergonomic gaming mouse with 16,000 DPI optical sensor and customizable RGB lighting.",
          category: "Peripherals",
          stock: 45
        },
        {
          name: "Omni Chrono Smart Watch",
          price: 8999,
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
          description: "Amoled touch display, heart rate monitor, sleep tracking, and built-in GPS tracker.",
          category: "Wearables",
          stock: 18
        },
        {
          name: "Apex Mechanical Keyboard",
          price: 4499,
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
          description: "Tactile blue switches, metal top frame, and dynamic rainbow backlighting options.",
          category: "Peripherals",
          stock: 30
        },
        {
          name: "SoundPulse Bluetooth Speaker",
          price: 3499,
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80",
          description: "IPX7 waterproof rating, 360-degree surround sound, and 12-hour continuous runtime.",
          category: "Audio",
          stock: 40
        },
        {
          name: "Horizon VR Headset",
          price: 29999,
          image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=600&q=80",
          description: "All-in-one virtual reality headset with spatial audio and precise hand-tracking controllers.",
          category: "Electronics",
          stock: 8
        },
        {
          name: "Nomad Heritage Leather Backpack",
          price: 5999,
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
          description: "Handcrafted full-grain leather backpack with a padded sleeve for 15-inch laptops.",
          category: "Fashion",
          stock: 15
        },
        {
          name: "Classic Aviator Sunglasses",
          price: 1499,
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
          description: "Polarized lenses with 100% UV protection and a durable lightweight gold frame.",
          category: "Fashion",
          stock: 50
        },
        {
          name: "Vanguard Minimalist Watch",
          price: 7999,
          image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=600&q=80",
          description: "Japanese quartz movement watch with a sleek black dial and genuine brown leather strap.",
          category: "Fashion",
          stock: 20
        },
        {
          name: "HyperStride Sneaker",
          price: 3999,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          description: "Responsive foam cushion sneakers, breathable mesh knit, and durable rubber traction grips.",
          category: "Fashion",
          stock: 25
        },
        {
          name: "ActiveFit Running Shoes",
          price: 4999,
          image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=600&q=80",
          description: "Ultralight road-running trainers featuring arch-support midsoles and reflective detailing.",
          category: "Fashion",
          stock: 30
        },
        {
          name: "Nordic Ceramic Coffee Mug",
          price: 799,
          image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
          description: "Matte-finished stoneware mug holding 400ml. Dishwasher and microwave safe.",
          category: "Home & Living",
          stock: 60
        },
        {
          name: "Lumina Balance Desk Lamp",
          price: 2499,
          image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80",
          description: "Minimalist architect desk lamp with touch dimming, adjustable arm, and USB charge port.",
          category: "Home & Living",
          stock: 22
        },
        {
          name: "Potted Snake Plant",
          price: 1199,
          image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80",
          description: "Low-maintenance air-purifying indoor plant, potted in a modern white ceramic dish.",
          category: "Home & Living",
          stock: 15
        },
        {
          name: "AeroBreeze Diffuser",
          price: 1899,
          image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80",
          description: "Ultrasonic cool-mist essential oil diffuser with quiet operation and 7 color LED cycle.",
          category: "Home & Living",
          stock: 28
        },
        {
          name: "IronForce Dumbbell Set",
          price: 2999,
          image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80",
          description: "Hexagonal neoprene-coated dumbbells (pair of 5kg) for home gym strength training.",
          category: "Fitness & Outdoors",
          stock: 14
        },
        {
          name: "ZenFlow Cork Yoga Mat",
          price: 1999,
          image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=600&q=80",
          description: "Eco-friendly natural cork yoga mat with high-density backing and non-slip surface grip.",
          category: "Fitness & Outdoors",
          stock: 20
        },
        {
          name: "HydroShield Water Bottle",
          price: 999,
          image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
          description: "Vacuum-insulated double-wall stainless steel flask keeping cold drinks chilled for 24h.",
          category: "Fitness & Outdoors",
          stock: 50
        },
        {
          name: "Rustic Leather Journal",
          price: 1299,
          image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80",
          description: "Refillable leather notebook containing 200 pages of unlined, vintage deckle-edge paper.",
          category: "Stationery",
          stock: 30
        },
        {
          name: "Classic Brass Fountain Pen",
          price: 2199,
          image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80",
          description: "Fine-nib writing fountain pen with gold detailing. Includes premium leather presentation pouch.",
          category: "Stationery",
          stock: 15
        },
        {
          name: "BioScale Smart Body Analyzer",
          price: 2499,
          image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=600&q=80",
          description: "Bluetooth-enabled scale tracking weight, body fat %, muscle mass, and BMI in-app.",
          category: "Fitness & Outdoors",
          stock: 16
        },
        {
          name: "Spectrum LED Ring Light",
          price: 1799,
          image: "https://images.unsplash.com/photo-1590608897129-79da98d15969?auto=format&fit=crop&w=600&q=80",
          description: "10-inch desktop ring light with flexible phone clip mount, 3 color temperatures, and tripod.",
          category: "Peripherals",
          stock: 25
        },
        {
          name: "Viper Ergonomic Gaming Chair",
          price: 14999,
          image: "https://images.unsplash.com/photo-1598550476439-6847785fce6e?auto=format&fit=crop&w=600&q=80",
          description: "PU leather chair with memory foam headrest, lumbar support pillow, and 135-degree recline.",
          category: "Peripherals",
          stock: 7
        },
        {
          name: "Studio Felt Desk Mat",
          price: 1499,
          image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
          description: "Extra large non-slip felt desk pad accommodating mouse, keyboard, and coffee mug.",
          category: "Home & Living",
          stock: 35
        },
        {
          name: "MagSafe Fast Wireless Charger",
          price: 1999,
          image: "https://images.unsplash.com/photo-1622445262465-2481c4574875?auto=format&fit=crop&w=600&q=80",
          description: "Ultra-slim 15W Qi-compatible wireless charging pad with anti-slip silicone surfaces.",
          category: "Electronics",
          stock: 40
        },
        {
          name: "Multi-Port USB-C Hub",
          price: 2299,
          image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80",
          description: "6-in-1 aluminium adapter dongle featuring 4K HDMI, SD readers, and 3x USB 3.0 ports.",
          category: "Electronics",
          stock: 30
        },
        {
          name: "Slim Aluminum Wallet",
          price: 1199,
          image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80",
          description: "RFID-blocking metallic minimalist pocket wallet holding up to 12 cards with cash clip.",
          category: "Fashion",
          stock: 45
        },
        {
          name: "Nomad Vacuum Travel Flask",
          price: 1299,
          image: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=600&q=80",
          description: "Thermal travel coffee mug (500ml) with leak-proof flip lid lock. Keeps hot for 12h.",
          category: "Home & Living",
          stock: 30
        }
      ];
      await Product.insertMany(initialProducts);
      console.log("Seeding complete!");
    }
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

// Seed Products on Startup
seedProducts();

// Health check route
app.get("/", (req, res) => {
  res.send("Backend E-Commerce API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
