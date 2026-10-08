export function daylight(hour:number,rise:number,set:number){
 const dawn=Math.max(0,rise-0.8),dusk=Math.min(24,set+0.8);
 if(hour<dawn||hour>dusk)return 0;
 if(hour<rise)return (hour-dawn)/(rise-dawn);
 if(hour>set)return 1-(hour-set)/(dusk-set);
 return 1;
}
export function skyPalette(hour:number,rise:number,set:number,cloud=0){
 const light=daylight(hour,rise,set),warm=Math.max(0,1-Math.min(Math.abs(hour-rise),Math.abs(hour-set))/1.2)*light;
 const night=[3,8,23,12,21,42],day=[47,143,207,166,221,244],grey=[81,109,132,164,182,192];
 const c=night.map((n,i)=>Math.round(n+((day[i]+(grey[i]-day[i])*cloud/100)-n)*light));
 c[3]+=Math.round(warm*48);c[4]-=Math.round(warm*25);
 return `linear-gradient(180deg,rgb(${c.slice(0,3).join(',')}) 0%,rgb(${c.slice(3).join(',')}) 100%)`;
}
export function cycleAt(initial:number,elapsed:number,duration:number){const seconds=Math.min(duration,initial+Math.max(0,elapsed));return {seconds,hour:seconds>=duration?0:seconds/duration*24,finished:seconds>=duration};}
export function solarStrength(hour:number,start:number,end:number){
 if(hour>=start&&hour<=end)return 1;
 return Math.max(0,1-(hour<start?start-hour:hour-end));
}
export function loopAt(initial:number,elapsed:number,duration:number){
 const total=initial+Math.max(0,elapsed);
 return {seconds:total%duration,cycles:Math.floor(total/duration)};
}
export function randomNext<T extends {id:string}>(cards:T[],currentId:string|undefined,random=Math.random):T|null{
 const other=cards.filter(c=>c.id!==currentId),pool=other.length?other:cards;
 return pool.length?pool[Math.floor(random()*pool.length)]:null;
}
export function weatherSeason(date:string,latitude=58){
 const month=Number(date.slice(5,7));
 const north=month>=3&&month<=5?0:month>=6&&month<=8?1:month>=9&&month<=11?2:3;
 return latitude<0?(north+2)%4:north;
}
export function weatherSun(isDay:boolean,radiation:number|undefined,cloud:number){
 if(!isDay)return 0;
 return Math.max(0,Math.min(1,Number.isFinite(radiation)?radiation!/800:1-cloud/100));
}
