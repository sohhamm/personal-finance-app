# Personal Finance App - Manual API Testing Guide

## Base Configuration

- **Base URL**: `http://localhost:3000/api` (adjust port as needed)
- **Content-Type**: `application/json`
- **Authentication**: Bearer token in Authorization header

## Quick Start Testing Sequence

### 1. First, test server health:

```http
GET http://localhost:3000/health
```

---

## 🔐 Authentication Tests

### Test Case 1: User Signup

**Endpoint**: `POST /api/auth/signup`

**Request**:

```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Expected Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "created_at": "2025-01-20T10:00:00.000Z",
      "updated_at": "2025-01-20T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  },
  "message": "User created successfully"
}
```

### Test Case 2: User Login

**Endpoint**: `POST /api/auth/login`

**Request**:

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Expected Response** (200 OK): Same format as signup

### Test Case 3: Get User Profile

**Endpoint**: `GET /api/auth/profile`

**Request**:

```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:00:00.000Z"
  },
  "message": "Profile retrieved successfully"
}
```

### Authentication Error Cases:

**Invalid Email Format**:

```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "invalid-email",
  "password": "SecurePass123"
}
```

Expected: 400 Bad Request with validation errors

**Weak Password**:

```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john2@example.com",
  "password": "weak"
}
```

Expected: 400 Bad Request with password requirements

**Duplicate Email**:

```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

Expected: 400 Bad Request

**Invalid Login Credentials**:

```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "WrongPassword"
}
```

Expected: 401 Unauthorized

---

## 💰 Transaction Tests

### Test Case 4: Create Income Transaction

**Endpoint**: `POST /api/transactions`

**Request**:

```http
POST http://localhost:3000/api/transactions
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "recipientSender": "Salary - Tech Corp",
  "category": "General",
  "transactionDate": "2025-01-20",
  "amount": 5000.00,
  "transactionType": "income",
  "recurring": false,
  "avatar": "https://example.com/avatar.jpg"
}
```

**Expected Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "recipientSender": "Salary - Tech Corp",
    "category": "General",
    "transactionDate": "2025-01-20T00:00:00.000Z",
    "amount": 5000.0,
    "transactionType": "income",
    "recurring": false,
    "avatar": "https://example.com/avatar.jpg",
    "userId": "user-uuid",
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:00:00.000Z"
  },
  "message": "Transaction created successfully"
}
```

### Test Case 5: Create Expense Transaction

**Request**:

```http
POST http://localhost:3000/api/transactions
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "recipientSender": "Starbucks Coffee",
  "category": "Dining Out",
  "transactionDate": "2025-01-20",
  "amount": 15.50,
  "transactionType": "expense",
  "recurring": false
}
```

### Test Case 6: Get All Transactions

**Endpoint**: `GET /api/transactions`

**Request**:

```http
GET http://localhost:3000/api/transactions?page=1&limit=10
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid-here",
        "recipientSender": "Salary - Tech Corp",
        "category": "General",
        "transactionDate": "2025-01-20T00:00:00.000Z",
        "amount": 5000.0,
        "transactionType": "income",
        "recurring": false,
        "avatar": "https://example.com/avatar.jpg",
        "userId": "user-uuid",
        "created_at": "2025-01-20T10:00:00.000Z",
        "updated_at": "2025-01-20T10:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### Test Case 7: Get Transactions with Filters

**Request**:

```http
GET http://localhost:3000/api/transactions?category=Dining Out&transactionType=expense&sortBy=amount&sortOrder=desc
Authorization: Bearer YOUR_TOKEN_HERE
```

### Test Case 8: Get Transaction Categories

**Endpoint**: `GET /api/transactions/categories`

**Request**:

```http
GET http://localhost:3000/api/transactions/categories
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "data": [
    "Entertainment",
    "Bills",
    "Groceries",
    "Dining Out",
    "Transportation",
    "Personal Care",
    "Education",
    "Lifestyle",
    "Shopping",
    "General"
  ]
}
```

### Test Case 9: Get Transaction Statistics

**Endpoint**: `GET /api/transactions/stats`

**Request**:

```http
GET http://localhost:3000/api/transactions/stats
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "totalIncome": 5000.0,
    "totalExpenses": 15.5,
    "balance": 4984.5,
    "transactionCount": 2
  }
}
```

### Test Case 10: Get Single Transaction

**Endpoint**: `GET /api/transactions/:id`

**Request**:

```http
GET http://localhost:3000/api/transactions/TRANSACTION_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

### Test Case 11: Update Transaction

**Endpoint**: `PUT /api/transactions/:id`

