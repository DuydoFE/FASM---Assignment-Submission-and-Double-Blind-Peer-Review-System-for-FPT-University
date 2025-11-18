import { createBrowserRouter, Navigate } from "react-router-dom";
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
import InstructorClassLayout from "../layout/InstructorClassLayout";
import InstructorManageClass from "../pages/InstructorManageClass/InstructorManageClass";
import InstructorManageAssignment from "../pages/InstructorManageAssignment/InstructorManageAssignment";
import AssignmentDetailPage from "../pages/AssignmentDetailPage/AssignmentDetailPage";
import StudentSubmitAssignmentPage from "../pages/StudentSubmitAssignmentPage/StudentSubmitAssignmentPage";
import InstructorManageRubric from "../pages/InstructorManageRubric/InstructorManageRubric";
import InstructorManageCriteria from "../pages/InstructorManageCriteria/InstructorManageCriteria";
import InstructorManageCriteriaTemplate from "../pages/InstructorManageCriteriaTemplate/InstructorManageCriteriaTemplate";
import InstructorManageSubmission from "../pages/InstructorManageSubmission/InstructorManageSubmission";
import InstructorSubmissionDetail from "../pages/InstructorSubmissionDetail/InstructorSubmissionDetail";
import InstructorManageGrading from "../pages/IntructorManageGrading/IntructorManageGrading";
import InstructorGradingDetail from "../pages/IntructorGradingDetail/IntructorGradingDetail";
import InstructorPublishMark from "../pages/InstructorPublishMark/InstructorPublishMark";
import InstructorRegradeRequest from "../pages/IntructorRegradeRequest/IntructorRegradeRequest";
import PeerReviewPage from "../pages/PeerReviewPage/PeerReviewPage";
import ReviewSuccessPage from "../pages/PeerReviewPage/ReviewSuccessPage";
import { getCurrentAccount } from "../utils/accountUtils";
import { toast } from "react-toastify";
import { ROLE } from "../constant/roleEnum";
const ProtectedRoute = ({ children, role }) => {
  const user = getCurrentAccount();
  if (!user || user?.roles[0] !== role) {
    // User is not authenticated or doesn't have the required role
    toast.error("You don't have permission to access this page!");
    return <Navigate to="/" replace />;
  }
  // User has the required role, render the children
  return children;
};

// 👉 Import layout + pages cho Admin
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUserManagement from "../pages/Admin/AdminUserManagement";
import AdminClassManagement from "../pages/Admin/AdminClassManagement";
import AdminClassDetailsManagement from "../pages/Admin/AdminClassDetailsManagement";
import AdminClassAssignments from "../pages/Admin/AdminClassAssignments";
import AdminAssignmentDetails from "../pages/Admin/AdminAssignmentDetails";
import AdminSubmissionDetails from "../pages/Admin/AdminSubmissionDetails";
import AdminRubricManagement from "../pages/Admin/AdminRubricManagement";
import AdminRubricDetail from "../pages/Admin/AdminRubricDetail";
import AdminAccountSettings from "../pages/Admin/AdminAccountSettings";
import AdminSystemSetting from "../pages/Admin/AdminSystemSetting";

import ProfilePage from "../pages/HomePage/ProfilePage";
import ViewScorePage from "../pages/ViewScorePage/ViewScorePage";
import ViewRequestHistoryPage from "../pages/RegradeRequest/ViewRequestHistoryPage";

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
        path: "profile",
        element: <ProfilePage />,
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
        element: <PeerReviewPage />,
      },
      {
        path: "/review-success",
        element: <ReviewSuccessPage />,
      },
      {
        path: "assignment/:courseId/:assignmentId/scores",
        element: <ViewScorePage />,
      },
      {
        path: "regrade-request",
        element: <ViewRequestHistoryPage />,
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
    path: "/instructor",
    element: <InstructorLayout />,
    children: [
      {
        path: "dashboard",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorDashboard /></ProtectedRoute>,
      },
      {
        path: "my-classes",
        element: <InstructorViewClass />,
      },
      {
        path: "regrade-request",
        element: <InstructorRegradeRequest />,
      },
    ],
  },
  {
    path: "/instructor",
    element: <InstructorLayout />,
    children: [
      {
        path: "instructordashboard",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorDashboard /></ProtectedRoute>,
      },
      {
        path: "my-classes",
        element: <InstructorViewClass />,
      },
      {
        path: "regrade-request",
        element: <InstructorRegradeRequest />,
      },
      {
        path: "grading-detail/:submissionId",
        element: <InstructorGradingDetail />,
      },
    ],
  },
  {
    path: "/instructor",
    element: <InstructorClassLayout />,
    children: [
      {
        index: true,
        element: <InstructorManageClass />,
      },
      {
        path: "manage-class/:id",
        element: <InstructorManageClass />,
      },
      {
        path: "manage-assignment/:id",
        element: <InstructorManageAssignment />,
      },
      {
        path: "manage-rubric",
        element: <InstructorManageRubric />,
      },
      {
        path: "manage-criteria/:rubricId?",
        element: <InstructorManageCriteria />,
      },
      {
        path: "manage-criteria-template/:templateId?",
        element: <InstructorManageCriteriaTemplate />,
      },
      {
        path: "manage-submission/:assignmentId",
        element: <InstructorManageSubmission />,
      },
      {
        path: "submission-detail/:submissionId",
        element: <InstructorSubmissionDetail />,
      },
      {
        path: "manage-grading",
        element: <InstructorManageGrading />,
      },
      {
        path: "publish-mark",
        element: <InstructorPublishMark />,
      },
    ],
  },
  // 👉 Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "dashboard", element: <AdminDashboard /> },
      { path: "users", element: <AdminUserManagement /> },
      { path: "classes", element: <AdminClassManagement /> },
      { path: "classes/:id/assignments/:assignmentId", element: <AdminAssignmentDetails /> },
      { path: "classes/:id/assignments", element: <AdminClassAssignments /> },
      { path: "classes/:id", element: <AdminClassDetailsManagement /> },
      { path: "classes/:id/assignments/:assignmentId/submissions/:submissionId", element: <AdminSubmissionDetails /> },
      { path: "rubrics", element: <AdminRubricManagement /> },
      { path: "rubrics/:id", element: <AdminRubricDetail /> },
      { path: "settings", element: <AdminAccountSettings /> },
      { path: "systemSetting", element: <AdminSystemSetting /> },
    ],
  }

]);
