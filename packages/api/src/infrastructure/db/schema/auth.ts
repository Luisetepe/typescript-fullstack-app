import { sql } from 'drizzle-orm'
import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core'

export const USER_TABLE = pgTable(
  'users',
  {
    id: text('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
      mode: 'date',
    })
      .default(sql`now()`)
      .notNull(),
  },
  (users) => ({
    emailIndex: uniqueIndex('email_idx').on(users.email),
  })
)

export const SESSION_TABLE = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => USER_TABLE.id),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'date',
  })
    .default(sql`now()`)
    .notNull(),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})
