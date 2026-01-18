import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PencilSquareIcon, TrashIcon, EyeIcon, PlusIcon, AcademicCapIcon, XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@headlessui/react';
import PageService from '../../services/PageService';
import DepartmentService from '../../services/DepartmentService';
import FacultyService from '../../services/FacultyService';

const DepartmentsList = () => {
  // State
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Faculty Autocomplete State
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [query, setQuery] = useState('');

  React.useEffect(() => {
    loadDepartments();
    loadFaculty();
  }, []);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await DepartmentService.getAllDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments", err);
      setError("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  const loadFaculty = async () => {
    try {
      const data = await FacultyService.getAllFaculty();
      setFacultyMembers(data || []);
    } catch (err) {
      console.error("Failed to load faculty", err);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({ name: '', slug: '', head: '', description: '' });

  const openCreateModal = () => {
    setEditingId(null);
    setNewDept({ name: '', slug: '', head: '', description: '' });
    setQuery('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingId(dept._id);
    // Remove 'departments/' prefix from slug for display if needed
    const slugPart = dept.slug.replace('departments/', '');
    setNewDept({
      name: dept.name,
      slug: slugPart,
      head: dept.head || '',
      description: dept.description || ''
    });
    setQuery('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const slug = `departments/${newDept.slug.toLowerCase().replace(/\s+/g, '-')}`;

    try {
      if (editingId) {
        // UPDATE EXISTING
        const updateData = {
          name: newDept.name,
          slug: slug,
          head: newDept.head,
          description: newDept.description
        };
        const updatedDept = await DepartmentService.updateDepartment(editingId, updateData);
        setDepartments(departments.map(d => d._id === editingId ? { ...updatedDept, lastModified: new Date().toISOString().split('T')[0] } : d));
        alert('Department updated successfully!');
      } else {
        // CREATE NEW
        // 1. Create the Page first (content)
        const pageData = {
          title: newDept.name,
          slug: slug,
          sections: []
        };
        await PageService.createPage(pageData);

        // 2. Create the Department metadata
        const deptData = {
          name: newDept.name,
          slug: slug,
          head: newDept.head,
          description: newDept.description
        };
        const createdDept = await DepartmentService.createDepartment(deptData);

        setDepartments([...departments, {
          ...createdDept,
          lastModified: new Date().toISOString().split('T')[0]
        }]);
        alert('Department created successfully!');
      }

      setIsModalOpen(false);
      setNewDept({ name: '', slug: '', head: '', description: '' });
      setEditingId(null);
    } catch (error) {
      alert('Error saving department: ' + error.message);
    }
  };

  const handleDelete = async (id, slug) => {
    if (window.confirm("Are you sure? This will delete the department and its page.")) {
      try {
        // 1. Delete department metadata
        await DepartmentService.deleteDepartment(id);

        // 2. Delete the associated page content
        try {
          await PageService.deletePage(slug);
        } catch (pageErr) {
          console.warn("Failed to delete associated page (might already be missing):", pageErr);
        }

        setDepartments(departments.filter(d => d._id !== id));
      } catch (err) {
        alert("Failed to delete: " + err.message);
      }
    }
  };

  const filteredPeople =
    query === ''
      ? facultyMembers
      : facultyMembers.filter((person) => {
        return person.name.toLowerCase().includes(query.toLowerCase());
      });

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="mt-1 text-sm text-gray-500">Manage department pages and content.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Add Department
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Head of Dept
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Modified
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                      <AcademicCapIcon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                      {dept.description && <div className="text-xs text-gray-500 truncate max-w-xs">{dept.description}</div>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    /{dept.slug}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dept.head}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dept.updatedAt ? dept.updatedAt.split('T')[0] : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => openEditModal(dept)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      title="Edit Details"
                    >
                      <Cog6ToothIcon className="h-5 w-5 mr-1" />
                      <span className="hidden lg:inline">Settings</span>
                    </button>
                    <Link
                      to={`/admin/pages/${encodeURIComponent(dept.slug)}`}
                      className="text-blue-600 hover:text-blue-900 flex items-center"
                      title="Edit Page Content"
                    >
                      <PencilSquareIcon className="h-5 w-5 mr-1" />
                      <span className="hidden lg:inline">Page</span>
                    </Link>
                    <a href={`/${dept.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600" title="View Live">
                      <EyeIcon className="h-5 w-5" />
                    </a>
                    <button
                      onClick={() => handleDelete(dept._id, dept.slug)}
                      className="text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Department Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button onClick={() => setIsModalOpen(false)} className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start w-full">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {editingId ? 'Edit Department' : 'Add New Department'}
                  </h3>
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Department Name</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newDept.name}
                        onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Slug (ID)</label>
                      <div className="mt-1 flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                          departments/
                        </span>
                        <input
                          type="text"
                          required
                          className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                          placeholder="cse"
                          value={newDept.slug}
                          onChange={(e) => setNewDept({ ...newDept, slug: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Head of Department with Combobox */}
                    <div className="relative z-20">
                      <Combobox value={newDept.head} onChange={(val) => setNewDept({ ...newDept, head: val })}>
                        <Combobox.Label className="block text-sm font-medium text-gray-700">Head of Department</Combobox.Label>
                        <div className="relative mt-1">
                          <Combobox.Input
                            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(person) => person}
                            placeholder="Select or type name..."
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          </Combobox.Button>

                          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredPeople.map((person) => (
                              <Combobox.Option
                                key={person._id}
                                value={person.name}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                  }`
                                }
                              >
                                {({ active, selected }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                      {person.name}
                                    </span>
                                    {selected && (
                                      <span
                                        className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-white' : 'text-blue-600'
                                          }`}
                                      >
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Combobox.Option>
                            ))}
                            {query.length > 0 && !filteredPeople.some(p => p.name.toLowerCase() === query.toLowerCase()) && (
                              <Combobox.Option
                                value={query}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                                  }`
                                }
                              >
                                Create "{query}"
                              </Combobox.Option>
                            )}
                          </Combobox.Options>
                        </div>
                      </Combobox>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={newDept.description}
                        onChange={(e) => setNewDept({ ...newDept, description: e.target.value })}
                      />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="submit"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        {editingId ? 'Update Department' : 'Create Department'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsList;
