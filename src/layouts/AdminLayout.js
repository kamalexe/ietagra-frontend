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
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { useGetLoggedUserQuery } from '../services/userAuthApi';
import { setUserInfo } from '../features/userSlice';

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { access_token } = useSelector((state) => state.auth);
  const { role, name, department } = useSelector((state) => state.user);

  // Fetch user info if access_token is present
  const { data, isSuccess } = useGetLoggedUserQuery(access_token, {
    skip: !access_token
  });

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUserInfo({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        department: data.user.department,
        id: data.user._id
      }));
    }
  }, [data, isSuccess, dispatch]);

  if (!access_token) {
    return <Navigate to="/login" replace />;
  }

  const allNavigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Squares2X2Icon, roles: ['admin', 'department_admin'] },
    { name: 'Home', href: '/admin/home', icon: HomeIcon, roles: ['admin'] },
    { name: 'Training and Placement', href: '/admin/training-placement', icon: AcademicCapIcon, roles: ['admin'] },
    { name: 'Pages', href: '/admin/pages', icon: DocumentTextIcon, roles: ['admin'] },
    { name: 'Departments', href: '/admin/departments', icon: AcademicCapIcon, roles: ['admin'] },
    { name: 'Faculty', href: '/admin/faculty', icon: UserGroupIcon, roles: ['admin', 'department_admin'] },
    { name: 'Events', href: '/admin/events', icon: CalendarIcon, roles: ['admin', 'department_admin'] },
    { name: 'Events Config', href: '/admin/events-config', icon: CalendarIcon, roles: ['admin'] },
    { name: 'Gallery', href: '/admin/gallery', icon: PhotoIcon, roles: ['admin', 'department_admin'] },
    { name: 'Albums', href: '/admin/albums', icon: FolderIcon, roles: ['admin', 'department_admin'] },
    { name: 'Student Data', href: '/admin/student-data', icon: UserGroupIcon, roles: ['admin', 'department_admin'] },
    { name: 'Research', href: '/admin/research', icon: ClipboardDocumentCheckIcon, roles: ['admin', 'department_admin'] },
    { name: 'Testimonials', href: '/admin/testimonials', icon: ChatBubbleLeftRightIcon, roles: ['admin', 'department_admin'] },
    { name: 'Contact Queries', href: '/admin/contacts', icon: EnvelopeIcon, roles: ['admin'] },
    { name: 'Footer', href: '/admin/footer', icon: SwatchIcon, roles: ['admin'] },
    { name: 'Navbar', href: '/admin/navbar', icon: MapIcon, roles: ['admin'] },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, roles: ['admin', 'department_admin'] },
  ];

  const navigation = allNavigation.filter(item => item.roles.includes(role));

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
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{name || 'Admin User'}</p>
              <p className="text-xs text-gray-500 capitalize">{department?.name || role || 'Access Level'}</p>
            </div>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
              {name ? name[0].toUpperCase() : 'A'}
            </div>
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
