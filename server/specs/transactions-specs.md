# Transactions

## View Transactions

- Display all transactions on the transactions page
- Implement pagination, showing 10 transactions per page with options to change page size (e.g.,
  20, 50)
- Delete a transaction with confirmation dialog
- Add ability to edit existing transactions
  - When editing, pre-fill the form with existing transaction details
  - Allow users to modify any field of the transaction
  - Implement validation for edited transactions
  - Update the transaction list after successful edit

## Search Functionality

- Allow searching by recipient/sender name
- Implement search by transaction amount (exact)

## Sorting Options

- Latest (most recent date)
- Oldest (earliest date)
- Highest (transaction amount, descending)
- Lowest (transaction amount, ascending)
- A to Z (alphabetical by recipient/sender name)
- Z to A (reverse alphabetical by recipient/sender name)

## Filtering

- Filter transactions by category
- Categories: Entertainment, Bills, Groceries, Dining Out, Transportation, Personal Care, Education,
  Lifestyle, Shopping, General
- When a category is selected, display only transactions from that category

## Add Manual Transaction

### Fields

1. Recipient/Sender
   - Text input
   - Does not need to be an existing user in the app
2. Category
   - Dropdown menu
   - Options: Entertainment, Bills, Groceries, Dining Out, Transportation, Personal Care, Education,
     Lifestyle, Shopping, General
3. Transaction Date
   - Date picker
   - Default to current date
4. Amount
   - Numeric input
   - Allow decimal places for cents
   - Include currency symbol (e.g., $)
5. Transaction Type
   - Radio buttons or dropdown
   - Options: Income / Expense

### Validation

- All fields are required
- Amount must be a positive number
- Date cannot be in the future
- Implement client-side validation for immediate feedback
- Implement server-side validation for security

## API Endpoints

- GET /api/transactions - Retrieve transactions with pagination, sorting, and filtering
- POST /api/transactions - Create a new transaction
- PUT /api/transactions/:id - Update an existing transaction
- DELETE /api/transactions/:id - Delete a transaction
- GET /api/transactions/categories - Retrieve list of categories
