# Test Data Fixtures & Sample Scenarios

## 🧪 Sample Test Data Sets

### User Accounts for Testing

```json
{
  "testUsers": [
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "SecurePass123"
    },
    {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "password": "TestPass456"
    },
    {
      "name": "Mike Johnson",
      "email": "mike.johnson@example.com",
      "password": "MyPassword789"
    }
  ]
}
```

### Sample Transactions Dataset

```json
{
  "sampleTransactions": [
    {
      "recipientSender": "Salary - Tech Corp Inc",
      "category": "General",
      "transactionDate": "2024-01-01T00:00:00.000Z",
      "amount": 5000.0,
      "transactionType": "income",
      "recurring": true
    },
    {
      "recipientSender": "Whole Foods Market",
      "category": "Groceries",
      "transactionDate": "2024-01-02T14:30:00.000Z",
      "amount": 125.5,
      "transactionType": "expense",
      "recurring": false,
      "avatar": "https://example.com/whole-foods.jpg"
    },
    {
      "recipientSender": "Netflix Subscription",
      "category": "Entertainment",
      "transactionDate": "2024-01-03T00:00:00.000Z",
      "amount": 15.99,
      "transactionType": "expense",
      "recurring": true,
      "avatar": "https://example.com/netflix.jpg"
    },
    {
      "recipientSender": "Starbucks Coffee",
      "category": "Dining Out",
      "transactionDate": "2024-01-04T08:15:00.000Z",
      "amount": 6.5,
      "transactionType": "expense",
      "recurring": false
    },
    {
      "recipientSender": "Uber Ride",
      "category": "Transportation",
      "transactionDate": "2024-01-05T18:45:00.000Z",
      "amount": 18.75,
      "transactionType": "expense",
      "recurring": false,
      "avatar": "https://example.com/uber.jpg"
    },
    {
      "recipientSender": "Freelance Project Payment",
      "category": "General",
      "transactionDate": "2024-01-06T10:00:00.000Z",
      "amount": 1500.0,
      "transactionType": "income",
      "recurring": false
    },
    {
      "recipientSender": "Target Store",
      "category": "Shopping",
      "transactionDate": "2024-01-07T16:20:00.000Z",
      "amount": 89.99,
      "transactionType": "expense",
      "recurring": false
    },
    {
      "recipientSender": "Electric Bill - City Power",
      "category": "Bills",
      "transactionDate": "2024-01-08T00:00:00.000Z",
      "amount": 145.0,
      "transactionType": "expense",
      "recurring": true
    },
    {
      "recipientSender": "Gym Membership",
      "category": "Personal Care",
      "transactionDate": "2024-01-09T00:00:00.000Z",
      "amount": 49.99,
      "transactionType": "expense",
      "recurring": true
    },
    {
      "recipientSender": "Investment Dividend",
      "category": "General",
      "transactionDate": "2024-01-10T00:00:00.000Z",
      "amount": 250.0,
      "transactionType": "income",
      "recurring": false
    }
  ]
}
```

### Sample Budgets Dataset

```json
{
  "sampleBudgets": [
    {
      "category": "Groceries",
      "maximum": 600.0,
      "theme": "#22C55E"
    },
    {
      "category": "Entertainment",
      "maximum": 200.0,
      "theme": "#8B5CF6"
    },
    {
      "category": "Dining Out",
      "maximum": 300.0,
      "theme": "#F59E0B"
    },
    {
      "category": "Transportation",
      "maximum": 150.0,
      "theme": "#06B6D4"
    },
    {
      "category": "Bills",
      "maximum": 800.0,
      "theme": "#EF4444"
    },
    {
      "category": "Shopping",
      "maximum": 400.0,
      "theme": "#EC4899"
    },
    {
      "category": "Personal Care",
      "maximum": 100.0,
      "theme": "#84CC16"
    }
  ]
}
```

### Sample Pots Dataset

```json
{
  "samplePots": [
    {
      "name": "Emergency Fund",
      "target": 10000.0,
      "theme": "#EF4444"
    },
    {
      "name": "Vacation to Japan",
      "target": 5000.0,
      "theme": "#06B6D4"
    },
    {
      "name": "New MacBook Pro",
      "target": 2500.0,
      "theme": "#8B5CF6"
    },
    {
      "name": "Wedding Fund",
      "target": 15000.0,
      "theme": "#EC4899"
    },
    {
      "name": "Car Down Payment",
      "target": 8000.0,
      "theme": "#F59E0B"
    },
    {
      "name": "Home Renovation",
      "target": 12000.0,
      "theme": "#84CC16"
    }
  ]
}
```

### Sample Recurring Bills Dataset

