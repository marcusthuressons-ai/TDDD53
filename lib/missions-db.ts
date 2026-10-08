import { env } from 'cloudflare:workers';
export function missionDb() { if (!env.DB) throw new Error('Mission database unavailable'); return env.DB; }
