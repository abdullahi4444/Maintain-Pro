# 📖 Maintain-Pro Frontend — `src/` Folder Explained

> A plain-English, bit-by-bit breakdown of every file and folder inside the **frontend/src** directory.

---

## 📁 Folder Structure at a Glance

```
src/
├── main.tsx                    ← App entry point
├── App.tsx                     ← Root component
├── index.css                   ← Global styles & design tokens
├── app/
│   ├── layouts/
│   │   └── dashboard-layout.tsx  ← The shell for all logged-in pages
│   ├── providers/
│   │   └── index.tsx             ← Global context providers
│   ├── router/
│   │   └── index.tsx             ← All URL routes + auth guards
│   └── store/
│       └── index.ts              ← Global auth state (Zustand)
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx           ← Navigation sidebar
│   │   └── header.tsx            ← Top navigation bar
│   ├── theme-provider.tsx        ← Dark/light mode engine
│   ├── theme-toggle.tsx          ← Dark/light toggle button
│   └── ui/                       ← Reusable UI primitives (shadcn)
├── lib/
│   └── utils.ts                  ← Shared helper functions
├── services/
│   ├── axios.ts                  ← Axios instance + auth interceptor
│   └── api.ts                    ← All API call functions
├── types/
│   └── index.ts                  ← TypeScript type definitions
├── pages/
│   └── landing/
│       └── index.tsx             ← Public landing/home page
└── team-modules/
    ├── auth-users/pages/         ← Login, Register, Profile, Users
    ├── dashboard/pages/          ← Dashboard page
    ├── requests/pages/           ← All request-related pages
    └── notifications-reports/    ← Notifications & Reports pages
```

---

## 📁 Table of Contents

