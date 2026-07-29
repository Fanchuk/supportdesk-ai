import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const savedAnswers = pgTable('saved_answers', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    category: text('category').notNull(),
    body: text('body').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
})