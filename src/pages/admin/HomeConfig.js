import React, { useState, useEffect } from 'react';
import PageService from '../../services/PageService';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Bars3Icon,
  EyeIcon,
  EyeSlashIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import TemplatePicker from './components/TemplatePicker'; // Reusing this if possible or need to create simplified version
import SectionForm from './components/SectionForm'; // Reusing existing form

const HomeConfig = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // general | sections
  
  // Admission Modal State
  const [admissionConfig, setAdmissionConfig] = useState({
    enabled: true,
    posters: ['/images/admissionPoster.jpg'],
    link: 'https://dbrauadm.samarth.edu.in/'
  });

  // Sections State
  const [sections, setSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      // We expect a page with slug 'home' to exist
      let data = await PageService.getPageBySlug('home');
      
      // If no page found, we might need to handle creation, but let's assume it exists or backend handles it
      // For now, mapping response
      setPageData(data);
      if (data.admissionModalConfig) {
        setAdmissionConfig(data.admissionModalConfig);
      }
      if (data.sections) {
        setSections(data.sections);
      }
    } catch (err) {
      console.error("Failed to fetch home config", err);
      // If 404, maybe initialize default structure
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedPage = {
        title: pageData?.title || 'Home',
        slug: 'home',
        status: 'published',
        sections: sections,
        admissionModalConfig: admissionConfig
      };

      // Check if page exists to determine update vs create, but PageService.updatePage handles via slug
      // If it's a new system, we might need a specific create check or ensure 'home' page exists.
      // Assuming 'home' page exists for this implementation.
      await PageService.updatePage('home', updatedPage);
      alert('Home configuration saved successfully!');
    } catch (err) {
      console.error("Failed to save", err);
      alert('Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  // Drag and Drop (Reused logic)
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSections(items);
  };

  const toggleSectionVisibility = (id) => {
    setSections(sections.map(sec => 
      sec.id === id ? { ...sec, visible: !sec.visible } : sec
    ));
  };

  const deleteSection = (id) => {
      if (window.confirm('Are you sure you want to delete this section?')) {
          setSections(sections.filter(sec => sec.id !== id));
      }
  };

  const handleAddSection = (templateKey, variant = null, initialData = {}) => {
      const newSection = {
          id: `sec-${Date.now()}`,
          templateKey,
          title: templateKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) + (variant ? ` (${variant})` : ''),
          visible: true,
          data: { ...initialData, variant: variant || initialData.variant }
      };
      setSections([...sections, newSection]);
      setIsPickerOpen(false);
  };

  const handleSaveSection = (id, newData) => {
      setSections(sections.map(sec =>
          sec.id === id ? { ...sec, data: newData } : sec
      ));
      setEditingSection(null);
  };

  if (loading) return <div className="p-8">Loading configuration...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Home Page Configuration</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          className={`pb-2 px-4 ${activeTab === 'general' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('general')}
        >
          General & Admission Modal
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'sections' ? 'border-b-2 border-blue-600 text-blue-600 font-medium' : 'text-gray-500'}`}
          onClick={() => setActiveTab('sections')}
        >
          Page Sections
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {activeTab === 'general' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6 max-w-2xl">
            <h2 className="text-lg font-semibold border-b pb-2">Admission Modal Settings</h2>
            
            <div className="flex items-center space-x-3">
              <label className="text-gray-700 font-medium">Enable Modal:</label>
              <button
                onClick={() => setAdmissionConfig({ ...admissionConfig, enabled: !admissionConfig.enabled })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  admissionConfig.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`${
                    admissionConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Apply Link</label>
              <input
                type="text"
                value={admissionConfig.link}
                onChange={(e) => setAdmissionConfig({ ...admissionConfig, link: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <label className="block text-gray-700 font-medium">Poster Image URL (First Image)</label>
              <input
                type="text"
                value={admissionConfig.posters[0] || ''}
                onChange={(e) => {
                   const newPosters = [...admissionConfig.posters];
                   newPosters[0] = e.target.value;
                   setAdmissionConfig({ ...admissionConfig, posters: newPosters });
                }}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                placeholder="/images/admissionPoster.jpg"
              />
              <p className="text-sm text-gray-500">Currently supporting editing the first poster only for simplicity. Add comma separated logic or array inputs for multiple if needed.</p>
            </div>
            
            {admissionConfig.posters[0] && (
                <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700 mb-1">Preview:</p>
                    <img src={admissionConfig.posters[0]} alt="Preview" className="h-40 object-contain border rounded bg-gray-50" />
                </div>
            )}
          </div>
        )}

        {activeTab === 'sections' && (
          <div className="space-y-6">
             <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm">
                 Manage the sections that appear on the Home page. You can try templates like <strong>Hero</strong>, <strong>Features</strong>, or custom department sections.
             </div>
             
             {/* Reusing the Drag and Drop list from PageBuilder but simplified or direct usage */}
             <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-8">
                 <DragDropContext onDragEnd={onDragEnd}>
                     <Droppable droppableId="home-sections">
                         {(provided) => (
                             <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 max-w-3xl mx-auto">
                                 {sections.map((section, index) => (
                                     <Draggable key={section.id} draggableId={section.id} index={index}>
                                         {(provided, snapshot) => (
                                             <div
                                                 ref={provided.innerRef}
                                                 {...provided.draggableProps}
                                                 className={`bg-white rounded-lg shadow-sm border ${snapshot.isDragging ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} p-4 flex items-center justify-between`}
                                                 style={{ ...provided.draggableProps.style }}
                                             >
                                                 <div className="flex items-center flex-1">
                                                     <div {...provided.dragHandleProps} className="mr-4 text-gray-400 hover:text-gray-600 cursor-move">
                                                         <Bars3Icon className="h-6 w-6" />
                                                     </div>
                                                     <div>
                                                         <h3 className="text-sm font-medium text-gray-900">{section.title}</h3>
                                                         <p className="text-xs text-gray-500 font-mono mt-0.5">{section.templateKey}</p>
                                                     </div>
                                                 </div>
                                                 <div className="flex items-center space-x-2">
                                                     <button onClick={() => toggleSectionVisibility(section.id)} className={`p-1.5 rounded-md ${section.visible ? 'text-gray-400' : 'text-orange-400 bg-orange-50'}`}>
                                                         {section.visible ? <EyeIcon className="h-5 w-5" /> : <EyeSlashIcon className="h-5 w-5" />}
                                                     </button>
                                                     <button onClick={() => setEditingSection(section)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md">
                                                         <PencilIcon className="h-5 w-5" />
                                                     </button>
                                                     <button onClick={() => deleteSection(section.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-md">
                                                         <TrashIcon className="h-5 w-5" />
                                                     </button>
                                                 </div>
                                             </div>
                                         )}
                                     </Draggable>
                                 ))}
                                 {provided.placeholder}
                                 <button
                                     onClick={() => setIsPickerOpen(true)}
                                     className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center"
                                 >
                                     <PlusIcon className="h-6 w-6 mb-1" />
                                     <span className="font-medium">Add Section</span>
                                 </button>
                             </div>
                         )}
                     </Droppable>
                 </DragDropContext>
             </div>
          </div>
        )}
      </div>

      {isPickerOpen && <TemplatePicker onClose={() => setIsPickerOpen(false)} onSelect={handleAddSection} />}
      {editingSection && (
          <SectionForm
              section={editingSection}
              onClose={() => setEditingSection(null)}
              onSave={handleSaveSection}
          />
      )}
    </div>
  );
};

export default HomeConfig;
