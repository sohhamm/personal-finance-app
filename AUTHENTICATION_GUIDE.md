# Authentication Flow & Token Management Guide

## 🔐 Authentication Overview

The Personal Finance App uses **JWT (JSON Web Tokens)** for authentication with a Bearer token
scheme. All protected routes require a valid token in the Authorization header.

### Authentication Flow Diagram

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Client    │    │    Server    │    │  Database   │
└─────────────┘    └──────────────┘    └─────────────┘
       │                   │                   │
       │ 1. POST /signup   │                   │
       ├──────────────────►│ 2. Hash password  │
       │                   ├──────────────────►│
       │                   │ 3. Save user      │
       │                   │◄──────────────────┤
       │ 4. Return token   │                   │
       │◄──────────────────┤                   │
       │                   │                   │
       │ 5. POST /login    │                   │
       ├──────────────────►│ 6. Verify password│
       │                   ├──────────────────►│
       │                   │ 7. User data      │
       │                   │◄──────────────────┤
       │ 8. Return token   │                   │
       │◄──────────────────┤                   │
       │                   │                   │
       │ 9. API Request    │                   │
       │    + Bearer Token │                   │
       ├──────────────────►│ 10. Verify token  │
       │                   │ 11. Process req   │
       │                   ├──────────────────►│
       │                   │ 12. Data          │
       │                   │◄──────────────────┤
       │ 13. Response      │                   │
       │◄──────────────────┤                   │
```

## 🚀 Quick Start Authentication

### Step 1: Sign Up a New User

```http
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-here",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  },
  "message": "User created successfully"
}
```

### Step 2: Save the Token

**Important:** Copy the `token` value from the response. You'll need this for all subsequent API
calls.

```javascript
// Save token (example for Postman)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
pm.collectionVariables.set('accessToken', token)
```

### Step 3: Use Token for API Calls

```http
GET http://localhost:3000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔑 Password Requirements

Passwords must meet these criteria:

- **Minimum 8 characters**
- **At least 1 uppercase letter**
- **At least 1 lowercase letter**
- **At least 1 number**

### Valid Password Examples:

- `SecurePass123`
- `MyPassword456`
- `Test123Pass`

### Invalid Password Examples:

- `password` (no uppercase, no numbers)
- `PASSWORD123` (no lowercase)
- `TestPass` (no numbers)
- `123456` (no letters)
- `short` (too short)

## 📧 Email Validation

- Must be a valid email format
- Must be unique (no duplicate accounts)
- Case-insensitive matching

### Valid Email Examples:

- `user@example.com`
- `john.doe@company.co.uk`
- `test+label@domain.org`

### Invalid Email Examples:

- `invalid-email`
- `@domain.com`
- `user@`
- `user.domain.com`

## 🔐 JWT Token Details

### Token Structure

JWT tokens contain three parts separated by dots:

```
header.payload.signature
```

### Token Payload (Decoded Example):

```json
{
  "userId": "user-uuid-here",
  "email": "john.doe@example.com",
  "iat": 1642248000,
  "exp": 1642334400
}
```

### Token Properties:

- **Algorithm**: HS256 (HMAC SHA256)
- **Expiration**: 24 hours from issue
- **Issuer**: Personal Finance App
- **Subject**: User authentication

## 🔒 Using Tokens in Requests

### Header Format

```
Authorization: Bearer <your-token-here>
```

### Examples in Different Tools

**Postman:**

- Go to Authorization tab
- Select "Bearer Token" type
- Paste token in the "Token" field
- Or use variable: `{{accessToken}}`

**cURL:**

```bash
curl -X GET http://localhost:3000/api/transactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**JavaScript (Fetch):**

```javascript
fetch('http://localhost:3000/api/transactions', {
  headers: {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
  },
})
```

**JavaScript (Axios):**

```javascript
axios.get('http://localhost:3000/api/transactions', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

## ⏰ Token Expiration

### Expiration Time

- Tokens expire after **24 hours**
- Expired tokens return `401 Unauthorized`
- No automatic refresh - must login again

### Handling Expiration

**Check Expiration:**

```javascript
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}
```

**Auto Re-login Flow:**

```javascript
async function apiCall(url, options = {}) {
  let token = localStorage.getItem('token')

  if (isTokenExpired(token)) {
    token = await refreshToken() // Re-login
  }

  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  })
}
```

## 🛡️ Security Best Practices

### Client-Side Token Storage

**✅ Recommended:**

- HttpOnly cookies (server-set)
- Secure session storage
- Memory storage (for SPAs)

**❌ Avoid:**

- localStorage (XSS vulnerable)
- URL parameters
- Plain text storage

### Token Transmission

- **Always use HTTPS** in production
- **Never log tokens** in console/files
- **Don't include tokens** in URLs
- **Validate tokens** on every request

### Rate Limiting Protection

The API includes rate limiting on auth endpoints:

- **Signup/Login**: 5 requests per 15 minutes
- **General API**: 60 requests per minute

## 🔄 Complete Authentication Workflows

### Workflow 1: New User Registration

```http
# 1. Sign up
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "SecurePass123"
}

# 2. Save token from response
# token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Get profile to verify
GET http://localhost:3000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 4. Start using protected endpoints
GET http://localhost:3000/api/transactions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Workflow 2: Returning User Login

```http
# 1. Login with existing credentials
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "SecurePass123"
}

