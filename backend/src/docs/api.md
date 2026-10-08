# CampusOS — City University Hub Backend API Documentation

**Base URL**: `http://localhost:5000/api`  
**Version**: `1.0.0`  
**Authentication Scheme**: Bearer JWT (`Authorization: Bearer <token>`)

---

## Table of Contents
1. [Overview & Standards](#overview--standards)
2. [Global Error & Response Contracts](#global-error--response-contracts)
3. [Authentication & Profile (`/api/auth`)](#1-authentication--profile-apiauth)
4. [Club & Event Engine (`/api/events`)](#2-club--event-engine-apievents)
5. [Resource Hub (`/api/resources`)](#3-resource-hub-apiresources)
6. [Smart Helpdesk (`/api/helpdesk`)](#4-smart-helpdesk-apihelpdesk)
7. [Lost & Found Listings (`/api/lost-found`)](#5-lost--found-listings-apilost-found)
8. [Grievance & Complaints (`/api/complaints`)](#6-grievance--complaints-apicomplaints)
9. [Pre-Seeded Credentials](#pre-seeded-credentials)

---

## Overview & Standards

All requests accepting payloads should specify `Content-Type: application/json`.  
Responses strictly follow standard HTTP status codes:
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Input validation failed or business rule violation.
- `401 Unauthorized`: Missing or invalid Bearer token.
- `403 Forbidden`: Authenticated user lacks required role.
- `404 Not Found`: Target resource does not exist.
- `409 Conflict`: Unique field conflict (e.g. duplicate email, ID, or double RSVP).
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unhandled server exception.

### Standard Success Response Format
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Standard Error Response Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error: email: Invalid email address format",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address format"
    }
  ]
}
```

---

## 1. Authentication & Profile (`/api/auth`)

### 1.1 Register User
- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Auth**: None
- **Body**:
  ```json
  {
    "name": "Tanvir Ahmed",
    "universityId": "2021-1-60-001",
    "email": "student@city.edu",
    "password": "password123",
    "department": "CSE",
    "role": "STUDENT"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "User registered successfully",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "_id": "67520f9241...",
        "name": "Tanvir Ahmed",
        "universityId": "2021-1-60-001",
        "email": "student@city.edu",
        "department": "CSE",
        "role": "STUDENT"
      }
    }
  }
  ```

### 1.2 User Login
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Auth**: None
- **Body**:
  ```json
  {
    "email": "student@city.edu",
    "password": "password123"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": { ... }
    }
  }
  ```

### 1.3 Get Current User Profile
- **Method**: `GET`
- **Route**: `/api/auth/me`
- **Auth**: Bearer Token
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "User profile retrieved successfully",
    "data": {
      "_id": "67520f9241...",
      "name": "Tanvir Ahmed",
      "universityId": "2021-1-60-001",
      "email": "student@city.edu",
      "department": "CSE",
      "role": "STUDENT"
    }
  }
  ```

---

## 2. Club & Event Engine (`/api/events`)

### 2.1 List Events
- **Method**: `GET`
- **Route**: `/api/events`
- **Auth**: None
- **Query Parameters**:
  - `category`: `Technical | Cultural | Sports | Debate | Academic | Career`
  - `timeFrame`: `upcoming | today | past`
  - `search`: Keyword string
  - `page`: Integer (default: 1)
  - `limit`: Integer (default: 10)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Events retrieved successfully",
    "data": [
      {
        "_id": "67520fa1...",
        "title": "CU Intra-University Programming Contest 2026",
        "clubName": "CU Computer Club",
        "category": "Technical",
        "description": "The premier competitive programming showdown...",
        "bannerUrl": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        "venue": "Lab 4 & 5, Academic Building 2",
        "eventDate": "2026-10-22T00:00:00.000Z",
        "registrationDeadline": "2026-10-19T00:00:00.000Z",
        "maxCapacity": 120,
        "registeredCount": 1,
        "isInterUniversity": false
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
  ```

### 2.2 Create Event
- **Method**: `POST`
- **Route**: `/api/events`
- **Auth**: Bearer Token (`CLUB_ADMIN` or `UNIVERSITY_ADMIN`)
- **Body**:
  ```json
  {
    "title": "Robotics Fest 2026",
    "clubName": "CU Robotics Club",
    "category": "Technical",
    "description": "Line follower and battle bot tournaments.",
    "bannerUrl": "https://example.com/banner.jpg",
    "venue": "Campus Grounds",
    "eventDate": "2026-11-10T10:00:00.000Z",
    "registrationDeadline": "2026-11-05T23:59:59.000Z",
    "maxCapacity": 150,
    "isInterUniversity": true
  }
  ```
- **Validation**: `registrationDeadline` must precede `eventDate`.
- **Response `201 Created`**

### 2.3 RSVP for Event
- **Method**: `POST`
- **Route**: `/api/events/:id/rsvp`
- **Auth**: Bearer Token (`STUDENT` only)
- **Behavior**:
  - Atomically verifies `registeredCount < maxCapacity`.
  - Increments `registeredCount` atomically.
  - Generates secure cryptographic ticket hash.
  - Throws `409 Conflict` if duplicate RSVP exists.
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "RSVP confirmed successfully",
    "data": {
      "_id": "6752102...",
      "eventId": "67520fa1...",
      "studentId": "67520f9...",
      "studentUniversityId": "2021-1-60-001",
      "ticketHash": "b2f6762391b1cb6ba4ffcb7fa8d578bf",
      "registrationDate": "2026-10-07T16:00:00.000Z"
    }
  }
  ```

### 2.4 Get My Event Passes
- **Method**: `GET`
- **Route**: `/api/events/my-passes`
- **Auth**: Bearer Token (`STUDENT` only)
- **Response `200 OK`**: Populated with Event details.

---

## 3. Resource Hub (`/api/resources`)

### 3.1 List Academic Resources
- **Method**: `GET`
- **Route**: `/api/resources`
- **Query Parameters**:
  - `department`: `CSE | EEE | BBA | English | Law | Civil | Pharmacy`
  - `courseCode`: Course code (e.g., `CSE-221`)
  - `semesterTerm`: `Mid-Term | Final-Term | Quiz | Lab Manual | Lecture Note`
  - `session`: Academic session (e.g., `Fall 2024`)
  - `page`: Page number
  - `limit`: Limit per page
- **Response `200 OK`**

### 3.2 Search Resources
- **Method**: `GET`
- **Route**: `/api/resources/search?q=:query`
- **Description**: Text index search across course code, course title, and title, with regex fallback for partial numbers (e.g., searching `"221"` matches `"CSE-221"`).
- **Response `200 OK`**

### 3.3 Upload Academic Resource
- **Method**: `POST`
- **Route**: `/api/resources`
- **Auth**: Bearer Token
- **Body**:
  ```json
  {
    "title": "CSE-221 Algorithms Mid-Term Question Paper (Fall 2024)",
    "courseCode": "CSE-221",
    "courseTitle": "Algorithms & Complexity Analysis",
    "department": "CSE",
    "semesterTerm": "Mid-Term",
    "academicSession": "Fall 2024",
    "fileUrl": "https://assets.city.edu/resources/cse-221-mid-fall2024.pdf",
    "fileFormat": "PDF"
  }
  ```
- **Validation**: `courseCode` must match regex `^[A-Z]{3}-[0-9]{3}$`.
- **Response `201 Created`**

### 3.4 Upvote Resource
- **Method**: `PATCH`
- **Route**: `/api/resources/:id/upvote`
- **Auth**: Bearer Token
- **Response `200 OK`**: Returns updated resource with incremented `upvotes`.

---

## 4. Smart Helpdesk (`/api/helpdesk`)

### 4.1 List FAQs
- **Method**: `GET`
- **Route**: `/api/helpdesk`
- **Query Parameters**:
  - `category`: `Accounts & Waivers | Examinations & Grading | Registrar & Admission | Library & Labs | General`
  - `search`: Keyword string
- **Ordering**: Pinned notices (`isPinned: true`) always appear first.
- **Response `200 OK`**

### 4.2 Create FAQ Guideline
- **Method**: `POST`
- **Route**: `/api/helpdesk`
- **Auth**: Bearer Token (`UNIVERSITY_ADMIN` only)
- **Body**:
  ```json
  {
    "question": "What is the policy for course retake?",
    "answer": "Students with grades of B- or below can retake within 2 weeks...",
    "category": "Examinations & Grading",
    "isPinned": true,
    "referenceUrl": "https://city.edu/academics/grading"
  }
  ```
- **Response `201 Created`**

### 4.3 Update & Delete FAQ
- **Update**: `PUT /api/helpdesk/:id` (Admin only)
- **Delete**: `DELETE /api/helpdesk/:id` (Admin only)

---

## 5. Lost & Found Listings (`/api/lost-found`)

### 5.1 List Active Lost & Found Items
- **Method**: `GET`
- **Route**: `/api/lost-found`
- **Query Parameters**:
  - `status`: `OPEN` (default), `RESOLVED`, or `ALL`
  - `type`: `LOST | FOUND`
  - `category`: `ID Card | Calculator | Electronics | Documents/Books | Wallets/Bags | Personal Accessories`
- **Response `200 OK`**

### 5.2 Report Lost or Found Item
- **Method**: `POST`
- **Route**: `/api/lost-found`
- **Auth**: Bearer Token
- **Body**:
  ```json
  {
    "type": "LOST",
    "title": "Casio FX-991EX ClassWiz Calculator",
    "category": "Calculator",
    "locationFoundOrLost": "Room 402, Academic Building 1",
    "dateOfIncident": "2026-10-05T14:30:00.000Z",
    "description": "Left behind after examination.",
    "imageUrl": "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd",
    "contactNumberOrEmail": "+8801700112233"
  }
  ```
- **Response `201 Created`**

### 5.3 Resolve Item
- **Method**: `PATCH`
- **Route**: `/api/lost-found/:id/resolve`
- **Auth**: Bearer Token (Reporter or `UNIVERSITY_ADMIN` only)
- **Response `200 OK`**: Sets status to `RESOLVED`.

---

## 6. Grievance & Complaints (`/api/complaints`)

### 6.1 Submit Complaint
- **Method**: `POST`
- **Route**: `/api/complaints`
- **Auth**: Bearer Token
- **Body**:
  ```json
  {
    "title": "AC Unit 2 Not Cooling",
    "category": "Classroom Infrastructure",
    "description": "Room 604 ceiling AC blowing warm air.",
    "locationRoom": "Room 604",
    "isAnonymous": false
  }
  ```
- **Behavior**:
  - System generates ticket ID in format `CU-TICK-XXXX`.
  - When `isAnonymous: true`, uploader ID (`submittedBy`) is stripped and persisted as `null`.
- **Response `201 Created`**

### 6.2 Public Ticket Tracking
- **Method**: `GET`
- **Route**: `/api/complaints/track/:ticketId`
- **Auth**: Public (None required)
- **Param**: `:ticketId` (e.g. `CU-TICK-1001`)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Complaint status retrieved successfully",
    "data": {
      "ticketId": "CU-TICK-1001",
      "title": "AC Unit 2 Not Cooling",
      "category": "Classroom Infrastructure",
      "locationRoom": "Room 604",
      "status": "UNDER_REVIEW",
      "adminRemarks": "Work order dispatched to campus engineering department.",
      "createdAt": "2026-10-07T12:00:00.000Z",
      "updatedAt": "2026-10-07T12:30:00.000Z"
    }
  }
  ```

### 6.3 My Complaints
- **Method**: `GET`
- **Route**: `/api/complaints/my-complaints`
- **Auth**: Bearer Token
- **Response `200 OK`**: Lists non-anonymous complaints filed by the current user.

### 6.4 Update Complaint Status & Remarks
- **Method**: `PATCH`
- **Route**: `/api/complaints/:id/status`
- **Auth**: Bearer Token (`UNIVERSITY_ADMIN` only)
- **Body**:
  ```json
  {
    "status": "ACTION_TAKEN",
    "adminRemarks": "Replacement unit installed."
  }
  ```
- **Response `200 OK`**

---

## Pre-Seeded Credentials

| Role | Email | Password | Department | University ID |
|---|---|---|---|---|
| **STUDENT** | `student@city.edu` | `password123` | CSE | `2021-1-60-001` |
| **CLUB_ADMIN** | `club@city.edu` | `password123` | BBA | `2020-2-50-012` |
| **UNIVERSITY_ADMIN** | `admin@city.edu` | `admin123` | CSE | `ADMIN-001` |
