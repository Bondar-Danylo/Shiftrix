import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "@/pages/LoginPage/LoginPage";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import AdminDashboardPage from "./pages/Admin/DashboardPage/AdminDashboardPage";

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
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
