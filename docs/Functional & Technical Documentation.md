# About Page

# **📄 About Page – Functional & Technical Documentation**

## **1\. Introduction**

The **About Page** is a core informational page of the college website that provides an overview of the institution, its vision, mission, history, values, and administrative messages.  
In this project, the About Page is implemented using a **slug-based, component-driven Content Management System (CMS)** where the **layout and content are fully controlled by the admin panel**.

**URL example:**

/about

The page is rendered dynamically without hardcoding any layout or content in the frontend.

---

## **2\. Purpose of the About Page**

The About Page serves the following purposes:

* Introduces the institution to students, parents, and visitors  
* Communicates vision, mission, and values  
* Displays key institutional statistics  
* Shows leadership messages (Principal / Director / HOD)  
* Builds credibility for accreditation and rankings (NAAC / NBA)

---

## **3\. Slug-Based Page Identification**

Each page in the system is uniquely identified by a **slug**.

| Attribute | Value |
| ----- | ----- |
| Page Title | About Us |
| Slug | `about` |
| Page Type | Static Informational Page |
| Status | Published / Draft |

### **Database (Pages Collection)**

{  
  "title": "About Us",  
  "slug": "about",  
  "type": "static",  
  "status": "published"  
}

---

## **4\. Component-Based Page Structure**

The About Page does **not use a fixed template**.  
Instead, it is composed of **multiple reusable sections (components)** that can be added, removed, reordered, or edited by the admin.

### **Typical Sections Used on About Page**

| Order | Section Name | Description |
| ----- | ----- | ----- |
| 1 | Hero Section | Page heading with subtitle and CTA |
| 2 | About Institution | Overview description |
| 3 | Statistics Section | Key numbers (Years, Students, Faculty) |
| 4 | Vision & Mission | Institutional goals |
| 5 | Leadership Message | Director / Principal message |
| 6 | Core Values | Value-based education highlights |
| 7 | Contact / CTA | Navigation to contact or admissions |

---

## **5\. Section Templates (Admin-Defined)**

Each section is created using a **predefined section template**.  
Templates define:

* Section layout  
* Input fields  
* Field types  
* Validation rules

### **Example: About Description Template**

{  
  "templateKey": "about\_description",  
  "fields": \[  
    { "key": "heading", "type": "text", "required": true },  
    { "key": "content", "type": "textarea", "required": true }  
  \]  
}

---

## **6\. Page Sections Data Storage**

Each section added to the About Page is stored as a **page section instance**.

### **Example: About Description Section Data**

{  
  "pageSlug": "about",  
  "templateKey": "about\_description",  
  "order": 2,  
  "visible": true,  
  "data": {  
    "heading": "About the Institute",  
    "content": "The Institute of Engineering & Technology is committed to academic excellence..."  
  }  
}

---

## **7\. Admin Panel Workflow (About Page)**

### **Step-by-Step Flow**

1. Admin logs into Admin Panel  
2. Navigates to **Pages → About**  
3. Views list of active sections  
4. Clicks **Add New Section**  
5. Selects a section template with preview  
6. Fills form generated dynamically from template  
7. Saves section  
8. Reorders sections using drag-and-drop  
9. Publishes the page

---

## **8\. Dynamic Form Generation**

The admin form is generated **automatically** based on the selected section template.

| Field Type | Description |
| ----- | ----- |
| Text | Short headings |
| Textarea | Long descriptions |
| Image | Upload institutional images |
| Repeatable | Multiple values (vision points, values) |
| Chips | Action links (PDF, URL, anchor `#id`) |

---

## **9\. Frontend Rendering Logic**

The frontend fetches the page data using the slug:

GET /api/pages/about

### **Rendering Process**

1. Fetch page by slug  
2. Fetch ordered sections  
3. Match `templateKey` with React components  
4. Render sections dynamically

sections.map(section \=\> {  
  const Component \= componentRegistry\[section.templateKey\];  
  return Component ? \<Component {...section.data} /\> : null;  
});

