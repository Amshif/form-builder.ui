// import Browse from "./Browse";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import CreateForm from "./AdminCreateForm";
import ViewForm from "./ViewForms";
import { createBrowserRouter , RouterProvider} from "react-router";



const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path:"/",
            element:<Login/>,
        },
        {
          path: "/admin/dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "/user/form",
          element: <UserDashboard />,
        },
        {
          path: "/admin/create-form",
          element: <CreateForm />,
        },
        { path: "/admin/view-form/:id", 
          element: <ViewForm /> 
        },
    ]);
  
  return (
    <RouterProvider router={appRouter}/>
  )
}

export default Body