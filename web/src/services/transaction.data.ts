import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { TransactionService } from './transaction.service'
import { queryKeys } from './query-key-factory'
import { useMutate } from './hooks/useMutate'
import { 
  TransactionQuery, 
  CreateTransactionRequest, 
  UpdateTransactionRequest,
  PotTransactionRequest
} from '@/types/transaction'

const svc = new TransactionService()

// Queries
export const useGetTransactions = (query: TransactionQuery) => {
  const res = useQuery({
    queryKey: queryKeys.transactions.list(query),
    queryFn: () => svc.getTransactions(query),
  })

  return {
    transactions: res.data?.data ?? [],
    isPending: res.isPending,
    pagination: res.data?.pagination,
    isError: res.isError,
    error: res.error,
  }
}

export const useGetTransactionById = (id?: string) => {
  const res = useQuery({
    queryKey: queryKeys.transactions.detail(id ?? ''),
    queryFn: () => svc.getTransactionById(id!),
    enabled: !!id,
  })

  return {
    transaction: res.data,
    isPending: res.isPending,
    isError: res.isError,
    error: res.error,
  }
}

export const useGetTransactionStats = () => {
  const res = useQuery({
    queryKey: queryKeys.transactions.stats(),
    queryFn: () => svc.getTransactionStats(),
  })

  return {
    stats: res.data,
    isPending: res.isPending,
    isError: res.isError,
    error: res.error,
  }
}

export const useGetTransactionCategories = () => {
  const res = useQuery({
    queryKey: queryKeys.transactions.categories(),
    queryFn: () => svc.getCategories(),
  })

  return {
    categories: res.data ?? [],
    isPending: res.isPending,
    isError: res.isError,
    error: res.error,
  }
}

// Mutations
export const useCreateTransaction = () => {
  return useMutate<any, CreateTransactionRequest>(
    svc.createTransaction.bind(svc),
    [queryKeys.transactions.all, queryKeys.transactions.stats()],
    {
      successMessage: 'Transaction created successfully',
      errorMessage: 'Failed to create transaction',
    }
  )
}

export const useUpdateTransaction = (id: string) => {
  return useMutate<any, UpdateTransactionRequest>(
    (payload) => svc.updateTransaction(id, payload),
    [
      queryKeys.transactions.all,
      queryKeys.transactions.detail(id),
      queryKeys.transactions.stats(),
    ],
    {
      successMessage: 'Transaction updated successfully',
      errorMessage: 'Failed to update transaction',
    }
  )
}

export const useDeleteTransaction = () => {
  return useMutate<void, string>(
    svc.deleteTransaction.bind(svc),
    [queryKeys.transactions.all, queryKeys.transactions.stats()],
    {
      successMessage: 'Transaction deleted successfully',
      errorMessage: 'Failed to delete transaction',
    }
  )
}