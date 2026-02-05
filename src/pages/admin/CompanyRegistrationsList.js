import React, { useState, useEffect } from 'react';
import CompanyService from '../../services/CompanyService';
import toast from 'react-hot-toast';

const CompanyRegistrationsList = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const fetchRegistrations = async () => {
        try {
            const res = await CompanyService.getAllRegistrations();
            setRegistrations(res.data);
        } catch (error) {
            toast.error('Failed to load registrations');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await CompanyService.updateStatus(id, newStatus);
            toast.success('Status updated');
            fetchRegistrations();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const [selectedRegistration, setSelectedRegistration] = useState(null);

    const openDetailsModal = (registration) => {
        setSelectedRegistration(registration);
    };

    const closeDetailsModal = () => {
        setSelectedRegistration(null);
    };

    // --- Search, Sort, Filter State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('dateDesc');

    // --- Filter Logic ---
    const filteredRegistrations = React.useMemo(() => {
        let result = [...registrations];

        // 1. Search
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(reg =>
                reg.companyName.toLowerCase().includes(lowerTerm) ||
                reg.contactPerson.name.toLowerCase().includes(lowerTerm) ||
                reg.contactPerson.email.toLowerCase().includes(lowerTerm) ||
                reg.industry.toLowerCase().includes(lowerTerm)
            );
        }

        // 2. Filter by Status
        if (statusFilter !== 'All') {
            result = result.filter(reg => reg.status === statusFilter.toLowerCase());
        }

        // 3. Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'dateDesc':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'dateAsc':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'nameAsc':
                    return a.companyName.localeCompare(b.companyName);
                case 'nameDesc':
                    return b.companyName.localeCompare(a.companyName);
                default:
                    return 0;
            }
        });

        return result;
    }, [registrations, searchTerm, statusFilter, sortBy]);

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold">Company Registrations</h1>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="All">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="dateDesc">Newest First</option>
                        <option value="dateAsc">Oldest First</option>
                        <option value="nameAsc">Name (A-Z)</option>
                        <option value="nameDesc">Name (Z-A)</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email/Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRegistrations.length > 0 ? (
                            filteredRegistrations.map((reg) => (
                                <tr key={reg._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{reg.companyName}</div>
                                        <div className="text-sm text-gray-500">{reg.industry}</div>
                                        <button
                                            onClick={() => openDetailsModal(reg)}
                                            className="text-blue-600 hover:text-blue-900 text-xs mt-1 underline"
                                        >
                                            View All Details
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{reg.contactPerson.name}</div>
                                        <div className="text-sm text-gray-500">{reg.contactPerson.designation}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{reg.contactPerson.email}</div>
                                        <div className="text-sm text-gray-500">{reg.contactPerson.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{reg.job.title}</div>
                                        <div className="text-sm text-gray-500">{reg.job.opportunityType}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(reg.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${reg.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                reg.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'}`}>
                                            {reg.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex flex-col space-y-2">
                                            <select
                                                value={reg.status}
                                                onChange={(e) => handleStatusUpdate(reg._id, e.target.value)}
                                                className="block w-full py-1 px-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="approved">Approve</option>
                                                <option value="rejected">Reject</option>
                                            </select>
                                            {reg.documents.companyProfile && (
                                                <a href={reg.documents.companyProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 text-xs flex items-center">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                    Profile
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No registrations match your search or filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Details Modal */}
            {selectedRegistration && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeDetailsModal}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 flex justify-between items-center" id="modal-title">
                                            <span>Full Registration Details</span>
                                            <button onClick={closeDetailsModal} className="text-gray-400 hover:text-gray-500">
                                                <span className="sr-only">Close</span>
                                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </h3>
                                        <div className="mt-4 border-t border-gray-100 pt-4 max-h-[70vh] overflow-y-auto">

                                            {/* Company Info */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-semibold text-blue-800 mb-3 bg-blue-50 p-2 rounded">Company Basics</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div><span className="font-medium text-gray-500">Name:</span> {selectedRegistration.companyName}</div>
                                                    <div><span className="font-medium text-gray-500">Industry:</span> {selectedRegistration.industry}</div>
                                                    <div><span className="font-medium text-gray-500">Website:</span> <a href={selectedRegistration.website} target="_blank" rel="noreferrer" className="text-blue-600 underline">{selectedRegistration.website}</a></div>
                                                    <div><span className="font-medium text-gray-500">Head Office:</span> {selectedRegistration.address.headOffice}, {selectedRegistration.address.city}, {selectedRegistration.address.country}</div>
                                                </div>
                                            </div>

                                            {/* Contact Person */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-semibold text-blue-800 mb-3 bg-blue-50 p-2 rounded">Contact Person</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div><span className="font-medium text-gray-500">Name:</span> {selectedRegistration.contactPerson.name}</div>
                                                    <div><span className="font-medium text-gray-500">Designation:</span> {selectedRegistration.contactPerson.designation}</div>
                                                    <div><span className="font-medium text-gray-500">Email:</span> {selectedRegistration.contactPerson.email}</div>
                                                    <div><span className="font-medium text-gray-500">Phone:</span> {selectedRegistration.contactPerson.phone} {selectedRegistration.contactPerson.altPhone && `/ ${selectedRegistration.contactPerson.altPhone}`}</div>
                                                </div>
                                            </div>

                                            {/* Job Details */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-semibold text-blue-800 mb-3 bg-blue-50 p-2 rounded">Job / Internship</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div><span className="font-medium text-gray-500">Title:</span> {selectedRegistration.job.title}</div>
                                                    <div><span className="font-medium text-gray-500">Type:</span> {selectedRegistration.job.opportunityType}</div>
                                                    <div><span className="font-medium text-gray-500">Positions:</span> {selectedRegistration.job.positions || 'N/A'}</div>
                                                    <div><span className="font-medium text-gray-500">Location:</span> {selectedRegistration.job.location}</div>
                                                    <div className="col-span-full"><span className="font-medium text-gray-500">Description:</span> <p className="mt-1 text-gray-700 whitespace-pre-wrap">{selectedRegistration.job.description}</p></div>
                                                </div>
                                            </div>

                                            {/* Eligibility */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-semibold text-blue-800 mb-3 bg-blue-50 p-2 rounded">Eligibility</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div><span className="font-medium text-gray-500">Branches:</span> {selectedRegistration.eligibility.branches.join(', ')}</div>
                                                    <div><span className="font-medium text-gray-500">Min CGPA:</span> {selectedRegistration.eligibility.minCGPA || 'N/A'}</div>
                                                    <div><span className="font-medium text-gray-500">Passing Year:</span> {selectedRegistration.eligibility.passingYear || 'N/A'}</div>
                                                    <div><span className="font-medium text-gray-500">Backlogs Allowed:</span> {selectedRegistration.eligibility.backlogAllowed ? 'Yes' : 'No'}</div>
                                                    <div className="col-span-full"><span className="font-medium text-gray-500">Skills Required:</span> {selectedRegistration.eligibility.skills.join(', ')}</div>
                                                </div>
                                            </div>

                                            {/* Compensation */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-semibold text-blue-800 mb-3 bg-blue-50 p-2 rounded">Compensation</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div><span className="font-medium text-gray-500">CTC / Stipend:</span> {selectedRegistration.compensation.isConfidential ? 'Confidential' : selectedRegistration.compensation.ctc}</div>
                                                    <div><span className="font-medium text-gray-500">Breakup:</span> {selectedRegistration.compensation.breakup || 'N/A'}</div>
                                                    <div className="col-span-full"><span className="font-medium text-gray-500">Bond Details:</span> {selectedRegistration.compensation.bondDetails || 'None'}</div>
                                                </div>
                                            </div>

                                            {/* Process */}
                                            <div className="mb-6">
                                                <h4 className="text-md font-semibold text-blue-800 mb-3 bg-blue-50 p-2 rounded">Recruitment Process</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div><span className="font-medium text-gray-500">Mode:</span> {selectedRegistration.recruitmentProcess.mode}</div>
                                                    <div><span className="font-medium text-gray-500">Date:</span> {selectedRegistration.recruitmentProcess.tentativeDate ? new Date(selectedRegistration.recruitmentProcess.tentativeDate).toLocaleDateString() : 'TBD'}</div>
                                                    <div className="col-span-full"><span className="font-medium text-gray-500">Rounds:</span> {selectedRegistration.recruitmentProcess.rounds.join(', ')}</div>
                                                </div>
                                            </div>

                                            {/* Documents */}
                                            <div className="mb-2">
                                                <h4 className="text-md font-semibold text-blue-800 mb-3 bg-blue-50 p-2 rounded">Documents</h4>
                                                <div className="flex gap-4 text-sm">
                                                    {selectedRegistration.documents.companyProfile && (
                                                        <a href={selectedRegistration.documents.companyProfile} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                                                            📄 Company Profile
                                                        </a>
                                                    )}
                                                    {selectedRegistration.documents.jobDescription && (
                                                        <a href={selectedRegistration.documents.jobDescription} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                                                            📄 Job Description
                                                        </a>
                                                    )}
                                                    {selectedRegistration.documents.prevPlacementRecord && (
                                                        <a href={selectedRegistration.documents.prevPlacementRecord} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded border border-blue-200">
                                                            📄 Past Record
                                                        </a>
                                                    )}
                                                    {!selectedRegistration.documents.companyProfile && !selectedRegistration.documents.jobDescription && !selectedRegistration.documents.prevPlacementRecord && (
                                                        <span className="text-gray-500 italic">No documents uploaded.</span>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" onClick={closeDetailsModal} className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                    Close
                                </button>
                                <a
                                    href={`mailto:${selectedRegistration.contactPerson.email}`}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    Email Contact
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyRegistrationsList;
