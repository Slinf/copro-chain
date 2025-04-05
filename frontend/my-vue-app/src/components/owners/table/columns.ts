import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import type { Proposal } from '../../../models/proposal';
import type { Owner } from '../../../models/owner';

export const columns: ColumnDef<Owner>[] = [
  {
    accessorKey: 'adress',
    header: () => h('div', { class: 'text-right' }, 'Address'),
    cell: ({ row }) => {
      const address = Number.parseFloat(row.getValue('address'))
      return h('div', { class: 'text-right font-medium' }, address)
    },
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Token Amount'),
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