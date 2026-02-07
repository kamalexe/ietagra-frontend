import React, { useEffect, useState } from 'react';
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
  UsersIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { useGetLoggedUserQuery } from '../services/userAuthApi';
import { setUserInfo } from '../features/userSlice';
import { getToken, registerAccount } from '../services/LocalStorageService';
import AccountSwitcher from '../components/dashboard/AccountSwitcher';


// Define Navigation Structure
const NAVIGATION_STRUCTURE = [
  {
    type: 'item',
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: Squares2X2Icon,
    roles: ['admin', 'department_admin']
  },
  {
    type: 'category',
    name: 'Academic',
    icon: AcademicCapIcon,
    roles: ['admin', 'department_admin'],
    children: [
      { name: 'Departments', href: '/admin/departments', icon: AcademicCapIcon, roles: ['admin'] },
      { name: 'Faculty', href: '/admin/faculty', icon: UserGroupIcon, roles: ['admin', 'department_admin'], permission: 'manage_faculty' },
      { name: 'Student Records', href: '/admin/student-data', icon: UserGroupIcon, roles: ['admin', 'department_admin'], permission: 'manage_student_data' },
      { name: 'Profiles', href: '/admin/student-profiles', icon: UserGroupIcon, roles: ['admin', 'department_admin'], permission: 'manage_student_data' },
      { name: 'Exams', href: '/admin/add-exam-schedule', icon: CalendarIcon, roles: ['admin', 'department_admin'], permission: 'manage_exam_schedule' },
      { name: 'Syllabus', href: '/admin/add-syllabus', icon: DocumentTextIcon, roles: ['admin', 'department_admin'], permission: 'manage_syllabus' },
    ]
  },
  {
    type: 'category',
    name: 'Media & Events',
    icon: PhotoIcon,
    roles: ['admin', 'department_admin'],
    children: [
      { name: 'Events', href: '/admin/events', icon: CalendarIcon, roles: ['admin', 'department_admin'], permission: 'manage_events' },
      { name: 'Event Setup', href: '/admin/events-config', icon: CalendarIcon, roles: ['admin'] },
      { name: 'Gallery', href: '/admin/gallery', icon: PhotoIcon, roles: ['admin', 'department_admin'], permission: 'manage_gallery' },
      { name: 'Gallery Setup', href: '/admin/gallery-config', icon: PhotoIcon, roles: ['admin'] },
      { name: 'Albums', href: '/admin/albums', icon: FolderIcon, roles: ['admin', 'department_admin'], permission: 'manage_albums' },
      { name: 'Testimonials', href: '/admin/testimonials', icon: ChatBubbleLeftRightIcon, roles: ['admin', 'department_admin'], permission: 'manage_testimonials' },
    ]
  },
  {
    type: 'category',
    name: 'Placements',
    icon: AcademicCapIcon,
    roles: ['admin'],
    children: [
      { name: 'Companies', href: '/admin/company-registrations', icon: AcademicCapIcon, roles: ['admin'] },
      { name: 'Placement Setup', href: '/admin/training-placement', icon: AcademicCapIcon, roles: ['admin'] },
    ]
  },
  {
    type: 'item',
    name: 'Research',
    href: '/admin/research',
    icon: ClipboardDocumentCheckIcon,
    roles: ['admin', 'department_admin'],
    permission: 'manage_research'
  },
  {
    type: 'category',
    name: 'Site Content',
    icon: DocumentTextIcon,
    roles: ['admin', 'department_admin'],
    children: [
      { name: 'Pages', href: '/admin/pages', icon: DocumentTextIcon, roles: ['admin'] },
      { name: 'Footer', href: '/admin/footer', icon: SwatchIcon, roles: ['admin'] },
      { name: 'Navbar', href: '/admin/navbar', icon: MapIcon, roles: ['admin'] },
      { name: 'Queries', href: '/admin/contacts', icon: EnvelopeIcon, roles: ['admin'] },
      { name: 'Uploads', href: '/admin/uploads', icon: FolderIcon, roles: ['admin', 'department_admin'], permission: 'manage_uploads' },
    ]
  },
  {
    type: 'category',
    name: 'System',
    icon: Cog6ToothIcon,
    roles: ['admin', 'department_admin', 'student', 'faculty'],
    children: [
      { name: 'Users', href: '/admin/users', icon: UsersIcon, roles: ['admin'] },
      { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon, roles: ['admin', 'department_admin'], permission: 'manage_settings' },
      { name: 'My Profile', href: '/admin/profile', icon: UserGroupIcon, roles: ['student', 'faculty', 'admin', 'department_admin'] },
      { name: 'Legacy Home', href: '/admin/home', icon: HomeIcon, roles: ['admin'] },
    ]
  }
];

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { access_token } = useSelector((state) => state.auth);
  const { role, name, email, permissions } = useSelector((state) => state.user);

  // Fetch user info if access_token is present
  const { data, isSuccess, isLoading } = useGetLoggedUserQuery(access_token, {
    skip: !access_token
  });

  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUserInfo({
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        department: data.user.department,
        id: data.user._id,
        permissions: data.user.permissions
      }));

      // Auto-register account for switching
      const tokens = getToken();
      registerAccount(tokens, { ...data.user, user_type: data.user.role === 'admin' ? 1 : 4 });
    }
  }, [data, isSuccess, dispatch]);

  // State for collapsible sections
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionName) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };





  // Auto-open sections based on active route
  useEffect(() => {
    // We need to access the filteredNavigation here, but it's defined below.
    // However, we can use the navigationStructure and filtering logic which depends on role/permissions.
    // For simplicity, let's just iterate over the structure and check permissions again, 
    // or better, define filteredNavigation BEFORE this effect if possible, 
    // BUT filteredNavigation is derived from navigationStructure which is constant.

    // Actually, we can just iterate the static structure. 
    // If the user doesn't have access, the item won't be rendered, so opening it doesn't matter (it won't be in the DOM/state usage).
    // But to be clean, let's just check the path matching.

    const newOpenSections = { ...openSections };
    let changed = false;

    NAVIGATION_STRUCTURE.forEach(item => {
      if (item.type === 'category') {
        const isChildActive = item.children.some(child => location.pathname.startsWith(child.href));
        if (isChildActive && openSections[item.name] === undefined) {
          newOpenSections[item.name] = true;
          changed = true;
        }
      }
    });

    if (changed) {
      setOpenSections(newOpenSections);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]); // Run when path changes

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-xl text-blue-600 font-semibold">Loading Dashboard...</div>
    </div>;
  }

  if (!access_token) {
    return <Navigate to="/login" replace />;
  }



  // Function to check permission for a single item
  const hasAccess = (item) => {
    if (role === 'admin' || role === 'super_admin') return true;
    if (item.permission) {
      return permissions && permissions.includes(item.permission);
    }
    return item.roles?.includes(role);
  };

  // Filter navigation based on roles/permissions
  const filteredNavigation = NAVIGATION_STRUCTURE.map(node => {
    if (node.type === 'category') {
      const filteredChildren = node.children.filter(child => hasAccess(child));
      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    } else {
      return hasAccess(node) ? node : null;
    }
  }).filter(Boolean);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg overflow-y-auto flex flex-col">
        <div className="p-6 border-b flex-shrink-0">
          <h1 className="text-2xl font-bold text-blue-600">IET Admin</h1>
          <p className="text-sm text-gray-500">Content Management</p>
        </div>
        <nav className="flex-1 mt-6 px-4 pb-4">
          <ul className="space-y-1">
            {filteredNavigation.length === 0 && (
              <li className="px-4 py-3 text-sm text-red-500 bg-red-50 rounded-lg">
                No menu items found for role: <strong>{role || 'None'}</strong>.
              </li>
            )}
            {filteredNavigation.map((item, index) => {
              if (item.type === 'category') {
                const isOpen = openSections[item.name] || false;
                // Check if any child is active
                const isChildActive = item.children.some(child => location.pathname.startsWith(child.href));

                // Auto-open logic moved to top-level useEffect

                return (
                  <li key={index} className="mb-2">
                    <button
                      onClick={() => toggleSection(item.name)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${isChildActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <div className="flex items-center">
                        <item.icon className={`h-5 w-5 mr-3 ${isChildActive ? 'text-blue-700' : 'text-gray-400'}`} />
                        {item.name}
                      </div>
                      {isOpen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
                    </button>
                    {isOpen && (
                      <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-100 pl-2">
                        {item.children.map((child, cIndex) => {
                          const isActive = location.pathname.startsWith(child.href);
                          return (
                            <li key={cIndex}>
                              <Link
                                to={child.href}
                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                  }`}
                              >
                                {child.icon && <child.icon className={`h-4 w-4 mr-3 ${isActive ? 'text-blue-800' : 'text-gray-400'}`} />}
                                {child.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              } else {
                const isActive = location.pathname.startsWith(item.href);
                return (
                  <li key={index} className="mb-2">
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
              }
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
          <h2 className="text-lg font-semibold text-gray-800">
            {/* Find current page title from nested structure */}
            {(() => {
              const activePath = location.pathname;
              for (const item of filteredNavigation) {
                if (item.type === 'item' && activePath.startsWith(item.href)) return item.name;
                if (item.type === 'category') {
                  const child = item.children.find(c => activePath.startsWith(c.href));
                  if (child) return `${item.name} / ${child.name}`;
                }
              }
              return 'Admin Panel';
            })()}
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
