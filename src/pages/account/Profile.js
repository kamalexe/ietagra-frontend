import React, { useState, useEffect } from 'react';
import { useGetLoggedUserQuery, useUpdateLoggedUserMutation } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorageService';
import { PencilIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Profile = () => {
    const { access_token } = getToken();
    const { data, isError, isLoading, refetch } = useGetLoggedUserQuery(access_token);
    const [updateLoggedUser] = useUpdateLoggedUserMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (data && data.profile) {
            setFormData(data.profile);
        }
    }, [data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (e, field) => {
        const values = e.target.value.split(',').map(item => item.trim());
        setFormData({ ...formData, [field]: values });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare payload: filter out non-updatable fields if necessary, 
            // but backend also filters.
            const res = await updateLoggedUser({ access_token, data: formData });
            if (res.error) {
                toast.error(res.error.data.message || 'Failed to update profile');
            } else {
                toast.success('Profile updated successfully');
                setIsEditing(false);
                refetch();
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong');
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (isError) return <div className="text-center text-red-500 mt-10">Failed to load profile</div>;

    const { user, profile } = data;
    const isFaculty = user.role === 'faculty';
    const isStudent = user.role === 'student';

    if (!isFaculty && !isStudent) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="bg-indigo-100 p-3 rounded-full">
                            <UserCircleIcon className="w-12 h-12 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
                            <p className="text-gray-600">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium capitalize">
                                {user.role.replace('_', ' ')}
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-500">Profile editing is currently available only for Faculty and Students.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

            {/* Approval Status Banner */}
            {profile && !profile.isApproved && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Your profile is currently <strong>Pending Approval</strong>. It will not be visible to the public until approved by an administrator.
                                Any changes you make will reset your approval status.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                    <h1 className="text-white text-xl font-bold">My Profile</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center text-white bg-indigo-500 hover:bg-indigo-700 px-4 py-2 rounded transition"
                        >
                            <PencilIcon className="w-4 h-4 mr-2" />
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column: Basic Info */}
                        <div className="md:w-1/3 text-center md:text-left">
                            <div className="relative inline-block">
                                {profile?.image ? (
                                    <img src={profile.image} alt="Profile" className="w-32 h-32 rounded-full object-cover mx-auto md:mx-0 border-4 border-white shadow-lg" />
                                ) : (
                                    <UserCircleIcon className="w-32 h-32 text-gray-300 mx-auto md:mx-0" />
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-gray-800 mt-4">{user.name}</h2>
                            <p className="text-gray-600">{user.email}</p>

                            <div className="mt-4 space-y-2">
                                <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium inline-block">
                                    {user.role === 'faculty' ? 'Faculty' : 'Student'}
                                </div>
                                {profile?.department && (
                                    <div className="text-sm text-gray-600 font-medium">
                                        {profile.department.name}
                                    </div>
                                )}
                                {/* Display read-only specific fields */}
                                {isFaculty && (
                                    <p className="text-sm text-gray-500">{profile?.designation}</p>
                                )}
                                {isStudent && (
                                    <>
                                        <p className="text-sm text-gray-500">Enrollment: {profile?.enrollmentNo}</p>
                                        <p className="text-sm text-gray-500">{profile?.batch} | {profile?.branch}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Details & Edit Form */}
                        <div className="md:w-2/3">
                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Bio</label>
                                        <textarea
                                            name="bio"
                                            rows="4"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            value={formData.bio || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {isFaculty && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                                                <input
                                                    type="text"
                                                    name="specialization"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                    value={formData.specialization || ''}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Experience</label>
                                                <input
                                                    type="text"
                                                    name="experience"
                                                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                                    value={formData.experience || ''}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Skills (Comma separated)</label>
                                        <input
                                            type="text"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            value={Array.isArray(formData.skills) ? formData.skills.join(', ') : (formData.skills || '')}
                                            onChange={(e) => handleArrayChange(e, 'skills')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Achievements (Comma separated)</label>
                                        <textarea
                                            rows="3"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            value={Array.isArray(formData.achievements) ? formData.achievements.join(', ') : (formData.achievements || '')}
                                            onChange={(e) => handleArrayChange(e, 'achievements')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Profile Image URL</label>
                                        <input
                                            type="text"
                                            name="image"
                                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                            value={formData.image || ''}
                                            onChange={handleInputChange}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>

                                    {isStudent && (
                                        <div className="space-y-4 pt-4 border-t">
                                            <h3 className="font-medium text-gray-900">Social Links</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">LinkedIn</label>
                                                    <input
                                                        type="text"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                                                        value={formData.links?.linkedin || ''}
                                                        onChange={(e) => setFormData({ ...formData, links: { ...formData.links, linkedin: e.target.value } })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">GitHub</label>
                                                    <input
                                                        type="text"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                                                        value={formData.links?.github || ''}
                                                        onChange={(e) => setFormData({ ...formData, links: { ...formData.links, github: e.target.value } })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-500">Website</label>
                                                    <input
                                                        type="text"
                                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm"
                                                        value={formData.links?.website || ''}
                                                        onChange={(e) => setFormData({ ...formData, links: { ...formData.links, website: e.target.value } })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setIsEditing(false); setFormData(profile); }}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    {/* Bio Section */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">About</h3>
                                        <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{profile?.bio || 'No bio added yet.'}</p>
                                    </div>

                                    {/* Skills Section */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile?.skills && profile.skills.length > 0 ? (
                                                profile.skills.map((skill, index) => (
                                                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 text-sm">No skills listed.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Achievements / Experience */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {isFaculty && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Experience</h3>
                                                <p className="text-gray-900">{profile?.experience || 'Not specified'}</p>
                                            </div>
                                        )}
                                        {isFaculty && (
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Specialization</h3>
                                                <p className="text-gray-900">{profile?.specialization || 'Not specified'}</p>
                                            </div>
                                        )}
                                    </div>

                                    {profile?.achievements && profile.achievements.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Achievements</h3>
                                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                                {profile.achievements.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {isStudent && profile?.links && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Links</h3>
                                            <div className="flex gap-4">
                                                {profile.links.linkedin && <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>}
                                                {profile.links.github && <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:underline">GitHub</a>}
                                                {profile.links.website && <a href={profile.links.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Website</a>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
