
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Kisan from "./pages/Kisan";
import Notices from "./pages/Notices";
import Jobs from "./pages/Jobs";
import Marketplace from "./pages/Marketplace";
import Emergency from "./pages/Emergency";
import Complaints from "./pages/Complaints";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import VillageInfoManagement from "./pages/VillageInfoManagement";
import Events from "./pages/Events";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageNotices from "./admin/ManageNotices";
import ManageComplaints from "./admin/ManageComplaints";
import ManageEvents from "./admin/ManageEvents";
import MyApplications from "./pages/MyApplications";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/profile" element={<Profile />} />

        <Route element={<ProtectedRoute />}>

        <Route
    path="/my-applications"
    element={<MyApplications />}
/>
        <Route path="/events" element={<Events />} />
          <Route path="/" element={<Home />} />
          <Route path="/kisan" element={<Kisan />} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route
  path="/admin/village-info"
  element={<VillageInfoManagement />}
/>
          <Route path="/contact" element={<Contact />} />

          <Route element={<AdminRoute />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
            <Route
              path="/admin/notices"
              element={<ManageNotices />}
            />
            <Route
              path="/admin/complaints"
              element={<ManageComplaints />}

              
            />
            <Route
  path="/admin/events"
  element={<ManageEvents />}
/>
          </Route>

        </Route>

        <Route path="*" element={<Auth />} />
      </Routes>

      {/* <h1 className="text-3xl font-bold text-green-700">
    Gao-Connect
</h1> */}
    </BrowserRouter>


  );
}

export default App;
