async function remote(url:URL){const r=await fetch(url,{signal:AbortSignal.timeout(15000)});if(!r.ok)throw new Error('Weather service unavailable');return r.json() as Promise<any>;}
export async function GET(request:Request){
 try{
  const params=new URL(request.url).searchParams,city=params.get('city');
  if(city!==null){if(city.trim().length<2||city.length>100)return Response.json({error:'Skriv minst två tecken i ortnamnet.'},{status:400});const url=new URL('https://geocoding-api.open-meteo.com/v1/search');url.search=new URLSearchParams({name:city.trim(),count:'8',language:'sv',format:'json'}).toString();const data=await remote(url);return Response.json({locations:(data.results||[]).map((l:any)=>({id:l.id,name:l.name,country:l.country,region:l.admin1,latitude:l.latitude,longitude:l.longitude,timezone:l.timezone}))});}
  const lat=Number(params.get('lat')),lon=Number(params.get('lon')),zone=params.get('timezone')||'Europe/Stockholm';
  if(!params.has('lat')||!params.has('lon')||!Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180)return Response.json({error:'Välj en ort först.'},{status:400});
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const date=new Date(today+'T12:00:00Z');date.setUTCDate(date.getUTCDate()-1);const yesterday=date.toISOString().slice(0,10);
  const url=new URL('https://api.open-meteo.com/v1/forecast');url.search=new URLSearchParams({latitude:String(lat),longitude:String(lon),hourly:'temperature_2m,cloud_cover,rain,snowfall,wind_speed_10m,wind_gusts_10m,wind_direction_10m,is_day,shortwave_radiation',daily:'sunrise,sunset',wind_speed_unit:'ms',past_days:'1',forecast_days:'1',timezone:zone}).toString();
  const d=await remote(url),h=d.hourly,indices=h.time.map((t:string,i:number)=>t.startsWith(yesterday)?i:-1).filter((i:number)=>i>=0);
  if(indices.length<23)throw new Error('Incomplete weather');
  const hours=indices.map((i:number)=>({hour:Number(h.time[i].slice(11,13)),temperature:h.temperature_2m[i],cloud:h.cloud_cover[i],rain:h.rain[i],snow:h.snowfall[i],wind:h.wind_speed_10m[i],gust:h.wind_gusts_10m[i],direction:h.wind_direction_10m[i],isDay:h.is_day[i]===1,radiation:h.shortwave_radiation?.[i]??undefined}));
  if(hours.some((h:any)=>[h.cloud,h.wind,h.gust,h.temperature,h.rain,h.snow].some(v=>v===null)))throw new Error('Incomplete weather');
  const index=d.daily.time.indexOf(yesterday);return Response.json({date:yesterday,timezone:zone,hours,sunrise:d.daily.sunrise[index],sunset:d.daily.sunset[index],source:'Open-Meteo · modellerat väder'}, {headers:{'Cache-Control':'no-store'}});
 }catch(e){console.error(e);return Response.json({error:'Gårdagens väder kunde inte hämtas. Försök igen eller välj årstidsläget.'},{status:503});}
}
