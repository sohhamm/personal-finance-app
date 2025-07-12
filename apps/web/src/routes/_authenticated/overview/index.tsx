import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/overview/')({
  component: () => <div>Hello /overview/!</div>,
})
