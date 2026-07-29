import { pgTable, serial, integer, timestamp, text, boolean } from 'drizzle-orm/pg-core'
import { tickets } from './tickets'
import { users } from './users'

export const jointSessions = pgTable('joint_sessions', {
    id: serial('id').primaryKey(),
    ticketId: integer('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }),
    isActive: boolean('is_active').default(true),
    createdAt: timestamp('created_at').defaultNow(),
})

export const jointSessionMessages = pgTable('joint_session_messages', {
    id: serial('id').primaryKey(),
    sessionId: integer('session_id').references(() => jointSessions.id, { onDelete: 'cascade' }),
    authorId: integer('author_id').references(() => users.id),
    body: text('body').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})

export const jointSessionAgents = pgTable('joint_session_agents', {
    id: serial('id').primaryKey(),
    sessionId: integer('session_id').references(() => jointSessions.id, { onDelete: 'cascade' }),
    userId: integer('user_id').references(() => users.id),
    joinedAt: timestamp('joined_at').defaultNow(),
})