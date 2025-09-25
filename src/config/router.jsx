import { createBrowserRouter } from "react-router-dom";
import Zustand from "../Zustand";
import UseReactQuerry from "../component/UseReactQuerry";
import Test from "../Test";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/HomePage/HomePage";
import LoginPage from "../pages/Authenticate/LoginPage";

import StudentDashBoard from "../pages/StudentDashBoard/StudentDashBoard";
import StudentAssignmentPage from "../pages/StudentAssignmentPage/StudentAssignmentPage";
import InstructorLayout from "../layout/InstructorLayout";
import InstructorDashboard from "../pages/InstructorDashBoard/InstructorDashBoard";
import InstructorClass from "../pages/InstructorClass/InstructorClass";
import InstructorCreatePassword from "../pages/InstructorCreatePassword/InstructorCreatePassword";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {

        path: "studentdashboard", 
        element: <StudentDashBoard />,
      },
      {
        
        path: "my-assignments", 
        element: <StudentAssignmentPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "/zustand",
    element: <Zustand />,
  },
  {
    path: "/a",
    element: <UseReactQuerry />,
  },
  {
    path: "",
    element: <InstructorLayout />,
    children: [
      {
        path: "instructordashboard",
        element: <InstructorDashboard />,
      },
      {

        path: "my-classes", 
        element: <InstructorClass />,
      },
      {
        
        path: "create-class-password", 
        element: <InstructorCreatePassword />,
      },
    ],
  },
  
]);