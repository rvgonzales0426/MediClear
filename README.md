# MediClear

**Automated Hospital Discharge Management System (AHDMS)**

MediClear is a comprehensive web-based hospital management system designed to streamline and automate the patient discharge workflow. The system facilitates efficient communication between healthcare staff, tracks patient progress through discharge stages, and provides detailed analytics and reporting capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Setup](#-project-setup)
- [User Roles](#-user-roles)
- [Key Modules](#-key-modules)

## ✨ Features

### Core Functionality

- 🔐 **Role-Based Authentication** - Secure login system with nurse and doctor roles
- 👥 **Patient Management** - Complete CRUD operations for patient records
- 🔄 **Discharge Workflow Tracking** - Visual progress tracking through discharge stages
- 📊 **Analytics & Reporting** - Comprehensive reports with charts and data export
- 🔔 **Real-time Status Updates** - Live tracking of patient discharge requests
- 📱 **Responsive Design** - Mobile-friendly interface for all devices

### Advanced Features

- 📈 **Interactive Charts** - Visualize patient data with multiple chart types
- 📄 **Export Capabilities** - Generate PDF and CSV reports
- 🔍 **Advanced Search & Filters** - Filter patients by status, ward, date range
- 📝 **Inline Editing** - Quick update patient information without dialogs
- 🔐 **Navigation Guards** - Protected routes with role-based access control
- 📊 **Dashboard Widgets** - Real-time statistics and metrics

## 🛠️ Tech Stack

### Frontend Framework & Core

| Technology                                                                                                        | Purpose                 |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------- |
| ![Vue.js](https://img.shields.io/badge/Vue.js_3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)           | Frontend Framework      |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)                   | Build Tool & Dev Server |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | Core Language           |

### UI & Styling

| Technology                                                                                                                 | Purpose                      |
| -------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| ![Vuetify](https://img.shields.io/badge/Vuetify_3-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)                 | Material Design UI Framework |
| ![Material Design Icons](https://img.shields.io/badge/MDI-2196F3?style=for-the-badge&logo=material-design&logoColor=white) | Icon Library                 |

### State Management & Routing

| Technology                                                                                                    | Purpose             |
| ------------------------------------------------------------------------------------------------------------- | ------------------- |
| ![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=vue.js&logoColor=black)           | State Management    |
| ![Vue Router](https://img.shields.io/badge/Vue_Router-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white) | Client-side Routing |

### Backend & Database

| Technology                                                                                                  | Purpose                     |
| ----------------------------------------------------------------------------------------------------------- | --------------------------- |
| ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) | Backend as a Service (BaaS) |

### Data Visualization & Export

| Technology                                                                                                        | Purpose               |
| ----------------------------------------------------------------------------------------------------------------- | --------------------- |
| ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)       | Data Visualization    |
| ![vue-chartjs](https://img.shields.io/badge/vue--chartjs-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)  | Vue Chart Integration |
| ![jsPDF](https://img.shields.io/badge/jsPDF-E34F26?style=for-the-badge&logo=adobe-acrobat-reader&logoColor=white) | PDF Generation        |

### Utilities & Tools

| Technology                                                                                                     | Purpose           |
| -------------------------------------------------------------------------------------------------------------- | ----------------- |
| ![Day.js](https://img.shields.io/badge/Day.js-FF6F00?style=for-the-badge&logo=clock&logoColor=white)           | Date Manipulation |
| ![Vue3 Toastify](https://img.shields.io/badge/Toastify-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white) | Notifications     |

### Development Tools

| Technology                                                                                                  | Purpose         |
| ----------------------------------------------------------------------------------------------------------- | --------------- |
| ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)       | Code Linting    |
| ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black) | Code Formatting |
| ![OXLint](https://img.shields.io/badge/OXLint-000000?style=for-the-badge&logo=rust&logoColor=white)         | Fast Linting    |

## 🏗️ System Architecture

```
MediClear/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── auth/           # Authentication forms
│   │   ├── layout/         # Layout components (AppLayout, NavigationDrawer)
│   │   └── system/         # System-specific components (Patient tables, workflow)
│   ├── composables/        # Vue composables for shared logic
│   │   ├── usePatientOperations.js
│   │   ├── useReports.js
│   │   └── useDischargeWorkflow.js
│   ├── router/             # Vue Router configuration
│   ├── stores/             # Pinia stores (auth, patient, medical records)
│   ├── utils/              # Helper functions and validators
│   ├── views/              # Page components
│   │   ├── auth/          # Login & Register pages
│   │   ├── errors/        # Error pages (404, 403)
│   │   ├── Guest/         # Landing page
│   │   └── system/        # System pages (Dashboards, Reports, Workflows)
│   └── main.js             # Application entry point
└── public/                 # Static assets
```

## 📦 Project Setup

### Prerequisites

- Node.js (^20.19.0 or >=22.12.0)
- npm or yarn
- Supabase account

### Installation

```sh
# Clone the repository
git clone https://github.com/rvgonzales0426/MediClear.git

# Navigate to project directory
cd MediClear

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```sh
# Run development server with hot-reload
npm run dev

# Access at http://localhost:5173
```

### Production Build

```sh
# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```sh
# Run linter
npm run lint

# Format code
npm run format
```

## 👥 User Roles

### Nurse

- ✅ Add and manage patient records
- ✅ Request patient discharge
- ✅ Edit patient information
- ✅ View all patients
- ✅ Access discharge workflow
- ✅ Generate reports

### Doctor

- ✅ View assigned patients
- ✅ Approve/reject discharge requests
- ✅ View patient medical history
- ✅ Access all patient records
- ✅ Monitor discharge workflow
- ✅ View analytics and reports

## 🔑 Key Modules

### 1. Patient Management

- Complete patient CRUD operations
- Advanced search and filtering
- Patient demographics and admission details
- Medical history tracking
- Billing information
- Diagnosis records
- Vital signs monitoring

### 2. Discharge Workflow

- 4-stage discharge process tracking
  - Stage 1: Admitted
  - Stage 2: Discharge Requested (Nurse)
  - Stage 3: Approved (Doctor)
  - Stage 4: Released
- Visual progress indicators
- Days-in-process tracking
- Workflow metrics and statistics

### 3. Reports & Analytics

- Interactive charts (Doughnut, Bar, Pie, Line)
- Filter by date range, ward, status
- Real-time statistics
- Export to CSV/PDF
- Patient demographics analysis
- Admission trends over time

### 4. Authentication & Authorization

- Role-based access control (RBAC)
- Secure session management
- Protected routes with navigation guards
- Auto-redirect based on user role
- Error pages (404, 403)

## 📊 Database Schema

### Core Tables

- `patients` - Patient information and status
- `medical_history` - Patient medical history records
- `billing` - Patient billing information
- `diagnosis` - Patient diagnosis records
- `vital_signs` - Patient vital signs data
- `users` - System users (nurses, doctors)

## 🔐 Security Features

- ✅ Row Level Security (RLS) with Supabase
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ Protected API routes
- ✅ Client-side route guards
- ✅ Secure password handling

## 📱 Responsive Design

MediClear is fully responsive and optimized for:

- 🖥️ Desktop (1920px+)
- 💻 Laptop (1280px - 1920px)
- 📱 Tablet (768px - 1280px)
- 📱 Mobile (320px - 768px)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is proprietary software developed for hospital use.

---

**MediClear** - Streamlining hospital discharge processes with modern technology.
