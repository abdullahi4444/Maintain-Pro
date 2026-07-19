# 📖 Maintain-Pro API — Codebase Explained

> A plain-English, bit-by-bit breakdown of every file inside the **Controllers** and **Models** folders.

---

## 📁 Table of Contents

### Models
1. [Enums.cs](#1-enumscs)
2. [User.cs](#2-usercs)
3. [MaintenanceRequest.cs](#3-maintenancerequestcs)
4. [Comment.cs](#4-commentcs)
5. [Notification.cs](#5-notificationcs)
6. [ActivityLog.cs](#6-activitylogcs)
7. [DTOs.cs](#7-dtoscs)

### Controllers
8. [AuthController.cs](#8-authcontrollercs)
9. [RequestsController.cs](#9-requestscontrollercs)
10. [CommentsController.cs](#10-commentscontrollercs)
11. [NotificationsController.cs](#11-notificationscontrollercs)
12. [UsersController.cs](#12-userscontrollercs)
13. [TechniciansController.cs](#13-technicianscontrollercs)
14. [DashboardController.cs](#14-dashboardcontrollercs)
15. [ReportsController.cs](#15-reportscontrollercs)
16. [ActivityLogsController.cs](#16-activitylogscontrollercs)

---

# 🗂️ MODELS

> Models are the **data shapes** of your application. Each model maps directly to a table in the database and describes what information is stored.

---

## 1. `Enums.cs`

**File:** `Models/Enums.cs`

This file contains **enumerations** — fixed lists of named options used across the system. Instead of using plain strings like `"admin"` or `"pending"` (which can have typos), enums make the code type-safe and clear.

### `Role` enum
Defines the three types of users in the system:

| Value | Meaning |
|---|---|
| `ADMIN` | Has full control — can manage users, assign technicians, view reports |
| `TECHNICIAN` | A worker who is assigned to repair/fix maintenance requests |
| `REQUESTER` | A regular user who submits maintenance requests |

### `Status` enum
Tracks the **lifecycle of a maintenance request**:

| Value | Meaning |
|---|---|
| `PENDING` | Just submitted, no one has acted on it yet |
| `ASSIGNED` | An admin has assigned a technician to it |
| `IN_PROGRESS` | The technician is actively working on it |
| `COMPLETED` | The work is done |
| `REJECTED` | The request was turned down |

### `Priority` enum
Indicates **how urgent** a request is:

| Value | Meaning |
|---|---|
| `LOW` | Not urgent, can be handled whenever |
| `MEDIUM` | Normal urgency |
| `HIGH` | Needs attention soon |
| `URGENT` | Must be handled immediately |

---

## 2. `User.cs`

**File:** `Models/User.cs`  
**Database Table:** `users`

This model represents **every person** in the system — admins, technicians, and requesters all share this one table. The `Role` field distinguishes them.

### Properties (Fields)

| Property | Type | What it stores |
|---|---|---|
| `Id` | `string` | A unique ID auto-generated as a GUID (e.g. `"a1b2-c3d4-..."`) |
| `FullName` | `string` | The user's display name (e.g. `"Ahmed Ali"`) |
| `Email` | `string` | Login email address |
| `Password` | `string` | **Hashed** password — never stored in plain text. The `[JsonIgnore]` attribute means it will **never** be sent in API responses (security!) |
| `Phone` | `string?` | Optional phone number (`?` means it can be null) |
| `Avatar` | `string?` | Optional path to the user's profile picture |
| `Role` | `Role` | Defaults to `REQUESTER` when a new user signs up |
| `IsActive` | `bool` | Whether the account is enabled; admins can deactivate accounts |
| `CreatedAt` | `DateTime` | When the account was created (auto-set to current UTC time) |
| `UpdatedAt` | `DateTime` | Last time the profile was modified |

### Navigation Properties

These are **relationships** to other tables — Entity Framework uses them to do JOINs automatically:

| Property | Meaning |
|---|---|
| `RequestsAsRequester` | All requests **submitted by** this user |
| `RequestsAsTechnician` | All requests **assigned to** this user (only relevant for technicians) |

Both are marked `[JsonIgnore]` so they don't cause infinite loops when returned as JSON.

---

## 3. `MaintenanceRequest.cs`

**File:** `Models/MaintenanceRequest.cs`  
**Database Table:** `maintenance_requests`

The **core model** of the entire system. Every repair/issue report is stored here.

### Properties

| Property | Type | What it stores |
|---|---|---|
| `Id` | `string` | Auto-generated unique GUID |
| `Title` | `string` | Short name for the issue (e.g. `"Broken AC in Room 201"`) |
| `Description` | `string` | Full details of the problem |
| `Category` | `string` | Type of issue (e.g. `"Electrical"`, `"Plumbing"`) |
| `Location` | `string` | Where the problem is (e.g. `"Block B, Floor 3"`) |
| `Priority` | `Priority` | Urgency level — defaults to `LOW` |
| `Status` | `Status` | Current state — defaults to `PENDING` |
| `Image` | `string?` | Optional path to an uploaded photo of the issue |
| `RequesterId` | `string` | The ID of the user who submitted the request |
| `Requester` | `User?` | Navigation property — loads the full requester object |
| `TechnicianId` | `string?` | The ID of the assigned technician (null until assigned) |
| `Technician` | `User?` | Navigation property — loads the full technician object |
| `CreatedAt` | `DateTime` | When the request was submitted |
| `UpdatedAt` | `DateTime` | Last modification time |
| `RepairNotes` | `string?` | Notes added by the technician after completing work |
| `CompletionImage` | `string?` | Optional photo of the completed repair |
| `Comments` | `List<Comment>` | All comments on this request (hidden from JSON to avoid loops) |

---

## 4. `Comment.cs`

**File:** `Models/Comment.cs`  
**Database Table:** `comments`

Represents a **single message** left on a maintenance request — like a discussion thread.

### Properties

| Property | Type | What it stores |
|---|---|---|
| `Id` | `string` | Auto-generated unique GUID |
| `Message` | `string` | The text of the comment |
| `RequestId` | `string` | Which maintenance request this comment belongs to |
| `UserId` | `string` | Who wrote the comment |
| `CreatedAt` | `DateTime` | When it was posted |
| `User` | `User?` | Navigation property — loads the commenter's full profile |
| `Request` | `MaintenanceRequest?` | Navigation property — loads the parent request |

---

## 5. `Notification.cs`

**File:** `Models/Notification.cs`  
**Database Table:** `notifications`

Stores **in-app alerts** sent to users when something important happens (e.g. their request was assigned).

### Properties

| Property | Type | What it stores |
|---|---|---|
| `Id` | `string` | Auto-generated unique GUID |
| `Title` | `string` | Short heading of the notification (e.g. `"Request Assigned"`) |
| `Message` | `string` | Full message text |
| `IsRead` | `bool` | Whether the user has already seen it; defaults to `false` |
| `UserId` | `string` | Who this notification is for |
| `CreatedAt` | `DateTime` | When it was created |
| `User` | `User?` | Navigation property — links to the recipient |

---

## 6. `ActivityLog.cs`

**File:** `Models/ActivityLog.cs`  
**Database Table:** `activity_logs`

An **audit trail** — records every important action taken in the system for tracking purposes.

### Properties

| Property | Type | What it stores |
|---|---|---|
| `Id` | `string` | Auto-generated unique GUID |
| `Action` | `string` | Short action label (e.g. `"Created Request"`, `"Assigned Technician"`) |
| `Description` | `string` | More detailed description of what happened |
| `UserId` | `string` | Who performed the action |
| `CreatedAt` | `DateTime` | When it happened |
| `User` | `User?` | Navigation property — links to the user who performed the action |

---

## 7. `DTOs.cs`

**File:** `Models/DTOs.cs`

DTO stands for **Data Transfer Object**. These are simple classes used only for **receiving data from the client** — they are NOT saved to the database directly. They exist to control exactly what data the API accepts.

### `LoginDto`
Used when a user tries to log in. Only needs:
- `Email` — the user's email address
- `Password` — their plain-text password (the API will hash and compare it)

### `RegisterDto`
Used when a new user registers. Accepts:
- `FullName` — their name
- `Email` — their email
- `Password` — chosen password (will be hashed before saving)
- `Phone` — optional phone number

### `AuthResponseDto`
What the API **returns** after a successful login or registration:
- `access_token` — a JWT token the frontend stores and sends with every future request
- `user` — the full user object (without the password, thanks to `[JsonIgnore]`)

---

# 🎮 CONTROLLERS

> Controllers are the **traffic directors** of the API. Each controller handles requests for a specific area of the system. Every public method inside a controller is an **API endpoint** — a URL the frontend can call.

---

## 8. `AuthController.cs`

**Route:** `/auth`

Handles everything related to **identity and authentication** — signing in, registering, and viewing your own profile.

---

### Constructor

```csharp
public AuthController(AppDbContext context, IConfiguration configuration)
```
The controller receives two injected services:
- `AppDbContext` — to read and write to the database
- `IConfiguration` — to read app settings (like the JWT secret key from `appsettings.json`)

---

### `POST /auth/login` — `Login(LoginDto request)`

**What it does:** Lets a user sign in.

**Step by step:**
1. Takes `{ email, password }` from the request body
2. Looks up the user by email in the database
3. If no user found OR the password doesn't match (using BCrypt hash comparison) → returns **401 Unauthorized**
4. If the user's account is disabled (`IsActive = false`) → returns **401 Unauthorized**
5. Otherwise, generates a JWT token and returns it along with the user object

---

### `POST /auth/register` — `Register(RegisterDto request)`

**What it does:** Creates a new account.

**Step by step:**
1. Takes `{ fullName, email, password, phone }` from the request body
2. Checks if any existing user already has that email → if yes, returns **400 Bad Request**
3. Creates a new `User` with the role `REQUESTER` and a **BCrypt-hashed** password
4. Saves to the database
5. Generates a JWT token and returns it with the new user

---

### `GET /auth/profile` — `GetProfile()` *(Requires Login)*

**What it does:** Returns the currently logged-in user's profile.

**Step by step:**
1. Reads the user's ID from their JWT token (stored in the `ClaimTypes.NameIdentifier` claim)
2. Looks up that user in the database
3. Returns the user or **404 Not Found** if somehow they don't exist

---

### `GenerateJwtToken(User user)` — Private Helper Method

**What it does:** Creates a signed JWT token that proves who the user is.

**Step by step:**
1. Reads the secret key from `appsettings.json` (`Jwt:Key`)
2. Creates signing credentials using HMAC-SHA256 algorithm
3. Packs these **claims** into the token:
   - `NameIdentifier` → user's ID
   - `Email` → user's email
   - `Role` → user's role (ADMIN / TECHNICIAN / REQUESTER)
4. Sets the token to expire in **7 days**
5. Returns the token as a string

---

## 9. `RequestsController.cs`

**Route:** `/requests`  
**Auth Required:** Yes (all endpoints)

The **largest and most important controller**. Manages the full lifecycle of maintenance requests.

---

### `POST /requests` — `Create(formData, image)`

**What it does:** Submits a new maintenance request.

**Step by step:**
1. Gets the logged-in user's ID from their JWT token
2. Reads form fields: `title`, `description`, `category`, `location`, `priority`
3. If an image file is attached:
   - Saves it to `wwwroot/uploads/` with a random GUID filename
   - Stores the path in `request.Image`
4. Saves the request to the database
5. **Notifies all admins** with a "New Maintenance Request" notification
6. **Logs the action** in `ActivityLogs` as `"Created Request"`
7. Returns the new request with a **201 Created** response

---

### `GET /requests` — `GetAll(page, limit, status, search)`

**What it does:** Returns a paginated list of ALL requests (for admins).

**Query parameters:**
- `page` — which page to return (default: 1)
- `limit` — how many per page (default: 10)
- `status` — filter by status (e.g. `PENDING`)
- `search` — text search across title, description, and location

**Step by step:**
1. Starts a database query including `Requester` and `Technician` data
2. Applies `status` filter if provided
3. Applies `search` filter if provided
4. Counts total matches for pagination metadata
5. Sorts by newest first, skips to the right page, takes the limit
6. Returns `{ data: [...requests], meta: { total, page, limit } }`

---

### `GET /requests/my-requests` — `GetMyRequests(page, limit)`

**What it does:** Returns only the requests submitted by the currently logged-in user.

**Step by step:**
1. Gets the logged-in user's ID
2. Filters requests where `RequesterId == userId`
3. Returns paginated results, newest first, with technician info included

---

### `GET /requests/assigned` — `GetAssignedRequests(page, limit)`

**What it does:** Returns requests assigned to the currently logged-in technician.

**Step by step:**
1. Gets the logged-in user's ID
2. Filters requests where `TechnicianId == userId`
3. Returns paginated results, newest first, with requester info included

---

### `GET /requests/{id}` — `GetOne(string id)`

**What it does:** Returns a single request by its ID.

**Step by step:**
1. Queries the database for a request with the given ID
2. Includes `Requester` and `Technician` details
3. Returns **404 Not Found** if it doesn't exist

---

### `PATCH /requests/{id}` — `Update(string id, MaintenanceRequest data)`

**What it does:** Updates editable fields of an existing request.

**What can be updated:** `Title`, `Description`, `Category`, `Location`, `Priority`

**Step by step:**
1. Finds the request by ID (404 if not found)
2. Only updates fields that are provided (non-empty)
3. Sets `UpdatedAt` to now
4. Saves and returns the updated request

---

### `DELETE /requests/{id}` — `Delete(string id)`

**What it does:** Permanently deletes a request.

**Step by step:**
1. Finds the request by ID (404 if not found)
2. Removes it from the database
3. Returns **204 No Content**

---

### `PATCH /requests/{id}/assign` — `Assign(string id, AssignDto data)`

**What it does:** Assigns a technician to a request (admin action).

**Step by step:**
1. Finds the request by ID
2. Sets `TechnicianId` from the body and changes `Status` to `ASSIGNED`
3. **Notifies the technician**: "You've been assigned to request..."
4. **Notifies the requester**: "Your request has been assigned to a technician..."
5. **Logs the action** as `"Assigned Technician"` in ActivityLogs
6. Returns the updated request

> **`AssignDto`** is a tiny helper class defined at the bottom of this file with just one field: `TechnicianId`.

---

### `PATCH /requests/{id}/status` — `UpdateStatus(string id, formData, completionImage)`

**What it does:** Updates the status of a request (usually done by a technician).

**What can be updated:** `status` (e.g. `IN_PROGRESS`, `COMPLETED`), `repairNotes`, optionally a completion photo.

**Step by step:**
1. Finds the request by ID
2. Saves the old status to detect changes
3. Updates `Status` and `RepairNotes` from the form data
4. If a completion image is uploaded, saves it to `wwwroot/uploads/` and stores the path
5. If the status **actually changed**:
   - Notifies the requester of the new status
   - Notifies all admins of the status change
6. Returns the updated request

---

## 10. `CommentsController.cs`

**Route:** `/comments`  
**Auth Required:** Yes (all endpoints)

Manages the **discussion thread** on each maintenance request.

---

### `POST /comments/request/{requestId}` — `Create(string requestId, Comment data)`

**What it does:** Adds a new comment to a specific request.

**Step by step:**
1. Gets the logged-in user's ID
2. Sets `RequestId` and `UserId` on the comment
3. Saves the comment to the database
4. Re-fetches the comment **with user info** included
5. Finds the related request to identify who to notify
6. Builds a set of user IDs to notify: requester + technician (if assigned) + all admins
7. Removes the commenter themselves (you don't need to notify yourself)
8. Creates a "New Comment" notification for each person in the set
9. Returns the saved comment with **201 Created**

---

### `GET /comments/request/{requestId}` — `GetByRequestId(string requestId)`

**What it does:** Returns all comments for a specific request, in chronological order (oldest first).

**Step by step:**
1. Queries comments where `RequestId == requestId`
2. Includes the user profile for each comment
3. Returns them sorted by `CreatedAt` ascending

---

### `DELETE /comments/{id}` — `Delete(string id)`

**What it does:** Deletes a comment.

**Authorization check:** Only the **original author** or an **ADMIN** can delete a comment. Anyone else gets **403 Forbidden**.

**Step by step:**
1. Finds the comment by ID (404 if not found)
2. Checks if the logged-in user is the author OR has ADMIN role
3. If neither → **403 Forbidden**
4. Removes the comment and returns **204 No Content**

---

## 11. `NotificationsController.cs`

**Route:** `/notifications`  
**Auth Required:** Yes (all endpoints)

Lets users **view and manage their own notifications**.

---

### `GET /notifications` — `GetAll()`

**What it does:** Returns all notifications for the logged-in user, newest first.

**Step by step:**
1. Gets the logged-in user's ID from the JWT token
2. Filters notifications where `UserId == userId`
3. Sorts by `CreatedAt` descending and returns them

---

### `PATCH /notifications/{id}/read` — `MarkAsRead(string id)`

**What it does:** Marks a single notification as read.

**Step by step:**
1. Finds the notification by ID (404 if not found)
2. Sets `IsRead = true`
3. Saves and returns the updated notification

---

### `PATCH /notifications/read-all` — `MarkAllAsRead()`

**What it does:** Marks ALL unread notifications for the logged-in user as read at once.

**Step by step:**
1. Gets the logged-in user's ID
2. Fetches all notifications where `UserId == userId AND IsRead == false`
3. Loops through them and sets each `IsRead = true`
4. Saves and returns `{ message: "All marked as read" }`

---

## 12. `UsersController.cs`

**Route:** `/users`  
**Auth Required:** Yes (all endpoints)

Handles **user account management** — primarily for admins managing all users, plus self-service profile/avatar updates.

---

### `GET /users` — `GetAll()`

**What it does:** Returns a list of **all users** in the system.

---

### `GET /users/{id}` — `GetOne(string id)`

**What it does:** Returns a single user by their ID. Returns **404** if not found.

---

### `POST /users` — `Create(User data)`

**What it does:** Admin creates a new user manually.

**Step by step:**
1. Hashes the provided password (or uses `"defaultpassword123"` if none given)
2. Saves the new user
3. Returns the created user with **201 Created**

---

### `PATCH /users/{id}` — `Update(string id, User data)`

**What it does:** Admin updates any user's information.

**What can be updated:** `FullName`, `Phone`, `Email`, `Role`, `IsActive`, `Password`

**Step by step:**
1. Finds the user by ID (404 if not found)
2. Updates only the fields that are provided
3. If a new password is given, it's hashed before saving
4. Sets `UpdatedAt` to now and saves

---

### `DELETE /users/{id}` — `Delete(string id)`

**What it does:** Permanently deletes a user. Returns **204 No Content**.

---

### `PATCH /users/profile` — `UpdateProfile(User data)`

**What it does:** Lets the **currently logged-in user** update their own profile.

**What can be updated:** Only `FullName` and `Phone` (for safety — no role changes here).

**Step by step:**
1. Gets user ID from JWT token
2. Finds and updates only the permitted fields
3. Returns the updated user

---

### `PATCH /users/avatar` — `UpdateAvatar(IFormFile file)`

**What it does:** Lets the logged-in user upload a new profile picture.

**Step by step:**
1. Gets user ID from JWT token
2. If a valid file is uploaded:
   - Saves it to `wwwroot/uploads/` with a random GUID filename
   - Sets `user.Avatar` to the file path
3. Saves and returns the updated user

---

## 13. `TechniciansController.cs`

**Route:** `/technicians`  
**Auth Required:** Yes (all endpoints)

A **specialized controller** for managing technician accounts. It's essentially a filtered version of the Users controller — only operates on users with `Role == TECHNICIAN`.

---

### `GET /technicians` — `GetAll()`

**What it does:** Returns all users who are technicians.

---

### `GET /technicians/{id}` — `GetOne(string id)`

**What it does:** Returns a single technician by ID. Returns **404** if the user doesn't exist or isn't a technician.

---

### `POST /technicians` — `Create(User data)`

**What it does:** Admin creates a new technician account.

**Step by step:**
1. Forces `Role = TECHNICIAN` regardless of what's in the body (security measure)
2. Hashes the provided password, or defaults to `"technician123"` if none given
3. Saves and returns the new technician with **201 Created**

---

### `PATCH /technicians/{id}` — `Update(string id, User data)`

**What it does:** Updates a technician's information.

**What can be updated:** `FullName`, `Phone`, `Email`, `IsActive`, `Password`

**Step by step:**
1. Finds the user by ID AND confirms they are a technician (404 if not)
2. Updates only provided fields
3. Hashes new password if provided
4. Sets `UpdatedAt` and saves

---

### `DELETE /technicians/{id}` — `Delete(string id)`

**What it does:** Deletes a technician account. Returns **204 No Content**.

---

## 14. `DashboardController.cs`

**Route:** `/dashboard`  
**Auth Required:** Yes (all endpoints)

Provides **aggregated statistical data** to power the admin dashboard.

---

### `GET /dashboard/stats` — `GetStats()`

**What it does:** Returns a single object with counts for all key metrics.

**Returns:**
```json
{
  "totalRequests": 45,
  "pendingRequests": 12,
  "assignedRequests": 8,
  "inProgressRequests": 5,
  "completedRequests": 18,
  "rejectedRequests": 2,
  "totalUsers": 30,
  "totalTechnicians": 7
}
```

---

### `GET /dashboard/recent-requests` — `GetRecentRequests(limit)`

**What it does:** Returns the most recently submitted requests.

- `limit` query param controls how many to return (default: 5)
- Includes the `Requester` object on each request
- Sorted newest first

---

### `GET /dashboard/monthly-requests` — `GetMonthlyRequests(year)`

**What it does:** Returns a 12-element array of request counts, one per month, for a given year.

**Example return:** `[3, 5, 7, 2, 9, 4, 6, 8, 1, 3, 5, 7]` (Jan → Dec)

**Step by step:**
1. Defaults to the current year if no `year` param is given
2. Groups requests by month for that year
3. Creates an array of 12 zeros, then fills in the counts
4. Returns the array (perfect for feeding into a bar chart)

---

### `GET /dashboard/request-status` — `GetRequestStatus()`

**What it does:** Returns a dictionary of status → count, for a pie/doughnut chart.

**Example return:**
```json
{
  "PENDING": 12,
  "ASSIGNED": 8,
  "COMPLETED": 18
}
```

---

### `GET /dashboard/technician-performance` — `GetTechnicianPerformance()`

**What it does:** Returns performance metrics for every technician.

**Returns for each technician:**
- `technicianId` — their ID
- `technicianName` — their full name
- `completedRequests` — number of requests they've marked as COMPLETED
- `totalAssigned` — total requests they've ever been assigned

---

## 15. `ReportsController.cs`

**Route:** `/reports`  
**Auth Required:** Yes (all endpoints)

Provides **filtered report data** for exporting or deeper analysis. Similar to the dashboard but with more filter options and raw data instead of aggregations.

---

### `GET /reports/requests` — `GetRequestsReport(status, priority)`

**What it does:** Returns a filtered list of all maintenance requests for a report.

**Query parameters:**
- `status` — filter by status (e.g. `COMPLETED`)
- `priority` — filter by priority (e.g. `URGENT`)

**Step by step:**
1. Builds a query on all requests
2. Applies status filter if given (safely parses the enum)
3. Applies priority filter if given
4. Includes `Requester` and `Technician` on each result
5. Returns sorted by newest first

---

### `GET /reports/users` — `GetUsersReport()`

**What it does:** Returns a summary list of all users (safe fields only — no passwords).

**Returns for each user:** `Id`, `FullName`, `Email`, `Role`, `IsActive`, `CreatedAt`

---

### `GET /reports/technicians` — `GetTechniciansReport()`

**What it does:** Returns a performance-focused report of all technicians.

**Returns for each technician:**
- Basic info: `Id`, `FullName`, `Email`, `IsActive`
- `AssignedCount` — total requests ever assigned
- `CompletedCount` — total requests completed

---

## 16. `ActivityLogsController.cs`

**Route:** `/activity-logs`  
**Auth Required:** Yes

The simplest controller. Exposes the audit trail to admins.

---

### `GET /activity-logs` — `GetAll()`

**What it does:** Returns every activity log entry, newest first, with the `User` who performed the action included.

**When logs are created:** Automatically by `RequestsController` when:
- A new request is **created** → logs `"Created Request"`
- A technician is **assigned** to a request → logs `"Assigned Technician"`

---

## 🔗 How Everything Connects

```
User
 ├── submits ──────────────→ MaintenanceRequest  (as Requester)
 ├── is assigned to ───────→ MaintenanceRequest  (as Technician)
 ├── writes ───────────────→ Comment
 ├── receives ─────────────→ Notification
 └── appears in ───────────→ ActivityLog

MaintenanceRequest
 ├── belongs to ───────────→ User (Requester)
 ├── assigned to ──────────→ User (Technician)
 └── has many ─────────────→ Comment

Comment
 ├── belongs to ───────────→ MaintenanceRequest
 └── written by ───────────→ User

Notification ─ sent to ───→ User
ActivityLog ── performed by → User
```

---

*Generated by Antigravity · Maintain-Pro API Documentation*
