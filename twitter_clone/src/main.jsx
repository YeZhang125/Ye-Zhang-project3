import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Homepage from "./components/Homepage.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import UserProfile from "./components/UserProfile.jsx";
import AuthProvider from './components/AuthProvider';
import Cookies from 'js-cookie';
import axios from "axios";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/user/:userId", // Dynamic route with parameter `userId`
    element: <UserProfile />,
  },
]);

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

axios.interceptors.request.use(config => {
  const token = Cookies.get('token'); // Retrieve token from local storage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