---

## **10\. Navigation Using Chips & Anchors**

Some sections support **chips/buttons** that can:

* Open external URLs  
* Download PDFs  
* Scroll to specific sections using `#id`

Example:

{  
  "label": "Our Vision",  
  "linkType": "anchor",  
  "value": "\#vision-mission"  
}

This enables smooth in-page navigation.

---

## **11\. Security & Validation**

* Admin authentication using JWT  
* Role-based access control  
* Server-side validation of section data  
* File upload restrictions (type & size)  
* Prevention of raw HTML input (XSS protection)

---

## **12\. Advantages of This Design**

* Fully dynamic and reusable  
* No frontend code changes for new sections  
* Admin-friendly page builder  
* SEO-friendly slug-based routing  
* Scalable for future pages

---

## **13\. Anti-Patterns Avoided**

* ❌ Hardcoded About page HTML  
* ❌ Duplicate content for multiple pages  
* ❌ Free-text editors without validation  
* ❌ Separate frontend routes per page

---

## **14\. Conclusion**

The About Page implementation demonstrates a **modern CMS-driven architecture** where content and layout are managed entirely from the admin panel.  
This approach improves maintainability, scalability, and real-world applicability, making it suitable for an academic major project as well as industry use.

Below is a **clear, exam-ready Admin UI wireframe** for your **page builder CMS**.  
This is written so you can:

* ✅ Explain it in **viva**  
* ✅ Convert it into **Figma / implementation**  
* ✅ Put it in **project documentation (UI Design section)**

I’ll keep it **visual (ASCII-style)** \+ **functional explanation**, which is best for academics.

---

# **🧩 Admin UI Wireframe – Page Builder CMS (MERN)**

## **1️⃣ Admin Login Screen**

\+--------------------------------------+  
|           COLLEGE CMS ADMIN           |  
\+--------------------------------------+  
|  Email                                |  
|  \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\]           |  
|                                      |  
|  Password                             |  
|  \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\]           |  
|                                      |  
|  \[ Login \]                            |  
\+--------------------------------------+

### **Purpose**

* Secure admin access  
* JWT-based authentication

---

## **2️⃣ Admin Dashboard (Landing Page)**

\+--------------------------------------------------+  
|  Sidebar              |  Dashboard               |  
|-----------------------|--------------------------|  
|  ▸ Dashboard          |  Total Pages: 12          |  
|  ▸ Pages              |  Departments: 6           |  
|  ▸ Section Templates  |  Faculty: 45              |  
|  ▸ Departments        |  Draft Pages: 3           |  
|  ▸ Faculty            |                          |  
|  ▸ Programs           |                          |  
|  ▸ Events             |                          |  
|  ▸ Settings           |                          |  
\+--------------------------------------------------+

### **Purpose**

* Quick system overview  
* Entry point for managing pages & content

---

## **3️⃣ Pages List Screen**

\+--------------------------------------------------+  
| Pages                                            |  
\+--------------------------------------------------+  
|  Title                | Slug          | Status   |  
|--------------------------------------------------|  
|  About Us             | /about        | Published|  
|  ECE Department       | /departments/ece | Pub |  
|  CSE Department       | /departments/cse | Draft|  
|--------------------------------------------------|  
|  \[+ Create New Page\]                             |  
\+--------------------------------------------------+

### **Actions**

* View  
* Edit  
* Publish / Unpublish  
* Open Page Builder

---

## **4️⃣ Page Builder Screen (CORE SCREEN)**

### **Example: `/about`**

\+--------------------------------------------------+  
| Page: About Us                                   |  
| Slug: /about                                     |  
\+--------------------------------------------------+

