import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [
          pages,
          departments,
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
          PageService.getAllPages().catch(e => []),
          DepartmentService.getAllDepartments().catch(e => []),
          FacultyService.getAllFaculty().catch(e => []),
          EventService.getAllEvents().catch(e => []),
          ContactService.getContacts().catch(e => []),
          StudentRecordService.getRecords('mooc').catch(e => []),
          StudentRecordService.getRecords('project').catch(e => []),
          StudentRecordService.getRecords('achievement').catch(e => []),
          ResearchService.getAllResearch().catch(e => []),
          TestimonialService.getAllTestimonials().catch(e => []),
          FileService.getFileCount().catch(e => 0)
        ]);

        setStats([
          { name: 'Total Pages', value: pages.length.toString(), change: '-', changeType: 'neutral' },
          { name: 'Departments', value: departments.length.toString(), change: '-', changeType: 'neutral' },
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
  }, []);

  return (
    <div className="space-y-6">
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
            {/* <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span className={`font-medium ${item.changeType === 'increase' ? 'text-green-600' :
                  item.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                  {item.change}
                </span>
                {item.change !== '-' && <span className="text-gray-500"> vs last fetch</span>}
              </div>
            </div> */}
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
