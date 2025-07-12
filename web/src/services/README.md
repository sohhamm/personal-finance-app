# Frontend API Integration Documentation

This document provides comprehensive guidance on using the frontend API integration layer for the Personal Finance App.

## Architecture Overview

The frontend follows a modular architecture pattern inspired by enterprise-grade applications:

```
src/
├── services/
│   ├── *.service.ts          # API service classes
│   ├── *.data.ts             # React Query hooks
│   ├── query-key-factory.ts  # Centralized query keys
│   └── hooks/
│       └── useMutate.ts      # Reusable mutation hook
├── stores/
│   └── *.ts                  # Zustand state management
├── types/
│   └── *.ts                  # TypeScript interfaces
└── components/
    └── examples/             # Example components
```

## Key Features

- **Type-safe API calls** with full TypeScript support
- **Centralized cache management** using React Query
- **Optimistic updates** and automatic cache invalidation
- **Modular state management** with Zustand
- **Consistent error handling** and loading states
- **Pagination and filtering** built-in
- **Reusable patterns** across all modules

## Usage Examples

### 1. Transactions

#### Basic Usage
```typescript
import { useGetTransactions, useCreateTransaction } from '@/services/transaction.data'
import { useTransactionQuery, useTransactionActions } from '@/stores/transaction'

function TransactionsPage() {
  const query = useTransactionQuery()
  const { setSearch, setCategory } = useTransactionActions()
  
  const { transactions, isPending, pagination } = useGetTransactions(query)
  const createTransaction = useCreateTransaction()

  const handleCreate = async (data) => {
    await createTransaction.mutateAsync(data)
    // Cache is automatically updated
  }

  return (
    <div>
      <input 
        value={query.search} 
        onChange={(e) => setSearch(e.target.value)} 
      />
      {/* Render transactions */}
    </div>
  )
}
```

#### Advanced Filtering
```typescript
const { setDateRange, setCategory, setSortBy } = useTransactionActions()

// Filter by date range
setDateRange('2024-01-01', '2024-12-31')

// Filter by category
setCategory('Groceries')

// Sort by amount descending
setSortBy('amount')
setSortOrder('desc')
```

### 2. Budgets

```typescript
import { useGetBudgets, useCreateBudget } from '@/services/budget.data'

function BudgetsPage() {
  const { budgets, isPending } = useGetBudgets()
  const createBudget = useCreateBudget()

  const handleCreateBudget = async () => {
    await createBudget.mutateAsync({
      category: 'Groceries',
      maximum: 500,
      theme: '#4F46E5'
    })
  }

  return <div>{/* Render budgets */}</div>
}
```

### 3. Pots (Savings)

```typescript
import { useGetPots, useAddToPot } from '@/services/pot.data'

function PotsPage() {
  const { pots, isPending } = useGetPots()
  const addToPot = useAddToPot('pot-id')

  const handleAddMoney = async () => {
    await addToPot.mutateAsync({
      amount: 100,
      type: 'add'
    })
  }

  return <div>{/* Render pots */}</div>
}
```

## Service Layer Pattern

Each module follows the same pattern:

### 1. Service Class (`*.service.ts`)
```typescript
export class TransactionService {
  async getTransactions(query: TransactionQuery): Promise<Transaction[]> {
    // API call implementation
  }
  
  async createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
    // API call implementation
  }
}
```

### 2. Data Hooks (`*.data.ts`)
```typescript
export const useGetTransactions = (query: TransactionQuery) => {
  return useQuery({
    queryKey: queryKeys.transactions.list(query),
    queryFn: () => svc.getTransactions(query),
  })
}

export const useCreateTransaction = () => {
  return useMutate(
    svc.createTransaction.bind(svc),
    [queryKeys.transactions.all],
    { successMessage: 'Transaction created successfully' }
  )
}
```

### 3. State Management (`stores/*.ts`)
```typescript
export const useTransactionStore = create<TransactionStore>((set) => ({
  query: transactionInitialQueries,
  setQuery: (updates) => set((state) => ({ query: { ...state.query, ...updates } })),
  setSearch: (search) => set((state) => ({ query: { ...state.query, search } })),
}))
```

## Query Key Factory

Centralized cache key management:

```typescript
export const queryKeys = {
  transactions: {
    all: ['transactions'] as const,
    lists: () => [...queryKeys.transactions.all, 'list'] as const,
    list: (query: TransactionQuery) => [...queryKeys.transactions.lists(), query] as const,
    detail: (id: string) => [...queryKeys.transactions.all, 'detail', id] as const,
  },
}
```

## Error Handling

All mutations include automatic error handling:

```typescript
const createTransaction = useCreateTransaction()

// Automatic error handling
createTransaction.mutate(data, {
  onError: (error) => {
    // Error is automatically logged and displayed
    console.error('Failed to create transaction:', error)
  }
})

// Manual error handling
try {
  await createTransaction.mutateAsync(data)
} catch (error) {
  // Handle specific error cases
}
```

## Environment Setup

Create a `.env.local` file:

```bash
VITE_API_URL=http://localhost:3000
```

## Best Practices

1. **Always use the data hooks** instead of service classes directly
2. **Leverage the store** for complex state management
3. **Use the query key factory** for cache operations
4. **Handle loading and error states** in your components
5. **Batch related operations** using React Query's batching
6. **Use optimistic updates** for better UX where appropriate

## Migration from Legacy

If you have existing API calls, migrate them gradually:

1. Replace direct API calls with service classes
2. Wrap service calls with React Query hooks
3. Move component state to Zustand stores
4. Update cache invalidation to use query keys

## Performance Tips

- Use `enabled: false` for conditional queries
- Implement pagination for large datasets
- Use `staleTime` for data that doesn't change frequently
- Leverage React Query's background refetching
- Consider infinite queries for large lists

## Testing

```typescript
import { renderHook } from '@testing-library/react'
import { useGetTransactions } from '@/services/transaction.data'

test('should fetch transactions', async () => {
  const { result } = renderHook(() => useGetTransactions({}))
  
  expect(result.current.isPending).toBe(true)
  // Add more assertions
})
```

This architecture provides a scalable, maintainable foundation for your frontend API integration while ensuring type safety and optimal performance.