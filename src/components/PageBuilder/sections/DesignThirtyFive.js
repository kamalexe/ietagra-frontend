import React, { useState } from 'react';
import CompanyService from '../../../services/CompanyService';
import toast from 'react-hot-toast';

const DesignThirtyFive = ({ title, subtitle }) => {
    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        website: '',
        address: { headOffice: '', city: '', country: '' },
        contactPerson: { name: '', designation: '', email: '', phone: '', altPhone: '' },
        job: { opportunityType: 'Internship', title: '', description: '', positions: '', location: 'Onsite' },
        eligibility: { branches: [], passingYear: '', minCGPA: '', backlogAllowed: false, skills: [] },
        compensation: { ctc: '', breakup: '', bondDetails: '', isConfidential: false },
        recruitmentProcess: { rounds: [], mode: 'Online', tentativeDate: '' },
        documents: { companyProfile: '', jobDescription: '', prevPlacementRecord: '' },
        consent: { infoTrue: false, policyAgree: false }
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState({ companyProfile: false, jobDescription: false, prevPlacementRecord: false });

    const handleChange = (e, section, field) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: { ...prev[section], [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [e.target.name]: value }));
        }
    };

    const handleArrayChange = (e, section, field) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentArray = prev[section][field] || [];
            if (checked) {
                return { ...prev, [section]: { ...prev[section], [field]: [...currentArray, value] } };
            } else {
                return { ...prev, [section]: { ...prev[section], [field]: currentArray.filter(item => item !== value) } };
            }
        });
    };

    const handleSkillsChange = (e) => {
        const skillsString = e.target.value;
        setFormData(prev => ({
            ...prev,
            eligibility: { ...prev.eligibility, skills: skillsString.split(',').map(s => s.trim()) }
        }));
    };

    const handleFileUpload = async (e, docType) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size exceeds 10MB limit');
            return;
        }

        if (file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed');
            return;
        }

        setUploading(prev => ({ ...prev, [docType]: true }));

        try {
            const response = await CompanyService.uploadDocument(file);
            setFormData(prev => ({
                ...prev,
                documents: { ...prev.documents, [docType]: response.data.url }
            }));
            toast.success(`${docType.replace(/([A-Z])/g, ' $1')} uploaded successfully`);
        } catch (error) {
            toast.error(error.message || 'Upload failed');
        } finally {
            setUploading(prev => ({ ...prev, [docType]: false }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.consent.infoTrue || !formData.consent.policyAgree) {
            toast.error('Please accept the declaration and consent');
            return;
        }

        setLoading(true);
        try {
            await CompanyService.registerCompany(formData);
            toast.success('Registration successful! We will verify and contact you shortly.');
            // Reset form
            setFormData({
                companyName: '',
                industry: '',
                website: '',
                address: { headOffice: '', city: '', country: '' },
                contactPerson: { name: '', designation: '', email: '', phone: '', altPhone: '' },
                job: { opportunityType: 'Internship', title: '', description: '', positions: '', location: 'Onsite' },
                eligibility: { branches: [], passingYear: '', minCGPA: '', backlogAllowed: false, skills: [] },
                compensation: { ctc: '', breakup: '', bondDetails: '', isConfidential: false },
                recruitmentProcess: { rounds: [], mode: 'Online', tentativeDate: '' },
                documents: { companyProfile: '', jobDescription: '', prevPlacementRecord: '' },
                consent: { infoTrue: false, policyAgree: false }
            });
        } catch (error) {
            toast.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-8 px-8 text-center text-white">
                    <h1 className="text-3xl font-bold tracking-tight">{title || 'Company Registration'}</h1>
                    <p className="mt-2 text-blue-100 text-lg">{subtitle || 'For Campus Placement Drive'}</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 divide-y divide-gray-200">

                    {/* Section 1: Company Basic Details */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                            Company Basic Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                                <input required type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Industry Type *</label>
                                <select required name="industry" value={formData.industry} onChange={handleChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                                    <option value="">Select Industry</option>
                                    <option value="IT">IT / Software</option>
                                    <option value="Core">Core Engineering</option>
                                    <option value="Manufacturing">Manufacturing</option>
                                    <option value="Finance">Finance / Fintech</option>
                                    <option value="Startup">Startup</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL *</label>
                                <input required type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Head Office Address</label>
                                <input type="text" value={formData.address.headOffice} onChange={(e) => handleChange(e, 'address', 'headOffice')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border mb-3" placeholder="Street Address" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" value={formData.address.city} onChange={(e) => handleChange(e, 'address', 'city')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="City" />
                                    <input type="text" value={formData.address.country} onChange={(e) => handleChange(e, 'address', 'country')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="Country" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: HR / Contact Person */}
                    <div className="pt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                            HR / Contact Person
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name *</label>
                                <input required type="text" value={formData.contactPerson.name} onChange={(e) => handleChange(e, 'contactPerson', 'name')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                <input type="text" value={formData.contactPerson.designation} onChange={(e) => handleChange(e, 'contactPerson', 'designation')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Official Email ID *</label>
                                <input required type="email" value={formData.contactPerson.email} onChange={(e) => handleChange(e, 'contactPerson', 'email')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="recruitment@company.com" />
                                <p className="text-xs text-gray-500 mt-1">Please use corporate email id.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
                                <input required type="tel" value={formData.contactPerson.phone} onChange={(e) => handleChange(e, 'contactPerson', 'phone')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Number</label>
                                <input type="tel" value={formData.contactPerson.altPhone} onChange={(e) => handleChange(e, 'contactPerson', 'altPhone')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Job Details */}
                    <div className="pt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                            Job / Internship Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Opportunity Type *</label>
                                <select required value={formData.job.opportunityType} onChange={(e) => handleChange(e, 'job', 'opportunityType')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                                    <option value="Internship">Internship</option>
                                    <option value="Full-Time">Full-Time</option>
                                    <option value="Internship + PPO">Internship + PPO</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title / Role *</label>
                                <input required type="text" value={formData.job.title} onChange={(e) => handleChange(e, 'job', 'title')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                <textarea rows={4} value={formData.job.description} onChange={(e) => handleChange(e, 'job', 'description')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="Roles & Responsibilities..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Positions</label>
                                <input type="number" value={formData.job.positions} onChange={(e) => handleChange(e, 'job', 'positions')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Work Location *</label>
                                <select required value={formData.job.location} onChange={(e) => handleChange(e, 'job', 'location')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                                    <option value="Onsite">Onsite</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Eligibility */}
                    <div className="pt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                            Eligibility Criteria
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Eligible Branches *</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {['CSE', 'IT', 'ECE', 'ME', 'CE', 'Others'].map(branch => (
                                        <label key={branch} className="inline-flex items-center">
                                            <input type="checkbox" value={branch} checked={formData.eligibility.branches.includes(branch)} onChange={(e) => handleArrayChange(e, 'eligibility', 'branches')} className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                                            <span className="ml-2 text-sm text-gray-700">{branch}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Passing Year</label>
                                    <input type="number" value={formData.eligibility.passingYear} onChange={(e) => handleChange(e, 'eligibility', 'passingYear')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="e.g. 2026" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Min CGPA / %</label>
                                    <input type="number" step="0.01" value={formData.eligibility.minCGPA} onChange={(e) => handleChange(e, 'eligibility', 'minCGPA')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                                </div>
                                <div className="flex items-end">
                                    <label className="inline-flex items-center mb-2">
                                        <input type="checkbox" checked={formData.eligibility.backlogAllowed} onChange={(e) => handleChange(e, 'eligibility', 'backlogAllowed')} className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                                        <span className="ml-2 text-sm text-gray-700">Backlogs Allowed?</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                                <input type="text" value={formData.eligibility.skills.join(', ')} onChange={handleSkillsChange} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" placeholder="Java, Python, React (comma separated)" />
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Compensation */}
                    <div className="pt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                            Compensation
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CTC / Stipend {formData.compensation.isConfidential ? '(Confidential)' : '*'}</label>
                                <input disabled={formData.compensation.isConfidential} type="text" value={formData.compensation.ctc} onChange={(e) => handleChange(e, 'compensation', 'ctc')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border disabled:bg-gray-100" />
                                <label className="inline-flex items-center mt-2">
                                    <input type="checkbox" checked={formData.compensation.isConfidential} onChange={(e) => handleChange(e, 'compensation', 'isConfidential')} className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                                    <span className="ml-2 text-sm text-gray-500">Confidential (Only T&P Cell)</span>
                                </label>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Breakup (CTC / Bonus etc)</label>
                                <input type="text" value={formData.compensation.breakup} onChange={(e) => handleChange(e, 'compensation', 'breakup')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Bond Details (if any)</label>
                                <input type="text" value={formData.compensation.bondDetails} onChange={(e) => handleChange(e, 'compensation', 'bondDetails')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                            </div>
                        </div>
                    </div>

                    {/* Section 6: Recruitment Process */}
                    <div className="pt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">6</span>
                            Recruitment Process
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Selection Rounds</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {['Online Test', 'Technical Interview', 'HR Interview', 'Group Discussion'].map(round => (
                                        <label key={round} className="inline-flex items-center">
                                            <input type="checkbox" value={round} checked={formData.recruitmentProcess.rounds.includes(round)} onChange={(e) => handleArrayChange(e, 'recruitmentProcess', 'rounds')} className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                                            <span className="ml-2 text-sm text-gray-700">{round}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mode of Recruitment</label>
                                    <select value={formData.recruitmentProcess.mode} onChange={(e) => handleChange(e, 'recruitmentProcess', 'mode')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border">
                                        <option value="Online">Online</option>
                                        <option value="On-Campus">On-Campus</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tentative Visit Date</label>
                                    <input type="date" value={formData.recruitmentProcess.tentativeDate} onChange={(e) => handleChange(e, 'recruitmentProcess', 'tentativeDate')} className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 7: Documents */}
                    <div className="pt-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">7</span>
                            Documents (PDF, max 10MB)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {['companyProfile', 'jobDescription', 'prevPlacementRecord'].map(doc => (
                                <div key={doc}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{doc.replace(/([A-Z])/g, ' $1')}</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {formData.documents[doc] ? (
                                                <div className="text-green-600 text-sm font-medium">Uploaded Successfully</div>
                                            ) : (
                                                <>
                                                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <div className="flex text-sm text-gray-600 justify-center">
                                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                                            <span>Upload a file</span>
                                                            <input id={doc} name={doc} type="file" className="sr-only" onChange={(e) => handleFileUpload(e, doc)} accept=".pdf" disabled={uploading[doc]} />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PDF up to 10MB</p>
                                                </>
                                            )}
                                            {uploading[doc] && <p className="text-xs text-blue-500">Uploading...</p>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 8: Declaration */}
                    <div className="pt-8">
                        <div className="bg-gray-50 p-6 rounded-md">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Declaration & Consent</h3>
                            <div className="space-y-4">
                                <label className="flex items-start">
                                    <input required type="checkbox" checked={formData.consent.infoTrue} onChange={(e) => handleChange(e, 'consent', 'infoTrue')} className="mt-1 rouinded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                                    <span className="ml-2 text-sm text-gray-700">I hereby confirm that the above information is true and correct to the best of my knowledge.</span>
                                </label>
                                <label className="flex items-start">
                                    <input required type="checkbox" checked={formData.consent.policyAgree} onChange={(e) => handleChange(e, 'consent', 'policyAgree')} className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                                    <span className="ml-2 text-sm text-gray-700">We agree to follow the college placement policies and procedures.</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-8 border-t border-gray-200">
                        <button type="submit" disabled={loading} className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}>
                            {loading ? 'Submitting...' : 'Submit Registration'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default DesignThirtyFive;
