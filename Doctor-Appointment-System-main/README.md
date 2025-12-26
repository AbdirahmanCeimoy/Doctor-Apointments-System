# Doctor Appointment System 🏥

A comprehensive full-stack web application for managing doctor appointments with role-based access control for patients, doctors, and administrators. This project was developed as part of the **SomnoG 8** coding challenge and achieved **Top 3 Winners** status! 🏆

## 🎯 Project Overview

The Doctor Appointment System is a modern, responsive web application that streamlines the appointment booking process for healthcare facilities. It provides separate dashboards and functionalities for three distinct user roles: **Patients**, **Doctors**, and **Administrators**.

## 🏆 Achievement

**Top 3 Winners** - This project was recognized as one of the top 3 winners in the **SomnoG 8** coding challenge! 🎉

## 🛠️ Technologies Used

### Frontend
- **Next.js 16** - React framework with server-side rendering and routing
- **React 19** - UI library for building interactive user interfaces
- **TypeScript** - Type-safe JavaScript for better code quality
- **Tailwind CSS 4** - Utility-first CSS framework for styling
- **Radix UI** - Accessible component primitives
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-select` - Select components
  - `@radix-ui/react-tabs` - Tab navigation
  - `@radix-ui/react-checkbox` - Checkbox components
- **Recharts** - Chart library for data visualization
- **Lucide React** - Icon library
- **date-fns** - Date utility library
- **clsx** & **tailwind-merge** - Utility functions for conditional styling

### Backend
- **NestJS 11** - Progressive Node.js framework for building efficient server-side applications
- **TypeScript** - Type-safe development
- **Prisma 7** - Next-generation ORM for database management
- **PostgreSQL** - Relational database
- **class-validator** - Decorator-based validation
- **class-transformer** - Object transformation utilities
- **Express** - Web application framework (via NestJS platform)
- **Jest** - Testing framework
- **ESLint** - Code linting and quality assurance

### Development Tools
- **Postman** - API testing and documentation
- **Git** - Version control
- **Node.js** - JavaScript runtime

## ✨ Features

### 👤 Patient Features
- **User Registration & Authentication** - Secure signup and login
- **Dashboard** - View appointment statistics and analytics
  - Total appointments overview
  - Pending, active, and completed appointments tracking
  - Visual charts and progress indicators
- **Browse Doctors** - Search and view available doctors with their profiles
- **View Doctor Availability** - Check doctor time slots and availability
- **Book Appointments** - Schedule appointments with preferred doctors
- **Manage Appointments** - View, update, and cancel appointments
- **Profile Management** - Update personal information and profile details

### 👨‍⚕️ Doctor Features
- **Doctor Registration** - Create doctor account with profile setup
- **Dashboard** - Comprehensive appointment analytics
  - Appointment statistics (total, pending, confirmed, completed)
  - Visual data representation with charts
  - Performance tracking
- **Profile Management** - Manage doctor profile including:
  - Specialization
  - Qualifications
  - Experience
  - Consultation fees
  - Bio and license information
- **Time Slot Management** - Create and manage available time slots
  - Set weekly availability
  - Configure start and end times
  - Enable/disable time slots
- **Appointment Management** - View and manage patient appointments
  - Accept or reject appointments
  - Update appointment status
  - Add notes and symptoms
  - Cancel appointments with reasons

### 👨‍💼 Admin Features
- **Comprehensive Dashboard** - System-wide analytics and insights
  - Total appointments overview
  - Appointment status breakdown
  - Visual charts and statistics
  - System performance metrics
- **User Management** - Full CRUD operations for all users
  - Create, read, update, and delete users
  - Manage user roles (Patient, Doctor, Admin)
  - View user profiles and information
- **Doctor Management** - Manage doctor profiles
  - Add new doctors
  - Edit doctor information
  - View all doctor profiles
  - Delete doctor accounts
- **Appointment Management** - Oversee all appointments
  - View all appointments across the system
  - Create appointments on behalf of users
  - Edit appointment details
  - Cancel appointments
  - Monitor appointment statuses
- **Time Slot Management** - Manage time slots for all doctors
  - View all time slots
  - Create time slots for doctors
  - Edit and delete time slots

### 🔒 Security & Authentication
- Role-based access control (RBAC)
- Secure authentication system
- Route guards for protected pages
- Input validation and sanitization




## 📁 Project Structure

```
doctor-apoitment-system/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── admin/          # Admin module
│   │   │   ├── appointment/    # Appointment management
│   │   │   ├── doctor-profile/ # Doctor profile management
│   │   │   ├── time-slot/      # Time slot management
│   │   │   └── users/          # User management
│   │   ├── prisma/             # Prisma service
│   │   └── generated/          # Generated Prisma client
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   └── postman/                # API documentation
│
└── frontend/
    ├── app/
    │   ├── admin/              # Admin pages
    │   ├── doctor/             # Doctor pages
    │   ├── patient/            # Patient pages
    │   ├── login/              # Authentication
    │   └── signup/             # User registration
    ├── components/
    │   ├── admin/              # Admin components
    │   ├── doctor/             # Doctor components
    │   ├── patient/            # Patient components
    │   ├── comman/             # Shared components
    │   └── ui/                 # UI components
    └── lib/                    # Utilities and API clients
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doctor-apoitment-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Set up environment variables
   # Create a .env file with:
   # DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   # PORT=3000
   
   # Run database migrations
   npx prisma migrate dev
   
   # Generate Prisma client
   npx prisma generate
   
   # Start the backend server
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

## 📝 API Documentation

The API documentation is available in the `backend/postman/` directory. Import the Postman collection to explore all available endpoints:

- **Users API** - User management endpoints
- **Doctor Profiles API** - Doctor profile management
- **Time Slots API** - Time slot management
- **Appointments API** - Appointment management

## 🗄️ Database Schema

The system uses PostgreSQL with the following main entities:
- **Users** - User accounts with roles (Patient, Doctor, Admin)
- **Doctor Profiles** - Doctor-specific information
- **Time Slots** - Doctor availability schedules
- **Appointments** - Appointment records with status tracking

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test
npm run test:e2e

# Frontend linting
cd frontend
npm run lint
```

## 📦 Build for Production

```bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm start
```

## 🤝 Contributing

This project was developed as part of the **SomnoG 8** coding challenge. Contributions and improvements are welcome!

## 📄 License

This project is private and unlicensed.

## 👥 Authors

Developed as part of the **SomnoG 8** coding challenge - **Top 3 Winners** 🏆

---

**Note**: This project demonstrates full-stack development skills with modern technologies, clean architecture, and comprehensive features for a healthcare appointment management system.

