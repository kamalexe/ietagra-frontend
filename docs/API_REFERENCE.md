# API Reference

## Authentication Endpoints

### Register User
**POST** `/api/account/register`

- **Description**: Registers a new user.
- **Auth**: Public
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "password_confirmation": "securePassword123",
    "tc": true
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Registration Success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
  }
  ```

### Login User
**POST** `/api/account/login`

- **Description**: Authenticates a user and returns a token.
- **Auth**: Public
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Login Success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI..."
  }
  ```

### Get User Profile
**GET** `/api/account/profile`

- **Description**: Get currently logged-in user's data.
- **Auth**: Bearer Token
- **Headers**:
  ```
  Authorization: Bearer <token>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

### Change Password
**POST** `/api/account/changepassword`

- **Description**: Change the authenticated user's password.
- **Auth**: Bearer Token
- **Body**:
  ```json
  {
    "password": "newSecurePassword456",
    "password_confirmation": "newSecurePassword456"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Password changed successfully"
  }
  ```

---

## Page Builder Endpoints (Admin)

### Create/Update Page
**POST / PUT** `/api/admin/pages`

- **Description**: Create or update a dynamic page.
- **Auth**: Bearer Token (Admin Role)
- **Body**:
  ```json
  {
    "slug": "departments/cse",
    "title": "Computer Science & Engineering",
    "sections": [
      {
        "id": "hero_section",
        "templateKey": "design_one",
        "visible": true,
        "order": 1,
        "data": {
           "title": "Welcome to CSE",
           "description": "Best department..."
        }
      }
    ]
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Page saved successfully",
    "data": { ...pageObject }
  }
  ```

### Get Page Details
**GET** `/api/pages/:slug`

- **Description**: Fetch content for a specific page slug.
- **Auth**: Public
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "slug": "departments/cse",
      "title": "Computer Science & Engineering",
      "sections": [ ... ]
    }
  }
  ```

---

## Faculty Management (Admin)

### List Faculty
**GET** `/api/admin/faculty`

- **Auth**: Bearer Token (Admin)
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "65b9a...",
        "name": "Dr. Rajesh Lavania",
        "designation": "Professor & Head",
        "department": "Computer Science",
        "email": "cse.hod@ietagra.ac.in",
        "image": "/images/cseHOD.png"
      }
    ]
  }
  ```

### Add Faculty
**POST** `/api/admin/faculty`

- **Auth**: Bearer Token (Admin)
- **Body**:
  ```json
  {
    "name": "Dr. New Faculty",
    "designation": "Assistant Professor",
    "department": "Civil Engineering",
    "email": "new.fac@ietagra.ac.in",
    "image": "/images/new.jpg"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Faculty added successfully",
    "data": { ...facultyObj }
  }
  ```

### Update Faculty
**PUT** `/api/admin/faculty/:id`

- **Body**: Partial updates allowed (e.g., just changing designation).

### Delete Faculty
**DELETE** `/api/admin/faculty/:id`

---

## Departments Management (Admin)

### List Departments
**GET** `/api/admin/departments`

- **Auth**: Bearer Token (Admin)
- **Response**:
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": "65b9b...",
        "name": "Computer Science & Engineering",
        "slug": "departments/cse",
        "head": "Dr. Rajesh Lavania"
      }
    ]
  }
  ```

### Create Department
**POST** `/api/admin/departments`

- **Auth**: Bearer Token (Admin)
- **Body**:
  ```json
  {
    "name": "New Department",
    "slug": "departments/new",
    "head": "Dr. Name"
  }
  ```

### Update Department
**PUT** `/api/admin/departments/:id`

- **Body**: `{ "head": "New Head Name" }`

### Delete Department
**DELETE** `/api/admin/departments/:id`

