import { Pause, Play } from 'lucide-react';
import type { EnergyWeatherHour } from '../lib/weather-energy';

type WeatherInfo = { date: string };
export function FullscreenWeather({ day, sample, city, storedSolarWh, productionWatts, running, finished, busy, error, startLabel, onToggle }: {
 day: WeatherInfo | null; sample: EnergyWeatherHour | null | undefined; city: string; storedSolarWh: number; productionWatts: number;
 running: boolean; finished: boolean; busy: boolean; error: string; startLabel: string; onToggle: () => void;
}) {
 return <section className="fullscreen-mission fullscreen-weather-card" aria-labelledby="fullscreen-weather-title">
  <div className="fullscreen-mission-content">
   <h2 id="fullscreen-weather-title">{city}</h2>
   {day?<><p className="fullscreen-weather-date">Gårdagens väder · {day.date}</p>
    <dl className="fullscreen-weather-values">
     <div><dt>Vind</dt><dd>{sample?`${sample.wind.toFixed(1)} m/s`:'—'}</dd></div>
     <div><dt>Möjlig lagrad solenergi</dt><dd>{(storedSolarWh/1000).toLocaleString('sv-SE',{minimumFractionDigits:2,maximumFractionDigits:2})} kWh</dd></div>
     <div><dt>El från sol + vind just nu</dt><dd>{Math.round(productionWatts)} W</dd></div>
    </dl>
    <small className="fullscreen-weather-model" title="Förenklad modell: 10 m² solceller, 20 % verkningsgrad, vindkraft högst 2 kW (från 3 m/s, full effekt vid 12 m/s). Möjlig solenergi räknas fram till klockans tid utan lagringsförluster.">Beräknat för 10 m² solceller (20 %) + 2 kW vindkraft.</small>
   </>:<p role={error?'alert':undefined}>{busy?'Hämtar gårdagens väder…':error||'Välj ort och hämta gårdagens väder på hemskärmen.'}</p>}
  </div>
  <button className="simulation-button fullscreen-start" disabled={!day||busy} onClick={onToggle}>{running?<Pause size={18}/>:<Play size={18}/>}<span>{finished?'Spela dygnet igen':startLabel}</span></button>
 </section>;
}
