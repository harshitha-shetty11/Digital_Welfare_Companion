"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueries = exports.userSessions = exports.welfareSchemes = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.welfareSchemes = (0, pg_core_1.pgTable)('welfare_schemes', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    nameHindi: (0, pg_core_1.text)('name_hindi'),
    nameTamil: (0, pg_core_1.text)('name_tamil'),
    nameTelugu: (0, pg_core_1.text)('name_telugu'),
    nameBengali: (0, pg_core_1.text)('name_bengali'),
    nameMarathi: (0, pg_core_1.text)('name_marathi'),
    description: (0, pg_core_1.text)('description').notNull(),
    descriptionHindi: (0, pg_core_1.text)('description_hindi'),
    descriptionTamil: (0, pg_core_1.text)('description_tamil'),
    descriptionTelugu: (0, pg_core_1.text)('description_telugu'),
    descriptionBengali: (0, pg_core_1.text)('description_bengali'),
    descriptionMarathi: (0, pg_core_1.text)('description_marathi'),
    category: (0, pg_core_1.text)('category').notNull(),
    eligibility: (0, pg_core_1.jsonb)('eligibility').notNull(),
    documents: (0, pg_core_1.jsonb)('documents').notNull(),
    applicationProcess: (0, pg_core_1.text)('application_process').notNull(),
    applicationProcessHindi: (0, pg_core_1.text)('application_process_hindi'),
    benefitAmount: (0, pg_core_1.text)('benefit_amount'),
    state: (0, pg_core_1.text)('state'),
    isActive: (0, pg_core_1.boolean)('is_active').default(true),
    applicationUrl: (0, pg_core_1.text)('application_url'),
    contactInfo: (0, pg_core_1.jsonb)('contact_info'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.userSessions = (0, pg_core_1.pgTable)('user_sessions', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    sessionId: (0, pg_core_1.text)('session_id').notNull(),
    userProfile: (0, pg_core_1.jsonb)('user_profile'),
    conversationHistory: (0, pg_core_1.jsonb)('conversation_history'),
    language: (0, pg_core_1.text)('language').default('hi'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow()
});
exports.userQueries = (0, pg_core_1.pgTable)('user_queries', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    sessionId: (0, pg_core_1.text)('session_id').notNull(),
    query: (0, pg_core_1.text)('query').notNull(),
    language: (0, pg_core_1.text)('language').notNull(),
    response: (0, pg_core_1.text)('response'),
    matchedSchemes: (0, pg_core_1.jsonb)('matched_schemes'),
    timestamp: (0, pg_core_1.timestamp)('timestamp').defaultNow()
});
//# sourceMappingURL=schema.js.map