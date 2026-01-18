import React, { useState } from 'react';
import axios from 'axios';

const DesignTwentyTwo = ({
    title = "Feedback/Query Form",
    subtitle,
    buttonText = "Send",
    venueTitle = "Venue",
    venueName = "Babu Banarasi Das College of Dental Sciences\nBBD City, Faizabad Road, Lucknow UP – 226 028 India",
    venueDetails = "0-(522)-6196300/301/302\n0-(522)-6196315/16/17/18\nEmail: office@bbdcods.edu.in\nwww.bbdcods.edu.in",
    mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d227955.61184081846!2d81.7437461!3d26.7824394!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a24faf9b58675%3A0x75a367e4a769ca4c!2sBabu%20Banrasi%20Das%20College%20of%20Dental%20Sciences!5e0!3m2!1sen!2sin!4v1683777694998!5m2!1sen!2sin",
    backgroundImage
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            await axios.post('http://localhost:5000/api/contacts', formData, config);

            setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
            setFormData({ name: '', email: '', phone: '', address: '', subject: '', message: '' });
        } catch (error) {
            console.error(error);
            setStatus({ type: 'error', message: error.response?.data?.error || 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={`py-12 px-4 md:px-8 bg-white ${backgroundImage ? 'bg-cover bg-center' : ''}`} style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12">
                    {/* Venue Column */}
                    <div className="w-full md:w-1/2">
                        {venueTitle && <h2 className="text-2xl font-bold text-gray-800 mb-6">{venueTitle}</h2>}

                        <div className="prose text-gray-700 mb-8 whitespace-pre-line">
                            {venueName && <p className="font-semibold mb-4">{venueName}</p>}
                            {venueDetails && <p>{venueDetails}</p>}
                        </div>

                        {mapEmbedUrl && (
                            <div className="w-full h-[300px] md:h-[450px] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <iframe
                                    src={mapEmbedUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Venue Map"
                                ></iframe>
                            </div>
                        )}
                    </div>

                    {/* Form Column */}
                    <div className="w-full md:w-1/2">
                        {title && <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>}
                        {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}

                        <div className="bg-gray-50 border border-gray-200 p-6 md:p-8 rounded-lg shadow-sm">
                            {status.message && (
                                <div className={`mb-6 p-4 rounded text-sm ${status.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                                    {status.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <FormGroup label="Your Name (required)" name="name" type="text" value={formData.name} onChange={handleChange} required />
                                <FormGroup label="Your Email (required)" name="email" type="email" value={formData.email} onChange={handleChange} required />
                                <FormGroup label="Contact Number (required)" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                                <FormGroup label="Address (required)" name="address" type="text" value={formData.address} onChange={handleChange} required />
                                <FormGroup label="Subject" name="subject" type="text" value={formData.subject} onChange={handleChange} required />
                                <FormGroup label="Your Message" name="message" type="textarea" value={formData.message} onChange={handleChange} required rows={5} />

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded transition-colors shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {loading && (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {buttonText}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FormGroup = ({ label, name, type, value, onChange, required, rows }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
            {label}
        </label>
        {type === 'textarea' ? (
            <textarea
                id={name}
                name={name}
                rows={rows}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
        ) : (
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
        )}
    </div>
);

export default DesignTwentyTwo;
