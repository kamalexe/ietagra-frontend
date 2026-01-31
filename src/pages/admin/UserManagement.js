
import React, { useState, useEffect } from 'react';
import { useGetAllUsersQuery, useUpdateUserRoleMutation } from '../../services/userAuthApi';
import DepartmentService from '../../services/DepartmentService';
import { useSelector } from 'react-redux';
import { getToken } from '../../services/LocalStorageService';

const UserManagement = () => {
    const { access_token } = useSelector((state) => state.auth);
    const { data, isLoading, isError, refetch } = useGetAllUsersQuery(access_token);
    const [updateUserRole] = useUpdateUserRoleMutation();
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await DepartmentService.getAllDepartments();
                setDepartments(data);
            } catch (error) {
                console.error("Failed to fetch departments", error);
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
            refetch(); // Refresh list
        } catch (error) {
            console.error("Failed to update role", error);
            alert("Failed to update role");
        }
    };

    const handleDepartmentChange = async (userId, newDeptId) => {
         // Find current user role first to ensure we don't clear role
         const user = data?.users.find(u => u._id === userId);
         if(!user) return;

        try {
            await updateUserRole({
                id: userId,
                access_token,
                data: { role: user.role, department: newDeptId }
            }).unwrap();
            refetch();
        } catch (error) {
            console.error("Failed to update department", error);
            alert("Failed to update department");
        }
    };

    if (isLoading) return <div className="p-8">Loading users...</div>;
    if (isError) return <div className="p-8 text-red-500">Error loading users. Ensure you are an Admin.</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">User Management</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data?.users?.map((user) => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{user.email}</div>
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
