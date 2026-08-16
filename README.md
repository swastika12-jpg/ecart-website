# E-Cart Fullstack E-Commerce Project

This is a MERN stack e-commerce web application with a dynamic React frontend, Node/Express backend, and MongoDB database.

## Deployed Links
* **Frontend (Vercel):** *[Insert your Vercel Link Here]*
* **Backend (Render):** *[Insert your Render Link Here]*

---

## Deployment Guide

Follow these steps to deploy both the frontend and backend successfully with the latest configuration fixes.

### 1. Deploy the Backend (Render)
Render is the easiest way to host the Express backend for free.

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New** -> **Web Service**.
2. Connect your GitHub repository `ecart-website`.
3. Set the following settings:
   * **Name:** `ecart-backend` (or similar)
   * **Root Directory:** `backend`
   * **Runtime:** `Node`
   * **Build Command:** `npm install`
   * **Start Command:** `node server.js`
4. Click **Advanced** and add the following **Environment Variables**:
   * `MONGODB_URI`: `mongodb+srv://swastikadubey4_db_user:xPEVbsHqnXs3m2Up@cluster0.nb2zvqi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`
   * `JWT_SECRET`: `supersecret12345`
   * `NODE_ENV`: `production`
5. Click **Create Web Service**. 
6. Once deployed, copy your backend URL (e.g., `https://ecart-backend.onrender.com`).

---

### 2. Deploy the Frontend (Vercel)
Vercel is the recommended hosting for the React frontend.

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Import your GitHub repository `ecart-website`.
3. Set the following settings:
   * **Framework Preset:** `Vite`
   * **Root Directory:** `frontend-react`
4. Click on **Environment Variables** and add:
   * **Key:** `VITE_API_URL`
   * **Value:** `<YOUR_DEPLOYED_BACKEND_URL>` (Use the URL you copied from Render in step 1, **without** a trailing slash, e.g., `https://ecart-backend.onrender.com`)
5. Click **Deploy**.

---

## Project Structure
* `/backend` - Express backend with MongoDB connection, Authentication, and Product & Order API routes.
* `/frontend-react` - React + Vite frontend styled with glassmorphism design.
