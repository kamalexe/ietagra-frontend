# Backend Technical Specifications

This document outlines the architecture, security model, database schema, and API structure for the IET Agra MERN Stack Application.

## 1. System Overview
*   **Platform**: Node.js & Express
*   **Database**: MongoDB (Mongoose ORM)
*   **Authentication**: JWT (JSON Web Tokens) with "A-to-Z" security policy.
*   **Architecture**: MVC (Model-View-Controller) with Service layer pattern.

---

## 2. Authentication & Security ("A-Z Auth")

The system enforces a **"Secure by Default"** policy. All API endpoints are protected unless explicitly whitelisted as public.

### 2.1 Auth Strategy
*   **Access Token**: Short-lived JWT (e.g., 15-30 mins) sent in `Authorization: Bearer <token>` header.
*   **Refresh Token**: Long-lived secure cookie or token used to obtain new access tokens.
*   **Password Hashing**: Bcrypt with minimum 12 salt rounds.

### 2.2 Roles & Permissions
*   `user`: Standard authenticated user (Student/Faculty regular access).
*   `admin`: Full access to CMS features (PageBuilder, User Management).

### 2.3 Middleware
*   `checkUserAuth`: Validates JWT signature and expiration. Attaches user to `req.user`.
*   `isAdmin`: Middleware placed after `checkUserAuth` to verify `req.user.role === 'admin'`.

---

## 3. Database Schema (Mongoose Models)

### 3.1 User Model (`users`)
Stores authentication / authorization data.

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  tc: { type: Boolean, required: true } // Terms & Conditions accepted
}, { timestamps: true });
```

### 3.2 Page Model (`pages`)
Stores the dynamic content for the PageBuilder. Supporting the flexible JSON structure from the frontend.

```javascript
const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true }, // e.g., 'departments/cse'
  title: { type: String, required: true },
  sections: [
    {
      id: { type: String, required: true }, // Unique ID for the section
      templateKey: { type: String, required: true }, // e.g., 'design_one'
      order: { type: Number, default: 0 },
      visible: { type: Boolean, default: true },
      // Flexible data object to store varied content per template
      data: { type: mongoose.Schema.Types.Mixed, default: {} }
    }
  ],
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

### 3.3 Faculty Model (`faculty`)
Stores faculty member details for the directory.

```javascript
const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true }, // e.g., 'Computer Science'
  email: { type: String, required: true },
  image: { type: String } // URL to image
}, { timestamps: true });
```

### 3.4 Department Model (`departments`)
Stores metadata about departments (separate from the Page content).

```javascript
const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., 'Computer Science & Engineering'
  slug: { type: String, required: true, unique: true }, // e.g., 'departments/cse'
  head: { type: String }, // Name of HOD
  pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page' } // Link to the dynamic page
}, { timestamps: true });
```
```

---

## 4. API Endpoints

### 4.1 Account / Authentication
**Base URL**: `/api/account`

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new user. Payload: `{ name, email, password, password_confirmation, tc }` |
| `POST` | `/login` | Public | Authenticate user. Returns `{ status, message, token }`. |
| `GET` | `/profile` | **Auth** | Get current logged-in user details. |
| `POST` | `/changepassword` | **Auth** | Change password. Payload: `{ password, password_confirmation }` |
| `POST` | `/send-reset-password-email` | Public | Send password reset link to email. |
| `POST` | `/reset-password/:id/:token` | Public | Reset password using token from email. |

### 4.2 Content Management (Pages)
**Base URL**: `/api/pages` (Public) and `/api/admin/pages` (Secure)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pages/:slug` | Public | Fetch full page content (sections) by slug. |
| `POST` | `/api/admin/pages` | **Admin** | Create a new page. Payload: `{ title, slug, sections }` |
| `PUT` | `/api/admin/pages/:slug` | **Admin** | Update an existing page. Payload: `{ sections, title }` |
| `DELETE` | `/api/admin/pages/:slug` | **Admin** | Delete a page. |

### 4.3 Faculty Management
**Base URL**: `/api/admin/faculty` (Secure: Admin only)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all faculty members. |
| `POST` | `/` | Add new faculty. Payload: `{ name, designation, department, email, image }` |
| `PUT` | `/:id` | Update faculty details. |
| `DELETE` | `/:id` | Remove a faculty member. |

### 4.4 Department Management
**Base URL**: `/api/admin/departments` (Secure: Admin only)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | List all departments. |
| `POST` | `/` | Create new department. Payload: `{ name, slug, head }` |
| `PUT` | `/:id` | Update department metadata. |
| `DELETE` | `/:id` | Delete department. |

---

## 5. Security Implementation Guidelines

1.  **Rate Limiting**: Implement `express-rate-limit` on all Public Auth endpoints to prevent brute-force attacks.
2.  **CORS**: Restrict CORS to specific frontend domains.
3.  **Sanitization**: Use `express-mongo-sanitize` to prevent NoSQL injection.
4.  **Error Handling**: Centralized error middleware not leaking stack traces in production.
