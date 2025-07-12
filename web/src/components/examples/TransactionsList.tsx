import React from 'react'
import { useGetTransactions, useDeleteTransaction } from '@/services/transaction.data'
import { useTransactionQuery, useTransactionActions } from '@/stores/transaction'

export const TransactionsList: React.FC = () => {
  const query = useTransactionQuery()
  const { setSearch, setCategory, setPage } = useTransactionActions()
  
  const { transactions, isPending, pagination, isError } = useGetTransactions(query)
  const deleteTransactionMutation = useDeleteTransaction()

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransactionMutation.mutate(id)
    }
  }

  if (isPending) return <div>Loading transactions...</div>
  if (isError) return <div>Error loading transactions</div>

  return (
    <div className="transactions-list">
      {/* Search and filters */}
      <div className="filters mb-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={query.search || ''}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        
        <select
          value={query.category || ''}
          onChange={(e) => setCategory(e.target.value as any)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Bills">Bills</option>
          <option value="Groceries">Groceries</option>
          <option value="Dining Out">Dining Out</option>
        </select>
      </div>

      {/* Transactions table */}
      <div className="transactions-table">
        {transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Description</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Amount</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="p-2">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{transaction.recipient_sender}</td>
                  <td className="p-2">{transaction.category}</td>
                  <td className="p-2 font-semibold">
                    ${Number(transaction.amount).toFixed(2)}
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      transaction.transaction_type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transaction.transaction_type}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deleteTransactionMutation.isPending}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination mt-4 flex justify-center gap-2">
          <button
            onClick={() => setPage(String(pagination.page - 1))}
            disabled={!pagination.hasPrev}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="px-3 py-1">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setPage(String(pagination.page + 1))}
            disabled={!pagination.hasNext}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}