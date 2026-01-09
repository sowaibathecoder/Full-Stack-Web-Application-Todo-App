# Full-Stack Multi-User Todo Web Application

A secure, responsive, multi-user web-based Todo application implementing all Basic, Intermediate, and Advanced level features with full persistence in Neon Serverless PostgreSQL. Users authenticate via Better Auth, receive JWT tokens, and manage only their own tasks. All operations strictly enforce user isolation.

## 🚀 Features

### Basic Features
- User authentication with email/password
- Create, read, update, delete tasks
- Mark tasks as complete/incomplete
- Secure user isolation

### Intermediate Features
- Priority levels (high, medium, low)
- Tagging system for tasks
- Search functionality
- Filter by status, priority, and tags
- Sort tasks by various fields

### Advanced Features
- Due dates with time
- Recurring tasks (daily, weekly, monthly)
- Browser notifications for due tasks
- Visual indicators for overdue tasks

### Polish Features
- Responsive design (mobile & desktop)
- Loading skeletons
- Empty states
- Success/error notifications
- Comprehensive error handling
- SEO optimization

## 🛠️ Tech Stack

### Frontend
- Next.js 16+ with App Router
- TypeScript in strict mode
- Tailwind CSS for styling
- Better Auth for authentication with JWT plugin

### Backend
- FastAPI for API
- SQLModel for ORM
- Python 3.13+
- PostgreSQL (Neon Serverless)

## 📋 Prerequisites

- Node.js 16+ for frontend
- Python 3.13+ for backend
- PostgreSQL database (Neon Serverless recommended)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone <repository-url>
cd Full-Stack-Web-Application-Todo-App
```

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-better-auth-secret-here
```

### 3. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
uv pip install requirements.txt
```

Create a `.env` file in the backend directory:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/todoapp
BETTER_AUTH_SECRET=your-better-auth-secret-here
```

### 4. Database Setup

Set up your PostgreSQL database (Neon Serverless recommended):
1. Create a new Neon project
2. Get your database connection string
3. Update the `DATABASE_URL` in your backend `.env` file

### 5. Environment Variables

Make sure to use the same `BETTER_AUTH_SECRET` in both frontend and backend environments.

### 6. Running the Application

#### Backend (in one terminal):
```bash
cd backend
uvicorn src.main:app --reload
```

#### Frontend (in another terminal):
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔐 Authentication

The application uses Better Auth with JWT tokens:
- Users can register with email and password
- JWT tokens are automatically attached to API requests
- Session management is handled by Better Auth
- All API endpoints require authentication

## 🗄️ Database Schema

### Users Table
- id: UUID (Primary Key)
- email: String (Unique)
- password_hash: String
- created_at: DateTime
- updated_at: DateTime

### Tasks Table
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to Users)
- title: String
- description: Text (Optional)
- completed: Boolean (Default: false)
- priority: String (Values: 'low', 'medium', 'high')
- tags: JSON (Array of strings)
- due_date: DateTime (Optional)
- is_recurring: Boolean (Default: false)
- recurrence_rule: String (Optional, Values: 'daily', 'weekly', 'monthly')
- created_at: DateTime
- updated_at: DateTime

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/{id}` - Get a specific task
- `PUT /api/tasks/{id}` - Update a task
- `PATCH /api/tasks/{id}` - Partially update a task
- `DELETE /api/tasks/{id}` - Delete a task
- `PATCH /api/tasks/{id}/complete` - Toggle task completion status

## 📱 Mobile Responsiveness

The application is fully responsive and works on:
- Mobile devices (iOS & Android)
- Tablets
- Desktop computers

## 🔒 Security Features

- JWT token-based authentication
- User isolation (users can only access their own tasks)
- Password hashing
- Input validation
- SQL injection prevention via ORM
- XSS prevention via framework

## 🚀 Deployment

### Frontend Deployment

#### Vercel (Recommended)
1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and connect your GitHub account
3. Import your project from GitHub
4. Set the following environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL (e.g., `https://your-app-name.up.railway.app/api`)
   - `BETTER_AUTH_URL`: Your frontend URL (e.g., `https://your-app-name.vercel.app`)
   - `BETTER_AUTH_SECRET`: A secure secret string (use the same one for backend)
5. Deploy

#### Netlify
1. Push your code to a GitHub repository
2. Go to [Netlify](https://netlify.com) and connect your GitHub account
3. Select your repository and configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `out`
4. Set environment variables in the Netlify dashboard
5. Deploy

#### Environment Variables for Frontend
- `NEXT_PUBLIC_API_URL`: URL of your backend API (e.g., `https://your-backend.com/api`)
- `BETTER_AUTH_URL`: URL of your frontend (e.g., `https://your-frontend.com`)
- `BETTER_AUTH_SECRET`: JWT secret (must match backend)

### Backend Deployment

#### Railway (Recommended)
1. Install the Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```
2. Login to Railway:
   ```bash
   railway login
   ```
3. Create a new project:
   ```bash
   railway init
   ```
4. Link your project:
   ```bash
   railway link <project-id>
   ```
5. Set environment variables in the Railway dashboard:
   - `DATABASE_URL`: PostgreSQL connection string
   - `BETTER_AUTH_SECRET`: JWT secret (must match frontend)
6. Deploy:
   ```bash
   railway up
   ```

#### Heroku
1. Install the Heroku CLI:
   ```bash
   npm install -g heroku
   ```
2. Login to Heroku:
   ```bash
   heroku login
   ```
3. Create a new app:
   ```bash
   heroku create your-app-name
   ```
4. Add PostgreSQL addon:
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```
5. Set environment variables:
   ```bash
   heroku config:set BETTER_AUTH_SECRET=your-secret
   ```
6. Deploy:
   ```bash
   git push heroku main
   ```

#### Environment Variables for Backend
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: JWT secret (must match frontend)

### Database

#### Neon Serverless PostgreSQL (Recommended)
1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Get your connection string from the dashboard
4. Use it as your `DATABASE_URL`

#### Alternative: Supabase
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Get your connection string from the dashboard
4. Use it as your `DATABASE_URL`

### Environment Variables (Both Frontend and Backend)
It's crucial that the `BETTER_AUTH_SECRET` is identical in both frontend and backend environments to ensure JWT tokens work correctly across both services.

### SSL/HTTPS
Both frontend and backend should be served over HTTPS in production for security. Most deployment platforms handle this automatically.

### Custom Domain
After deployment, you can add custom domains to both your frontend and backend:
- Frontend: Through Vercel, Netlify, or your hosting provider
- Backend: Through Railway, Heroku, or your cloud provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Issues

If you encounter any issues, please open an issue in the repository with:
- A clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment details (OS, browser, version)

## 🙏 Acknowledgments

- Next.js for the amazing React framework
- FastAPI for the Python web framework
- Better Auth for the authentication solution
- Tailwind CSS for the utility-first CSS framework
- SQLModel for the Python ORM
- The open-source community for countless helpful tools and libraries