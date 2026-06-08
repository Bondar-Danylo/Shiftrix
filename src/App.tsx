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

// Layouts
import MainLayout from "@/layouts/MainLayout/MainLayout";

const App = () => {
  const isAuthenticated = !!localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole");

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}
        >
          <Route index element={<Navigate to="/dashboard" />} />

          <Route
            path="dashboard"
            element={role === "admin" ? <AdminDashboardPage /> : ""}
          />

          <Route path="requests" element={<RequestsPage />} />

          <Route path="analytics" element={<AnalyticsPage />} />

          <Route path="employees" element={<EmployeesPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