| Sections (Drag & Drop)                           |  
|--------------------------------------------------|  
|  ☰ Hero Section              \[Edit\] \[Hide\] \[X\] |  
|  ☰ About Description         \[Edit\] \[Hide\] \[X\] |  
|  ☰ Statistics Grid           \[Edit\] \[Hide\] \[X\] |  
|  ☰ Vision & Mission           \[Edit\] \[Hide\] \[X\] |  
|  ☰ Director Message          \[Edit\] \[Hide\] \[X\] |  
|--------------------------------------------------|  
|  \[+ Add New Section\]                             |  
\+--------------------------------------------------+

### **Key Features**

* Drag & drop reorder  
* Toggle visibility  
* Edit section  
* Delete section

✅ **This is the heart of your project**

---

## **5️⃣ Add New Section – Template Picker**

\+--------------------------------------------------+  
| Add New Section                                  |  
\+--------------------------------------------------+  
|  \[ Hero Section \]     \[ About Text \]             |  
|  \[ Stats Grid \]       \[ Vision & Mission \]       |  
|  \[ Chips / CTA \]      \[ Image Gallery \]          |  
|  \[ Faculty List \]     \[ Contact Section \]        |  
|                                                  |  
|  (Each card shows preview image)                 |  
\+--------------------------------------------------+

### **Purpose**

* Admin selects **what type of section** to add  
* Prevents free-form design errors  
* Ensures consistency

---

## **6️⃣ Dynamic Section Form (Template-Based)**

### **Example: Hero Section Form**

\+--------------------------------------------------+  
| Add Hero Section                                 |  
\+--------------------------------------------------+  
| Heading \*                                        |  
| \[ Electronics & Communication Engineering \]      |  
|                                                  |  
| Sub Heading                                      |  
| \[ Institute of Engineering & Technology \]        |  
|                                                  |  
| Background Image                                 |  
| \[ Upload Image \]                                 |  
|                                                  |  
| Action Chips                                     |  
| \------------------------------------------------|  
|  Label        | Link Type | Value                |  
|  Explore      | Anchor    | \#about               |  
|  Syllabus PDF | PDF       | ece.pdf              |  
| \------------------------------------------------|  
| \[+ Add Chip\]                                    |  
|                                                  |  
| \[ Save Section \]   \[ Cancel \]                    |  
\+--------------------------------------------------+

### **Important**

* Fields appear **based on template**  
* Chips support:  
  * URL  
  * PDF  
  * `#anchor`

---

## **7️⃣ Edit Section Screen**

Same UI as Add Section, but:

* Pre-filled data  
* Save updates section instance  
* No layout change needed

---

## **8️⃣ Section Visibility Toggle (Draft Mode)**

\[ ✔ Visible \]   or   \[ ✖ Hidden \]

### **Use Case**

* Temporarily hide sections  
* Useful for drafts or seasonal updates

---

## **9️⃣ Faculty Management Screen**

\+--------------------------------------------------+  
| Faculty Members                                  |  
\+--------------------------------------------------+  
| Name                 | Dept | Designation       |  
|--------------------------------------------------|  
| Dr. Greesh K. Singh  | ECE  | HOD               |  
| Dr. Mukesh Baghel    | ECE  | Asst. Professor   |  
|--------------------------------------------------|  
| \[+ Add Faculty\]                                  |  
\+--------------------------------------------------+

Click → opens Faculty Form

---

## **🔟 Faculty Add/Edit Form**

\+--------------------------------------------------+  
| Add Faculty Member                               |  
\+--------------------------------------------------+  
| Name \*                                           |  
| Designation \*                                    |  
| Qualification                                    |  
| Experience (Years)                               |  
| Expertise (chips)                                |  
| Departments (multi-select)                       |  
| Photo Upload                                     |  
|                                                  |  
| \[ Save \]                                         |  
\+--------------------------------------------------+

---

## **1️⃣1️⃣ Section Templates Management (Optional – Advanced)**

\+--------------------------------------------------+  
| Section Templates                                |  
\+--------------------------------------------------+  
| Hero Section                                     |  
| Stats Grid                                       |  
| Vision & Mission                                 |  
| Chips Section                                    |  
\+--------------------------------------------------+

