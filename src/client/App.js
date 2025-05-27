import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./User/Components/Navbar";
import Footer from "./User/Components/Footer";
import PageLoader from "./User/Components/PageLoader";
import Home from "./User/Pages/Home";
import Coaches from "./User/Pages/Coaches";
import CoachDetails from "./User/Pages/CoachDetails";
import CelebrationsPage from "./User/Pages/CelebrationsPage";
import Pricing from "./User/Pages/Pricing";
import ContactUs from "./User/Pages/ContactUs";
import ScrollToTop from "./User/Components/ScrollToTop";
import LoginPage from "./Staff/Pages/LoginPage";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import StaffPage from "./Staff/Pages/StaffPage";
import About from "./User/Pages/About";
import Transformations from "./User/Pages/Transformations";

function App() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location]);

  // Paths where you want to hide the Navbar/Footer
  const hideLayoutPaths = [ "/staff/dashboard"];
  const hideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <AuthProvider>
      <div className="App">
        {loading && <PageLoader />}
        {!hideLayout && <Navbar />}
        <ScrollToTop />
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/coaches/:id" element={<CoachDetails />} />
          <Route path="/celebrations" element={<CelebrationsPage />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
          <Route path="/transformation" element={<Transformations />} />
          <Route path="/staff" element={<LoginPage />} />

          {/* Protected Staff Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute>
                <StaffPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        {!hideLayout && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
