import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transaction/')({
  component: () => <div>Hello /transactions/!</div>,
})