**Request**:

```http
PUT http://localhost:3000/api/transactions/TRANSACTION_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "amount": 20.00,
  "recipientSender": "Starbucks Coffee Updated"
}
```

### Test Case 12: Delete Transaction

**Endpoint**: `DELETE /api/transactions/:id`

**Request**:

```http
DELETE http://localhost:3000/api/transactions/TRANSACTION_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "data": null,
  "message": "Transaction deleted successfully"
}
```

---

## 💳 Budget Tests

### Test Case 13: Create Budget

**Endpoint**: `POST /api/budgets`

**Request**:

```http
POST http://localhost:3000/api/budgets
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "category": "Groceries",
  "maximum": 500.00,
  "theme": "#FF6B35"
}
```

**Expected Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "category": "Groceries",
    "maximum": 500.0,
    "theme": "#FF6B35",
    "userId": "user-uuid",
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:00:00.000Z"
  },
  "message": "Budget created successfully"
}
```

### Test Case 14: Get All Budgets

**Endpoint**: `GET /api/budgets`

**Request**:

```http
GET http://localhost:3000/api/budgets
Authorization: Bearer YOUR_TOKEN_HERE
```

### Test Case 15: Get Budget Spending Analysis

**Endpoint**: `GET /api/budgets/:id/spending`

**Request**:

```http
GET http://localhost:3000/api/budgets/BUDGET_ID_HERE/spending
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "category": "Groceries",
    "maximum": 500.0,
    "theme": "#FF6B35",
    "spent": 120.5,
    "remaining": 379.5,
    "percentageUsed": 24.1,
    "userId": "user-uuid",
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:00:00.000Z"
  }
}
```

---

## 🏺 Pot Tests

### Test Case 16: Create Pot

**Endpoint**: `POST /api/pots`

**Request**:

```http
POST http://localhost:3000/api/pots
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Vacation Fund",
  "target": 2000.00,
  "theme": "#00B4D8"
}
```

**Expected Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Vacation Fund",
    "target": 2000.0,
    "total": 0.0,
    "theme": "#00B4D8",
    "userId": "user-uuid",
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:00:00.000Z"
  },
  "message": "Pot created successfully"
}
```

### Test Case 17: Add Money to Pot

**Endpoint**: `POST /api/pots/:id/add`

**Request**:

```http
POST http://localhost:3000/api/pots/POT_ID_HERE/add
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "amount": 100.00
}
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Vacation Fund",
    "target": 2000.0,
    "total": 100.0,
    "theme": "#00B4D8",
    "userId": "user-uuid",
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:05:00.000Z"
  },
  "message": "Money added to pot successfully"
}
```

### Test Case 18: Withdraw Money from Pot

**Endpoint**: `POST /api/pots/:id/withdraw`

**Request**:

```http
POST http://localhost:3000/api/pots/POT_ID_HERE/withdraw
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "amount": 25.00
}
```

### Test Case 19: Get Pot Progress

**Endpoint**: `GET /api/pots/:id/progress`

**Request**:

```http
GET http://localhost:3000/api/pots/POT_ID_HERE/progress
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Vacation Fund",
    "target": 2000.0,
    "total": 75.0,
    "theme": "#00B4D8",
    "progressPercentage": 3.75,
    "remaining": 1925.0,
    "userId": "user-uuid",
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:10:00.000Z"
  }
}
```

---

## 📋 Recurring Bills Tests

### Test Case 20: Create Recurring Bill

**Endpoint**: `POST /api/recurring-bills`

**Request**:

```http
POST http://localhost:3000/api/recurring-bills
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Netflix Subscription",
  "amount": 15.99,
  "dueDay": 15,
  "category": "Entertainment",
  "avatar": "https://example.com/netflix-avatar.jpg"
}
```

