import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import {
  HomeIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { useSelector } from 'react-redux';

const AdminLayout = () => {
  const location = useLocation();
  const { access_token } = useSelector((state) => state.auth);

  if (!access_token) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Squares2X2Icon },
    { name: 'Home', href: '/admin/home', icon: HomeIcon },
    { name: 'Training and Placement', href: '/admin/training-placement', icon: AcademicCapIcon },
    { name: 'Pages', href: '/admin/pages', icon: DocumentTextIcon },
    { name: 'Departments', href: '/admin/departments', icon: AcademicCapIcon },
    { name: 'Faculty', href: '/admin/faculty', icon: UserGroupIcon },
    { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
  ];

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
            <span className="text-sm text-gray-600">Admin User</span>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
              A
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
