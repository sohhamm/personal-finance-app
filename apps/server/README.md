# Personal Finance App - Express TypeScript API

A modern, secure, and scalable REST API for personal finance management built with Express, TypeScript, and PostgreSQL.

## Features

- **Authentication & Security**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Rate limiting
  - Input validation
  - CORS protection
  - Security headers with Helmet

- **Transaction Management**
  - CRUD operations for transactions
  - Pagination, filtering, and sorting
  - Category-based organization
  - Search functionality
  - Transaction statistics

- **Budget Management**
  - Create and manage budgets by category
  - Track spending against budgets
  - Budget progress monitoring
  - Latest transactions per budget

- **Savings Pots**
  - Create savings goals
  - Add/withdraw money
  - Track progress toward targets
  - Visual progress indicators

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens
- **Validation**: express-validator
- **Security**: helmet, cors, rate limiting
- **Logging**: Custom logger with structured logging

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration.

4. Set up the database:
   ```bash
   # Create PostgreSQL database
   createdb personal_finance_db
   
   # Run migrations
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Transactions
- `GET /api/transactions` - Get transactions (with pagination, filtering, sorting)
- `GET /api/transactions/:id` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/categories` - Get available categories
- `GET /api/transactions/stats` - Get transaction statistics

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get budget by ID
- `GET /api/budgets/:id/spending` - Get budget with spending details
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Pots (Savings)
- `GET /api/pots` - Get all pots
- `GET /api/pots/:id` - Get pot by ID
- `GET /api/pots/:id/progress` - Get pot progress
- `POST /api/pots` - Create new pot
- `PUT /api/pots/:id` - Update pot
- `DELETE /api/pots/:id` - Delete pot
- `POST /api/pots/:id/add` - Add money to pot
- `POST /api/pots/:id/withdraw` - Withdraw money from pot

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:push` - Push schema changes to database

### Project Structure

```
src/
├── controllers/     # Route handlers
├── db/             # Database schema and connection
├── middleware/     # Express middleware
├── routes/         # Route definitions
├── services/       # Business logic
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Environment Variables

See `.env.example` for all required environment variables.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (configurable)
- Input validation and sanitization
- CORS protection
- Security headers
- SQL injection prevention with parameterized queries

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License