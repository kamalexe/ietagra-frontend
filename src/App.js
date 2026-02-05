
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginReg from './pages/auth/LoginReg';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';
import SendPasswordResetEmail from './pages/auth/SendPasswordResetEmail';

import Home from './pages/Home';
// Imports removed as part of cleanup
import Layout from './pages/Layout';
import { useSelector } from 'react-redux';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import PagesList from './pages/admin/PagesList';
import DepartmentsList from './pages/admin/DepartmentsList';
import FacultyList from './pages/admin/FacultyList';
import PageBuilder from './pages/admin/PageBuilder';
import HomeConfig from './pages/admin/HomeConfig';
import FooterConfig from './pages/admin/FooterConfig';
import NavbarConfig from './pages/admin/NavbarConfig';
import StudentDataManager from './pages/admin/StudentDataManager';
import EventsList from './pages/admin/EventsList';
import GalleryList from './pages/admin/GalleryList';
import GalleryPageConfig from './pages/admin/GalleryPageConfig';
import AlbumList from './pages/admin/AlbumList';
import ContactSubmissions from './pages/admin/ContactSubmissions';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import DynamicPage from './pages/DynamicPage';
import GalleryPage from './pages/GalleryPage';
import ResearchList from './pages/admin/ResearchList';
import TestimonialsList from './pages/admin/TestimonialsList';
import UserManagement from './pages/admin/UserManagement';
import UploadsManager from './pages/admin/UploadsManager';
import CompanyRegistrationsList from './pages/admin/CompanyRegistrationsList';
import CompanyRegistration from './pages/CompanyRegistration';
import AddSyllabus from './pages/admin/AddSyllabus';
import AddExamSchedule from './pages/admin/AddExamSchedule';

function App() {
    const { access_token } = useSelector((state) => state.auth);
    return (
        <>
            <Toaster position="top-right" />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
                        <Route path="events" element={<EventsList />} />
                        <Route path="events-config" element={<PageBuilder slug="events" />} />
                        <Route path="footer" element={<FooterConfig />} />
                        <Route path="navbar" element={<NavbarConfig />} />
                        <Route path="gallery" element={<GalleryList />} />
                        <Route path="gallery-config" element={<GalleryPageConfig />} />
                        <Route path="albums" element={<AlbumList />} />
                        <Route path="research" element={<ResearchList />} />
                        <Route path="testimonials" element={<TestimonialsList />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="uploads" element={<UploadsManager />} />
                        <Route path="add-syllabus" element={<AddSyllabus />} />
                        <Route path="add-exam-schedule" element={<AddExamSchedule />} />
                        <Route path="company-registrations" element={<CompanyRegistrationsList />} />
                        <Route path="settings" element={<div>Settings Page</div>} />
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
                        <Route path="/:slug" element={<DynamicPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/company-registration" element={<CompanyRegistration />} />
                        <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