### Root Files
1. [main.tsx](#1-maintsx)
2. [App.tsx](#2-apptsx)
3. [index.css](#3-indexcss)

### `app/` — Application Infrastructure
4. [app/store/index.ts](#4-appstoreindexts)
5. [app/providers/index.tsx](#5-appprovidersindextsx)
6. [app/router/index.tsx](#6-approuterindextsx)
7. [app/layouts/dashboard-layout.tsx](#7-applayoutsdashboard-layouttsx)

### `services/` — API Layer
8. [services/axios.ts](#8-servicesaxiosts)
9. [services/api.ts](#9-servicesapits)

### `types/` & `lib/`
10. [types/index.ts](#10-typesindexts)
11. [lib/utils.ts](#11-libutilsts)

### `components/` — Reusable UI
12. [components/theme-provider.tsx](#12-componentstheme-providertsx)
13. [components/theme-toggle.tsx](#13-componentstheme-toggletsx)
14. [components/layout/sidebar.tsx](#14-componentslayoutsidebartsx)
15. [components/layout/header.tsx](#15-componentslayoutheadertsx)
16. [components/ui/](#16-componentsui--shadcn-primitives)

### `pages/` — Public Pages
17. [pages/landing/index.tsx](#17-pageslandingindextsx)

### `team-modules/` — Feature Pages
18. [auth-users/pages/login.tsx](#18-auth-userspageslogintsx)
19. [auth-users/pages/register.tsx](#19-auth-userspagesregistertsx)
20. [auth-users/pages/Profile.tsx](#20-auth-userspagesprofiletsx)
21. [auth-users/pages/Users.tsx](#21-auth-userspagesuserstsx)
22. [dashboard/pages/Dashboard.tsx](#22-dashboardpagesdashboardtsx)
23. [requests/pages/index.tsx](#23-requestspagesindextsx)
24. [requests/pages/create.tsx](#24-requestspagescreatetsx)
25. [requests/pages/detail.tsx](#25-requestspagesdetailtsx)
26. [requests/pages/my-requests.tsx](#26-requestspagesmy-requeststsx)
27. [requests/pages/assigned.tsx](#27-requestspagesassignedtsx)
28. [notifications-reports/pages/Notifications.tsx](#28-notifications-reportspagesnotificationstsx)
29. [notifications-reports/pages/Reports.tsx](#29-notifications-reportspagesreportstsx)

---

# 🏁 ROOT FILES

---

## 1. `main.tsx`

**Path:** `src/main.tsx`

This is the **very first file that runs** when the app loads. It's the JavaScript entry point.

### What it does, line by line:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'           // Load all global styles
import { Toaster } from 'sonner' // Toast notification renderer
```

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>    // Enables extra development warnings
    <App />             // The entire app renders here
    <Toaster />         // Toast pop-ups (e.g. "Login successful!")
  </React.StrictMode>,
)
```

- `document.getElementById('root')` — finds the `<div id="root">` in `index.html`
- `ReactDOM.createRoot` — mounts the React app into that div
- `React.StrictMode` — a wrapper that helps catch bugs in development
- `<Toaster />` — renders all toast notifications globally

---

## 2. `App.tsx`

**Path:** `src/App.tsx`

The **root React component**. It's tiny because it delegates everything to two other systems.

```tsx
function App() {
  return (
    <Providers>           // Wraps the whole app in global context
      <RouterProvider router={router} />   // Renders the correct page based on URL
    </Providers>
  );
}
```

- `<Providers>` — wraps children in theme, query client, and tooltip context
- `<RouterProvider>` — hands control to React Router, which shows the right page

---

## 3. `index.css`

**Path:** `src/index.css`

The **global stylesheet** for the entire application. This is where all the design tokens, animations, and utility classes are defined.

### Section 1 — Google Font Import
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:...');
```
Loads the **Plus Jakarta Sans** font used throughout the app.

### Section 2 — Tailwind Directives
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Tells Tailwind CSS to inject its base resets, component classes, and utility classes.

### Section 3 — CSS Variables (Design Tokens)

Under `:root` (light mode) and `.dark` (dark mode), CSS variables define the entire colour palette:

| Variable | What it controls |
|---|---|
| `--background` | Page background colour |
| `--foreground` | Default text colour |
| `--card` | Card background colour |
| `--primary` | Brand colour (sky blue, HSL 199 89% 48%) |
| `--muted` | Subtle backgrounds |
| `--border` | Border colours |
| `--ring` | Focus ring colour |
| `--radius` | Default border radius (0.75rem) |

> **Why CSS variables?** They allow the entire colour scheme to switch between light and dark mode by simply toggling a class on the `<html>` element.

### Section 4 — Base Styles
- Sets **Plus Jakarta Sans** as the default font
- Applies `bg-background text-foreground` to `body`
- Styles the custom **thin scrollbar** (6px, rounded, semi-transparent)

### Section 5 — Custom Utility Classes

| Class | What it does |
|---|---|
| `.glass` | Frosted glass effect (blur + semi-transparent background) |
| `.glass-strong` | Stronger frosted glass |
| `.gradient-text` | Text with a blue-to-purple gradient fill |
| `.gradient-primary/success/warning/danger/info` | Gradient backgrounds for different contexts |
| `.glow-primary` | Soft blue glow box-shadow |
| `.hover-lift` | Card lifts 2px with shadow on hover |
| `.shimmer` | Animated loading skeleton effect |
| `.dot-pattern` | Radial dot grid background pattern |
| `.animated-border` | Animated gradient border effect |

### Section 6 — Keyframe Animations

| Animation | Effect |
|---|---|
| `shimmer` | Slides a highlight across (for skeleton loaders) |
| `gradientShift` | Slowly shifts gradient background position |
| `fadeIn` | Fades element in from slightly below |
| `slideInLeft/Right` | Slides element in from left or right |
| `scaleIn` | Scales element from 95% to 100% |
| `pulse-glow` | Pulsing glow ring effect |
| `float` | Gentle up-and-down floating |
| `countUp` | Fades number in from below |

### Section 7 — Animation Utility Classes
Ready-to-use classes like `.animate-fade-in`, `.animate-float`, `.animate-pulse-glow`.

### Section 8 — `.stagger-children`
Automatically staggers the fade-in animation of child elements (1st child fades in at 0ms, 2nd at 75ms, 3rd at 150ms, etc.). Used to create cascading entrance effects on lists and grids.

---

# 🏗️ `app/` — APPLICATION INFRASTRUCTURE

---

## 4. `app/store/index.ts`

**Path:** `src/app/store/index.ts`

The **global authentication state** for the entire app. Built with **Zustand** (a lightweight state management library).

### The State Shape

```ts
interface AuthState {
  user: User | null;          // The logged-in user object
  token: string | null;       // The JWT access token
  isAuthenticated: boolean;   // Quick check: is anyone logged in?
  login(user, token): void;   // Action to log in
  logout(): void;             // Action to log out
  updateUser(updates): void;  // Action to patch user details
}
```

### The Store

```ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state: nobody logged in
      user: null,
      token: null,
      isAuthenticated: false,

      // login: saves user + token, sets isAuthenticated = true
      login: (user, token) => set({ user, token, isAuthenticated: true }),

      // logout: clears everything back to initial state
      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      // updateUser: merges partial updates into the existing user object
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    { name: "auth-storage" }   // Persists to localStorage under this key
  )
);
```

**`persist` middleware** — automatically saves and restores the state from `localStorage`, so you stay logged in after a page refresh.

---

## 5. `app/providers/index.tsx`

**Path:** `src/app/providers/index.tsx`

A single **wrapper component** that bundles all global context providers together. This way, `App.tsx` stays clean.

### What it wraps the app in (outer to inner):

1. **`<ThemeProvider defaultTheme="dark">`** — Enables dark/light mode switching, defaults to dark
2. **`<QueryClientProvider client={queryClient}>`** — Enables React Query for data fetching throughout the app. Configures queries to stay "fresh" for 60 seconds (`staleTime: 60 * 1000`)
3. **`<TooltipProvider>`** — Makes tooltips work anywhere in the app
4. **`<Toaster />`** — Renders toast notifications

The `queryClient` is created once using `useState` so it's not recreated on re-renders.

---

## 6. `app/router/index.tsx`

**Path:** `src/app/router/index.tsx`

The **URL routing system** of the entire app. Defines every page URL and what component renders there.

### Route Guards

Two special wrapper components protect routes:

#### `ProtectedRoute`
```tsx
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;  // Redirect to login if not logged in
  }
  return <>{children}</>;
}
```
If you're **not logged in** and try to visit `/app/...`, you're automatically sent to `/login`.

#### `GuestRoute`
```tsx
function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;  // Already logged in → go to dashboard
  }
  return <>{children}</>;
}
```
If you're **already logged in** and visit `/login` or `/register`, you're sent straight to the dashboard.

### Route Map

| URL | Component | Access |
|---|---|---|
| `/` | `LandingPage` | Public |
| `/login` | `LoginPage` | Guest only |
| `/register` | `RegisterPage` | Guest only |
| `/app/dashboard` | `DashboardPage` | Must be logged in |
| `/app/requests` | `RequestsPage` | Must be logged in |
| `/app/requests/my` | `MyRequestsPage` | Must be logged in |
| `/app/requests/assigned` | `AssignedRequestsPage` | Must be logged in |
| `/app/requests/create` | `CreateRequestPage` | Must be logged in |
| `/app/requests/:id` | `RequestDetailPage` | Must be logged in |
| `/app/users` | `UsersPage` | Must be logged in |
| `/app/technicians` | `TechniciansPage` | Must be logged in |
| `/app/reports` | `ReportsPage` | Must be logged in |
| `/app/notifications` | `NotificationsPage` | Must be logged in |
| `/app/profile` | `ProfilePage` | Must be logged in |

All `/app/...` routes share the **`DashboardLayout`** as their outer shell (sidebar + header).

---

## 7. `app/layouts/dashboard-layout.tsx`

**Path:** `src/app/layouts/dashboard-layout.tsx`

The **visual shell** that wraps every logged-in page. It puts the sidebar and header in place and renders the current page in the main content area.

### Structure

```tsx
<div className="flex min-h-screen">
  <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
  <div className={cn("flex-1 flex flex-col transition-all", sidebarOpen ? "lg:ml-[272px]" : "ml-0")}>
    <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden overflow-y-auto">
      <div className="max-w-7xl mx-auto animate-fade-in w-full">
        <Outlet />   {/* ← The current page renders here */}
      </div>
    </main>
  </div>
</div>
```

- `sidebarOpen` state — tracks whether the sidebar is visible
- `lg:ml-[272px]` — on large screens, content shifts right to make room for the sidebar
- `<Outlet />` — React Router's placeholder; the matched child route renders here
- `animate-fade-in` — the page content fades in on each navigation

---

# 🌐 `services/` — API LAYER

---

## 8. `services/axios.ts`

**Path:** `src/services/axios.ts`

Sets up the **pre-configured Axios HTTP client** that all API calls go through.

```ts
export const API_URL = "http://localhost:5264";  // The backend server address

const api = axios.create({
  baseURL: API_URL,   // All requests start with this base URL
});
```

### The Request Interceptor

```ts
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;  // Read JWT from Zustand store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // Attach it to every request
  }
  return config;
});
```

This interceptor runs **automatically before every single HTTP request**. It:
1. Reads the JWT token from the auth store
2. If a token exists, adds it as `Authorization: Bearer <token>` in the request headers
3. This is how the backend knows who is making the request

> **Why this is important:** Without this, every API call would need to manually add the token. The interceptor does it automatically for all calls.

---

## 9. `services/api.ts`

**Path:** `src/services/api.ts`

All **API call functions** organised by feature. Each function calls an endpoint and returns a typed response.

### `authAPI` — Authentication

| Function | Method + URL | What it does |
|---|---|---|
| `login(data)` | POST `/auth/login` | Logs in with email + password |
| `register(data)` | POST `/auth/register` | Creates a new account |
| `getProfile()` | GET `/auth/profile` | Gets the current user's profile |

### `usersAPI` — User Management

| Function | Method + URL | What it does |
|---|---|---|
| `getAll()` | GET `/users` | Get all users |
| `getOne(id)` | GET `/users/:id` | Get one user |
| `create(data)` | POST `/users` | Create a user |
| `update(id, data)` | PATCH `/users/:id` | Update a user |
| `delete(id)` | DELETE `/users/:id` | Delete a user |
| `updateProfile(data)` | PATCH `/users/profile` | Update own profile |
| `updateAvatar(formData)` | PATCH `/users/avatar` | Upload profile picture |

### `techniciansAPI` — Technician Management

Same CRUD structure as `usersAPI` but hits `/technicians/...` endpoints.

### `requestsAPI` — Maintenance Requests

| Function | Method + URL | What it does |
|---|---|---|
| `create(formData)` | POST `/requests` | Submit a new request |
| `getAll(params)` | GET `/requests` | All requests (admin) with pagination |
| `getMyRequests(params)` | GET `/requests/my-requests` | Logged-in user's requests |
| `getAssignedRequests(params)` | GET `/requests/assigned` | Technician's assigned requests |
| `getOne(id)` | GET `/requests/:id` | Single request detail |
| `update(id, data)` | PATCH `/requests/:id` | Edit request fields |
| `delete(id)` | DELETE `/requests/:id` | Delete a request |
| `assign(id, data)` | PATCH `/requests/:id/assign` | Assign a technician |
| `updateStatus(id, formData)` | PATCH `/requests/:id/status` | Update request status |

### `commentsAPI` — Comments

| Function | Method + URL | What it does |
|---|---|---|
| `create(requestId, data)` | POST `/comments/request/:id` | Add a comment |
| `getByRequestId(requestId)` | GET `/comments/request/:id` | Get all comments |
| `delete(id)` | DELETE `/comments/:id` | Delete a comment |

### `notificationsAPI` — Notifications

| Function | What it does |
|---|---|
| `getAll()` | Get all notifications for logged-in user |
| `markAsRead(id)` | Mark one as read |
| `markAllAsRead()` | Mark all as read |

### `dashboardAPI` — Dashboard Statistics

| Function | What it returns |
|---|---|
| `getStats()` | Total/pending/completed counts etc. |
| `getRecentRequests(limit)` | Last N requests |
| `getMonthlyRequests(year)` | Array of 12 monthly counts |
| `getRequestStatus()` | Dictionary of status → count |
| `getTechnicianPerformance()` | Performance data per technician |

### `reportsAPI` — Reports

| Function | What it returns |
|---|---|
| `getRequestsReport(params)` | Filterable list of all requests |
| `getUsersReport()` | All users (safe fields) |
| `getTechniciansReport()` | Technicians with assignment stats |

### `activityLogsAPI`

| Function | What it returns |
|---|---|
| `getAll(params)` | All activity log entries |

---

# 📐 `types/` & `lib/`

---

## 10. `types/index.ts`

**Path:** `src/types/index.ts`

Defines all **TypeScript types and interfaces** used across the frontend. These mirror the backend models so the frontend stays type-safe.

### String Union Types (matching backend enums)

```ts
type Role = "ADMIN" | "TECHNICIAN" | "REQUESTER";
type Status = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
```

### `User` Interface

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique GUID |
| `fullName` | `string` | Display name |
| `email` | `string` | Email address |
| `phone?` | `string` | Optional phone |
| `avatar?` | `string` | Optional profile picture URL |
| `role` | `Role` | User's role |
| `isActive` | `boolean` | Account enabled? |
| `createdAt` | `string` | ISO date string |
| `updatedAt` | `string` | ISO date string |

### `MaintenanceRequest` Interface

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique GUID |
| `title` | `string` | Short issue title |
| `description` | `string` | Full description |
| `category` | `string` | Issue type |
| `location` | `string` | Where the issue is |
| `priority` | `Priority` | Urgency level |
| `status` | `Status` | Current lifecycle stage |
| `image?` | `string` | Upload path for issue photo |
| `completionImage?` | `string` | Upload path for completion photo |
| `repairNotes?` | `string` | Technician's notes |
| `requester` | `User` | Who submitted it |
| `technician?` | `User` | Who's assigned to it |
| `comments` | `Comment[]` | Discussion thread |

### Other interfaces: `Comment`, `Notification`, `ActivityLog`, `DashboardStats`

Each mirrors the corresponding backend model exactly.

---

## 11. `lib/utils.ts`

**Path:** `src/lib/utils.ts`

Contains **shared helper utility functions** used throughout the app.

### `cn(...inputs)`

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

This is the standard **className merging utility** from shadcn/ui. It:
- Uses `clsx` to conditionally join class names (e.g. `cn("base", isActive && "active")`)
- Uses `twMerge` to intelligently merge Tailwind classes and resolve conflicts (e.g. `"p-2 p-4"` → `"p-4"`)

**Used everywhere** when building dynamic class strings.

### `getImageUrl(url)`

```ts
export function getImageUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith("http://") || url.startsWith("https://")) return url
  return `${API_URL}${url}`
}
```

Converts a relative image path from the backend into a full URL.

- If URL is empty/null → returns `null`
- If URL is already absolute (starts with `http`) → returns it as-is
- Otherwise → prepends the API base URL (e.g. `/uploads/abc.jpg` → `http://localhost:5264/uploads/abc.jpg`)

**Used for:** user avatars and request images.

---

# 🧩 `components/` — REUSABLE UI

---

## 12. `components/theme-provider.tsx`

**Path:** `src/components/theme-provider.tsx`

The **dark/light mode engine** of the app. Uses React Context to share theme state.

### How it works

1. On mount, reads the saved theme from `localStorage` (key: `"vite-ui-theme"`)
2. Applies the theme by adding `"dark"` or `"light"` class to `<html>` element
3. If `theme === "system"`, reads the OS preference using `window.matchMedia`
4. Exposes `{ theme, setTheme }` via the `ThemeProviderContext`

### `useTheme()` hook

```ts
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
```

Any component can call `useTheme()` to read or change the current theme. Throws an error if used outside the provider (good safety check).

---

## 13. `components/theme-toggle.tsx`

**Path:** `src/components/theme-toggle.tsx`

A simple **button** that toggles between dark and light mode.

- Calls `useTheme()` to get current theme
- Checks if currently dark (including system preference)
- Shows ☀️ Sun when dark (click to go light), 🌙 Moon when light (click to go dark)

---

## 14. `components/layout/sidebar.tsx`

**Path:** `src/components/layout/sidebar.tsx`

The **left navigation sidebar** of the dashboard. Fixed on the left, collapsible, role-aware.

### Key Concepts

#### Navigation Sections
The sidebar is built from a `navSections` array with 4 sections:

| Section | Items |
|---|---|
| **Overview** | Dashboard (all roles) |
| **Requests** | Create Request (admin/requester), My Requests (requester), Assigned to Me (technician), All Requests (admin) |
| **Management** | Users, Technicians, Reports (admin only) |
| **Account** | Notifications, Profile (all roles) |

#### Role-based Filtering
```ts
const filteredItems = section.items.filter(
  (item) => user?.role && item.roles.includes(user.role)
);
```
Each nav item has a `roles` array. Items are **filtered** based on the logged-in user's role, so technicians don't see admin-only links and vice versa.

#### Mobile Support
- On mobile, the sidebar slides over the page content
- A dark overlay (`bg-black/60`) covers the page
- Clicking the overlay closes the sidebar

#### Active Link Styling
Uses React Router's `<NavLink>` which automatically gets `isActive = true` when the URL matches. Active links get bold text and a highlighted background.

#### User Section at Bottom
Shows the logged-in user's avatar (or initials), their name and role, and a **Sign Out** button that calls `logout()` from the auth store and navigates to `/login`.

---

## 15. `components/layout/header.tsx`

**Path:** `src/components/layout/header.tsx`

The **sticky top navigation bar** on every dashboard page.

### What it contains (left to right):

1. **Hamburger menu** — toggles the sidebar open/close
2. **Search bar** — decorative search input (visible on md+ screens)
3. **Theme toggle** — switches dark/light mode
4. **Notification bell** — shows unread count badge, navigates to `/app/notifications`
5. **User avatar/name** — clicking navigates to `/app/profile`

### Notification Count
```ts
const { data: notifications } = useQuery({
  queryKey: ["notifications-count"],
  queryFn: () => notificationsAPI.getAll({ limit: 5 }),
  refetchInterval: 30000,  // Auto-refresh every 30 seconds
});

const unreadCount = notifications?.data?.filter((n) => !n.isRead)?.length || 0;
```
The bell icon **automatically polls** for unread notifications every 30 seconds and shows a pulsing badge with the count.

---

## 16. `components/ui/` — shadcn Primitives

**Path:** `src/components/ui/`

These are **pre-built, accessible UI components** from the [shadcn/ui](https://ui.shadcn.com/) library. They are not installed as a package — they're copied into the codebase so you can customise them freely.

| File | Component | What it is |
|---|---|---|
| `avatar.tsx` | `<Avatar>` | Circular profile image with fallback initials |
| `badge.tsx` | `<Badge>` | Small coloured label/tag |
| `button.tsx` | `<Button>` | Styled button with variants (default, ghost, outline, etc.) |
| `card.tsx` | `<Card>` | Container with header, content, footer sections |
| `checkbox.tsx` | `<Checkbox>` | Accessible checkbox input |
| `dialog.tsx` | `<Dialog>` | Modal popup with overlay |
| `dropdown-menu.tsx` | `<DropdownMenu>` | Contextual dropdown menu |
| `input.tsx` | `<Input>` | Styled text input field |
| `label.tsx` | `<Label>` | Accessible form label |
| `popover.tsx` | `<Popover>` | Floating content anchored to an element |
| `scroll-area.tsx` | `<ScrollArea>` | Custom-styled scrollable container |
| `select.tsx` | `<Select>` | Accessible styled dropdown selector |
| `separator.tsx` | `<Separator>` | Horizontal or vertical divider line |
| `sheet.tsx` | `<Sheet>` | Side-sliding drawer panel |
| `sonner.tsx` | `<Toaster>` | Toast notification container |
| `table.tsx` | `<Table>` | Full table with head/body/row/cell |
| `tabs.tsx` | `<Tabs>` | Tab navigation with content panels |
| `textarea.tsx` | `<Textarea>` | Multi-line styled text input |
| `tooltip.tsx` | `<Tooltip>` | Hover tooltip on any element |

All components use the CSS variables from `index.css`, so they automatically adapt to dark/light mode.

---

# 🌍 `pages/` — PUBLIC PAGES

---

## 17. `pages/landing/index.tsx`

**Path:** `src/pages/landing/index.tsx`

The **public home page** shown at the root URL `/`. This is a large marketing page (~21KB) accessible to anyone, logged in or not.

### Likely Sections (based on file size and common patterns):
- Hero section with headline, CTA buttons (Get Started, Login)
- Features section highlighting key capabilities
- How it works / steps
- Testimonials or statistics
- Footer

The page is accessible publicly and does not require authentication.

---

# 🧑‍💻 `team-modules/` — FEATURE PAGES

The `team-modules/` folder is organized by **feature area**. Each subfolder represents a feature that could be worked on by a different team member.

---

## 18. `auth-users/pages/login.tsx`

**Path:** `src/team-modules/auth-users/pages/login.tsx`

The **login page** at `/login`.

### Layout
- **Left half** — the login form
- **Right half** (desktop only) — a full-height background image with marketing text overlay

### Form Validation (Zod schema)
```ts
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
```

### What happens on submit:
1. `react-hook-form` validates the input against the Zod schema
2. On valid data, `loginMutation.mutate(data)` is called
3. Calls `authAPI.login(data)` → POST to `/auth/login`
4. **On success:** calls `login(user, token)` to save to the store, shows "Welcome back!" toast, navigates to `/app/dashboard`
5. **On error:** shows "Invalid credentials" toast

Also has a Google login button (currently shows an info toast that it's not configured).

---

## 19. `auth-users/pages/register.tsx`

**Path:** `src/team-modules/auth-users/pages/register.tsx`

The **registration page** at `/register`. Very similar structure to login.

### Form Fields:
- `fullName` — minimum 2 characters
- `email` — valid email format
- `password` — minimum 6 characters
- `phone` — optional

### What happens on submit:
1. Validates with Zod
2. Calls `authAPI.register(data)` → POST to `/auth/register`
3. **On success:** logs the user in immediately, shows "Registration successful!", navigates to dashboard
4. **On error:** shows "Email already exists" toast

---

## 20. `auth-users/pages/Profile.tsx`

**Path:** `src/team-modules/auth-users/pages/Profile.tsx`

The **user profile settings page** at `/app/profile`. Lets users edit their own info and upload an avatar.

### Features:
- Displays current user info (name, email, phone, role, avatar)
- **Edit Profile** form — update `fullName` and `phone`
- **Avatar upload** — file input with live preview; uploads via `PATCH /users/avatar`
- Both use `useMutation` hooks; on success, calls `updateUser()` to refresh the store

### How avatar upload works:
1. User picks a file
2. `FileReader` generates a local preview URL shown immediately
3. On save, a `FormData` object is sent to the backend
4. Backend saves the file and returns the new path, which updates the store

---

## 21. `auth-users/pages/Users.tsx`

**Path:** `src/team-modules/auth-users/pages/Users.tsx`

The **Users management page** at `/app/users`. Admin-only.

### Features:
- **Table view** of all users with role badges (coloured by role: purple=Admin, blue=Technician, green=Requester)
- **Search bar** to filter users by name/email
- **Create User dialog** — form to add a new user with role selection
- **Edit User dialog** — form to modify existing user details
- **Delete user** with confirmation
- All actions use React Query mutations; on success, `queryClient.invalidateQueries(["users"])` refreshes the list

---

## 22. `dashboard/pages/Dashboard.tsx`

**Path:** `src/team-modules/dashboard/pages/Dashboard.tsx`

The **main dashboard page** at `/app/dashboard`. The first thing users see after logging in.

### Data it fetches (4 parallel queries):
1. `dashboard-stats` → summary numbers
2. `monthly-requests` → 12-element array for the chart
3. `request-status` → status distribution for pie chart
4. `recent-requests` → latest 5 requests

### What it displays:
- **Stat cards** — Total Requests, Pending, In Progress, Completed, Rejected (with icons and colours)
- **Area Chart** — Monthly request volume for the current year (uses Recharts `AreaChart`)
- **Pie Chart** — Distribution of requests by status (uses Recharts `PieChart`)
- **Recent Requests table** — last 5 requests with status badges and links to detail page
- **Technician Performance section** (if admin) — shows each tech's completed vs total

### Color mappings:
```ts
const STATUS_COLORS = {
  PENDING: "#f59e0b",    // amber
  ASSIGNED: "#0ea5e9",   // sky blue
  IN_PROGRESS: "#8b5cf6", // purple
  COMPLETED: "#10b981",  // emerald
  REJECTED: "#ef4444",   // red
};
```

---

## 23. `requests/pages/index.tsx`

**Path:** `src/team-modules/requests/pages/index.tsx`

The **All Requests page** at `/app/requests`. Admin view of every request in the system.

### Features:
- **Paginated table** — 10 requests per page with Previous/Next buttons
- **Search** — searches across title, description, location (debounced with state)
- **Status filter** — dropdown to filter by PENDING, ASSIGNED, etc.
- **View button** — links to the request detail page
- **Assign Technician dialog** — opens when admin clicks assign; shows a dropdown of all available technicians
- **Delete button** — removes a request with confirmation toast

### Status & Priority colour maps
Hardcoded colour lookup objects map each status/priority value to Tailwind background + text colour classes.

---

## 24. `requests/pages/create.tsx`

**Path:** `src/team-modules/requests/pages/create.tsx`

The **Create Request page** at `/app/requests/create`. Used by Requesters and Admins.

### Form Fields (validated with Zod):
- `title` — min 5 characters
- `description` — min 10 characters
- `category` — one of 10 preset options (Electrical, Plumbing, HVAC, etc.)
- `location` — required text field
- `priority` — radio-style card buttons (Low / Medium / High / Urgent), each styled with matching colour

### Image Upload
- Drag-and-drop area or click-to-select
- Shows a live preview of the selected image
- On submit, the image is included in a `FormData` object alongside all other fields

### On submit:
1. Zod validates the form
2. Creates `FormData` and appends all fields
3. Calls `requestsAPI.create(formData)` → POST `/requests` (multipart)
4. On success, navigates to the request detail page

---

## 25. `requests/pages/detail.tsx`

**Path:** `src/team-modules/requests/pages/detail.tsx`

The **Request Detail page** at `/app/requests/:id`. The most feature-rich page in the app (~590 lines).

### What it shows:
- Full request info: title, description, category, location, priority badge, status badge
- **Progress tracker** — visual steps: PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
- **Issue photo** (if uploaded)
- **Completion photo + repair notes** (if marked as completed)
- **Assigned technician** info with avatar
- **Comment thread** — all comments chronologically with author, time, delete option
- **Comment input** — text area + send button for anyone to add a comment

### Dialogs (modals) available to admin:
- **Assign Technician** — shows dropdown of technicians
- **Update Status** — update to IN_PROGRESS or COMPLETED with repair notes + completion image upload

### What each role can do:

| Action | ADMIN | TECHNICIAN | REQUESTER |
|---|---|---|---|
| View details | ✅ | ✅ | ✅ |
| Assign technician | ✅ | ❌ | ❌ |
| Update status | ✅ | ✅ | ❌ |
| Add comment | ✅ | ✅ | ✅ |
| Delete own comment | ✅ | ✅ | ✅ |
| Delete any comment | ✅ | ❌ | ❌ |

---

## 26. `requests/pages/my-requests.tsx`

**Path:** `src/team-modules/requests/pages/my-requests.tsx`

The **My Requests page** at `/app/requests/my`. For Requesters to track their own submissions.

### Features:
- Fetches requests with `requestsAPI.getMyRequests()`
- Shows requests as **cards** (not a table), each with title, category, location, status badge, priority border colour
- "New Request" button in the top right
- Each card links to the detail page via `<Link to={/app/requests/${id}}>`
- Empty state message if no requests exist

---

## 27. `requests/pages/assigned.tsx`

**Path:** `src/team-modules/requests/pages/assigned.tsx`

The **Assigned Requests page** at `/app/requests/assigned`. For Technicians.

### Features:
- Fetches with `requestsAPI.getAssignedRequests()`
- Shows cards similar to My Requests
- Each card has action buttons:
  - **Start Work** — opens a dialog to change status to `IN_PROGRESS`
  - **Mark Complete** — opens a dialog to add repair notes + completion photo and change status to `COMPLETED`
- On status update, invalidates `assigned-requests` query to refresh the list

---

## 28. `notifications-reports/pages/Notifications.tsx`

**Path:** `src/team-modules/notifications-reports/pages/Notifications.tsx`

The **Notifications page** at `/app/notifications`.

### Helper functions:
- `getNotificationIcon(title)` — picks a different icon based on the notification title keywords (assign, comment, complete, reject, etc.)
- `getNotificationColor(title)` — picks a colour theme similarly
- `timeAgo(dateStr)` — converts a timestamp into a human-readable relative time ("5m ago", "2h ago", "3d ago")

### Features:
- Lists all notifications for the logged-in user, newest first
- Each notification shows: icon, title, message, relative time, read/unread indicator
- **Mark as Read** button on each unread notification
- **Mark All as Read** button at the top
- Unread notifications have a highlighted background
- Both mutations invalidate both `all-notifications` and `notifications-count` queries

---

## 29. `notifications-reports/pages/Reports.tsx`

**Path:** `src/team-modules/notifications-reports/pages/Reports.tsx`

The **Reports page** at `/app/reports`. Admin-only analytics view with charts.

### Data fetched:
- `dashboard-stats` — summary numbers
- `monthly-requests` — 12-month data
- `request-status` — status distribution
- `technicians` report — technician performance

### Charts used (Recharts):
- **Bar Chart** — monthly request volume
- **Area Chart** — request trend over time
- **Pie Chart** — status distribution

### Custom tooltip:
```tsx
const CustomTooltip = ({ active, payload, label }) => {
  // Shows a styled card on chart hover with the data point values
};
```

### Download button
A "Download Report" button (currently decorative) that would export data.

### Stat summary cards
Shows Total Requests, Active (pending+assigned+in_progress), Completed, and Total Users at the top.

---

## 🔗 How the Frontend Layers Connect

```
Browser URL
    ↓
Router (app/router)          — picks which page to render
    ↓
ProtectedRoute / GuestRoute  — checks if user is logged in
    ↓
DashboardLayout (app/layouts) — renders sidebar + header + <Outlet>
    ↓
Page Component (team-modules) — the actual page content
    ↓
services/api.ts               — calls the backend API via Axios
    ↓
services/axios.ts             — adds JWT token to every request
    ↓
app/store (Zustand)           — holds the logged-in user + token
    ↓
components/ui                 — reusable buttons, cards, dialogs
    ↓
index.css                     — CSS variables, animations, utilities
```

---

*Generated by Antigravity · Maintain-Pro Frontend Documentation*
