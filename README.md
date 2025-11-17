# FASM - Assignment Submission and Double-Blind Peer Review System for FPT University

## 📋 Project Overview

**FASM** is a comprehensive web-based platform designed for FPT University to streamline assignment submission and peer review processes. The system implements a **double-blind peer review mechanism** where reviewers and students remain anonymous, ensuring fair and unbiased evaluations. This platform serves multiple user roles including students, instructors, administrators, and peer reviewers.

## 🎯 Key Features

- **Assignment Management**: Create, edit, and manage assignments with customizable rubrics and grading criteria
- **Submission System**: Students can submit assignments with support for various file formats and deadlines
- **Double-Blind Peer Review**: Anonymous peer review process where both reviewers and submitters remain unidentified
- **Automated Grading**: AI-powered grading assistance for instructors (AIforInstructor feature)
- **Dynamic Rubrics**: Customizable grading rubrics with weighted criteria
- **Real-time Notifications**: Instant updates for submissions, reviews, and grade publication
- **Regrade Requests**: Students can request regrading with instructor review
- **Dashboard Analytics**: Visualization of grades, submissions, and peer review progress
- **Role-Based Access Control**: Distinct interfaces for students, instructors, and administrators

## 🛠️ Technology Stack

### Frontend Framework & Build Tools
- **React 18.2**: Modern UI library with hooks and functional components
- **Vite 5.0**: Lightning-fast build tool and development server
- **React Router 6**: Client-side routing for navigation
- **Redux Toolkit & Redux Persist**: State management and persistent store

### UI & Styling
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Ant Design 5.13**: Comprehensive component library
- **Material-UI 5.15**: Material Design components
- **Framer Motion**: Smooth animations and transitions
- **AOS (Animate On Scroll)**: Scroll-triggered animations

### Data Fetching & API Management
- **TanStack React Query 5.90**: Powerful server state management
- **Axios 1.6**: HTTP client for API requests
- **React Query Devtools**: Query debugging and monitoring

### Real-time Features
- **Socket.js Client**: WebSocket communication for real-time updates
- **StompJS**: STOMP protocol for message brokering

### Additional Libraries
- **Firebase 10.7**: Authentication, messaging, and cloud services
- **Date-fns & Moment.js**: Date manipulation and formatting
- **Zustand 4.5**: Lightweight state management
- **React Signature Canvas**: Digital signature capture
- **XLSX**: Excel file export/import capabilities
- **SweetAlert2**: Enhanced alert dialogs
- **React Hot Toast**: Toast notifications
- **Nivo Charts**: Advanced data visualization
- **Recharts**: Interactive chart library

## 📁 Project Structure

```
src/
├── pages/               # Main page components for each feature
│   ├── Admin/          # Administrator management pages
│   ├── AssignmentDetailPage/
│   ├── InstructorDashBoard/
│   ├── StudentDashBoard/
│   ├── PeerReviewPage/
│   ├── ViewScorePage/
│   └── ...
├── component/          # Reusable UI components
│   ├── Assignment/     # Assignment-related components
│   ├── Criteria/       # Rubric criteria components
│   ├── InstructorGrading/
│   ├── Review/         # Peer review components
│   ├── Submission/     # Submission handling
│   └── ...
├── service/            # API service modules
│   ├── assignmentService.js
│   ├── submissionService.js
│   ├── reviewService.js
│   ├── instructorGrading.js
│   └── ...
├── config/             # Configuration files
│   ├── axios.js        # Axios instance setup
│   ├── firebase.js     # Firebase configuration
│   └── router.jsx      # Route definitions
├── assets/
│   ├── hook/          # Custom React hooks
│   │   ├── useCallApi.js
│   │   ├── useRealTime.jsx
│   │   ├── useNotification.js
│   │   └── ...
│   └── img/
├── layout/             # Layout components for different user roles
├── redux/              # Redux store setup and features
├── zustand/            # Zustand state stores
└── utils/              # Utility functions

```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/DuydoFE/FASM---Assignment-Submission-and-Double-Blind-Peer-Review-System-for-FPT-University.git

# Navigate to the project directory
cd FASM---Assignment-Submission-and-Double-Blind-Peer-Review-System-for-FPT-University

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# The application will be available at http://localhost:5173
```

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

### Code Quality

```bash
# Run ESLint to check code quality
npm run lint
```

## 📱 User Roles & Workflows

### Students
- Submit assignments before deadlines
- View submission status and grades
- Participate in peer reviews (anonymous)
- Request regrades if needed
- Track review feedback

### Instructors
- Create and manage assignments with custom rubrics
- View all student submissions
- Grade submissions using AI-assisted tools
- Publish grades and feedback
- Monitor peer review process
- Manage grading criteria and rubric templates

### Administrators
- Manage system users and roles
- Configure campus and course settings
- Oversee assignment and grading workflows
- Generate system reports

### Peer Reviewers
- Review anonymously submitted assignments
- Provide feedback using structured rubrics
- Rate submissions fairly without bias

## 🔐 Security Features

- Double-blind peer review system ensures anonymity
- Firebase authentication and authorization
- Role-based access control (RBAC)
- Secure API communication with token validation
- Real-time message encryption via STOMP

## 🌟 Current Branch

**AIforInstructor** - This branch includes AI-powered grading assistance features to help instructors streamline the grading process.

## 📞 Contact & Support

For issues or inquiries, please refer to the project repository or contact the FPT University development team.

---

**Last Updated**: November 2025
