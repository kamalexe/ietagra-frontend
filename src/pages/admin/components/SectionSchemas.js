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
        { name: 'badge', label: 'Badge', type: 'text' }
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
        { name: 'tabs', label: 'Tabs Implementation (Complex JSON)', type: 'json_full' }
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
        {
            name: 'cards',
            label: 'Cards List',
            type: 'list',
            itemSchema: [
                { name: 'title', label: 'Title', type: 'text' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'image', label: 'Image', type: 'image' },
                { name: 'link', label: 'Link', type: 'text' }
            ]
        }
    ],
    'design_twelve': [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'image', label: 'Side Image', type: 'image' },
        { name: 'content', label: 'Content', type: 'textarea' },
        {
            name: 'listItems',
            label: 'Bullet Points List',
            type: 'list',
            itemSchema: [
                { name: 'text', label: 'Item Text', type: 'text' }
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
        { name: 'title', label: 'Title', type: 'text' },
        {
            name: 'members',
            label: 'Team Members',
            type: 'list',
            itemSchema: [
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'role', label: 'Role', type: 'text' },
                { name: 'image', label: 'Photo', type: 'image' },
                { name: 'bio', label: 'Bio', type: 'textarea' }
            ]
        }
    ],
    'design_twenty': [
        { name: 'title', label: 'Title', type: 'text' },
        {
            name: 'testimonials',
            label: 'Testimonials',
            type: 'list',
            itemSchema: [
                { name: 'name', label: 'Name', type: 'text' },
                { name: 'designation', label: 'Role/Designation', type: 'text' },
                { name: 'quote', label: 'Quote', type: 'textarea' },
                { name: 'image', label: 'Photo', type: 'image' }
            ]
        }
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
