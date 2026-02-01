# IETagra Frontend - Project Documentation & Design System Manual

## 1. Project Synopsis

The **IETagra** project is a dynamic, MERN-stack based web application designed for an educational institution (Institute of Engineering & Technology). The frontend is built with React and Tailwind CSS, featuring a powerful **Page Builder** system that allows administrators to dynamically construct and manage website pages using a library of pre-defined "Design Sections".

**Key Features:**
- **Dynamic Page Builder:** Admins can stack various "Design" components (e.g., Hero sections, Features, Testimonials) to create custom pages without touching code.
- **Role-Based Content:** Customized views and management capabilities for Admins, Faculty, and Students.
- **Centralized Configuration:** A registry-based system ensures that adding new UI components is scalable and maintainable.

---

## 2. How the Design Template System Works

The core of the Page Builder is a "Triad" architecture that connects the Admin UI to the Frontend Component.

### The Triad Architecture

1.  **The Component (`src/components/PageBuilder/sections/`)**
    *   This is the standard React component that renders the UI.
    *   It accepts data via `props` (e.g., `title`, `description`, `images`).
    *   *Example:* `DesignOne.js` renders a hero banner or simple text section based on the props it receives.

2.  **The Schema (`src/pages/admin/components/SectionSchemas.js`)**
    *   This defines the **configuration form** for the Admin Panel.
    *   It tells the Admin UI what fields to show (Input, Textarea, Image Upload, Dynamic List, JSON) so the admin can provide data for the Component prop.
    *   *Example:* if `DesignOne` needs a title, the schema defines `{ name: 'title', label: 'Heading', type: 'text' }`.

3.  **The Registry (`src/components/PageBuilder/SectionRegistry.js`)**
    *   This acts as the bridge, mapping a unique **Key** (string) to the **Component**.
    *   When the API returns a page structure like `[{ templateKey: 'hero_section', data: {...} }]`, the Registry tells the app to render `HeroSection` with that data.

---

## 3. Guide for Developers: How to Add a New Design Template

Follow these steps to add a new reusable section (e.g., `DesignNew`) to the project.

### Step 1: Create the Component
Create a new file: `src/components/PageBuilder/sections/DesignNew.js`

```jsx
import React from 'react';

const DesignNew = ({ title, features }) => {
    return (
        <section className="py-12 bg-white">
            <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
            <div className="grid grid-cols-3 gap-4">
                {features && features.map((f, i) => (
                    <div key={i} className="p-4 border rounded shadow">
                        <h3 className="font-bold">{f.title}</h3>
                        <p>{f.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default DesignNew;
```

### Step 2: Register the Component
Open `src/components/PageBuilder/SectionRegistry.js` and import your component.

```javascript
// ... existing imports
import DesignNew from './sections/DesignNew';

const SectionRegistry = {
    // ... existing keys
    'design_new': DesignNew, // The key 'design_new' will be used in the DB and Admin
};

export default SectionRegistry;
```

### Step 3: Define the Admin Schema
Open `src/pages/admin/components/SectionSchemas.js` and define the inputs.

```javascript
const schemas = {
    // ... existing schemas
    'design_new': [
        { name: 'title', label: 'Main Heading', type: 'text' },
        { 
            name: 'features', 
            label: 'Feature List', 
            type: 'json', 
            placeholder: '[{"title": "Fast", "description": "..."}]' 
            // Note: 'json' type allows complex array input. 
            // You can also use 'list' type for a more user-friendly UI if supported by SectionForm.
        }
    ]
};
```

**Done!** The new design is now available in the Admin Page Builder.

---

## 4. Guide for Admins: How to Add & Configure Sections

### Adding a Section
1.  Navigate to **Admin Dashboard -> Pages**.
2.  Click **Edit** on an existing page or **Create Page**.
3.  Scroll to the bottom of the builder and click the large **+ Add New Section** button.
4.  A **Template Picker** drawer will slide open. Select a design (e.g., "Design One", "Hero Section").
5.  The section will appear in the list.

### Configuring a Section
1.  Click the **Pencil Icon** (Edit) on the newly added section.
2.  A form will appear based on the schema (defined by developers).
    *   **Text/Textarea:** Type your content directly.
    *   **Image:** Paste the URL of the image or upload if the tool supports it.
    *   **JSON Fields:** For complex lists (like features, cards), you may need to enter data in JSON format or use the provided structured inputs.
        *   *Example JSON:* `[{"title": "Item 1", "desc": "Good"}, {"title": "Item 2", "desc": "Better"}]`
3.  Click **Save Changes** on the form.

### Reordering & Managing
*   **Drag & Drop:** Click and hold the drag handle (three bars) to move sections up or down.
*   **Visibility:** Click the **Eye Icon** to hide a section from the public site without deleting it.
*   **Delete:** Click the **Trash Bin** to remove the section permanently.

---

## 5. Tips & Tricks for Future Development

### 1. Naming Conventions exist for a reason
*   **Generic Designs:** `DesignOne`, `DesignTwo`... use these for generic layouts (e.g., "Left Image, Right Text").
*   **Semantic Aliases:** In `SectionRegistry.js`, you can alias a generic design to a specific purpose.
    *   *Example:* `const HeroSection = (props) => <DesignOne variant="hero" {...props} />`
    *   This allows you to reuse code while presenting clear options ("Hero Section") to the Admin.

### 2. Handling Data Types
Since MERN uses JSON-like documents (MongoDB), we freely pass arrays and objects.
*   **JSON Fields:** Be careful with `type: 'json'` in schemas. It's powerful but error-prone for non-technical admins.
*   **Recommendation:** Whenever possible, enhance `SectionForm.js` to render user-friendly "List Builders" instead of raw JSON text areas for array data.

### 3. Image Handling
Currently, images are often stored as URL strings.
*   **Tip:** When adding an image upload feature, ensure the backend returns the full accessible public URL.
*   **Performance:** Use optimized image formats (WebP) where possible to keep the page load speed high.

### 4. Component Reusability
Before creating `DesignTwentyFive`, check if `DesignThree` can be slightly modified with a new `variant` prop.
*   **CSS-in-JS:** The project uses Tailwind. You can pass `className` or `color` props to drastically change a component's look without duplicating logic.

### 5. Security Note
The Page Builder renders HTML/Components dynamically. Ensure that data entered by Admins is sanitized if it's ever rendered using `dangerouslySetInnerHTML`, although React escapes most content by default.

---
*Document generated by Antigravity AI - 2026*
