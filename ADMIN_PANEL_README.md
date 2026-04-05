# NavSafar Admin Panel — Production Ready

A complete, production-level admin panel with excellent UI/UX, authentication, and full CRUD operations.

## Features

### 1. Authentication System
- Secure login with email/password
- Bearer token authentication
- Session-based auth using sessionStorage
- Protected routes with automatic redirect
- Logout functionality

### 2. Dashboard (`/admin/dashboard`)
- Real-time statistics overview
- Quick stats cards:
  - Total Contacts
  - Testimonials (approved/pending/featured)
  - Tour Packages
  - Pending Messages
- Recent activity feed showing latest contacts
- Quick action cards for common tasks
- System status indicators
- Refresh functionality

### 3. Testimonials Management (`/admin/testimonials`)
- Full CRUD operations (Create, Read, Update, Delete)
- Filter by status: All, Approved, Pending, Featured
- Approve/unapprove testimonials
- Mark as featured
- Beautiful form modal for editing
- Stats display (total, approved, pending, featured)
- Avatar generation from name
- Responsive table layout

### 4. Packages Management (`/admin/packages`)
- Complete package management
- Form includes all fields:
  - Title, City, Country
  - Duration, Rating, Best Time
  - Categories (comma-separated)
  - Tourism types
  - Famous attractions
  - Image URL (supports Google Drive)
  - Tagline, Description
  - Highlights, Activities
  - Popular toggle
- Image preview with error handling
- Search functionality
- Edit existing packages with pre-filled form
- Delete with confirmation
- Grid view of packages

### 5. Contacts Management (`/admin/contacts`)
- View all customer inquiries
- Status management: Pending, Contacted, Resolved, Closed
- Priority levels: Low, Normal, High
- Search by name, email, subject, message
- Filter by status
- Detailed view modal:
  - Edit all contact fields
  - Update status/priority
  - View submission date
  - Package interest tracking
- Bulk actions support
- Visual status badges

### 6. UI/UX Features
- Modern dark theme with gradient backgrounds
- Responsive design (mobile, tablet, desktop)
- Smooth animations with Framer Motion
- Loading states with spinners
- Success/error notifications
- Confirmation dialogs for destructive actions
- Sidebar navigation with active states
- Collapsible mobile menu
- Custom scrollbars
- Accessible components with focus states

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS (v4)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (for testimonials)
- **File Storage**: JSON files (for packages & contacts)
- **Authentication**: Custom token-based

## Setup Instructions

### 1. Environment Variables

Create `.env.local` in the project root:

```env
# Admin Authentication
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET_TOKEN=your-random-token-here

# Supabase (for testimonials)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
PRIMARY_DOMAIN=https://yourdomain.com
```

### 2. Database Setup (Supabase)

Run this SQL in your Supabase SQL Editor to create the testimonials table:

```sql
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  avatar text,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text not null,
  trip text not null,
  location text,
  travel_date text,
  email text,
  phone text,
  is_approved boolean default false,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table testimonials enable row level security;

-- Create policy for service role to access all rows
create policy "Service role can do everything" on testimonials
  for all using (true) with check (true);

-- Index for performance
create index idx_testimonials_created_at on testimonials(created_at desc);
create index idx_testimonials_approved on testimonials(is_approved);
create index idx_testimonials_featured on testimonials(is_featured);
```

### 3. Admin Credentials

Set your admin credentials in `.env.local`:
- `ADMIN_EMAIL`: Your admin email
- `ADMIN_PASSWORD`: Strong password (min 8 chars)
- `ADMIN_SECRET_TOKEN`: Random secure token (use: `openssl rand -base64 32`)

### 4. Run the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Access admin panel
# Navigate to: http://localhost:3001/admin/login
```

### 5. File Structure

```
src/app/admin/
├── layout.jsx              # Admin layout with sidebar
├── page.jsx                # Redirects to dashboard
├── login/
│   └── page.jsx           # Login page
├── dashboard/
│   └── page.jsx           # Dashboard overview
├── testimonials/
│   └── page.jsx           # Testimonials management
├── packages/
│   └── page.jsx           # Packages management
├── contacts/
│   └── page.jsx           # Contacts management
└── globals.css            # Admin-specific styles

src/app/api/admin/
├── auth/
│   └── route.js           # Authentication endpoint
├── testimonials/
│   ├── route.js          # GET all, POST new
│   └── [id]/
│       └── route.js      # GET one, PUT, DELETE
├── packages/
│   └── route.js          # Full CRUD for packages
└── contacts/
    └── route.js          # Full CRUD for contacts

src/app/components/admin/
├── Sidebar.jsx            # Navigation sidebar
└── ProtectedRoute.jsx    # Auth guard component
```

## API Endpoints (Protected)

All admin API endpoints require `Authorization: Bearer <ADMIN_SECRET_TOKEN>` header.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/auth` | POST | Login (no auth required) |
| `/api/admin/testimonials` | GET | Fetch all testimonials (with filter) |
| `/api/admin/testimonials` | POST | Create new testimonial |
| `/api/admin/testimonials/[id]` | GET | Fetch single testimonial |
| `/api/admin/testimonials/[id]` | PUT | Update testimonial |
| `/api/admin/testimonials/[id]` | DELETE | Delete testimonial |
| `/api/admin/packages` | GET | Fetch all packages |
| `/api/admin/packages` | POST | Create package |
| `/api/admin/packages` | PUT | Update package |
| `/api/admin/packages?id=X` | DELETE | Delete package |
| `/api/admin/contacts` | GET | Fetch all contacts |
| `/api/admin/contacts` | POST | Create contact (public) |
| `/api/admin/contacts` | PUT | Update contact |
| `/api/admin/contacts?id=X` | DELETE | Delete contact |

## Production Deployment Checklist

- [ ] Set strong `ADMIN_SECRET_TOKEN` in production
- [ ] Configure Supabase with proper RLS policies
- [ ] Enable HTTPS
- [ ] Set up environment variables in hosting platform
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Enable backup for JSON data files
- [ ] Set up monitoring/error tracking (e.g., Sentry)
- [ ] Test all CRUD operations
- [ ] Verify authentication works
- [ ] Test on mobile devices
- [ ] Optimize images (use CDN)
- [ ] Set up rate limiting on API endpoints
- [ ] Configure CORS properly
- [ ] Add audit logging for admin actions

## Security Considerations

1. **Change Default Credentials**: Never use default admin credentials in production
2. **Use Strong Token**: Generate a cryptographically secure random token
3. **HTTPS Only**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting on auth endpoint
5. **Audit Logs**: Consider adding audit trails for admin actions
6. **Regular Backups**: Backup JSON files and Supabase data regularly
7. **Keep Token Secret**: Never expose `ADMIN_SECRET_TOKEN` to client-side code except for auth header

## Customization

### Change Colors
Edit the gradient colors in:
- `src/app/components/admin/Sidebar.jsx`
- `src/app/admin/dashboard/page.jsx`
- `src/app/admin/login/page.jsx`

Primary colors: `amber` (#f59e0b) and `orange` (#ea580c)

### Add New Admin Pages
1. Create page in `src/app/admin/your-page/page.jsx`
2. Add navigation item in `src/app/components/admin/Sidebar.jsx`
3. Ensure ProtectedRoute wrapper is in layout

### Modify Dashboard Stats
Edit `src/app/admin/dashboard/page.jsx` to add/remove stat cards.

## Support

For issues or questions, check:
- Next.js docs: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Supabase: https://supabase.com/docs

---

**Built with ❤️ for NavSafar**
