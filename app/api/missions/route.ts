import { missionDb } from '../../../lib/missions-db';
import { loadMissionLibrary } from '../../../lib/mission-library';
import { validMissionPower, type MissionPower } from '../../../lib/mission-power';
export async function GET() {
 try { return Response.json({cards:await loadMissionLibrary(missionDb())}, {headers:{'Cache-Control':'no-store'}}); }
 catch(e) { console.error(e); return Response.json({error:'Uppdragen kunde inte hämtas. Försök igen.'},{status:503}); }
}
export async function PUT(request: Request) {
 try { const {cards} = await request.json() as {cards: (MissionPower & {id:string;title:string;text:string;sunStart?:number;sunEnd?:number;windStart?:number;windEnd?:number;windSpeed?:number;season?:number})[]};
 if (!Array.isArray(cards) || cards.length > 50 || cards.some(c=>typeof c.id !== 'string' || typeof c.title !== 'string' || !c.title.trim() || c.title.length > 100 || typeof c.text !== 'string' || c.text.length > 2000)) return Response.json({error:'Varje uppdrag behöver en rubrik. Högst 50 uppdrag.'},{status:400});
 if(cards.some(c=>(c.sunStart!==undefined||c.sunEnd!==undefined)&&(!Number.isInteger(c.sunStart)||!Number.isInteger(c.sunEnd)||c.sunStart!<0||c.sunStart!>=24||c.sunEnd!>24||c.sunEnd!<=c.sunStart!)))return Response.json({error:'Solens sluttid måste vara efter starttiden, inom samma dygn.'},{status:400});
 if(cards.some(c=>(c.windStart!==undefined||c.windEnd!==undefined||c.windSpeed!==undefined)&&(!Number.isInteger(c.windStart)||!Number.isInteger(c.windEnd)||c.windStart!<0||c.windStart!>=24||c.windEnd!>24||c.windEnd!<=c.windStart!||!Number.isFinite(c.windSpeed)||c.windSpeed!<0||c.windSpeed!>30)))return Response.json({error:'Välj ett giltigt vindintervall och en vindstyrka mellan 0 och 30 m/s.'},{status:400});
 if(cards.some(c=>c.season!==undefined&&(!Number.isInteger(c.season)||c.season<0||c.season>3)))return Response.json({error:'Välj vår, sommar, höst eller vinter.'},{status:400});
 if(cards.some(c=>!validMissionPower(c)))return Response.json({error:'Förbrukning och produktion måste vara noll eller positiva tal i watt.'},{status:400});
 const clean = cards.map(c=>({id:c.id,title:c.title.trim(),text:c.text.trim(),...(c.consumptionWatts!==undefined?{consumptionWatts:c.consumptionWatts}:{}),...(c.productionWatts!==undefined?{productionWatts:c.productionWatts}:{}),...(c.season!==undefined?{season:c.season}:{}),...(c.sunStart!==undefined?{sunStart:c.sunStart,sunEnd:c.sunEnd}:{}),...(c.windStart!==undefined?{windStart:c.windStart,windEnd:c.windEnd,windSpeed:c.windSpeed}:{})}));
 await missionDb().prepare('INSERT INTO mission_library (id, content) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET content = excluded.content').bind(1,JSON.stringify(clean)).run(); return Response.json({cards:clean});
 } catch(e) {console.error(e); return Response.json({error:'Kunde inte spara. Din text finns kvar. Försök igen.'},{status:503});}
}
