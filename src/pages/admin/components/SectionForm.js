import React, { useState, useEffect } from 'react';
import { XMarkIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import SectionSchemas from './SectionSchemas';
import FileService from '../../../services/FileService';

const SectionForm = ({ section, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [jsonInputs, setJsonInputs] = useState({});
  const [jsonErrors, setJsonErrors] = useState({});
  const [uploadingField, setUploadingField] = useState(null);

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

  const handleFileUpload = async (e, fieldName, parentIndex = null, grandParentName = null) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploadKey = parentIndex !== null ? `${grandParentName}-${parentIndex}-${fieldName}` : fieldName;
      setUploadingField(uploadKey);

      const data = await FileService.uploadFile(file);

      if (parentIndex !== null && grandParentName) {
        // Nested update for list items
        const list = [...(formData[grandParentName] || [])];
        // Ensure the object exists
        if (!list[parentIndex]) list[parentIndex] = {};
        list[parentIndex] = { ...list[parentIndex], [fieldName]: data.url };
        setFormData(prev => ({ ...prev, [grandParentName]: list }));
      } else {
        // Top level update
        setFormData(prev => ({ ...prev, [fieldName]: data.url }));
      }

    } catch (err) {
      alert("Image upload failed: " + err.message);
    } finally {
      setUploadingField(null);
      e.target.value = null;
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

  const getFieldSchema = (templateKey) => {
    // Return specific schema or default generic fields if not found
    return SectionSchemas[templateKey] || [
      { name: 'title', label: 'Title (Generic)', type: 'text' },
      { name: 'raw_json', label: 'Configuration (JSON)', type: 'json_full' }
    ];
  };

  // Generic recursive field renderer
  const renderField = (field, index, currentValue, onFieldChange, parentContext = null) => {
    const value = currentValue !== undefined ? currentValue : '';

    // Unique ID for inputs to prevent conflicts
    const inputId = parentContext
      ? `${parentContext.name}-${parentContext.index}-${field.name}`
      : field.name;

    switch (field.type) {
      case 'text':
      case 'image':
      case 'color':
        return (
          <div className="col-span-6" key={index}>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">{field.label}</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type={field.type === 'color' ? 'text' : 'text'}
                name={field.name}
                id={inputId}
                value={value}
                onChange={(e) => onFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder || ''}
                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 border py-2 px-3"
              />
              {field.type === 'image' && (
                <label className={`ml-2 cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}>
                  <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (parentContext) {
                        handleFileUpload(e, field.name, parentContext.index, parentContext.name)
                      } else {
                        handleFileUpload(e, field.name)
                      }
                    }}
                  />
                </label>
              )}
              {field.type === 'color' && (
                <input
                  type="color"
                  value={value}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  className="ml-2 h-9 w-9 p-0 border-0 rounded"
                />
              )}
            </div>
            {field.type === 'image' && value && (
              <div className="mt-2 relative group w-fit">
                <img src={value} alt="Preview" className="h-20 w-auto object-cover rounded border bg-gray-50" />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity rounded"></div>
              </div>
            )}
          </div>
        );
      case 'textarea':
        return (
          <div className="col-span-6" key={index}>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">{field.label}</label>
            <textarea
              name={field.name}
              id={inputId}
              rows={4}
              value={value}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
            />
          </div>
        );
      case 'select':
        return (
          <div className="col-span-6" key={index}>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">{field.label}</label>
            <select
              name={field.name}
              id={inputId}
              value={value}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Select...</option>
              {field.options.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        );
      case 'number':
        return (
          <div className="col-span-6" key={index}>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">{field.label}</label>
            <input
              type="number"
              name={field.name}
              id={inputId}
              value={value}
              onChange={(e) => onFieldChange(field.name, e.target.value)}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
            />
          </div>
        );
      case 'list':
        const items = Array.isArray(value) ? value : [];
        return (
          <div className="col-span-6 space-y-4" key={index}>
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">{field.label} ({items.length})</label>
              <button
                type="button"
                onClick={() => {
                  const newItem = {};
                  // Initialize fields if needed
                  onFieldChange(field.name, [...items, newItem]);
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="border rounded-md p-4 bg-gray-50 relative">
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = items.filter((_, i) => i !== idx);
                      onFieldChange(field.name, newItems);
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>

                  <div className="grid grid-cols-6 gap-6">
                    {field.itemSchema.map((itemField, fIdx) =>
                      renderField(
                        itemField,
                        fIdx,
                        item[itemField.name],
                        (nestedName, nestedValue) => {
                          const newItems = [...items];
                          newItems[idx] = { ...newItems[idx], [nestedName]: nestedValue };
                          onFieldChange(field.name, newItems);
                        },
                        { name: field.name, index: idx } // Context for upload inputs
                      )
                    )}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <span className="text-sm text-gray-500">No items added yet.</span>
                </div>
              )}
            </div>
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
                    {currentSchema.map((field, index) =>
                      renderField(
                        field,
                        index,
                        formData[field.name],
                        (name, value) => setFormData(prev => ({ ...prev, [name]: value }))
                      )
                    )}
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