```json
{
  "sampleRecurringBills": [
    {
      "name": "Netflix Premium",
      "amount": 19.99,
      "dueDay": 15,
      "category": "Entertainment",
      "avatar": "https://example.com/netflix.jpg"
    },
    {
      "name": "Spotify Premium",
      "amount": 9.99,
      "dueDay": 3,
      "category": "Entertainment"
    },
    {
      "name": "Spark Electric Solutions",
      "amount": 145.0,
      "dueDay": 2,
      "category": "Bills",
      "avatar": "https://example.com/spark-electric.jpg"
    },
    {
      "name": "Aqua Flow Utilities",
      "amount": 85.0,
      "dueDay": 30,
      "category": "Bills",
      "avatar": "https://example.com/aqua-flow.jpg"
    },
    {
      "name": "Serenity Spa & Wellness",
      "amount": 75.0,
      "dueDay": 5,
      "category": "Personal Care"
    },
    {
      "name": "TechNova Innovations",
      "amount": 29.99,
      "dueDay": 12,
      "category": "Bills"
    },
    {
      "name": "EcoFuel Energy",
      "amount": 120.0,
      "dueDay": 25,
      "category": "Bills"
    },
    {
      "name": "Elevate Education",
      "amount": 199.99,
      "dueDay": 1,
      "category": "Education"
    }
  ]
}
```

## 🔄 Testing Workflows

### Workflow 1: New User Complete Setup

1. **Sign Up**: Create new user account
2. **Login**: Authenticate with new credentials
3. **Create Income**: Add salary/income source
4. **Setup Budgets**: Create budgets for main categories
5. **Add Pots**: Setup savings goals
6. **Create Bills**: Add recurring monthly bills
7. **Add Expenses**: Log some daily expenses
8. **Check Overview**: Verify dashboard calculations

### Workflow 2: Monthly Financial Management

1. **Login**: Authenticate existing user
2. **Review Overview**: Check current financial status
3. **Add Transactions**: Log new income/expenses
4. **Manage Pots**: Add money to savings goals
5. **Pay Bills**: Mark recurring bills as paid
6. **Update Budgets**: Adjust budget limits if needed
7. **Check Trends**: Review monthly trends

### Workflow 3: Budget Tracking Scenario

1. **Create Budget**: Set $300 budget for Dining Out
2. **Add Expenses**: Create dining transactions totaling $120
3. **Check Spending**: Verify budget shows $120 spent, $180 remaining
4. **Add More Expenses**: Add $200 more in dining expenses
5. **Check Over-Budget**: Verify budget shows over-budget status

### Workflow 4: Savings Goal Achievement

1. **Create Pot**: "Vacation Fund" with $2000 target
2. **Add Money**: Multiple additions totaling $500
3. **Check Progress**: Verify 25% progress toward goal
4. **Withdraw Some**: Test withdrawal of $100
5. **Final Check**: Verify updated balance and progress

## 🧪 Edge Case Test Scenarios

### Boundary Value Testing

```json
{
  "boundaryTests": {
    "amounts": {
      "minimum": 0.01,
      "maximum": 999999.99,
      "zero": 0.00,
      "negative": -100.00
    },
    "dates": {
      "past": "2020-01-01T00:00:00.000Z",
      "current": "2024-01-15T12:00:00.000Z",
      "future": "2025-12-31T23:59:59.999Z",
      "invalid": "invalid-date-string"
    },
    "strings": {
      "empty": "",
      "maxLength": "A".repeat(255),
      "overLength": "A".repeat(256),
      "specialChars": "Test@#$%^&*()",
      "unicode": "Test 🎉 Émojì"
    },
    "pagination": {
      "page": {
        "minimum": 1,
        "maximum": 9999,
        "zero": 0,
        "negative": -1
      },
      "limit": {
        "minimum": 1,
        "maximum": 100,
        "overMax": 101,
        "zero": 0
      }
    }
  }
}
```

### Invalid Data Scenarios

```json
{
  "invalidScenarios": [
    {
      "name": "Transaction with missing required fields",
      "data": {
        "category": "Groceries",
        "amount": 50.0
      },
      "expectedError": "recipientSender is required"
    },
    {
      "name": "Budget with invalid category",
      "data": {
        "category": "NonExistentCategory",
        "maximum": 500.0,
        "theme": "#FF0000"
      },
      "expectedError": "Invalid category"
    },
    {
      "name": "Pot with negative target",
      "data": {
        "name": "Test Pot",
        "target": -1000.0,
        "theme": "#FF0000"
      },
      "expectedError": "Target must be positive"
    },
    {
      "name": "Recurring bill with invalid due day",
      "data": {
        "name": "Test Bill",
        "amount": 50.0,
        "dueDay": 35,
        "category": "Bills"
      },
      "expectedError": "Due day must be between 1 and 31"
    }
  ]
}
```

