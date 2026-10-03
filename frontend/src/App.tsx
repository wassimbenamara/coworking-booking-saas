import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CoworkingSpacesPage from "./pages/CoworkingSpacesPage";
import CoworkingSpaceDetailsPage from "./pages/CoworkingSpaceDetailsPage";
import CreateCoworkingSpacePage from "./pages/CreateCoworkingSpacePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/coworking-spaces" element={<CoworkingSpacesPage />} />
        <Route
          path="/coworking-spaces/:id"
          element={<CoworkingSpaceDetailsPage />}
        />
        <Route
          path="/coworking-spaces/new"
          element={<CreateCoworkingSpacePage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
