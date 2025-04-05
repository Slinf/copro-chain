import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import type { Owner } from '../../../models/owner';

export const columns: ColumnDef<Owner>[] = [
  {
    accessorKey: 'address',
    header: () => h('div', { class: 'text-left' }, 'Address'),
    cell: ({ row }) => {
      const address = row.getValue('address') as string
      return h('div', { class: 'text-left font-medium' }, address)
    },
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'COPRO Token Amount'),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as string

      return h('div', { class: 'text-right font-medium' }, amount)
    },
  },
  {
    accessorKey: 'status',
    header: () => h('div', { class: 'text-right' }, 'Status'),
    cell: ({ row }) => {
      const status = row.getValue('status') as string

      return h('div', { class: 'text-right font-medium' }, status)
    },
  },
]