# Department Page

# **Department Page – Functional & Technical Documentation**

---

## **1\. Introduction**

The **Department Page** is a dynamic informational page designed to present comprehensive details about an academic department such as Electronics & Communication Engineering (ECE), Computer Science Engineering (CSE), etc.

In this project, department pages are implemented using a **slug-based, component-driven CMS architecture**, where the **admin controls the structure, content, and visibility of each section** through the admin panel.

**Example URLs:**

/departments/ece  
/departments/cse  
/departments/me

---

## **2\. Purpose of the Department Page**

The Department Page serves multiple stakeholders:

* Provides detailed academic information to students  
* Communicates vision, mission, and goals of the department  
* Displays faculty profiles and infrastructure  
* Highlights research, placements, and achievements  
* Supports accreditation requirements (NAAC / NBA)

---

## **3\. Slug-Based Page Identification**

Each department page is uniquely identified by a **hierarchical slug**.

| Attribute | Example |
| ----- | ----- |
| Page Title | Department of ECE |
| Slug | `departments/ece` |
| Page Type | Department |
| Status | Published / Draft |

### **Database Representation (Pages Collection)**

{  
  "title": "Department of Electronics & Communication Engineering",  
  "slug": "departments/ece",  
  "type": "department",  
  "status": "published"  
}

---

## **4\. Component-Driven Page Structure**

The Department Page is composed of **independent, reusable sections** that are added and ordered dynamically by the admin.

### **Common Sections Used in Department Page**

| Order | Section Name | Description |
| ----- | ----- | ----- |
| 1 | Department Hero | Department title, institute name, CTA |
| 2 | About Department | Introduction and overview |
| 3 | Department Statistics | Labs, faculty, placements |
| 4 | Vision & Mission | Department goals |
| 5 | HOD Message | Message from Head of Department |
| 6 | Academic Programs | Courses offered |
| 7 | Student Strength | Batch size and totals |
| 8 | Teaching-Learning Process | Evaluation methodology |
| 9 | Best Academic Practices | Innovation & mentoring |
| 10 | Faculty Members | Faculty profiles |
| 11 | Infrastructure & Labs | Department facilities |
| 12 | Research & Innovation | Publications and patents |
| 13 | Placements & Achievements | Placement statistics |
| 14 | Events & Activities | Academic and extracurricular |
| 15 | Contact Section | Department contact form |

---

## **5\. Section Templates (Reusable Components)**

Each section is based on a **predefined section template** that defines:

* Layout  
* Input fields  
* Field types  
* Validation rules

### **Example: Department Hero Template**

{  
  "templateKey": "department\_hero",  
  "fields": \[  
    { "key": "title", "type": "text", "required": true },  
    { "key": "subtitle", "type": "text" },  
    { "key": "backgroundImage", "type": "image" },  
    {  
      "key": "chips",  
      "type": "repeatable",  
      "fields": \[  
        { "key": "label", "type": "text" },  
        { "key": "linkType", "type": "select", "options": \["url", "pdf", "anchor"\] },  
        { "key": "value", "type": "text" }  
      \]  
    }  
  \]  
}

---

## **6\. Department Page Sections Storage**

Each section added to a department page is stored as a **page section instance**.

{  
  "pageSlug": "departments/ece",  
  "templateKey": "department\_hero",  
  "order": 1,  
  "visible": true,  
  "data": {  
    "title": "Electronics & Communication Engineering",  
    "subtitle": "Institute of Engineering & Technology, DBRAU Agra",  
    "chips": \[  
      { "label": "Explore Department", "linkType": "anchor", "value": "\#about" },  
      { "label": "Contact Us", "linkType": "anchor", "value": "\#contact" }  
    \]  
  }  
}

---

## **7\. Department-Specific Domain Data**

Some sections reference **domain-specific collections** instead of storing raw data.

### **Faculty Example**

