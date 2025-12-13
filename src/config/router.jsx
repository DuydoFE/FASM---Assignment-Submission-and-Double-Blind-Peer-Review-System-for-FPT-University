import { createBrowserRouter, Navigate } from "react-router-dom";
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
import InstructorClassDashBoard from "../pages/InstructorClassDashBoard/InstructorClassDashBoard";
import InstructorManageRubric from "../pages/InstructorManageRubric/InstructorManageRubric";
import InstructorManageCriteria from "../pages/InstructorManageCriteria/InstructorManageCriteria";
import InstructorManageCriteriaTemplate from "../pages/InstructorManageCriteriaTemplate/InstructorManageCriteriaTemplate";
import InstructorManageSubmission from "../pages/InstructorManageSubmission/InstructorManageSubmission";
import InstructorSubmissionDetail from "../pages/InstructorSubmissionDetail/InstructorSubmissionDetail";
import InstructorManageGrading from "../pages/IntructorManageGrading/IntructorManageGrading";
import InstructorGradingDetail from "../pages/IntructorGradingDetail/IntructorGradingDetail";
import InstructorPublishMark from "../pages/InstructorPublishMark/InstructorPublishMark";
import InstructorRegradeRequest from "../pages/IntructorRegradeRequest/IntructorRegradeRequest";
import InstructorSearchResultsPage from "../pages/InstructorSearchResultsPage/InstructorSearchResultsPage";
import PeerReviewPage from "../pages/PeerReviewPage/PeerReviewPage";
import ReviewSuccessPage from "../pages/PeerReviewPage/ReviewSuccessPage";
import { useCurrentAccount } from "../utils/accountUtils";
import { toast } from "react-toastify";
import { ROLE } from "../constant/roleEnum";
import { useRef } from "react";

const ProtectedRoute = ({ children, role }) => {
  const user = useCurrentAccount();
  const hasShownToast = useRef(false);
  
  if (!user) {
    // User is not logged in, redirect to login page without error message
    // This handles the case when user logs out
    return <Navigate to="/login" replace />;
  }
  if (user?.roles[0] !== role) {
    // User is logged in but doesn't have the correct role
    // Use ref to prevent multiple toasts on re-renders
    if (!hasShownToast.current) {
      hasShownToast.current = true;
      toast.error("You don't have permission to access this page!");
    }
    return <Navigate to="/" replace />;
  }
  return children;
};

import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUserManagement from "../pages/Admin/AdminUserManagement";
import AdminUserDetailsManagement from "../pages/Admin/AdminUserDetailsManagement";
import AdminCreateUser from "../pages/Admin/AdminCreateUser";
import AdminCourseManagement from "../pages/Admin/AdminCourseManagement";
import AdminMajorManagement from "../pages/Admin/AdminMajorManagement";
import AdminAcademicYearManagement from "../pages/Admin/AdminAcademicYearManagement";
import AdminSemesterManagement from "../pages/Admin/AdminSemesterManagement";
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
import SearchResultsPage from "@/pages/SearchResultsPage/SearchResultsPage";
import CrossClassReviewPage from "@/pages/PeerReviewPage/CrossClassReviewPage";
import PeerReviewHistoryPage from "@/pages/PeerReviewPage/PeerReviewHistoryPage";

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
        path: "assignment/:courseId/:assignmentId/cross-review",
        element: <CrossClassReviewPage />,
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
       {
        path: "search", 
        element: <SearchResultsPage />,
      },
      {
        path: "assignment/:courseId/:assignmentId/review-history",
        element: <PeerReviewHistoryPage />,
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
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorViewClass /></ProtectedRoute>,
      },
      {
        path: "regrade-request",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorRegradeRequest /></ProtectedRoute>,
      },
      {
        path: "search",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorSearchResultsPage /></ProtectedRoute>,
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
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorViewClass /></ProtectedRoute>,
      },
      {
        path: "regrade-request",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorRegradeRequest /></ProtectedRoute>,
      },
      {
        path: "grading-detail/:submissionId",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorGradingDetail /></ProtectedRoute>,
      },
    ],
  },
  {
    path: "/instructor",
    element: <InstructorClassLayout />,
    children: [
      {
        index: true,
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorClassDashBoard /></ProtectedRoute>,
      },
      {
        path: "class-statistic/:id",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorClassDashBoard /></ProtectedRoute>,
      },
      {
        path: "manage-class/:id",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageClass /></ProtectedRoute>,
      },
      {
        path: "manage-assignment/:id",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageAssignment /></ProtectedRoute>,
      },
      {
        path: "manage-rubric",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageRubric /></ProtectedRoute>,
      },
      {
        path: "manage-criteria/:rubricId?",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageCriteria /></ProtectedRoute>,
      },
      {
        path: "manage-criteria-template/:templateId?",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageCriteriaTemplate /></ProtectedRoute>,
      },
      {
        path: "manage-submission/:assignmentId",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageSubmission /></ProtectedRoute>,
      },
      {
        path: "submission-detail/:submissionId",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorSubmissionDetail /></ProtectedRoute>,
      },
      {
        path: "manage-grading",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageGrading /></ProtectedRoute>,
      },
      {
        path: "publish-mark",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorPublishMark /></ProtectedRoute>,
      },
    ],
  },
  
  {
  path: "/admin",
  element: (
    <ProtectedRoute role={ROLE.ADMIN}>
      <AdminLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: "dashboard", element: <AdminDashboard /> },
    { path: "users", element: <AdminUserManagement /> },
    { path: "users/add", element: <AdminCreateUser /> },
    { path: "users/:id", element: <AdminUserDetailsManagement /> },
    { path: "courses", element: <AdminCourseManagement /> },
    { path: "majors", element: <AdminMajorManagement /> },
    { path: "academicYears", element: <AdminAcademicYearManagement /> },
    { path: "semesters", element: <AdminSemesterManagement /> },
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
