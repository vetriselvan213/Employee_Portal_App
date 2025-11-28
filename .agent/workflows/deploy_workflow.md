# Deployment Workflow

This guide outlines the steps to deploy the Employee Portal application.

## Prerequisites

-   GitHub Account (repo pushed)
-   Render Account (for Backend)
-   Netlify Account (for Frontend)

## 1. Backend Deployment (Render)

1.  Log in to [Render](https://render.com/).
2.  Click **New +** and select **Web Service**.
3.  Connect your GitHub repository: `https://github.com/vetriselvan213/Employee_Portal_App`.
4.  Configure the service:
    -   **Name**: `employee-portal-api` (or similar)
    -   **Root Directory**: `server`
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
5.  **Environment Variables**:
    -   Add the following variables in the "Environment" tab:
        -   `MONGO_URI`: Your MongoDB connection string (e.g., from MongoDB Atlas).
        -   `JWT_SECRET`: A strong secret key.
        -   `PORT`: `10000` (Render default) or `5000`.
6.  Click **Create Web Service**.
7.  Wait for the deployment to finish. **Copy the backend URL** (e.g., `https://employee-portal-api.onrender.com`).

## 2. Frontend Deployment (Netlify)

1.  Log in to [Netlify](https://www.netlify.com/).
2.  Click **Add new site** -> **Import from existing project**.
3.  Select **GitHub** and choose your repository.
4.  Configure the build settings:
    -   **Base directory**: `client`
    -   **Build command**: `npm run build`
    -   **Publish directory**: `client/dist`
5.  **Environment Variables**:
    -   Click **Show advanced** or go to **Site configuration > Environment variables** after creation.
    -   Add `VITE_API_URL` and set it to your **Render Backend URL** (e.g., `https://employee-portal-api.onrender.com`).
        -   *Note: Do not add a trailing slash.*
6.  Click **Deploy site**.

## 3. Final Verification

1.  Open your Netlify URL.
2.  Log in with the admin credentials.
3.  Verify that data loads from the backend.

## Troubleshooting

-   **CORS Issues**: If you see CORS errors, update `server/index.js` to explicitly allow your Netlify domain in the `cors()` configuration.
-   **Build Errors**: Check the build logs on Render/Netlify for missing dependencies or syntax errors.
