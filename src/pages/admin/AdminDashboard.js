import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PageService from '../../services/PageService';
import DepartmentService from '../../services/DepartmentService';
import FacultyService from '../../services/FacultyService';
import EventService from '../../services/EventService';
import ContactService from '../../services/ContactService';
import StudentRecordService from '../../services/StudentRecordService';
import FileService from '../../services/FileService';
import ResearchService from '../../services/ResearchService';
import TestimonialService from '../../services/TestimonialService';

const AdminDashboard = () => {
  const { role, department } = useSelector(state => state.user);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');

  const [stats, setStats] = useState([
    { name: 'Total Pages', value: '0', change: '0', changeType: 'neutral' },
    { name: 'Departments', value: '0', change: '0', changeType: 'neutral' },
    { name: 'Faculty Members', value: '0', change: '0', changeType: 'neutral' },
    { name: 'Active Events', value: '0', change: '0', changeType: 'neutral' },
    { name: 'Contact Queries', value: '0', change: '0', changeType: 'neutral' },
    { name: 'MOOC Completions', value: '0', change: '0', changeType: 'neutral' },
    { name: 'Student Projects', value: '0', change: '0', changeType: 'neutral' },
    { name: 'Achievements', value: '0', change: '0', changeType: 'neutral' },
    { name: 'Research Papers', value: '0', change: '0', changeType: 'neutral' },
    { name: 'Testimonials', value: '0', change: '0', changeType: 'neutral' },
    { name: 'Uploaded Images', value: '0', change: '0', changeType: 'neutral' },
  ]);
  const [loading, setLoading] = useState(true);

  // Initial load: Set selectedDept based on role
  useEffect(() => {
    if (role === 'department_admin' && department) {
      setSelectedDept(department._id || department);
    } else {
      // Load departments list for Admin filter
      DepartmentService.getAllDepartments()
        .then(data => setDepartments(data))
        .catch(err => console.error("Failed to load departments", err));
    }
  }, [role, department]);

  useEffect(() => {
    const fetchData = async () => {
          setLoading(true);
          try {
              let params = {};
              // If specific department selected (or enforced), add to params
              if (selectedDept !== 'all') {
                params.department = selectedDept;
              }

              // Fetch all data in parallel with params
              const [
                pages,
                  allDepartments, // Just count of departments usually global
                  faculty,
                  events,
                  contacts,
                  moocs,
                  projects,
                  achievements,
                  research,
                  testimonials,
                  fileCount
                ] = await Promise.all([
                  PageService.getAllPages(params).catch(e => []),
                  DepartmentService.getAllDepartments().catch(e => []), // Departments list is usually global
                  FacultyService.getAllFaculty(params).catch(e => []),
                  EventService.getAllEvents(params).catch(e => []),
                  ContactService.getContacts(params).catch(e => []),
                  StudentRecordService.getRecords('mooc', params).catch(e => []),
                  StudentRecordService.getRecords('project', params).catch(e => []),
                  StudentRecordService.getRecords('achievement', params).catch(e => []),
                  ResearchService.getAllResearch(params).catch(e => []),
                  TestimonialService.getAllTestimonials(params).catch(e => []),
                  FileService.getFileCount().catch(e => 0) // File count might be global unless updated
                ]);

              setStats([
                { name: 'Total Pages', value: pages.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'Departments', value: allDepartments.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'Faculty Members', value: faculty.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'Active Events', value: events.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'Contact Queries', value: contacts.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'MOOC Completions', value: moocs.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'Student Projects', value: projects.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'Achievements', value: achievements.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'Research Papers', value: research.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'Testimonials', value: testimonials.length.toString(), change: '-', changeType: 'neutral' },
                  { name: 'Uploaded Images', value: fileCount.toString(), change: '-', changeType: 'neutral' },
                ]);
          } catch (error) {
            console.error("Dashboard fetch error:", error);
          } finally {
            setLoading(false);
          }
        };

      fetchData();
    }, [selectedDept]);

  return (
    <div className="space-y-6">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {role === 'department_admin' ? `Dashboard: ${department?.name || 'My Department'}` : 'Admin Dashboard'}
            </h2>
          </div>
          {/* Department Filter for Super Admin */}
          {role === 'admin' && (
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="all">All Departments (Global)</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {loading ? '...' : item.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
                  </div>
                ))}
        </div>

        {/* Recent Activity / Welcome */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Welcome to IET Agra CMS</h3>
          <div className="mt-2 text-sm text-gray-500">
            <p>
              This admin panel allows you to manage the website content, structure, and dynamic pages.
              Use the sidebar to navigate to different sections.
            </p>
          </div>
          <div className="mt-5">
            <h4 className="text-sm font-medium text-gray-900">Quick Actions</h4>
            <div className="mt-3 flex space-x-4">
              <Link to="/admin/pages" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Manage Pages
              </Link>
              <Link to="/admin/faculty" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Manage Faculty
              </Link>
              <Link to="/admin/events" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Manage Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
};

export default AdminDashboard;
