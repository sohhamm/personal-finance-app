import React from 'react'
import {useForm} from '@tanstack/react-form'
import {zodValidator} from '@tanstack/zod-form-adapter'
import {z} from 'zod'
import {useCreateTransaction} from '@/services/transaction.data'
import type {
  CreateTransactionRequest,
  TransactionCategory,
  TransactionType,
} from '@/types/transaction'

const createTransactionSchema = z.object({
  recipientSender: z.string().min(1, 'Recipient/Sender is required'),
  category: z.enum([
    'Entertainment',
    'Bills',
    'Groceries',
    'Dining Out',
    'Transportation',
    'Personal Care',
    'Education',
    'Lifestyle',
    'Shopping',
    'General',
  ]),
  transactionDate: z.string().min(1, 'Transaction date is required'),
  amount: z.number().positive('Amount must be positive'),
  transactionType: z.enum(['income', 'expense']),
  recurring: z.boolean().optional(),
})

interface CreateTransactionFormProps {
  onSuccess?: () => void
}

export const CreateTransactionForm: React.FC<CreateTransactionFormProps> = ({onSuccess}) => {
  const createTransactionMutation = useCreateTransaction()

  const form = useForm({
    defaultValues: {
      recipientSender: '',
      category: 'General' as TransactionCategory,
      transactionDate: new Date().toISOString().split('T')[0], // Today's date
      amount: 0,
      transactionType: 'expense' as TransactionType,
      recurring: false,
    },
    onSubmit: async ({value}) => {
      try {
        await createTransactionMutation.mutateAsync(value)
        form.reset()
        onSuccess?.()
      } catch (error) {
        console.error('Failed to create transaction:', error)
      }
    },
    validatorAdapter: zodValidator(),
  })

  return (
    <div className='create-transaction-form max-w-md mx-auto p-6 bg-white rounded-lg shadow'>
      <h2 className='text-xl font-semibold mb-4'>Add New Transaction</h2>

      <form
        onSubmit={e => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className='space-y-4'
      >
        <form.Field
          name='recipientSender'
          validators={{
            onChange: createTransactionSchema.shape.recipientSender,
          }}
        >
          {field => (
            <div>
              <label className='block text-sm font-medium mb-1'>Recipient/Sender *</label>
              <input
                type='text'
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                className='w-full border border-gray-300 rounded px-3 py-2'
                placeholder='Enter recipient or sender name'
              />
              {field.state.meta.errors.length > 0 && (
                <p className='text-red-500 text-sm mt-1'>{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name='category'
          validators={{
            onChange: createTransactionSchema.shape.category,
          }}
        >
          {field => (
            <div>
              <label className='block text-sm font-medium mb-1'>Category *</label>
              <select
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value as TransactionCategory)}
                className='w-full border border-gray-300 rounded px-3 py-2'
              >
                <option value='Entertainment'>Entertainment</option>
                <option value='Bills'>Bills</option>
                <option value='Groceries'>Groceries</option>
                <option value='Dining Out'>Dining Out</option>
                <option value='Transportation'>Transportation</option>
                <option value='Personal Care'>Personal Care</option>
                <option value='Education'>Education</option>
                <option value='Lifestyle'>Lifestyle</option>
                <option value='Shopping'>Shopping</option>
                <option value='General'>General</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field
          name='amount'
          validators={{
            onChange: createTransactionSchema.shape.amount,
          }}
        >
          {field => (
            <div>
              <label className='block text-sm font-medium mb-1'>Amount *</label>
              <input
                type='number'
                step='0.01'
                min='0'
                value={field.state.value}
                onChange={e => field.handleChange(Number(e.target.value))}
                className='w-full border border-gray-300 rounded px-3 py-2'
                placeholder='0.00'
              />
              {field.state.meta.errors.length > 0 && (
                <p className='text-red-500 text-sm mt-1'>{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name='transactionType'
          validators={{
            onChange: createTransactionSchema.shape.transactionType,
          }}
        >
          {field => (
            <div>
              <label className='block text-sm font-medium mb-1'>Type *</label>
              <select
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value as TransactionType)}
                className='w-full border border-gray-300 rounded px-3 py-2'
              >
                <option value='expense'>Expense</option>
                <option value='income'>Income</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field
          name='transactionDate'
          validators={{
            onChange: createTransactionSchema.shape.transactionDate,
          }}
        >
          {field => (
            <div>
              <label className='block text-sm font-medium mb-1'>Transaction Date *</label>
              <input
                type='date'
                value={field.state.value}
                onChange={e => field.handleChange(e.target.value)}
                className='w-full border border-gray-300 rounded px-3 py-2'
              />
              {field.state.meta.errors.length > 0 && (
                <p className='text-red-500 text-sm mt-1'>{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name='recurring'>
          {field => (
            <div className='flex items-center'>
              <input
                type='checkbox'
                checked={field.state.value}
                onChange={e => field.handleChange(e.target.checked)}
                className='mr-2'
              />
              <label className='text-sm'>Recurring transaction</label>
            </div>
          )}
        </form.Field>

        <button
          type='submit'
          disabled={createTransactionMutation.isPending}
          className='w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50'
        >
          {createTransactionMutation.isPending ? 'Creating...' : 'Create Transaction'}
        </button>
      </form>
    </div>
  )
}
