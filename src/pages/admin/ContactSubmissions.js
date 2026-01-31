import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TrashIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../api/axiosConfig';

const ContactSubmissions = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContacts = async () => {
        try {
            const response = await axiosInstance.get('/contacts');
            setContacts(response.data.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch contact submissions');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await axiosInstance.delete(`/contacts/${id}`);
            setContacts(contacts.filter(contact => contact._id !== id));
        } catch (err) {
            alert('Failed to delete message');
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading submissions...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <EnvelopeIcon className="h-8 w-8 mr-3 text-blue-600" />
                Contact Submissions
            </h1>

            {contacts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
                    No submissions found.
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name/Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contacts.map((contact) => (
                                <tr key={contact._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(contact.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                        <div className="text-sm text-gray-500">{contact.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{contact.phone}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{contact.address}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {contact.subject}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={contact.message}>
                                        {contact.message}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(contact._id)}
                                            className="text-red-600 hover:text-red-900 transition-colors bg-red-50 p-2 rounded-full hover:bg-red-100"
                                            title="Delete Message"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ContactSubmissions;
