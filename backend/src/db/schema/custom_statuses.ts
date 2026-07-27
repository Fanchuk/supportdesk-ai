import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core'

export const customStatuses = pgTable('custom_statuses', {
    id: serial('id').primaryKey(),
    label: text('label').notNull(),
    color: text('color').notNull(),
    description: text('description'),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
})