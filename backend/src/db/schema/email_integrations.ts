import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'

export const emailIntegrations = pgTable('email_integrations', {
    id: serial('id').primaryKey(),
    email: text('email').notNull(),
    provider: text('provider').notNull(), // 'Gmail' | 'Outlook' | 'SMTP'
    host: text('host').notNull(),
    port: integer('port').notNull(),
    login: text('login').notNull(),
    isActive: boolean('is_active').default(true),
    receivedToday: integer('received_today').default(0),
    sentToday: integer('sent_today').default(0),
    lastSyncAt: timestamp('last_sync_at').defaultNow(),
    createdAt: timestamp('created_at').defaultNow(),
})