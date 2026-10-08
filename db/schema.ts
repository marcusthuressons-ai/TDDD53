import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
export const missionLibrary = sqliteTable('mission_library', { id: integer('id').primaryKey(), content: text('content').notNull() });
