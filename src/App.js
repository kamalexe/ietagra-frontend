import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginReg from './pages/auth/LoginReg';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';
import SendPasswordResetEmail from './pages/auth/SendPasswordResetEmail';

import Home from './pages/Home';
import Gallery from './components/gallery/Gallery';
import SideNavTandP from './components/TandPCell/SideNavTandP';
import Layout from './pages/Layout';
import { useSelector } from 'react-redux';
import TNPCell from './components/home/DepartmentWiseData/TNPCell';
import MeDepartment from './components/home/DepartmentWiseData/MeDepartment';
import EceDepartment from './components/home/DepartmentWiseData/EceDepartment';
import CseDepartment from './components/home/DepartmentWiseData/CSEDepartment/index';
import EeDepartment from './components/home/DepartmentWiseData/EeDepartment';
import CivilDepartment from './components/home/DepartmentWiseData/CivilDepartment/CivilDepartment';
import AppliedScience from './components/home/DepartmentWiseData/AppliedScience';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PagesList from './pages/admin/PagesList';
import DepartmentsList from './pages/admin/DepartmentsList';
import FacultyList from './pages/admin/FacultyList';
import PageBuilder from './pages/admin/PageBuilder';
import HomeConfig from './pages/admin/HomeConfig';
import StudentDataManager from './pages/admin/StudentDataManager';
import EventsList from './pages/admin/EventsList';
import ContactSubmissions from './pages/admin/ContactSubmissions';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import DynamicPage from './pages/DynamicPage';

function App() {
  const { access_token } = useSelector((state) => state.auth);
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="home" element={<HomeConfig />} />
            <Route path="training-placement" element={<PageBuilder slug="tandpcell" />} />
            <Route path="student-data" element={<StudentDataManager />} />
            <Route path="contacts" element={<ContactSubmissions />} />
            <Route path="pages" element={<PagesList />} />
            <Route path="departments" element={<DepartmentsList />} />
            <Route path="faculty" element={<FacultyList />} />
            <Route path="pages/:slug" element={<PageBuilder />} />
            <Route path="pages/:slug" element={<PageBuilder />} />
            <Route path="events" element={<EventsList />} />
            <Route path="events-config" element={<PageBuilder slug="events" />} />
          </Route>

          {/* Main Site Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:id" element={<EventDetailPage />} />
            <Route
              path="login"
              element={!access_token ? <LoginReg /> : <Navigate to="/admin/dashboard" />}
            />
            <Route path="changepassword" element={<ChangePassword />} />
            <Route path="sendpasswordresetemail" element={<SendPasswordResetEmail />} />
            <Route path="api/account/reset/:id/:token" element={<ResetPassword />} />
            {/* Redirect old dashboard/profile attempts to admin */}
            <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/profile" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/tnpcell" element={<TNPCell />} />
            <Route path="/departments/cse" element={<CseDepartment />} />
            <Route path="/departments/me" element={<MeDepartment />} />
            <Route path="/departments/ece" element={<EceDepartment />} />
            <Route path="/departments/ee" element={<EeDepartment />} />
            <Route path="/departments/civil" element={<CivilDepartment />} />
            <Route path="/departments/asm" element={<AppliedScience />} />
            <Route path="/:slug" element={<DynamicPage />} />
            <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="tandpcell" element={<SideNavTandP />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
