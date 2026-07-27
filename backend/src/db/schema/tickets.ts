import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { users } from './users'
import { teams } from './teams'

export const tickets = pgTable('tickets', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: text('status', { enum: ['open', 'in_progress', 'closed'] })
        .default('open')
        .notNull(),
    priority: text('priority', { enum: ['low', 'medium', 'high'] })
        .default('medium')
        .notNull(),
    category: text('category'),
    assignedToId: integer('assigned_to_id').references(() => users.id),
    teamId: integer('team_id').references(() => teams.id),
    createdById: integer('created_by_id').references(() => users.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