{  
  "name": "Dr. Greesh Kumar Singh",  
  "designation": "Head of Department",  
  "experienceYears": 10,  
  "departments": \["ece"\]  
}

The `faculty_list` section fetches faculty dynamically using department code.

---

## **8\. Admin Panel Workflow (Department Page)**

1. Admin logs into Admin Panel  
2. Navigates to **Pages → Departments → ECE**  
3. Views current sections  
4. Adds new sections using templates  
5. Fills dynamic form fields  
6. Reorders sections using drag-and-drop  
7. Toggles section visibility  
8. Publishes the page

---

## **9\. Dynamic Form Generation**

Forms for adding/editing sections are generated automatically based on template definitions.

| Field Type | Description |
| ----- | ----- |
| Text | Headings and labels |
| Textarea | Long descriptions |
| Image | Lab or department images |
| Repeatable | Lists (mission points, highlights) |
| Chips | Links, PDFs, anchors (`#id`) |

---

## **10\. Frontend Rendering Logic**

The frontend renders the department page dynamically using the slug.

GET /api/pages/departments/ece

### **Rendering Process**

1. Fetch page by slug  
2. Fetch ordered sections  
3. Resolve domain data (faculty, programs)  
4. Render sections via component factory

sections.map(section \=\> {  
  const Component \= componentRegistry\[section.templateKey\];  
  return Component ? \<Component {...section.data} /\> : null;  
});

---

## **11\. In-Page Navigation Using Anchors**

Chips/buttons can navigate within the page using anchors:

{  
  "label": "Faculty",  
  "linkType": "anchor",  
  "value": "\#faculty"  
}

This allows smooth scrolling to specific sections.

---

## **12\. Security & Validation**

* JWT-based admin authentication  
* Role-based access control  
* Server-side validation of section data  
* File upload restrictions  
* Protection against XSS and NoSQL injection

---

## **13\. Advantages of This Approach**

* Fully dynamic department pages  
* Reusable across all departments  
* No frontend changes required for new sections  
* Admin-friendly content management  
* SEO-friendly routing

---

## **14\. Anti-Patterns Avoided**

* ❌ Hardcoded department pages  
* ❌ Copy-paste layouts  
* ❌ Free-form HTML editors  
* ❌ Page-specific frontend logic

---

## **15\. Conclusion**

The Department Page implementation demonstrates a **modern, scalable CMS architecture** where pages are composed dynamically using reusable section templates. This design improves maintainability, flexibility, and real-world applicability, making it suitable for both academic and industry use.

# Admin Drag-and-Drop

# **Admin Drag-and-Drop Logic (React)**

## **1️⃣ Architecture / Approach**

### **Problem to Solve**

Admin should be able to:

* Reorder page sections visually  
* Persist the order in database  
* See immediate UI feedback  
* Avoid breaking published pages

### **Chosen Solution (Recommended)**

✅ **`@hello-pangea/dnd`** (maintained fork of `react-beautiful-dnd`)

Why:

* Stable  
* Simple mental model  
* Perfect for vertical lists  
* Widely accepted in production apps

❌ Avoid custom mouse handlers (bug-prone)  
❌ Avoid sortable hacks without state sync

---

## **2️⃣ Data Model Assumption (Important)**

Each section has an explicit `order` field.

type PageSection \= {  
  \_id: string;  
  templateKey: string;  
  order: number;  
  visible: boolean;  
  data: any;  
};

Backend **must trust `order`**, not array index.

---

## **3️⃣ Drag-Drop UI Structure**

\<PageBuilder\>  
 └── DragDropContext  
      └── Droppable (vertical list)  
           └── Draggable (each section)

---

## **4️⃣ Core Drag-Drop Code (Clean & Minimal)**

### **4.1 Install Dependency**

npm install @hello-pangea/dnd

---

### **4.2 Page Builder Component**

import {  
  DragDropContext,  
  Droppable,  
  Draggable  
} from "@hello-pangea/dnd";

