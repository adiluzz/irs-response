# Authentication System

This project now includes a complete user authentication system with the following features:

## Features

- ✅ User signup with email verification
- ✅ Login/Logout functionality
- ✅ Password reset via email
- ✅ Protected API routes
- ✅ Session management with NextAuth.js
- ✅ MongoDB database integration

## Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taxletters
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taxletters

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32

# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-specific-password

# Email Configuration
EMAIL_FROM=noreply@taxletters.com
EMAIL_FROM_NAME=Tax Letters System
```

### 2. Generate NextAuth Secret

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

### 3. Gmail App Password Setup

1. Go to your Google Account settings
2. Navigate to Security > 2-Step Verification
3. Under "App passwords", generate a new app password for "Mail"
4. Use this password in `GMAIL_APP_PASSWORD`

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

## API Routes

### Authentication Routes (Public)

- `POST /api/auth/signup` - Create a new user account
- `GET /api/auth/verify-email?token=...` - Verify email address
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Protected Routes

All API routes under `/api/` (except auth routes) are protected by default via middleware.

**Example:**
```typescript
import { requireAuthApi } from '@/lib/utils/apiAuth';

export async function GET() {
  const session = await requireAuthApi();
  // Your protected logic here
  return NextResponse.json({ user: session.user });
}
```

## Pages

- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/auth/forgot-password` - Forgot password page
- `/auth/reset-password?token=...` - Reset password page
- `/auth/error` - Error page

## Usage in Components

### Client Components

```typescript
import { useSession, signIn, signOut } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Not authenticated</div>;
  
  return <div>Logged in as {session.user.email}</div>;
}
```

### Server Components

```typescript
import { getSession } from '@/lib/utils/auth';
import { redirect } from 'next/navigation';

export default async function MyPage() {
  const session = await getSession();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  return <div>Welcome {session.user.email}</div>;
}
```

## Middleware Protection

The middleware automatically protects all API routes except:
- `/api/auth/signup`
- `/api/auth/verify-email`
- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/auth/[...nextauth]`

To add more protected routes, update `middleware.ts`.

## Database Schema

The User model includes:
- `email` (unique, required)
- `password` (hashed, required)
- `name` (optional)
- `emailVerified` (boolean)
- `emailVerificationToken` (string)
- `emailVerificationExpires` (date)
- `resetPasswordToken` (string)
- `resetPasswordExpires` (date)
- `createdAt`, `updatedAt` (timestamps)

## Security Features

- Passwords are hashed using bcryptjs
- Email verification tokens expire after 24 hours
- Password reset tokens expire after 1 hour
- JWT-based sessions with 30-day expiration
- API routes protected by middleware
- Secure password requirements (minimum 6 characters)
