import { pgTable, serial, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { teams } from './teams'

export const assignmentRules = pgTable('assignment_rules', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    keywords: text('keywords').array().notNull(),
    teamId: integer('team_id')
        .references(() => teams.id)
        .notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})
