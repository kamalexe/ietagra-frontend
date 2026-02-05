import React, { useEffect } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  Squares2X2Icon,
  CalendarIcon,
  EnvelopeIcon,
  SwatchIcon,
  MapIcon,
  PhotoIcon,
  FolderIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { useGetLoggedUserQuery } from '../services/userAuthApi';
import { setUserInfo } from '../features/userSlice';
import { getToken, registerAccount } from '../services/LocalStorageService';
import AccountSwitcher from '../components/dashboard/AccountSwitcher';

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { access_token } = useSelector((state) => state.auth);
  const { role, name, email } = useSelector((state) => state.user);

  // Fetch user info if access_token is present
  // Fetch user info if access_token is present
  const { data, isSuccess, isLoading } = useGetLoggedUserQuery(access_token, {
    skip: !access_token
  });

  useEffect(() => {
    // ... same effect
    if (data && isSuccess) {
      dispatch(setUserInfo({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        department: data.user.department,
        id: data.user._id
      }));

      // Auto-register account for switching
      const tokens = getToken();
      registerAccount(tokens, { ...data.user, user_type: data.user.role === 'admin' ? 1 : 4 }); 
    }
  }, [data, isSuccess, dispatch]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-xl text-blue-600 font-semibold">Loading Dashboard...</div>
    </div>;
  }

  if (!access_token) {
    return <Navigate to="/login" replace />;
  }

  const allNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Squares2X2Icon, roles: ['admin', 'department_admin'] },
    { name: 'Home', href: '/admin/home', icon: HomeIcon, roles: ['admin'] },
    { name: 'Company Registrations', href: '/admin/company-registrations', icon: AcademicCapIcon, roles: ['admin'] },
    { name: 'Training and Placement Config', href: '/admin/training-placement', icon: AcademicCapIcon, roles: ['admin'] },
    { name: 'Pages', href: '/admin/pages', icon: DocumentTextIcon, roles: ['admin'] },
    { name: 'Departments', href: '/admin/departments', icon: AcademicCapIcon, roles: ['admin'] },
    { name: 'Faculty', href: '/admin/faculty', icon: UserGroupIcon, roles: ['admin', 'department_admin'] },
    { name: 'Events', href: '/admin/events', icon: CalendarIcon, roles: ['admin', 'department_admin'] },
    { name: 'Events Config', href: '/admin/events-config', icon: CalendarIcon, roles: ['admin'] },
    { name: 'Gallery', href: '/admin/gallery', icon: PhotoIcon, roles: ['admin', 'department_admin'] },
    { name: 'Gallery Config', href: '/admin/gallery-config', icon: PhotoIcon, roles: ['admin'] },
    { name: 'Albums', href: '/admin/albums', icon: FolderIcon, roles: ['admin', 'department_admin'] },
    { name: 'Student Data', href: '/admin/student-data', icon: UserGroupIcon, roles: ['admin', 'department_admin'] },
    { name: 'Research', href: '/admin/research', icon: ClipboardDocumentCheckIcon, roles: ['admin', 'department_admin'] },
    { name: 'Testimonials', href: '/admin/testimonials', icon: ChatBubbleLeftRightIcon, roles: ['admin', 'department_admin'] },
    { name: 'Contact Queries', href: '/admin/contacts', icon: EnvelopeIcon, roles: ['admin'] },
    { name: 'Footer', href: '/admin/footer', icon: SwatchIcon, roles: ['admin'] },
    { name: 'Navbar', href: '/admin/navbar', icon: MapIcon, roles: ['admin'] },
    { name: 'User Management', href: '/admin/users', icon: UsersIcon, roles: ['admin'] },
    { name: 'Uploads', href: '/admin/uploads', icon: UsersIcon, roles: ['admin', 'department_admin'] },
    { name: 'Add Exam Schedule', href: '/admin/add-exam-schedule', icon: UsersIcon, roles: ['admin', 'department_admin'] },
    { name: 'Add Syllabus', href: '/admin/add-syllabus', icon: UsersIcon, roles: ['admin', 'department_admin'] },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, roles: ['admin', 'department_admin'] },
  ];

  const navigation = allNavigation.filter(item => item.roles.includes(role));

  console.log('Current User Role:', role);
  console.log('Navigation Items:', navigation.length);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">IET Admin</h1>
          <p className="text-sm text-gray-500">Content Management</p>
        </div>
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {navigation.length === 0 && (
              <li className="px-4 py-3 text-sm text-red-500 bg-red-50 rounded-lg">
                No menu items found for role: <strong>{role || 'None'}</strong>.
                <br />
                <span className="text-xs text-gray-500">Please contact super admin to assign 'department_admin' role.</span>
              </li>
            )}
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {navigation.find(n => location.pathname.startsWith(n.href))?.name || 'Admin Panel'}
          </h2>
          <div className="flex items-center space-x-4">
            <AccountSwitcher currentUser={{ name, email, user_type: role === 'admin' ? 1 : 4 }} />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
