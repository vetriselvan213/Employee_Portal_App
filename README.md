# Employee Portal Project - ZevenStone

A modern, full-stack employee management application built with React, Node.js, Express, and MongoDB.

## Features

-   **Authentication**: Secure login with JWT and Role-Based Access Control (RBAC).
-   **Dashboard**: Overview of key metrics and recent activities.
-   **Employee Management**: CRUD operations for employees with search and filtering.
-   **Responsive Design**: Fully responsive UI with glassmorphism effects and modern aesthetics.
-   **Notifications**: Real-time toast notifications for actions.
-   **Security**: Protected routes and secure password handling.

## Tech Stack

-   **Frontend**: React, Redux Toolkit, Tailwind CSS, Lucide React, React Hot Toast.
-   **Backend**: Node.js, Express, Mongoose (MongoDB).
-   **Tools**: Vite, PostCSS.

## Setup Instructions

### Prerequisites

-   Node.js (v14+ recommended)
-   MongoDB (Local or Atlas URI)

### 1. Clone the Repository

```bash
git clone <https://github.com/vetriselvan213/Employee_Portal_App>
cd "Employee Portal Project - ZevenStone"
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employee-portal
JWT_SECRET=your_jwt_secret_key_here
```

*Note: Replace `your_jwt_secret_key_here` with a strong secret string.*

Start the server:

```bash
npm start
# or for development with nodemon
npm run dev
```

### 3. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Sample Credentials

To get started, you can seed the database or use the following default credentials if you have run the seeder:

| Role       | Email                   | Password |
| :--------- | :---------------------- | :------- |
| **Admin**  | `shan@zevenstone.com`  | `shan123` |
| **Supervisor** | `melisadev@zevenstone.com` | `melisa123` |
| **Employee**   | `vetriselvan@zevenstone.com`   | `vetri123` |

*Note: If these users do not exist, you can register them or use the `seed.js` script in the server folder if available.*

## Design Choices & Tradeoffs

### UI/UX
-   **Glassmorphism**: Chosen for a premium, modern feel. It adds depth but requires careful handling of contrast and performance (backdrop-filter).
-   **Tailwind CSS**: Used for rapid development and consistency. Custom utilities were added for complex effects like gradients and glass styles.
-   **Responsiveness**: Prioritized mobile-first approach. Tables convert to cards on smaller screens to ensure usability.

### State Management
-   **Redux Toolkit**: Used for global state (auth, employees) to avoid prop drilling and manage complex async flows (thunks).
-   **Local State**: Used for UI-specific state (modals, form inputs) to keep the global store clean.

### Notifications
-   **React Hot Toast**: Selected over browser alerts for a non-blocking, visually appealing notification system. It provides immediate feedback without interrupting the user flow.

### Modals
-   **Custom Confirmation Modal**: Implemented instead of `window.confirm` to maintain visual consistency with the rest of the application.

## Future Improvements
-   Add unit and integration tests.
-   Implement pagination for the employee list (backend support needed).
-   Add profile image upload functionality.
