const schemas = {
    'hero_section': [
        { name: 'variant', label: 'Variant', type: 'select', options: ['simple', 'hero'] },
        { name: 'title', label: 'Heading / Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'badge', label: 'Badge Text', type: 'text' },
        { name: 'backgroundImage', label: 'Background Image URL', type: 'image' },
        { name: 'gradient', label: 'Gradient Class', type: 'text', placeholder: 'bg-gradient-to-r ...' },
        { name: 'underlineColor', label: 'Underline Color Class', type: 'text', placeholder: 'from-blue-500 to-indigo-500' },
        {
            name: 'buttons',
            label: 'Buttons List',
            type: 'list',
            itemSchema: [
                { name: 'text', label: 'Button Text', type: 'text' },
                { name: 'link', label: 'Link URL', type: 'text' },
                { name: 'variant', label: 'Style Variant', type: 'select', options: ['primary', 'secondary', 'outline'] }
            ]
        }
    ],
    'design_one': [
        { name: 'variant', label: 'Variant', type: 'select', options: ['simple', 'hero'] },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'backgroundImage', label: 'Background Image URL', type: 'image' },
        { name: 'badge', label: 'Badge (Simple Only)', type: 'text' },
        { name: 'underlineColor', label: 'Underline Color Class (Simple Only)', type: 'text', placeholder: 'from-blue-500 to-indigo-500' },
        { name: 'gradient', label: 'Gradient Class (Hero Only)', type: 'text', placeholder: 'bg-gradient-to-r ...' },
        {
            name: 'buttons',
            label: 'Buttons List (Hero Only)',
            type: 'list',
            itemSchema: [
                { name: 'text', label: 'Button Text', type: 'text' },
                { name: 'link', label: 'Link URL', type: 'text' },
                { name: 'primary', label: 'Is Primary?', type: 'select', options: ['true', 'false'] }
            ]
        }
    ],
    'design_two': [
        {
            name: 'items',
            label: 'Features List',
            type: 'list',
            itemSchema: [
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'icon', label: 'Icon (React Icon Name)', type: 'text' }
            ]
        }
    ],
    'design_three': [
        {
            name: 'cards',
            label: 'Cards List',
            type: 'list',
            itemSchema: [
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'content', label: 'Content', type: 'textarea' },
                { name: 'icon', label: 'Icon', type: 'text' },
                { name: 'colorTheme', label: 'Color Theme (e.g. green, teal)', type: 'text' }
            ]
        }
    ],
    'design_four': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        {
            name: 'items',
            label: 'Faculty / Team Members',
            type: 'list',
            itemSchema: [
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'position', label: 'Position / Role', type: 'text' },
                { name: 'image', label: 'Photo URL', type: 'image' },
                { name: 'qualification', label: 'Qualification', type: 'text' },
                { name: 'specialization', label: 'Specialization', type: 'text' },
                { name: 'email', label: 'Email', type: 'text' }
            ]
        }
    ],
    'design_five': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        {
            name: 'swotData',
            label: 'SWOT Data',
            type: 'list',
            itemSchema: [
                { name: 'type', label: 'Type (strengths, weaknesses, opportunities, threats)', type: 'select', options: ['strengths', 'weaknesses', 'opportunities', 'threats'] },
                { name: 'items', label: 'Items List', type: 'list', itemSchema: [{ name: 'text', label: 'Item Text', type: 'text' }] }
            ]
        }
    ],
    'design_six': [
        { name: 'title', label: 'Title', type: 'text' },
        {
            name: 'items',
            label: 'Features List',
            type: 'list',
            itemSchema: [
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'icon', label: 'Icon', type: 'text' }
            ]
        }
    ],
    'design_seven': [
        {
            name: 'tabs',
            label: 'Tabs List',
            type: 'list',
            itemSchema: [
                { name: 'id', label: 'Tab ID (unique)', type: 'text' },
                { name: 'label', label: 'Tab Label', type: 'text' },
                { name: 'icon', label: 'Icon (e.g. FaHome)', type: 'text' },
                {
                    name: 'sections',
                    label: 'Sections in Tab',
                    type: 'list',
                    itemSchema: [
                        { name: 'templateKey', label: 'Template Key (e.g. hero_section)', type: 'text' },
                        { name: 'id', label: 'Section ID (unique)', type: 'text' },
                        { name: 'data', label: 'Section Data (JSON)', type: 'json' }
                    ]
                }
            ]
        }
    ],
    'design_eight': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'badge', label: 'Badge', type: 'text' },
        { name: 'content', label: 'Main Content', type: 'textarea' },
        {
            name: 'images',
            label: 'Carousel Images',
            type: 'list',
            itemSchema: [
                { name: 'src', label: 'Image URL', type: 'image' },
                { name: 'alt', label: 'Alt Text', type: 'text' }
            ]
        },
        {
            name: 'features',
            label: 'Features List',
            type: 'list',
            itemSchema: [
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'subtitle', label: 'Subtitle', type: 'text' },
                { name: 'icon', label: 'Icon', type: 'text' }
            ]
        }
    ],
    'design_nine': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'variant', label: 'Variant', type: 'select', options: ['simple', 'publication', 'visit'] },
        { name: 'columns', label: 'Columns (2, 3, 4)', type: 'number' },
        {
            name: 'items',
            label: 'Items List',
            type: 'list',
            itemSchema: [
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'date', label: 'Date', type: 'text' },
                { name: 'subtitle', label: 'Subtitle/Dept', type: 'text' },
                { name: 'meta', label: 'Meta Info', type: 'text' },
                { name: 'icon', label: 'Icon', type: 'text' }
            ]
        }
    ],
    'design_ten': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'image', label: 'Image', type: 'image' },
        {
            name: 'features',
            label: 'Features List',
            type: 'list',
            itemSchema: [
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'icon', label: 'Icon', type: 'text' }
            ]
        }
    ],
    'design_eleven': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'image', label: 'Image', type: 'image' },
        { name: 'buttonText', label: 'Button Text', type: 'text' },
        { name: 'buttonLink', label: 'Button Link', type: 'text' },
        { name: 'reverse', label: 'Reverse Layout', type: 'select', options: ['true', 'false'] }
    ],
    'design_twelve': [
        { name: 'title', label: 'Title', type: 'text' },
        {
            name: 'items',
            label: 'Team / Faculty Members',
            type: 'list',
            itemSchema: [
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'designation', label: 'Designation', type: 'text' },
                { name: 'image', label: 'Photo URL', type: 'image' },
                { name: 'specialization', label: 'Specialization', type: 'text' },
                { name: 'email', label: 'Email', type: 'text' },
                {
                    name: 'achievements',
                    label: 'Achievements List',
                    type: 'list',
                    itemSchema: [
                        { name: 'text', label: 'Achievement Text', type: 'text' }
                    ]
                }
            ]
        }
    ],
    'design_thirteen': [
        { name: 'title', label: 'Title', type: 'text' },
        {
            name: 'items',
            label: 'Departments / Items',
            type: 'list',
            itemSchema: [
                { name: 'title', label: 'Title/Name', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'link', label: 'Link URL/Slug', type: 'text' },
                { name: 'icon', label: 'Icon', type: 'text' },
                { name: 'gradient', label: 'Gradient Class', type: 'text' }
            ]
        }
    ],
    'design_fourteen': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'badge', label: 'Badge', type: 'text' },
        { name: 'underlineColor', label: 'Underline Color Class', type: 'text', placeholder: 'from-blue-500 to-indigo-500' },
        { name: 'description', label: 'Description', type: 'textarea' },
        {
            name: 'items',
            label: 'Features / Items',
            type: 'list',
            itemSchema: [
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'link', label: 'Link URL', type: 'text' },
                { name: 'target', label: 'Link Target', type: 'select', options: ['_self', '_blank'] },
                { name: 'icon', label: 'Icon (Emoji or Class)', type: 'text' },
                { name: 'gradient', label: 'Gradient Class', type: 'text', placeholder: 'from-blue-500 to-cyan-500' }
            ]
        },
        { name: 'backgroundImage', label: 'Background Image URL', type: 'image' },
        { name: 'gradient', label: 'Gradient Class', type: 'text', placeholder: 'bg-gradient-to-r ...' },
        {
            name: 'buttons',
            label: 'Buttons List',
            type: 'list',
            itemSchema: [
                { name: 'text', label: 'Button Text', type: 'text' },
                { name: 'link', label: 'Link URL', type: 'text' },
                { name: 'variant', label: 'Style Variant', type: 'select', options: ['primary', 'secondary', 'outline'] }
            ]
        }
    ],
    'design_fifteen': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'videoUrl', label: 'Video URL', type: 'text' },
        { name: 'thumbnail', label: 'Video Thumbnail', type: 'image' },
        { name: 'description', label: 'Description', type: 'textarea' }
    ],
    'design_sixteen': [
        { name: 'title', label: 'Section Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        {
            name: 'dataSource',
            label: 'Data Source (Dynamic)',
            type: 'select',
            options: ['', 'project', 'gate', 'placement', 'mooc', 'achievement']
        },
        {
            name: 'projects',
            label: 'Manual Projects List',
            type: 'list',
            itemSchema: [
                { name: 'projectName', label: 'Project Name', type: 'text' },
                { name: 'studentName', label: 'Student Name', type: 'text' },
                { name: 'batch', label: 'Batch', type: 'text' },
                { name: 'branch', label: 'Branch', type: 'text' },
                { name: 'supervisor', label: 'Supervisor', type: 'text' },
                { name: 'technology', label: 'Technology', type: 'text' },
                { name: 'githubLink', label: 'GitHub Link', type: 'text' },
                { name: 'pptLink', label: 'PPT Link', type: 'text' }
            ]
        }
    ],
    'design_seventeen': [
        { name: 'title', label: 'Section Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        {
            name: 'images',
            label: 'Gallery Images',
            type: 'list',
            itemSchema: [
                { name: 'src', label: 'Image URL', type: 'image' },
                { name: 'caption', label: 'Caption', type: 'text' }
            ]
        }
    ],
    'design_eighteen': [
        { name: 'title', label: 'Title', type: 'text' },
        {
            name: 'faqItems',
            label: 'FAQ Items',
            type: 'list',
            itemSchema: [
                { name: 'question', label: 'Question', type: 'text' },
                { name: 'answer', label: 'Answer', type: 'textarea' }
            ]
        }
    ],
    'design_nineteen': [
        { name: 'title', label: 'Section Title', type: 'text' },
        { name: 'image', label: 'Person Image', type: 'image' },
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'designation', label: 'Designation', type: 'text' },
        { name: 'quote', label: 'Quote', type: 'textarea' },
        { name: 'content', label: 'Content (HTML supported)', type: 'textarea' }
    ],
    'design_twenty': [
        { name: 'title', label: 'Section Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'content', label: 'Content (HTML)', type: 'textarea' },
        { name: 'backgroundImage', label: 'Header Background Image', type: 'image' },
        { name: 'limit', label: 'Number of Events (leave empty for all)', type: 'number' }
    ],
    'design_twenty_one': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'mapEmbedUrl', label: 'Map Embed URL', type: 'text' },
        {
            name: 'contactInfo',
            label: 'Contact Details',
            type: 'list',
            itemSchema: [
                { name: 'label', label: 'Label (e.g. Phone)', type: 'text' },
                { name: 'value', label: 'Value', type: 'text' },
                { name: 'icon', label: 'Icon', type: 'text' }
            ]
        }
    ],
    'about_brief': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'text', label: 'Content', type: 'textarea' }
    ],
    'stats_grid': [
        {
            name: 'stats',
            label: 'Statistics',
            type: 'list',
            itemSchema: [
                { name: 'label', label: 'Label', type: 'text' },
                { name: 'value', label: 'Value', type: 'text' },
                { name: 'icon', label: 'Icon', type: 'text' }
            ]
        }
    ],
    'department_hero': [
        { name: 'title', label: 'Department Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'backgroundImage', label: 'Hero Image', type: 'image' },
        {
            name: 'chips',
            label: 'Action Chips',
            type: 'list',
            itemSchema: [
                { name: 'label', label: 'Label', type: 'text' },
                { name: 'link', label: 'Link', type: 'text' }
            ]
        }
    ],
    'design_twenty_two': [
        { name: 'title', label: 'Form Title', type: 'text', placeholder: 'Feedback/Query Form' },
        { name: 'subtitle', label: 'Form Subtitle', type: 'text' },
        { name: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Send' },
        { name: 'venueTitle', label: 'Venue Title', type: 'text', placeholder: 'Venue' },
        { name: 'venueName', label: 'Venue Name', type: 'textarea', placeholder: 'Babu Banarasi Das College...' },
        { name: 'venueDetails', label: 'Venue Contact Details', type: 'textarea', placeholder: 'Phone, Email, Website...' },
        { name: 'mapEmbedUrl', label: 'Google Maps Embed URL', type: 'text' },
        { name: 'backgroundImage', label: 'Background Image', type: 'image' }
    ],
    'hod_message': [
        { name: 'name', label: 'HOD Name', type: 'text' },
        { name: 'designation', label: 'Designation', type: 'text' },
        { name: 'image', label: 'HOD Photo', type: 'image' },
        { name: 'message', label: 'Message', type: 'textarea' }
    ],
    'vision_mission': [
        { name: 'vision', label: 'Vision Statement', type: 'textarea' },
        {
            name: 'mission',
            label: 'Mission Points',
            type: 'list',
            itemSchema: [
                { name: 'text', label: 'Point Text', type: 'textarea' }
            ]
        }
    ],
};

export default schemas;
