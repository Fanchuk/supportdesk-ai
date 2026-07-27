import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

export const automationRules = pgTable('automation_rules', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    trigger: text('trigger', { enum: ['new_ticket', 'time_based', 'status_change'] }).notNull(),
    action: text('action', { enum: ['close_ticket', 'send_email', 'change_priority', 'reassign'] }).notNull(),
    conditionHours: integer('condition_hours'),
    isActive: boolean('is_active').default(true).notNull(),
    executedCount: integer('executed_count').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})
