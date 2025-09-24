import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PublicRoute from '../components/auth/PublicRoute';
import RootRedirect from '../components/auth/RootRedirect';
import LoadingSkeleton from '../components/shared/LoadingSkeleton';

const FullLayout = lazy(() => import('../layouts/full/FullLayout'));
const BlankLayout = lazy(() => import('../layouts/blank/BlankLayout'));

// Authentication Pages
const Login = lazy(() => import('../views/authentication/auth1/Login'));
const Register = lazy(() => import('../views/authentication/auth1/Register'));
const ForgotPassword = lazy(() => import('../views/authentication/auth1/ForgotPassword'));
const Unauthorized = lazy(() => import('../views/authentication/Unauthorized'));

// Dashboard
const Dashboard = lazy(() => import('../views/dashboard/Dashboard'));

// User Profile
const MyProfile = lazy(() => import('../views/profile/MyProfile'));
const AccountSettings = lazy(() => import('../views/profile/AccountSettings'));
const Security = lazy(() => import('../views/profile/Security'));
const ChangePassword = lazy(() => import('../views/profile/ChangePassword'));

// Help & Support
const Help = lazy(() => import('../views/help/Help'));

// Visitor Management Pages
const AllVisitors = lazy(() => import('../views/visitors/AllVisitors'));
const CheckInOut = lazy(() => import('../views/visitors/CheckInOut'));
const PreRegistration = lazy(() => import('../views/visitors/PreRegistration'));
const VisitorBadges = lazy(() => import('../views/visitors/VisitorBadges'));
const VisitorHistory = lazy(() => import('../views/visitors/VisitorHistory'));

// Security Pages
const IDVerification = lazy(() => import('../views/security/IDVerification'));
const PhotoCapture = lazy(() => import('../views/security/PhotoCapture'));
const QRScanner = lazy(() => import('../views/security/QRScanner'));
const Blacklist = lazy(() => import('../views/security/Blacklist'));
const Watchlist = lazy(() => import('../views/security/Watchlist'));
const AuditLogs = lazy(() => import('../views/security/AuditLogs'));

// Staff Management Pages
const StaffManagement = lazy(() => import('../views/staff/StaffManagement'));
const VisitorApprovals = lazy(() => import('../views/staff/VisitorApprovals'));
const Appointments = lazy(() => import('../views/staff/Appointments'));
const MeetingScheduler = lazy(() => import('../views/staff/MeetingScheduler'));

// Reports & Analytics Pages
const VisitorReports = lazy(() => import('../views/reports/VisitorReports'));
const VisitAnalytics = lazy(() => import('../views/reports/VisitAnalytics'));
const StaffReports = lazy(() => import('../views/reports/StaffReports'));
const ExportData = lazy(() => import('../views/reports/ExportData'));

// Communications Pages
const Notifications = lazy(() => import('../views/communications/Notifications'));
const Alerts = lazy(() => import('../views/communications/Alerts'));

// Admin Settings Pages
const SchoolSettings = lazy(() => import('../views/admin/SchoolSettings'));
const VisitorCategories = lazy(() => import('../views/admin/VisitorCategories'));
const AccessHours = lazy(() => import('../views/admin/AccessHours'));
const FormBuilder = lazy(() => import('../views/admin/FormBuilder'));
const DataSettings = lazy(() => import('../views/admin/DataSettings'));

const Router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSkeleton variant="dashboard" />}>
          <FullLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Dashboard />
          </Suspense>
        ),
      },

      // Profile Routes
      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <MyProfile />
          </Suspense>
        ),
      },
      {
        path: 'profile/settings',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <AccountSettings />
          </Suspense>
        ),
      },
      {
        path: 'profile/security',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Security />
          </Suspense>
        ),
      },
      {
        path: 'profile/change-password',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <ChangePassword />
          </Suspense>
        ),
      },

      // Help & Support Routes
      {
        path: 'help',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Help />
          </Suspense>
        ),
      },

      // Visitor Management Routes
      {
        path: 'visitors/all',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <AllVisitors />
          </Suspense>
        ),
      },
      {
        path: 'visitors/checkin',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <CheckInOut />
          </Suspense>
        ),
      },
      {
        path: 'visitors/pre-register',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <PreRegistration />
          </Suspense>
        ),
      },
      {
        path: 'visitors/badges',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <VisitorBadges />
          </Suspense>
        ),
      },
      {
        path: 'visitors/history',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <VisitorHistory />
          </Suspense>
        ),
      },

      // Security Routes
      {
        path: 'security/id-verification',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <IDVerification />
          </Suspense>
        ),
      },
      {
        path: 'security/photo-capture',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <PhotoCapture />
          </Suspense>
        ),
      },
      {
        path: 'security/qr-scanner',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <QRScanner />
          </Suspense>
        ),
      },
      {
        path: 'security/blacklist',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Blacklist />
          </Suspense>
        ),
      },
      {
        path: 'security/watchlist',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Watchlist />
          </Suspense>
        ),
      },
      {
        path: 'security/audit-logs',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <AuditLogs />
          </Suspense>
        ),
      },

      // Staff Management Routes
      {
        path: 'staff/management',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <StaffManagement />
          </Suspense>
        ),
      },
      {
        path: 'staff/approvals',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <VisitorApprovals />
          </Suspense>
        ),
      },
      {
        path: 'staff/appointments',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Appointments />
          </Suspense>
        ),
      },
      {
        path: 'staff/scheduler',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <MeetingScheduler />
          </Suspense>
        ),
      },

      // Reports Routes
      {
        path: 'reports/visitors',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <VisitorReports />
          </Suspense>
        ),
      },
      {
        path: 'reports/analytics',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <VisitAnalytics />
          </Suspense>
        ),
      },
      {
        path: 'reports/staff',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <StaffReports />
          </Suspense>
        ),
      },
      {
        path: 'reports/export',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <ExportData />
          </Suspense>
        ),
      },

      // Communications Routes
      {
        path: 'notifications',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Notifications />
          </Suspense>
        ),
      },
      {
        path: 'alerts',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Alerts />
          </Suspense>
        ),
      },

      // Admin Routes
      {
        path: 'admin/school-settings',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <SchoolSettings />
          </Suspense>
        ),
      },
      {
        path: 'admin/visitor-categories',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <VisitorCategories />
          </Suspense>
        ),
      },
      {
        path: 'admin/access-hours',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <AccessHours />
          </Suspense>
        ),
      },
      {
        path: 'admin/form-builder',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <FormBuilder />
          </Suspense>
        ),
      },
      {
        path: 'admin/data-settings',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <DataSettings />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
          <BlankLayout />
        </Suspense>
      </PublicRoute>
    ),
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/unauthorized',
    element: (
      <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
        <BlankLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSkeleton variant="minimal" />}>
            <Unauthorized />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default Router;
