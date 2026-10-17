/**
 * App display language for astrology data returned by astro-fast-api.
 * This only controls the `Accept-Language` header sent with chart/analysis
 * requests (see src/api/client.ts) - it does not yet localize the app's
 * own UI text (section titles, labels, etc.), which stays in English
 * until a dedicated i18n config is added.
 */
export type AppLanguage = 'ta' | 'en';
