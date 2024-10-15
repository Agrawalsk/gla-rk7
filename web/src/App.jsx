import { useEffect, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import PostUpload from "./pages/postUpload/postUpload";

import "./App.css";
import { AuthProvider } from "./utils/authContext";
import LandingPage from "./pages/landing/landingPage";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import PageNotImplemented from "./pages/pageEmpty";

import DashboardPage from "@/pages/dashboard";
import CommonHeader from "@/Components/Header";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SearchScreen from "./pages/search/SearchScreen";
import ForgotPassword from "./pages/ForgotPasswprd/forgotPassword";

const BlankLayout = () => {
  return (
    <>
      <CommonHeader />
      <main>
        <div className="bg-overlay"></div>
        <Outlet />
        <ToastContainer />
      </main>
    </>
  );
};

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <BlankLayout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path:"/upload",
          element:<PostUpload />
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
        {
          path:"/forget-password",
          element:<ForgotPassword />
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
        {
          path: "/dashboard",
          element: <DashboardPage />,
        },
        {
          path: "/contact",
          element: <main>Contact Us</main>,
        },
        {
          path: "/services",
          element: <main>Services</main>,
        },
        {
          path: "/about",
          element: <main>About Us</main>,
        },
        {
          path: "*",
          element: <PageNotImplemented />,
        },
        {
          path:"/Search",
          element:<SearchScreen/>
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
