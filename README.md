# Finyomatic - Financial Management App

A modern financial management application built with Next.js, featuring traditional username/email and password authentication using Auth.js (NextAuth.js).

## Features

- 🔐 **Traditional Authentication**: Email/password sign-up and sign-in
- 🛡️ **Secure Password Handling**: Bcrypt hashing with salt rounds
- ✅ **Form Validation**: Client and server-side validation using Zod
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🗄️ **Database Integration**: PostgreSQL with Drizzle ORM
- 🔄 **Session Management**: JWT-based sessions with Auth.js
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Authentication**: Auth.js (NextAuth.js) v5
- **Database**: PostgreSQL with Drizzle ORM
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd finyomatic
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/finyomatic"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

4. **Set up the database**

   ```bash
   # Generate migration files
   npx drizzle-kit generate

   # Run migrations
   npx drizzle-kit migrate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication Flow

### Sign Up Process

1. User visits `/auth/signup`
2. Fills out the registration form (name, email, password, confirm password)
3. Client-side validation using Zod schema
4. Form submission to `/api/auth/signup`
5. Server-side validation and password hashing
6. User creation in database
7. Redirect to sign-in page

### Sign In Process

1. User visits `/auth/signin`
2. Enters email and password
3. Client-side validation
4. Form submission to Auth.js credentials provider
5. Server-side credential verification
6. Session creation and JWT token generation
7. Redirect to dashboard or callback URL

### Protected Routes

- `/dashboard` - Requires authentication
- Unauthenticated users are redirected to `/auth/signin`

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/
│   │       │   └── route.js          # Auth.js API routes
│   │       └── signup/
│   │           └── route.js          # User registration API
│   ├── auth/
│   │   ├── signin/
│   │   │   └── page.js               # Sign-in page
│   │   └── signup/
│   │       └── page.js               # Sign-up page
│   ├── dashboard/
│   │   └── page.js                   # Protected dashboard
│   ├── components/
│   │   └── layout/
│   │       └── Header.js             # Navigation header
│   ├── globals.css                   # Global styles
│   ├── layout.js                     # Root layout
│   ├── page.js                       # Home page
│   └── providers.js                  # Session provider
├── lib/
│   ├── db/
│   │   ├── index.js                  # Database connection
│   │   ├── users.js                  # User database operations
│   │   └── schema/
│   │       └── users.js              # User schema
│   └── utils/
│       ├── password.js               # Password utilities
│       └── validation.js             # Validation schemas
└── auth.js                           # Auth.js configuration
```

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **Input Validation**: Zod schemas for client and server validation
- **SQL Injection Protection**: Drizzle ORM with parameterized queries
- **Session Security**: JWT tokens with secure configuration
- **CSRF Protection**: Built-in NextAuth.js protection
- **Rate Limiting**: Can be added for production

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User sign-in (handled by Auth.js)
- `POST /api/auth/signout` - User sign-out (handled by Auth.js)

### Protected Routes

- `GET /dashboard` - User dashboard (requires authentication)

## Environment Variables

| Variable               | Description                  | Required |
| ---------------------- | ---------------------------- | -------- |
| `DATABASE_URL`         | PostgreSQL connection string | Yes      |
| `NEXTAUTH_URL`         | Your application URL         | Yes      |
| `NEXTAUTH_SECRET`      | Secret key for JWT tokens    | Yes      |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID       | No       |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret   | No       |

## Database Schema

### Users Table

```sql
CREATE TABLE "user" (
  "id" text PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" varchar(255) NOT NULL,
  "email" varchar(255) NOT NULL UNIQUE,
  "password" varchar(255),
  "image" varchar(255),
  "emailVerified" timestamp,
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now()
);
```

## Development

### Running the Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

### Database Migrations

```bash
# Generate new migration
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate

# Reset database (development only)
npx drizzle-kit drop
```

## Testing the Authentication

1. **Create a new account**:

   - Visit `/auth/signup`
   - Fill out the registration form
   - Submit and verify account creation

2. **Sign in with credentials**:

   - Visit `/auth/signin`
   - Enter your email and password
   - Verify successful authentication

3. **Access protected content**:

   - Visit `/dashboard`
   - Verify you can see the dashboard content

4. **Sign out**:
   - Click the "Sign Out" button
   - Verify you're redirected to the home page

## Production Deployment

1. **Set up production database**
2. **Configure environment variables**
3. **Set up proper SSL certificates**
4. **Configure reverse proxy (nginx/Apache)**
5. **Set up monitoring and logging**
6. **Enable rate limiting**
7. **Configure backup strategies**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.