## 🎯 Performance Test Data

### Large Dataset Creation

```json
{
  "performanceData": {
    "massTransactionCreation": {
      "count": 1000,
      "template": {
        "recipientSender": "Performance Test Transaction {{index}}",
        "category": "General",
        "transactionDate": "2024-01-{{dayOfMonth}}T{{hour}}:{{minute}}:00.000Z",
        "amount": "{{randomAmount}}",
        "transactionType": "{{randomType}}",
        "recurring": false
      }
    },
    "bulkBudgetTest": {
      "categories": [
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
      ],
      "amounts": [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]
    }
  }
}
```

## 🔐 Security Test Scenarios

### Authentication Edge Cases

```json
{
  "securityTests": [
    {
      "name": "SQL Injection in Login",
      "email": "test@example.com'; DROP TABLE users; --",
      "password": "password",
      "expectedResult": "Safe error handling"
    },
    {
      "name": "XSS in Transaction Name",
      "recipientSender": "<script>alert('XSS')</script>",
      "expectedResult": "Sanitized input"
    },
    {
      "name": "Long Token Attack",
      "token": "A".repeat(10000),
      "expectedResult": "Token validation failure"
    },
    {
      "name": "Expired Token Usage",
      "scenario": "Use token after 24 hours",
      "expectedResult": "401 Unauthorized"
    }
  ]
}
```

## 📊 Data Consistency Tests

### Cross-Entity Validation

```json
{
  "consistencyTests": [
    {
      "name": "Budget Spending Calculation",
      "steps": [
        "Create budget for 'Groceries' with $500 limit",
        "Add 3 grocery transactions: $100, $150, $75",
        "Verify budget shows $325 spent, $175 remaining"
      ]
    },
    {
      "name": "Overview Balance Calculation",
      "steps": [
        "Add income transaction: $1000",
        "Add expense transactions totaling: $300",
        "Verify overview shows balance: $700"
      ]
    },
    {
      "name": "Pot Progress Tracking",
      "steps": [
        "Create pot with $1000 target",
        "Add $250 to pot",
        "Verify progress shows 25%",
        "Withdraw $50",
        "Verify progress shows 20%"
      ]
    }
  ]
}
```

## 🛠️ Test Execution Guidelines

### Pre-Test Setup Checklist

- [ ] Server is running on correct port
- [ ] Database is clean/reset
- [ ] Environment variables configured
- [ ] Postman collection imported
- [ ] Base URL configured in environment

### Test Execution Order

1. **Authentication Tests** - Start here to get valid tokens
2. **Basic CRUD Operations** - Test core functionality
3. **Data Seeding** - Create sample data for complex tests
4. **Complex Queries** - Test filtering, sorting, pagination
5. **Business Logic** - Test calculations and relationships
6. **Error Scenarios** - Test validation and error handling
7. **Performance Tests** - Test with larger datasets
8. **Security Tests** - Test edge cases and attacks

### Post-Test Validation

- [ ] Check database state consistency
- [ ] Verify no memory leaks
- [ ] Check server logs for errors
- [ ] Validate response times
- [ ] Confirm data integrity

## 📝 Test Reporting Template

```json
{
  "testReport": {
    "testSuite": "Personal Finance API",
    "executionDate": "2024-01-15T10:00:00.000Z",
    "environment": "localhost:3000",
    "summary": {
      "totalTests": 0,
      "passed": 0,
      "failed": 0,
      "skipped": 0,
      "passRate": "0%"
    },
    "results": [
      {
        "category": "Authentication",
        "tests": [
          {
            "name": "User Signup",
            "status": "PASS",
            "responseTime": "150ms",
            "statusCode": 201
          }
        ]
      }
    ],
    "issues": [
      {
        "severity": "HIGH|MEDIUM|LOW",
        "description": "Issue description",
        "endpoint": "POST /api/auth/signup",
        "reproduction": "Steps to reproduce"
      }
    ]
  }
}
```

## 🎯 Quick Reference Commands

### cURL Examples

```bash
# Health Check
curl -X GET http://localhost:3000/health

# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'

# Get Transactions (with auth)
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create Transaction
curl -X POST http://localhost:3000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"recipientSender":"Test Store","category":"Shopping","transactionDate":"2024-01-15T00:00:00.000Z","amount":25.00,"transactionType":"expense"}'
```

Remember to replace `YOUR_TOKEN_HERE` with actual JWT token from login response!
