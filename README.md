# E-Cart Fullstack E-Commerce Project

This is a MERN stack e-commerce web application with a dynamic React frontend, Node/Express backend, and MongoDB database.

## Deployed Links
* **Frontend (Vercel):** *[Insert your Vercel Link Here]*
* **Backend (Render):** *[Insert your Render Link Here]*

---

## Deployment Guide

Follow these steps to deploy both the frontend and backend successfully with the latest configuration fixes.

### 1. Deploy the Backend (Vercel)
You can deploy your Express backend on Vercel as a Serverless function.

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Import your GitHub repository `ecart-website`.
3. Set the following settings:
   * **Framework Preset:** `Other` (or select `Express` if it autodetects)
   * **Root Directory:** `backend`
4. Click on **Environment Variables** and add:
   * `MONGODB_URI`: `mongodb+srv://swastikadubey4_db_user:xPEVbsHqnXs3m2Up@cluster0.nb2zvqi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0`
   * `JWT_SECRET`: `supersecret12345`
   * `NODE_ENV`: `production`
5. Click **Deploy**.
6. Once deployed, copy your backend Vercel URL (e.g., `https://ecart-backend.vercel.app`).

*(Alternatively, you can deploy the backend on Render by choosing Root Directory as `backend`, Build Command as `npm install`, and Start Command as `node server.js`.)*

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
   * **Value:** `<YOUR_DEPLOYED_BACKEND_URL>` (Use the URL you copied from Vercel/Render in step 1, **without** a trailing slash, e.g., `https://ecart-backend.vercel.app`)
5. Click **Deploy**.

---

## Project Structure
* `/backend` - Express backend with MongoDB connection, Authentication, and Product & Order API routes.
* `/frontend-react` - React + Vite frontend styled with glassmorphism design.
