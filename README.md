# 🏫 Campus Resource Management System

A modern, full-stack web application designed to streamline campus resource management for educational institutions. Built with Next.js, Express.js, and MongoDB, this platform enables students to browse and request resources while providing administrators with powerful management tools.

## 📋 Project Overview

The Campus Resource Management System is a comprehensive platform that bridges the gap between students and campus resources. Students can easily discover available resources, submit requests, and track their status in real-time. Administrators have access to powerful tools for managing resources, handling requests, and providing support.

### Key Features

- **🔍 Resource Discovery**: Intuitive browsing and search functionality for campus resources
- **📝 Request Management**: Streamlined request submission and tracking system
- **👥 User Management**: Role-based access control (Students and Administrators)
- **📊 Admin Dashboard**: Comprehensive administrative tools and analytics
- **💬 Support System**: Built-in support ticket system for user assistance
- **📱 Responsive Design**: Mobile-first design that works on all devices
- **🔐 Secure Authentication**: JWT-based authentication with secure session management
- **⚡ Real-time Updates**: Instant notifications for request status changes

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Context** - State management for authentication
- **Lucide React** - Modern icon library

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe server development
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing and security
- **Express Validator** - Input validation and sanitization

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **tsx** - TypeScript execution for development
- **MongoDB Memory Server** - In-memory database for testing

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/tuyy-99/campus-resource-management.git
cd campus-resource-management
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

### 3. Environment Configuration

#### Backend Environment Setup

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Configure your backend environment variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/campus-resources
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-resources

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_ORIGIN=http://localhost:3000
```

#### Frontend Environment Setup

Create environment files in the `frontend` directory:

```bash
cd frontend
cp .env.example .env.local
```

Configure your frontend environment variables:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The application will automatically create the database

#### Option B: MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env`

### 5. Create Admin User

Create an initial admin user:

```bash
cd backend
npm run create-admin
```

Follow the prompts to create your admin account.

### 6. Start the Application

#### Development Mode

Start the backend server:
```bash
cd backend
npm run dev
```

In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

#### Production Mode

Build and start the backend:
```bash
cd backend
npm run build
npm start
```

Build and start the frontend:
```bash
cd frontend
npm run build
npm start
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## 📱 Application Screenshots

### Home Page
*Modern landing page with gradient design and feature highlights*

![Uploading screencapture-localhost-3000-2026-02-03-08_59_37.png…]()

![Uploading screencapture-localhost-3000-2026-02-03-09_09_15.png…]()


### User Dashboard
*Clean, intuitive dashboard for students to manage their requests*

![User Dashboard](docs/screenshots/user-dashboard.png)

### Admin Panel
*Comprehensive administrative interface for resource and request management*

![Admin Dashboard](docs/screenshots/admin-dashboard.png)

### Mobile Responsive Design
*Fully responsive design that works seamlessly on all devices*

![Mobile View](docs/screenshots/mobile-responsive.png)

## 🔧 Available Scripts

### Root Directory
```bash
npm install          # Install all dependencies
```

### Backend (`/backend`)
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start           # Start production server
npm run create-admin # Create admin user
```

### Frontend (`/frontend`)
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start          # Start production server
```

## 📁 Project Structure

```
campus-resource-management/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── config/         # Database and environment configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # MongoDB/Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript type definitions
│   │   └── utils/          # Utility functions
│   ├── scripts/            # Utility scripts
│   └── package.json
├── frontend/               # Next.js React application
│   ├── src/
│   │   ├── app/           # Next.js App Router pages
│   │   ├── components/    # Reusable React components
│   │   ├── lib/          # Utility libraries
│   │   └── types/        # TypeScript type definitions
│   └── package.json
└── README.md
```

## 🔐 Authentication & Authorization

The application uses JWT-based authentication with the following roles:

- **USER**: Students who can browse resources and submit requests
- **ADMIN**: Administrators who can manage resources, users, and requests

### Protected Routes

- `/dashboard` - User dashboard (USER role required)
- `/admin/*` - Admin panel (ADMIN role required)
- `/requests` - User requests (USER role required)

## 🌟 Key Features Explained

### Resource Management
- Create, read, update, and delete resources
- File upload support for resource attachments
- Category-based organization
- Availability status tracking

### Request System
- Submit requests for specific resources
- Track request status (pending, approved, rejected)
- Admin approval workflow
- Request history and analytics

### User Management
- Secure user registration and authentication
- Role-based access control
- Profile management
- Password security with bcrypt hashing

### Support System
- Built-in support ticket system
- User-friendly help documentation
- Contact forms and assistance requests

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start with: `npm start`
4. Ensure MongoDB is accessible from production environment

### Frontend Deployment
1. Update `NEXT_PUBLIC_API_URL` to production API URL
2. Build the application: `npm run build`
3. Deploy using platforms like Vercel, Netlify, or traditional hosting

### Recommended Hosting Platforms
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Railway, Render, DigitalOcean, AWS EC2
- **Database**: MongoDB Atlas, AWS DocumentDB

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Built with modern web technologies and best practices
- Designed with user experience and accessibility in mind
- Inspired by the need for efficient campus resource management

---

**Made with ❤️ for educational institutions worldwide**
