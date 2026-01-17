import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const SectionForm = ({ section, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [jsonInputs, setJsonInputs] = useState({});
  const [jsonErrors, setJsonErrors] = useState({});

  useEffect(() => {
    if (section && section.data) {
      setFormData(section.data);
      setJsonInputs({});
      setJsonErrors({});
    }
  }, [section]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleJsonChange = (name, value, isFull) => {
    // Update raw input
    setJsonInputs(prev => ({ ...prev, [name]: value }));

    try {
      const parsed = JSON.parse(value);
      setJsonErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      // Update actual data if valid
      if (isFull) {
        setFormData(parsed);
      } else {
        setFormData(prev => ({ ...prev, [name]: parsed }));
      }
    } catch (err) {
      setJsonErrors(prev => ({ ...prev, [name]: 'Invalid JSON format' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Block save if there are errors
    if (Object.keys(jsonErrors).length > 0) {
      alert('Please fix JSON errors before saving.');
      return;
    }
    onSave(section.id, formData);
  };

  // Field configurations for each template type
  const schemas = {
    'hero_section': [
      { name: 'variant', label: 'Variant', type: 'select', options: ['simple', 'hero'] },
      { name: 'title', label: 'Heading / Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'badge', label: 'Badge Text', type: 'text' },
      { name: 'backgroundImage', label: 'Background Image URL', type: 'image' },
      { name: 'gradient', label: 'Gradient Class', type: 'text', placeholder: 'bg-gradient-to-r ...' },
      { name: 'underlineColor', label: 'Underline Color Class', type: 'text', placeholder: 'from-blue-500 to-indigo-500' },
      // Simple JSON fallback for complex arrays for now
      { name: 'buttons', label: 'Buttons (JSON)', type: 'json' }
    ],
    'design_one': [
      { name: 'variant', label: 'Variant', type: 'select', options: ['simple', 'hero'] },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'backgroundImage', label: 'Background Image URL', type: 'image' },
      { name: 'badge', label: 'Badge', type: 'text' }
    ],
    'design_two': [
      // Grid of cards with icons
      { name: 'items', label: 'Items (JSON: [{title, description, icon}])', type: 'json' }
    ],
    'design_three': [
      // Grid of cards
      { name: 'cards', label: 'Cards (JSON: [{title, content, icon}])', type: 'json' }
    ],
    'design_four': [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      // Complex list of faculty members
      { name: 'items', label: 'Faculty Members (JSON: [{name, image, position, qualification, ...}])', type: 'json' }
    ],
    'design_five': [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      // SWOT data is a specific object structure
      { name: 'swotData', label: 'SWOT Data (JSON: {strengths: [], weaknesses: [], ...})', type: 'json' }
    ],
    'design_six': [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'items', label: 'Items (JSON: [{title, description, icon}])', type: 'json' }
    ],
    'design_seven': [
      // Tabs with nested sections
      { name: 'tabs', label: 'Tabs Implementation (Complex JSON)', type: 'json_full' }
    ],
    'design_eight': [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'badge', label: 'Badge', type: 'text' },
      { name: 'content', label: 'Main Content', type: 'textarea' },
      { name: 'images', label: 'Images (JSON: [{src, alt}])', type: 'json' },
      { name: 'features', label: 'Features List (JSON: [{title, subtitle, icon}])', type: 'json' }
    ],
    'design_nine': [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'variant', label: 'Variant', type: 'select', options: ['simple', 'publication', 'visit'] },
      { name: 'columns', label: 'Columns (2, 3, 4)', type: 'number' }, // will default to text input which is fine for numbers usually
      { name: 'items', label: 'Items (JSON)', type: 'json' }
    ],
    'about_brief': [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'text', label: 'Content', type: 'textarea' }
    ],
    'stats_grid': [
      { name: 'stats', label: 'Stats (JSON)', type: 'json' }
    ],
    // New layouts from Documentation
    'department_hero': [
      { name: 'title', label: 'Department Title', type: 'text' },
      { name: 'subtitle', label: 'Subtitle', type: 'text' },
      { name: 'backgroundImage', label: 'Hero Image', type: 'image' },
      { name: 'chips', label: 'Action Chips (JSON)', type: 'json' }
    ],
    'hod_message': [
      { name: 'name', label: 'HOD Name', type: 'text' },
      { name: 'designation', label: 'Designation', type: 'text' },
      { name: 'image', label: 'HOD Photo', type: 'image' },
      { name: 'message', label: 'Message', type: 'textarea' }
    ],
    'vision_mission': [
      { name: 'vision', label: 'Vision Statement', type: 'textarea' },
      { name: 'mission', label: 'Mission Points (JSON)', type: 'json' }
    ],
    'design_sixteen': [
      { name: 'title', label: 'Section Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      {
        name: 'dataSource',
        label: 'Data Source (Optional - For Dynamic Data)',
        type: 'select',
        options: ['', 'project', 'gate', 'placement', 'mooc', 'achievement']
      },
      { name: 'projects', label: 'Manual Data (JSON Array - Fallback)', type: 'json' }
    ],
    'design_seventeen': [
      { name: 'title', label: 'Section Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' }
    ]
  };

  const getFieldSchema = (templateKey) => {
    // Return specific schema or default generic fields if not found
    return schemas[templateKey] || [
      { name: 'title', label: 'Title (Generic)', type: 'text' },
      { name: 'raw_json', label: 'Configuration (JSON)', type: 'json_full' }
    ];
  };

  const renderField = (field, index) => {
    const value = formData[field.name] || '';

    switch (field.type) {
      case 'text':
      case 'image':
      case 'color':
        return (
          <div className="col-span-6" key={index}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type={field.type === 'color' ? 'text' : 'text'}
                name={field.name}
                id={field.name}
                value={value}
                onChange={handleChange}
                placeholder={field.placeholder || ''}
                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 border py-2 px-3"
              />
              {field.type === 'image' && value && (
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  Preview
                </span>
              )}
              {field.type === 'color' && (
                <input
                  type="color"
                  value={value}
                  onChange={handleChange}
                  className="ml-2 h-9 w-9 p-0 border-0 rounded"
                />
              )}
            </div>
            {field.type === 'image' && value && (
              <div className="mt-2 text-xs text-gray-500">
                <img src={value} alt="Preview" className="h-20 w-auto object-cover rounded border" />
              </div>
            )}
          </div>
        );
      case 'textarea':
        return (
          <div className="col-span-6" key={index}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
            <textarea
              name={field.name}
              id={field.name}
              rows={4}
              value={value}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
            />
          </div>
        );
      case 'select':
        return (
          <div className="col-span-6" key={index}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label}</label>
            <select
              name={field.name}
              id={field.name}
              value={value}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              {field.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      case 'json':
      case 'json_full':
        const isFull = field.type === 'json_full';
        const fieldName = isFull ? 'raw_full_json' : field.name;
        // Determine value to show: explicit unsaved input -> OR stringified current data
        const currentDataValue = isFull ? formData : value;
        const stringified = JSON.stringify(currentDataValue === undefined ? {} : currentDataValue, null, 2);
        const displayValue = jsonInputs[fieldName] !== undefined ? jsonInputs[fieldName] : stringified;
        const error = jsonErrors[fieldName];

        return (
          <div className="col-span-6" key={index}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 font-mono text-xs uppercase tracking-wide">
              {field.label}
            </label>
            <textarea
              name={fieldName}
              rows={6}
              value={displayValue}
              onChange={(e) => handleJsonChange(fieldName, e.target.value, isFull)}
              className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm rounded-md py-2 px-3 border font-mono bg-gray-50 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            />
            {error ? (
              <p className="mt-1 text-xs text-red-500">{error}</p>
            ) : (
              <p className="mt-1 text-xs text-gray-400">Enter valid JSON for complex lists/objects.</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const currentSchema = getFieldSchema(section?.templateKey);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} aria-hidden="true"></div>
        <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div className="py-6 px-4 sm:px-6 bg-blue-600">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white" id="slide-over-title">
                    Edit Section
                  </h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      onClick={onClose}
                      type="button"
                      className="bg-blue-600 rounded-md text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">Close panel</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-blue-200 max-w-xs overflow-hidden truncate">
                    {section?.title || 'Section Settings'}
                  </p>
                  <p className="text-xs text-blue-300 font-mono mt-1">{section?.templateKey}</p>
                </div>
              </div>
              <div className="relative flex-1 py-6 px-4 sm:px-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Sidebar Configuration (Optional)</h3>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="sidebarTitle" className="block text-sm font-medium text-gray-700">Sidebar Title</label>
                        <input
                          type="text"
                          name="sidebarTitle"
                          id="sidebarTitle"
                          value={formData.sidebarTitle || ''}
                          onChange={handleChange}
                          placeholder="e.g., Placement Services"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                        />
                        <p className="mt-1 text-xs text-gray-500">Overrides the section title in the sidebar.</p>
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="sidebarIcon" className="block text-sm font-medium text-gray-700">Sidebar Icon</label>
                        <input
                          type="text"
                          name="sidebarIcon"
                          id="sidebarIcon"
                          value={formData.sidebarIcon || ''}
                          onChange={handleChange}
                          placeholder="e.g., FaGraduationCap"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                        />
                        <p className="mt-1 text-xs text-gray-500">React Icon name (e.g., FaHome, FaInfoCircle)</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-6">
                    {currentSchema.map((field, index) => renderField(field, index))}
                  </div>

                  <div className="pt-5 pb-5 border-t border-gray-200 mt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={onClose}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionForm;
