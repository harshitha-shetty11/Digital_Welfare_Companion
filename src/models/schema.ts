import { pgTable, serial, text, jsonb, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const welfareSchemes = pgTable('welfare_schemes', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  nameHindi: text('name_hindi'),
  nameTamil: text('name_tamil'),
  nameTelugu: text('name_telugu'),
  nameBengali: text('name_bengali'),
  nameMarathi: text('name_marathi'),
  description: text('description').notNull(),
  descriptionHindi: text('description_hindi'),
  descriptionTamil: text('description_tamil'),
  descriptionTelugu: text('description_telugu'),
  descriptionBengali: text('description_bengali'),
  descriptionMarathi: text('description_marathi'),
  category: text('category').notNull(), // 'agriculture', 'education', 'health', 'employment', 'housing'
  eligibility: jsonb('eligibility').notNull(),
  documents: jsonb('documents').notNull(),
  applicationProcess: text('application_process').notNull(),
  applicationProcessHindi: text('application_process_hindi'),
  benefitAmount: text('benefit_amount'),
  state: text('state'), // null for central schemes
  isActive: boolean('is_active').default(true),
  applicationUrl: text('application_url'),
  contactInfo: jsonb('contact_info'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const userSessions = pgTable('user_sessions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  userProfile: jsonb('user_profile'),
  conversationHistory: jsonb('conversation_history'),
  language: text('language').default('hi'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const userQueries = pgTable('user_queries', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull(),
  query: text('query').notNull(),
  language: text('language').notNull(),
  response: text('response'),
  matchedSchemes: jsonb('matched_schemes'),
  timestamp: timestamp('timestamp').defaultNow()
});
