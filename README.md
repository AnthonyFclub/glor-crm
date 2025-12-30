# GLOR CRM Dashboard 🏠

Professional Real Estate CRM for **GLOR Bienes Raíces** - Gloria & Anthony Morales

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4 (custom GLOR branding)
- **Database**: Supabase (PostgreSQL + Auth + Real-time)
- **Email**: Resend API
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Drag & Drop**: DnD Kit

## 🎨 Brand Colors

- **Primary (Navy Blue)**: `#1e3a8a`
- **Secondary (Gold)**: `#fbbf24`
- **Success**: `#10b981`
- **Warning**: `#f59e0b`
- **Danger**: `#ef4444`

## 📋 Features (In Progress)

### ✅ Completed
- [x] Authentication system (login, password recovery)
- [x] Route protection middleware
- [x] Dashboard layout (sidebar + header)
- [x] Dashboard page with KPIs and widgets
- [x] Database schema (8 tables)
- [x] TypeScript types
- [x] Utility functions

### 🔄 In Progress
- [ ] Contact management (CRUD)
- [ ] Activity logging
- [ ] Deal pipeline (Kanban)
- [ ] Property management
- [ ] Email automation
- [ ] Reports & Analytics

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your **Project URL** and **Anon Key**

### 3. Configure Environment Variables

Create `.env.local` file:

```bash
cp env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
RESEND_API_KEY=your-resend-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Run Database Schema

1. Open Supabase Dashboard → **SQL Editor**
2. Copy contents of `supabase/schema.sql`
3. Paste and run the SQL script
4. This creates:
   - 8 tables (contacts, activities, deals, properties, etc.)
   - Automated triggers
   - Row-level security policies
   - Database views
   - Default email templates

### 5. Create User Accounts

In Supabase Dashboard → **Authentication** → **Users**:

- Add Gloria's email & password
- Add Anthony's email & password

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
glor-crm/
├── app/                    # Next.js pages
│   ├── login/             # Authentication
│   ├── dashboard/         # Main dashboard
│   ├── contactos/         # Contact management
│   ├── actividades/       # Activity logging
│   ├── pipeline/          # Deal pipeline
│   ├── propiedades/       # Properties
│   ├── emails/            # Email automation
│   ├── reportes/          # Analytics
│   └── configuracion/     # Settings
├── components/
│   ├── layout/            # Sidebar, Header
│   └── ui/                # Reusable components
├── lib/
│   ├── supabase/          # DB clients
│   ├── utils/             # Helper functions
│   └── email/             # Email utilities
├── types/
│   └── database.ts        # TypeScript types
└── supabase/
    └── schema.sql         # Database schema
```

## 🗄️ Database Schema

### Core Tables

1. **contacts** - Customer database (2,200+ contacts)
2. **activities** - Activity log (calls, meetings, showings)
3. **deals** - Sales pipeline (7 stages)
4. **properties** - Property inventory
5. **email_templates** - Automated email templates
6. **email_history** - Email tracking
7. **notifications** - System notifications
8. **activity_logs** - Audit trail

## 📧 Email Automation (Coming Soon)

Automated emails for:
- 🎂 Birthdays (9 AM on birthday)
- 🏠 Anniversaries (9 AM on anniversary)
- 📞 Follow-ups (90 days inactive)
- 📑 Rent renewals (60, 30, 7 days before)

## 👥 Users

- **Gloria Morales** - Real Estate Agent (70% commission)
- **Anthony Morales** - Tech Partner (30% commission)

## 📊 Dashboard Widgets

- Total Contacts: 2,200+
- Active Deals: Real-time count
- Revenue MTD: Monthly tracking
- Pending Follow-ups: Alert system
- Today's Activities: Daily log
- Upcoming Birthdays (7 days)
- Upcoming Anniversaries (30 days)
- Rent Renewals (60 days)
- Deal Pipeline: Visual funnel
- Recent Contacts: Last 10 added/modified

## 🔒 Security

- ✅ Supabase authentication
- ✅ Route protection middleware
- ✅ Row-level security (RLS)
- ✅ Session management (30-min auto-logout)
- ✅ Activity audit logging
- ✅ HTTPS only (production)

## 🚀 Deployment (Future)

Deploy to **Vercel**:

```bash
npm install -g vercel
vercel
```

Configure:
- Custom domain: `crm.glorbienes raices.com` or `app.glorbienes raices.com`
- Environment variables from `.env.local`
- Supabase production database

## 📝 License

Private project for GLOR Bienes Raíces

---

**Built with 💙 for Gloria & Anthony Morales**
