import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import BloodRequestsPage from './pages/blood-requests';
import DonorRegistration from './pages/donor-registration';
import AdminDashboard from './pages/admin-dashboard';
import DonorDashboard from './pages/donor-dashboard';
import DonorLogin from './pages/donor-login';
import FindDonors from './pages/find-donors';
import Homepage from './pages/homepage';
import DonorProfile from './pages/donor-profile';
import { LanguageProvider } from './contexts/LanguageContext';

const Routes = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Homepage />} />
        <Route path="/blood-requests" element={<BloodRequestsPage />} />
        <Route path="/donor-registration" element={<DonorRegistration />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/donor-login" element={<DonorLogin />} />
        <Route path="/donor-dashboard" element={<DonorDashboard />} />
        <Route path="/find-donors" element={<FindDonors />} />
        <Route path="/donor-profile/:donorId" element={<DonorProfile />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </ErrorBoundary>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default Routes;
