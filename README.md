# Personal Finance App Monorepo

A full-stack personal finance application built with modern web technologies and a monorepo structure for efficient development and type sharing.

## 🏗️ Architecture

```
personal-finance-app/
├── packages/
│   └── shared-types/          # Shared TypeScript types
├── server/                    # Backend API (Bun + Express)
├── web/                       # Frontend app (React + Vite)
├── package.json              # Root workspace configuration
└── turbo.json               # Turborepo configuration
```

## 🛠️ Tech Stack

### Backend (`/server`)
- **Runtime**: Bun
- **Framework**: Express.js
- **Database**: PostgreSQL with Bun's native SQL
- **Authentication**: JWT
- **Validation**: Express Validator + Zod
- **Code Quality**: Biome (linting + formatting)

### Frontend (`/web`)
- **Framework**: React 19
- **Build Tool**: Vite
- **Routing**: TanStack Router
- **State Management**: Zustand
- **Data Fetching**: TanStack Query + Axios
- **Forms**: TanStack Form + Zod
- **Styling**: CSS Modules
- **Code Quality**: Biome (linting + formatting)

### Shared (`/packages/shared-types`)
- **Language**: TypeScript
- **Purpose**: Shared type definitions between frontend and backend
- **Build**: TypeScript compiler

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (latest version)
- PostgreSQL database
- Node.js 18+ (for compatibility)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd personal-finance-app
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   
   Create `.env` files in the server directory:
   ```bash
   # server/.env
   DATABASE_URL=postgresql://username:password@localhost:5432/personal_finance
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   PORT=3000
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   cd server
   bun run db:migrate
   ```

5. **Build shared types**
   ```bash
   bun run build:types
   ```

## 🏃 Development

### Start all services
```bash
bun run dev
```
This will start both the backend server and frontend development server concurrently.

### Start services individually
```bash
# Start backend only
bun run dev:server

# Start frontend only  
bun run dev:web

# Build and watch shared types
cd packages/shared-types
bun run dev
```

## 📦 Available Scripts

### Root Level
- `bun run dev` - Start all services in development mode
- `bun run build` - Build all packages and applications
- `bun run lint` - Lint all packages
- `bun run format` - Format all packages

### Backend (`/server`)
- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run start` - Start production server
- `bun run lint` - Lint TypeScript files
- `bun run format` - Format TypeScript files
- `bun run db:migrate` - Run database migrations

### Frontend (`/web`)
- `bun run dev` - Start Vite development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run lint` - Lint TypeScript/React files
- `bun run format` - Format TypeScript/React files

### Shared Types (`/packages/shared-types`)
- `bun run build` - Compile TypeScript to JavaScript
- `bun run dev` - Watch and compile on changes
- `bun run lint` - Lint TypeScript files
- `bun run format` - Format TypeScript files

## 🗂️ Shared Types Structure

The shared types package includes:

### API Types
- `ApiResponse<T>` - Standard API response wrapper
- `PaginatedResponse<T>` - Paginated data response
- `PaginationMetadata` - Pagination info
- `BaseTableQuery` - Common query parameters

### Domain Types
- **Auth**: `LoginRequest`, `SignupRequest`, `AuthResponse`, `JwtPayload`
- **User**: `User`, `UserProfile`
- **Transaction**: `Transaction`, `CreateTransactionRequest`, `TransactionQuery`, etc.
- **Budget**: `Budget`, `CreateBudgetRequest`, `BudgetWithSpending`
- **Pot**: `Pot`, `CreatePotRequest`, `PotProgress`
- **Recurring Bills**: `RecurringBill`, `RecurringBillPayment`, etc.
- **Overview**: `OverviewData`, `MonthlyTrend`

## 🔧 Configuration

### TypeScript Configuration
Each package has its own `tsconfig.json` with appropriate settings:
- **Server**: Configured for Node.js with Bun
- **Web**: Configured for React with Vite
- **Shared Types**: Configured for library compilation

### Code Quality
All packages use Biome for consistent linting and formatting:
- Shared configuration in `biome.json`
- Consistent code style across frontend and backend
- Pre-configured rules for TypeScript and React

### Monorepo Management
- **Workspace**: Bun workspaces for dependency management
- **Turborepo**: Pipeline configuration for builds and tasks
- **Shared Dependencies**: Types package linked via workspace protocol

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration  
- `GET /api/auth/profile` - Get user profile

### Transactions
- `GET /api/transactions` - List transactions (paginated)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/:id` - Get specific transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/categories` - Get transaction categories
- `GET /api/transactions/stats` - Get transaction statistics

### Budgets
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets/:id` - Get specific budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/:id/spending` - Get budget with spending info

### Pots
- `GET /api/pots` - List pots
- `POST /api/pots` - Create pot
- `GET /api/pots/:id` - Get specific pot
- `PUT /api/pots/:id` - Update pot
- `DELETE /api/pots/:id` - Delete pot (returns money)
- `POST /api/pots/:id/add` - Add money to pot
- `POST /api/pots/:id/withdraw` - Withdraw money from pot
- `GET /api/pots/:id/progress` - Get pot progress

### Recurring Bills
- `GET /api/recurring-bills` - List recurring bills (paginated)
- `POST /api/recurring-bills` - Create recurring bill
- `GET /api/recurring-bills/:id` - Get specific recurring bill
- `PUT /api/recurring-bills/:id` - Update recurring bill
- `DELETE /api/recurring-bills/:id` - Delete recurring bill
- `PATCH /api/recurring-bills/payments/:paymentId/paid` - Mark bill as paid
- `GET /api/recurring-bills/due-soon` - Get bills due soon

### Overview
- `GET /api/overview` - Get dashboard overview data
- `GET /api/overview/monthly-trends` - Get monthly income/expense trends

## 🚢 Deployment

### Backend Deployment
```bash
cd server
bun run build
bun run start
```

### Frontend Deployment
```bash
cd web
bun run build
# Deploy the 'dist' folder to your hosting provider
```

### Docker (Optional)
Create Docker configurations for each service as needed.

## 🤝 Contributing

1. Follow the established code style (enforced by Biome)
2. Add types to the shared package when creating new APIs
3. Test both frontend and backend when making changes
4. Update this README when adding new features

## 📄 License

[Your License Here]