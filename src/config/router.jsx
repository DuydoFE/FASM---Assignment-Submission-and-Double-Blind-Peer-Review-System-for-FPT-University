import { createBrowserRouter, Navigate, useLocation } from "react-router-dom";
import Test from "../Test";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/HomePage/HomePage";
import LandingPage from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/Authenticate/LoginPage";
import ForgotPasswordPage from "../pages/Authenticate/ForgotPasswordPage";
import AccessDeniedPage from "../pages/AccessDenied/AccessDeniedPage";
import ForbiddenPage from "../pages/AccessDenied/ForbiddenPage";
import NotFoundPage from "../pages/NotFound/NotFoundPage";

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

const ProtectedRoute = ({ children, role, allowGuest = false, requireAuth = false }) => {
  const user = useCurrentAccount();
  const location = useLocation();
  const hasShownToast = useRef(false);
  
  // Allow guest access if allowGuest is true and requireAuth is false
  if (allowGuest && !user && !requireAuth) {
    return children;
  }
  
  // If requireAuth is true, always require login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user?.roles[0] !== role) {
    if (!hasShownToast.current) {
      hasShownToast.current = true;
      toast.error("You don't have permission to access this page!");
    }
    return <Navigate to="/access-denied" state={{ from: location }} replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const user = useCurrentAccount();
  
  // Prevent logged-in users from accessing login page
  if (user) {
    if (user.roles[0] === "Instructor") {
      return <Navigate to="/instructor/dashboard" replace />;
    } else if (user.roles[0] === "Admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.roles[0] === "Student") {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminUserManagement from "../pages/Admin/AdminUserManagement";
import AdminUserDetailsManagement from "../pages/Admin/AdminUserDetailsManagement";
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
    element: <ProtectedRoute role={ROLE.STUDENT} allowGuest={true}><MainLayout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "landing",
        element: <LandingPage />,
      },
      {
        path: "profile",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><ProfilePage /></ProtectedRoute>,
      },
      {
        path: "studentdashboard",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><StudentDashBoard /></ProtectedRoute>,
      },
      {
        path: "my-assignments",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><StudentAssignmentPage /></ProtectedRoute>,
      },
      {
        path: "assignment/:courseId",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><AssignmentDetailPage /></ProtectedRoute>,
      },
      {
        path: "assignment/:courseId/:assignmentId",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><StudentSubmitAssignmentPage /></ProtectedRoute>,
      },
      {
        path: "assignment/:courseId/:assignmentId/review",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><PeerReviewPage /></ProtectedRoute>,
      },
      {
        path: "assignment/:courseId/:assignmentId/cross-review",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><CrossClassReviewPage /></ProtectedRoute>,
      },
      {
        path: "/review-success",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><ReviewSuccessPage /></ProtectedRoute>,
      },
      {
        path: "assignment/:courseId/:assignmentId/scores",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><ViewScorePage /></ProtectedRoute>,
      },
      {
        path: "regrade-request",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><ViewRequestHistoryPage /></ProtectedRoute>,
      },
       {
        path: "search",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><SearchResultsPage /></ProtectedRoute>,
      },
      {
        path: "assignment/:courseId/:assignmentId/review-history",
        element: <ProtectedRoute role={ROLE.STUDENT} requireAuth={true}><PeerReviewHistoryPage /></ProtectedRoute>,
      },

    ],
  },
  {
    path: "/login",
    element: <PublicRoute><LoginPage /></PublicRoute>,
  },
  {
    path: "/forgot-password",
    element: <PublicRoute><ForgotPasswordPage /></PublicRoute>,
  },
  {
    path: "/access-denied",
    element: <AccessDeniedPage />,
  },
  {
    path: "/forbidden",
    element: <ForbiddenPage />,
  },
  {
    path: "/test",
    element: <Test />,
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
        path: "class-statistic/:courseInstanceId",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorClassDashBoard /></ProtectedRoute>,
      },
      {
        path: "manage-class/:courseInstanceId",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageClass /></ProtectedRoute>,
      },
      {
        path: "manage-assignment/:courseInstanceId",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageAssignment /></ProtectedRoute>,
      },
      {
        path: "manage-rubric/:courseInstanceId",
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
        path: "manage-grading/:courseInstanceId",
        element: <ProtectedRoute role={ROLE.INSTRUCTOR}><InstructorManageGrading /></ProtectedRoute>,
      },
      {
        path: "publish-score/:courseInstanceId",
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
},
{
  path: "*",
  element: <NotFoundPage />,
}

]);
