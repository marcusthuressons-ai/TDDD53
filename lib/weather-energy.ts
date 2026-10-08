import { fullScaleWatts } from './mission-power';

export type EnergyWeatherHour = { hour: number; wind: number; cloud: number; isDay: boolean; radiation?: number };

// Illustrative installation: 10 m² of solar panels at 20% efficiency and a 2 kW wind turbine.
export const solarPanelAreaM2 = 10;
export const solarPanelEfficiency = 0.2;
export const windTurbineRatedWatts = 2000;
export function solarPowerWatts(sample: EnergyWeatherHour | null | undefined) {
 if (!sample?.isDay) return 0;
 const radiation = Number.isFinite(sample.radiation) ? Math.max(0, sample.radiation!) : 800 * (1 - Math.max(0, Math.min(100, sample.cloud)) / 100);
 return radiation * solarPanelAreaM2 * solarPanelEfficiency;
}

export function windPowerWatts(sample: EnergyWeatherHour | null | undefined) {
 if (!sample || !Number.isFinite(sample.wind) || sample.wind <= 3) return 0;
 const wind = Math.min(12, sample.wind);
 return Math.min(windTurbineRatedWatts, Math.max(0, (wind ** 3 - 3 ** 3) / (12 ** 3 - 3 ** 3) * windTurbineRatedWatts));
}

export function weatherProductionWatts(sample: EnergyWeatherHour | null | undefined) {
 return solarPowerWatts(sample) + windPowerWatts(sample);
}

export function potentialSolarEnergyWh(hours: EnergyWeatherHour[], elapsedHour: number) {
 if (!Number.isFinite(elapsedHour)) return 0;
 const end = Math.max(0, Math.min(24, elapsedHour));
 return hours.reduce((energy, sample) => energy + solarPowerWatts(sample) * Math.max(0, Math.min(1, end - sample.hour)), 0);
}

export function weatherPowerValue(sample: EnergyWeatherHour | null | undefined) {
 return 50 + Math.min(1, weatherProductionWatts(sample) / fullScaleWatts) * 50;
}
