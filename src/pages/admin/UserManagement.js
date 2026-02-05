
import React, { useState, useEffect } from 'react';
import { useGetAllUsersQuery, useUpdateUserRoleMutation } from '../../services/userAuthApi';
import DepartmentService from '../../services/DepartmentService';
import { useSelector } from 'react-redux';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const AVAILABLE_PERMISSIONS = [
    { id: 'manage_faculty', label: 'Manage Faculty' },
    { id: 'manage_events', label: 'Manage Events' },
    { id: 'manage_gallery', label: 'Manage Gallery' },
    { id: 'manage_albums', label: 'Manage Albums' },
    { id: 'manage_student_data', label: 'Manage Student Data' },
    { id: 'manage_research', label: 'Manage Research' },
    { id: 'manage_testimonials', label: 'Manage Testimonials' },
    { id: 'manage_uploads', label: 'Manage Uploads' },
    { id: 'manage_syllabus', label: 'Manage Syllabus' },
    { id: 'manage_exam_schedule', label: 'Manage Exam Schedule' },
    { id: 'manage_settings', label: 'Manage Settings' },
];

const UserManagement = () => {
    const { access_token } = useSelector((state) => state.auth);
    const { data, isLoading, isError, refetch } = useGetAllUsersQuery(access_token);
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [departments, setDepartments] = useState([]);

    // Permission Modal State
    const [editingUser, setEditingUser] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await DepartmentService.getAllDepartments();
                setDepartments(data);
            } catch (error) {
                console.error("Failed to fetch departments", error);
                toast.error("Failed to fetch departments");
            }
        };
        fetchDepartments();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            await updateUserRole({
                id: userId,
                access_token,
                data: { role: newRole }
            }).unwrap();
            toast.success("User role updated successfully");
            refetch(); // Refresh list
        } catch (error) {
            console.error("Failed to update role", error);
            const message = error?.data?.error || error?.data?.message || "Failed to update role";
            toast.error(message);
        }
    };

    const handleDepartmentChange = async (userId, newDeptId) => {
         const user = data?.users.find(u => u._id === userId);
         if(!user) return;

        try {
            await updateUserRole({
                id: userId,
                access_token,
                data: { role: user.role, department: newDeptId }
            }).unwrap();
            toast.success("Department updated successfully");
            refetch();
        } catch (error) {
            console.error("Failed to update department", error);
            const message = error?.data?.error || error?.data?.message || "Failed to update department";
            toast.error(message);
        }
    };

    const openPermissionModal = (user) => {
        setEditingUser(user);
        setSelectedPermissions(user.permissions || []);
    };

    const closePermissionModal = () => {
        setEditingUser(null);
        setSelectedPermissions([]);
    };

    const togglePermission = (permId) => {
        if (selectedPermissions.includes(permId)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== permId));
        } else {
            setSelectedPermissions([...selectedPermissions, permId]);
        }
    };

    const savePermissions = async () => {
        if (!editingUser) return;
        try {
            // Preserve existing role/dept
            await updateUserRole({
                id: editingUser._id,
                access_token,
                data: {
                    role: editingUser.role,
                    permissions: selectedPermissions
                    // We don't need to send department if we don't want to change it, 
                    // but depending on controller, we might need to be careful. 
                    // Controller: if department provided update it, else if role !dept_admin clear it.
                    // If we don't send department, it won't change it unless role changes.
                    // So sending just role and permissions is safe.
                }
            }).unwrap();

            toast.success("Permissions updated successfully");
            refetch();
            closePermissionModal();
        } catch (error) {
            console.log("Error object:", error); // Debug log
            const message = error?.data?.error || error?.data?.message || "Failed to update permissions";
            toast.error(message);
        }
    };

    if (isLoading) return <div className="p-8">Loading users...</div>;
    if (isError) return <div className="p-8 text-red-500">Error loading users. Ensure you are an Admin.</div>;

    return (
        <div className="container mx-auto p-6 relative">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permissions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data?.users?.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                                    >
                                        <option value="user">User</option>
                                        <option value="department_admin">Department Admin</option>
                                        <option value="admin">Super Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.department?._id || user.department || ""}
                                        onChange={(e) => handleDepartmentChange(user._id, e.target.value)}
                                        disabled={user.role !== 'department_admin'}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border disabled:bg-gray-100 disabled:text-gray-400"
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept._id} value={dept._id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-wrap gap-1">
                                        {user.permissions && user.permissions.length > 0 ? (
                                            user.permissions.map(p => (
                                                <span key={p} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                    {AVAILABLE_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">No specific permissions</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => openPermissionModal(user)}
                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded"
                                    >
                                        Manage Permissions
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Permission Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Manage Permissions: {editingUser.name}</h3>
                            <button onClick={closePermissionModal} className="text-gray-500 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6 space-y-3">
                            <p className="text-sm text-gray-600 mb-2">Check permissions to assign:</p>
                            {AVAILABLE_PERMISSIONS.map((perm) => (
                                <div key={perm.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={perm.id}
                                        checked={selectedPermissions.includes(perm.id)}
                                        onChange={() => togglePermission(perm.id)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor={perm.id} className="ml-2 block text-sm text-gray-900 cursor-pointer">
                                        {perm.label}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t sticky bottom-0 bg-white">
                            <button
                                onClick={closePermissionModal}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={savePermissions}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
