import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const slaPolicies = pgTable('sla_policies', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  priority: text('priority').notNull(), // 'low' | 'medium' | 'high'
  firstResponseHours: integer('first_response_hours').notNull(),
  resolutionHours: integer('resolution_hours').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});