**Expected Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "Netflix Subscription",
    "amount": 15.99,
    "dueDay": 15,
    "category": "Entertainment",
    "avatar": "https://example.com/netflix-avatar.jpg",
    "isActive": true,
    "userId": "user-uuid",
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T10:00:00.000Z"
  },
  "message": "Recurring bill created successfully"
}
```

### Test Case 21: Get Bills Due Soon

**Endpoint**: `GET /api/recurring-bills/due-soon`

**Request**:

```http
GET http://localhost:3000/api/recurring-bills/due-soon
Authorization: Bearer YOUR_TOKEN_HERE
```

### Test Case 22: Mark Payment as Paid

**Endpoint**: `PATCH /api/recurring-bills/payments/:paymentId/mark-paid`

**Request**:

```http
PATCH http://localhost:3000/api/recurring-bills/payments/PAYMENT_ID_HERE/mark-paid
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "transactionId": "uuid-of-transaction"
}
```

---

## 📊 Overview Tests

### Test Case 23: Get Overview Dashboard

**Endpoint**: `GET /api/overview`

**Request**:

```http
GET http://localhost:3000/api/overview
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "currentBalance": 4984.5,
    "income": 5000.0,
    "expenses": 15.5,
    "budgets": [
      {
        "id": "uuid",
        "category": "Groceries",
        "maximum": 500.0,
        "spent": 0.0,
        "theme": "#FF6B35"
      }
    ],
    "pots": [
      {
        "id": "uuid",
        "name": "Vacation Fund",
        "target": 2000.0,
        "total": 75.0,
        "theme": "#00B4D8"
      }
    ],
    "transactions": [
      // Recent transactions
    ],
    "recurringBills": [
      // Upcoming bills
    ]
  }
}
```

### Test Case 24: Get Trends

**Endpoint**: `GET /api/overview/trends`

**Request**:

```http
GET http://localhost:3000/api/overview/trends?months=6
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## ❌ Error Testing Scenarios

### Test Case 25: Unauthorized Access

**Request**:

```http
GET http://localhost:3000/api/transactions
```

**Expected**: 401 Unauthorized

### Test Case 26: Invalid Token

**Request**:

```http
GET http://localhost:3000/api/transactions
Authorization: Bearer invalid_token_here
```

**Expected**: 401 Unauthorized

### Test Case 27: Validation Errors

**Request**:

```http
POST http://localhost:3000/api/transactions
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "recipientSender": "",
  "amount": -100,
  "transactionType": "invalid_type"
}
```

**Expected**: 400 Bad Request with detailed validation errors

### Test Case 28: Resource Not Found

**Request**:

```http
GET http://localhost:3000/api/transactions/non-existent-uuid
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected**: 404 Not Found

### Test Case 29: Insufficient Funds (Pot Withdrawal)

**Request**:

```http
POST http://localhost:3000/api/pots/POT_ID_HERE/withdraw
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "amount": 10000.00
}
```

**Expected**: 400 Bad Request - Insufficient funds

---

## 🔄 Rate Limiting Tests

### Test Case 30: Auth Rate Limiting

**Test**: Make 6 login requests within 15 minutes **Expected**: 5th request should succeed, 6th
should return 429 Too Many Requests

### Test Case 31: API Rate Limiting

**Test**: Make 61 API requests within 1 minute **Expected**: 60th request should succeed, 61st
should return 429 Too Many Requests

---

## 📝 Testing Checklist

### Before Testing:

- [ ] Server is running
- [ ] Database is connected
- [ ] Environment variables are set

### Authentication Flow:

- [ ] Signup with valid data
- [ ] Login with created user
- [ ] Access protected routes with token
- [ ] Test token expiry

### CRUD Operations for Each Entity:

- [ ] **Transactions**: Create, Read, Update, Delete
- [ ] **Budgets**: Create, Read, Update, Delete
- [ ] **Pots**: Create, Read, Update, Delete, Add Money, Withdraw Money
- [ ] **Recurring Bills**: Create, Read, Update, Delete, Mark Paid

### Data Validation:

- [ ] Required fields validation
- [ ] Data type validation
- [ ] Range validation (amounts, dates)
- [ ] Format validation (emails, UUIDs)

### Edge Cases:

- [ ] Empty request bodies
- [ ] Invalid UUIDs
- [ ] Non-existent resources
- [ ] Boundary values
- [ ] Special characters in strings

### Security:

- [ ] Access without authentication
- [ ] Access other users' data
- [ ] SQL injection attempts
- [ ] XSS prevention

---

## 🛠️ Tools Recommendation

1. **Postman**: Import the collection for easy testing
2. **cURL**: For command-line testing
3. **HTTPie**: User-friendly HTTP client
4. **Browser Dev Tools**: For debugging responses

---

## 💡 Tips for Manual Testing

1. **Start with Authentication**: Get a valid token first
2. **Save Token**: Use environment variables in Postman
3. **Test Happy Path First**: Ensure basic functionality works
4. **Then Test Edge Cases**: Validation, errors, edge cases
5. **Check Response Times**: Note any slow endpoints
6. **Verify Data Consistency**: Check database after operations
7. **Test Cross-Entity Logic**: How transactions affect budgets
8. **Document Issues**: Keep track of bugs or unexpected behavior

Remember to replace `YOUR_TOKEN_HERE`, `TRANSACTION_ID_HERE`, etc., with actual values from your
test responses!
