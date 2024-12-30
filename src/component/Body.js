import React from "react";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import CreateForm from "./AdminCreateForm";
import SubmitForm from "./SubmitForm";
import ViewForm from "./ViewForms";
import ProtectedRoute from "./ProtectedRoute"; 
import { createBrowserRouter, RouterProvider } from "react-router";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />, 
    },
    {
      path: "/admin/dashboard",
      element: (
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/user/form",
      element: (
        <ProtectedRoute>
          <UserDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/create-form",
      element: (
        <ProtectedRoute>
          <CreateForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/view-form/:id",
      element: (
        <ProtectedRoute>
          <ViewForm />
        </ProtectedRoute>
      ),
    },
    {
      path: "/form/:formId",
      element: (
        <ProtectedRoute>
          <SubmitForm />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={appRouter} />;
};

export default Body;