# 2. Save new token from response
# token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 3. Continue with API calls
GET http://localhost:3000/api/overview
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Workflow 3: Token Validation

```http
# Valid token - should return user data
GET http://localhost:3000/api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Invalid token - should return 401
GET http://localhost:3000/api/auth/profile
Authorization: Bearer invalid_token_here

# No token - should return 401
GET http://localhost:3000/api/auth/profile
```

## ❌ Common Authentication Errors

### 401 Unauthorized Responses

**Missing Authorization Header:**

```json
{
  "success": false,
  "message": "Access denied. No token provided.",
  "errors": []
}
```

**Invalid Token Format:**

```json
{
  "success": false,
  "message": "Invalid token format",
  "errors": []
}
```

**Expired Token:**

```json
{
  "success": false,
  "message": "Token has expired",
  "errors": []
}
```

**Invalid Token Signature:**

```json
{
  "success": false,
  "message": "Invalid token",
  "errors": []
}
```

### 400 Bad Request Examples

**Invalid Email Format:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

**Weak Password:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "password",
      "message": "Password must be at least 8 characters and contain uppercase, lowercase, and number"
    }
  ]
}
```

**Duplicate Email:**

```json
{
  "success": false,
  "message": "User with this email already exists",
  "errors": []
}
```

## 🧪 Testing Authentication

### Postman Environment Setup

```json
{
  "name": "Personal Finance API",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "enabled": true
    },
    {
      "key": "accessToken",
      "value": "",
      "enabled": true
    }
  ]
}
```

### Auto-Save Token Script (Postman)

Add this to the "Tests" tab of signup/login requests:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
  const response = pm.response.json()
  if (response.success && response.data && response.data.token) {
    pm.environment.set('accessToken', response.data.token)
    console.log('Token saved:', response.data.token)
  }
}
```

### Token Validation Test

```javascript
// Test script to verify token format
pm.test('Token is valid JWT format', function () {
  const response = pm.response.json()
  const token = response.data.token

  // JWT has 3 parts separated by dots
  const parts = token.split('.')
  pm.expect(parts).to.have.lengthOf(3)

  // Decode payload to check structure
  const payload = JSON.parse(atob(parts[1]))
  pm.expect(payload).to.have.property('userId')
  pm.expect(payload).to.have.property('email')
  pm.expect(payload).to.have.property('exp')
})
```

## 🔧 Troubleshooting

### Common Issues & Solutions

**Problem**: "Access denied. No token provided"

- **Solution**: Add Authorization header with Bearer token

**Problem**: "Invalid token format"

- **Solution**: Ensure token starts with "Bearer " (note the space)

**Problem**: "Token has expired"

- **Solution**: Login again to get a new token

**Problem**: "User with this email already exists"

- **Solution**: Use a different email or login with existing account

**Problem**: Rate limit exceeded

- **Solution**: Wait 15 minutes before trying auth endpoints again

### Debug Checklist

- [ ] Token is correctly formatted (3 parts separated by dots)
- [ ] Authorization header includes "Bearer " prefix
- [ ] Token is not expired (check exp claim)
- [ ] Server is running and accessible
- [ ] Environment variables are set correctly
- [ ] No typos in email/password

### Token Debugging Tools

**JWT Debugger**: https://jwt.io

- Paste your token to decode and inspect payload
- Verify expiration time and user data

**Browser DevTools**:

```javascript
// Decode token payload in browser console
const token = 'your-token-here'
const payload = JSON.parse(atob(token.split('.')[1]))
console.log(payload)

// Check if expired
const isExpired = Date.now() >= payload.exp * 1000
console.log('Token expired:', isExpired)
```

## 📋 Authentication Testing Checklist

### Basic Authentication Tests

- [ ] Sign up with valid data
- [ ] Sign up with invalid email format
- [ ] Sign up with weak password
- [ ] Sign up with duplicate email
- [ ] Login with valid credentials
- [ ] Login with invalid password
- [ ] Login with non-existent email
- [ ] Access profile with valid token
- [ ] Access profile with invalid token
- [ ] Access profile without token

### Token Management Tests

- [ ] Token contains correct user data
- [ ] Token expires after 24 hours
- [ ] Expired token returns 401
- [ ] Invalid token format returns 401
- [ ] Missing Authorization header returns 401

### Security Tests

- [ ] Password hashing works correctly
- [ ] Rate limiting prevents brute force
- [ ] XSS protection in user inputs
- [ ] SQL injection protection
- [ ] CORS headers configured correctly

Remember: Always test authentication flows first before testing other API endpoints!
