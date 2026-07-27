import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { teams } from './teams'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role', { enum: ['admin', 'manager', 'agent'] }).default('agent').notNull(),
  teamId: integer('team_id').references(() => teams.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
