import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { tickets } from './tickets'
import { users } from './users'

export const messages = pgTable('messages', {
    id: serial('id').primaryKey(),
    body: text('body').notNull(),
    ticketId: integer('ticket_id')
        .references(() => tickets.id)
        .notNull(),
    authorId: integer('author_id')
        .references(() => users.id)
        .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})
