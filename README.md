# Multi-Tenant Blog Platform

A modern, full-stack multi-tenant blog platform built with Next.js 15, Clerk authentication, and Drizzle ORM. Each organization gets its own subdomain and isolated blog environment.

![Platform Overview](public/ss1.png)

## 🚀 Features

### Multi-Tenancy
- **Subdomain Routing**: Each organization gets its own subdomain (e.g., `tenant.yourdomain.com`)
- **Isolated Content**: Blog posts are completely isolated per organization
- **Custom Branding**: Each organization can have its own branding and identity

### Authentication & Authorization
- **Clerk Integration**: Secure authentication with social logins
- **Organization Management**: Create and manage organizations
- **Role-Based Access**: Different permission levels for organization members
- **Member Verification**: Only organization members can create posts

### Blog Management
- **Rich Content Creation**: Create and publish blog posts with ease
- **Real-time Publishing**: Instant publishing to organization subdomains
- **Responsive Design**: Mobile-first, responsive blog layouts
- **SEO Optimized**: Clean URLs and meta tags for better search visibility

### Developer Experience
- **TypeScript**: Full type safety throughout the application
- **Modern Stack**: Next.js 15 with App Router
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components

## 📸 Screenshots

### Organization Dashboard
![Organization Dashboard](public/ss2.png)

### Blog Creation Interface
![Blog Interface](public/ss3.png)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Clerk
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)

## 🏗️ Project Structure

\`\`\`
app/
├── (auth)/                 # Authentication routes
│   ├── sign-in/
│   └── sign-up/
├── (root)/                 # Main application routes
├── (subdomain)/            # Subdomain-specific routes
│   └── s/[subdomain]/      # Dynamic subdomain routing
│       ├── page.tsx        # Subdomain blog homepage
│       ├── create/         # Blog post creation
│       ├── blog/[id]/      # Individual blog posts
│       └── actions.ts      # Server actions
├── org/                    # Organization management
│   ├── page.tsx           # Organization selection
│   └── [slug]/            # Organization dashboard
├── globals.css
├── layout.tsx
└── page.tsx               # Landing page

components/
├── ui/                    # shadcn/ui components
├── Navbar.tsx            # Navigation component
└── ...

lib/
├── utils.ts              # Utility functions
└── ...

db/
├── schema.ts             # Database schema
└── index.ts              # Database connection
\`\`\`

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd multi-tenant-blog
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Fill in your environment variables:
   \`\`\`env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/blog_db"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

   # Domain Configuration
   NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   npm run db:push
   \`\`\`

5. **Configure local subdomains (for development)**
   
   Add entries to your \`/etc/hosts\` file:
   \`\`\`
   127.0.0.1 tenant1.localhost
   127.0.0.1 tenant2.localhost
   127.0.0.1 myorg.localhost
   \`\`\`

6. **Start the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Visit the application**
   - Main site: \`http://localhost:3000\`
   - Subdomain example: \`http://tenant1.localhost:3000\`

## 🔧 Configuration

### Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Enable organizations in your Clerk dashboard
3. Configure your environment variables
4. Set up organization creation and management

### Database Schema

The application uses the following main tables:

\`\`\`sql
-- Organizations are managed by Clerk
-- Blog posts table
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(80) NOT NULL,
  body TEXT NOT NULL,
  org_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Subdomain Configuration

For production deployment:

1. **DNS Setup**: Configure wildcard DNS (\`*.yourdomain.com\`)
2. **SSL Certificates**: Set up wildcard SSL certificates
3. **Environment Variables**: Update \`NEXT_PUBLIC_ROOT_DOMAIN\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Set up custom domain** with wildcard DNS
4. **Deploy** - Vercel handles the rest!

### Environment Variables for Production

\`\`\`env
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_ROOT_DOMAIN=yourdomain.com
\`\`\`

## 🎯 Usage

### Creating an Organization

1. Sign up or sign in to the platform
2. Navigate to the organization section
3. Create a new organization with a unique slug
4. Your organization will be accessible at \`slug.yourdomain.com\`

### Managing Blog Posts

1. Access your organization dashboard
2. Click "Create Post" to write new content
3. Posts are immediately published to your subdomain
4. Share your subdomain URL with your audience

### Team Collaboration

1. Invite team members to your organization
2. Assign appropriate roles (admin, member, etc.)
3. Team members can create posts for the organization
4. All posts are attributed to the organization

## 🔒 Security Features

- **Authentication Required**: All blog creation requires authentication
- **Organization Membership**: Users can only create posts for organizations they belong to
- **Role-Based Access**: Different permission levels for different roles
- **Data Isolation**: Complete separation of data between organizations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Clerk](https://clerk.com/) for authentication
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Drizzle ORM](https://orm.drizzle.team/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

Built with ❤️ using Next.js 15 and modern web technologies.
