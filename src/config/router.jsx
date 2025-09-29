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
import InstructorViewClass from "../pages/InstructorViewClass/InstructorViewClass";
import InstructorCreatePassword from "../pages/InstructorCreatePassword/InstructorCreatePassword";
import InstructorClassLayout from "../layout/InstructorClassLayout";
import InstructorManageClass from "../pages/InstructorManageClass/InstructorManageClass";
import InstructorManageAssignment from "../pages/InstructorManageAssignment/InstructorManageAssignment";
import AssignmentDetailPage from "../pages/AssignmentDetailPage/AssignmentDetailPage";
import StudentSubmitAssignmentPage from "../pages/StudentSubmitAssignmentPage/StudentSubmitAssignmentPage";
import InstructorManageSubmission from "../pages/InstructorManageSubmission/InstructorManageSubmission";
import InstructorSubmissionDetail from "../pages/InstructorSubmissionDetail/InstructorSubmissionDetail";
import InstructorManageGrading from "../pages/IntructorManageGrading/IntructorManageGrading";
import InstructorGradingDetail from "../pages/IntructorGradingDetail/IntructorGradingDetail";
import InstructorPublishMark from "../pages/InstructorPublishMark/InstructorPublishMark";
import InstructorRegradeRequest from "../pages/IntructorRegradeRequest/IntructorRegradeRequest";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import ManageClass from "../pages/Admin/ManageClass";
import AssignmentPage from "../pages/Admin/AssignmentPage";
import PeerReviewPage from "../pages/PeerReviewPage/PeerReviewPage";

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
       {
    
        path: "assignment/:courseId",
        element: <AssignmentDetailPage />,
      },
       {
        path: "assignment/:courseId/:assignmentId",
        element: <StudentSubmitAssignmentPage />,
      },
       {
        path: "assignment/:courseId/:assignmentId/review",
        element: <PeerReviewPage/>,
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
        element: <InstructorViewClass />,
      },
      {

        path: "create-class-password",
        element: <InstructorCreatePassword />,
      },
      {

        path: "regrade-request",
        element: <InstructorRegradeRequest />,
      },
    ],
  },
  {
    path: "",
    element: <InstructorClassLayout />,
    children: [
      {
        index: true,
        element: <InstructorManageClass />,
      },
      {
        path: "manage-class",
        element: <InstructorManageClass />,
      },
      {
        path: "manage-assignment",
        element: <InstructorManageAssignment />,
      },
      {
        path: "manage-submission",
        element: <InstructorManageSubmission />,
      },
      {
        path: "submission-detail",
        element: <InstructorSubmissionDetail />,
      },
      {
        path: "manage-grading",
        element: <InstructorManageGrading />,
      },
      {
        path: "grading-detail",
        element: <InstructorGradingDetail />,
      },
      {
        path: "publish-mark",
        element: <InstructorPublishMark />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "manage-class",
        element: <ManageClass />
      },
      {
        path: "assignments",
        element: <AssignmentPage />
      },
    ],
  }


]);