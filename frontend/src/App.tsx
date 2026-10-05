import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CoworkingSpacesPage from "@/pages/CoworkingSpacesPage";
import CoworkingSpaceDetailsPage from "@/pages/CoworkingSpaceDetailsPage";
import CreateCoworkingSpacePage from "@/pages/CreateCoworkingSpacePage";
import CreateCoworkingResourcePage from "@/pages/CreateCoworkingResourcePage";
import { CreateBookingPage } from "@/pages/CreateBookingPage";
import BookingsPage from "@/pages/BookingsPage";
import CreateResourceAvailabilityPage from "@/pages/CreateResourceAvailabilityPage";

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
        <Route
          path="/coworking-spaces/:id/resources/new"
          element={<CreateCoworkingResourcePage />}
        />
        <Route
          path="/coworking-resources/:id/book"
          element={<CreateBookingPage />}
        />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route
          path="/coworking-resources/:id/availabilities/new"
          element={<CreateResourceAvailabilityPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
