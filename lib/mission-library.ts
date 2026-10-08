import defaultMissions from './default-missions.json';

export async function loadMissionLibrary(db: D1Database) {
 const read = () => db.prepare('SELECT content FROM mission_library WHERE id = ?').bind(1).first<{content:string}>();
 let row = await read();
 if (!row) {
  // A missing library gets the bundled defaults. An intentionally empty library stays empty.
  await db.prepare('INSERT INTO mission_library (id, content) VALUES (?, ?) ON CONFLICT(id) DO NOTHING').bind(1, JSON.stringify(defaultMissions)).run();
  // Re-read so a concurrent save always wins over initialization.
  row = await read();
 }
 return row ? JSON.parse(row.content) : [];
}
