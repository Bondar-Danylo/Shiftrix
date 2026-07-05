// Imports
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import LoginPage from "@/pages/Common/LoginPage/LoginPage";
import AdminDashboardPage from "./pages/Admin/DashboardPage/AdminDashboardPage";
import RequestsPage from "./pages/Common/RequestsPage/RequestsPage";
import AnalyticsPage from "./pages/Admin/AnalyticsPage/AnalyticsPage";
import EmployeesPage from "./pages/Admin/EmployeesPage/EmployeesPage";
import ProfilePage from "./pages/Common/ProfilePage/ProfilePage";
import SettingsPage from "./pages/Common/SettingsPage/SettingsPage";

// Layouts
import MainLayout from "@/layouts/MainLayout/MainLayout";
import SchedulePage from "./pages/Common/SchedulePage/SchedulePage";
import ProtectedRoute from "./components/Common/ProtectedRoute/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/schedule" />} />

            {/* Common Routes */}
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="requests" element={<RequestsPage />} />

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="employees" element={<EmployeesPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