function PageBuilder({ sections, setSections }) {  
  const onDragEnd \= (result) \=\> {  
    if (\!result.destination) return;

    const items \= Array.from(sections);  
    const \[moved\] \= items.splice(result.source.index, 1);  
    items.splice(result.destination.index, 0, moved);

    // 🔑 Recalculate order safely  
    const reordered \= items.map((item, index) \=\> ({  
      ...item,  
      order: index \+ 1  
    }));

    setSections(reordered);

    // 🔐 Persist order  
    updateSectionOrder(reordered);  
  };

  return (  
    \<DragDropContext onDragEnd={onDragEnd}\>  
      \<Droppable droppableId="page-sections"\>  
        {(provided) \=\> (  
          \<div  
            ref={provided.innerRef}  
            {...provided.droppableProps}  
          \>  
            {sections.map((section, index) \=\> (  
              \<Draggable  
                key={section.\_id}  
                draggableId={section.\_id}  
                index={index}  
              \>  
                {(provided) \=\> (  
                  \<div  
                    ref={provided.innerRef}  
                    {...provided.draggableProps}  
                    {...provided.dragHandleProps}  
                  \>  
                    \<SectionCard section={section} /\>  
                  \</div\>  
                )}  
              \</Draggable\>  
            ))}

            {provided.placeholder}  
          \</div\>  
        )}  
      \</Droppable\>  
    \</DragDropContext\>  
  );  
}

---

## **5️⃣ Section Card (UI Layer)**

function SectionCard({ section }) {  
  return (  
    \<div className="section-card"\>  
      \<span className="drag-handle"\>☰\</span\>

      \<strong\>{section.templateKey}\</strong\>

      \<div className="actions"\>  
        \<button\>Edit\</button\>  
        \<button\>{section.visible ? "Hide" : "Show"}\</button\>  
        \<button\>Delete\</button\>  
      \</div\>  
    \</div\>  
  );  
}

✅ Drag handle visible  
✅ Actions separated  
✅ Clean UX

---

## **6️⃣ Backend Sync (VERY IMPORTANT)**

### **API Contract**

PUT /api/sections/reorder

### **Payload**

\[  
  { "id": "s1", "order": 1 },  
  { "id": "s2", "order": 2 },  
  { "id": "s3", "order": 3 }  
\]

### **Frontend Call**

async function updateSectionOrder(sections) {  
  await fetch("/api/sections/reorder", {  
    method: "PUT",  
    headers: { "Content-Type": "application/json" },  
    body: JSON.stringify(  
      sections.map(s \=\> ({  
        id: s.\_id,  
        order: s.order  
      }))  
    )  
  });  
}

---

## **7️⃣ Backend Logic (Node \+ Mongo – Conceptual)**

for (const item of req.body) {  
  await PageSection.updateOne(  
    { \_id: item.id },  
    { $set: { order: item.order } }  
  );  
}

✅ Simple  
✅ Predictable  
⚠️ Use transaction if page is critical

---

## **8️⃣ Performance & Safety Notes**

### **✅ Best Practices**

* Update UI **optimistically**  
* Persist order **after drop**  
* Sort sections by `order` on fetch  
* Lock drag if page is published (optional)

### **❌ Avoid**

* Using array index as ID ❌  
* Not recalculating `order` ❌  
* Updating DB on every mouse move ❌  
* Trusting frontend blindly ❌

---

## **9️⃣ How to Explain This in Viva (Perfect Answer)**

“The admin page builder uses a drag-and-drop system where sections are reordered visually. On drop, the frontend recalculates section order and sends it to the backend, where it is persisted. Pages are rendered based on the stored order, making layout management dynamic and reliable.”

---

## **10️⃣ Optional Enhancements (Bonus Marks)**

⭐ Disable drag for hidden sections  
⭐ Section preview on hover  
⭐ Undo reorder  
⭐ Draft vs published layouts

