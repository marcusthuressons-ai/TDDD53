import { missionPeriod } from './mission-schedule';

function missionEnding(title: string | undefined, seconds: number, duration: number) {
 if (!title || !Number.isFinite(seconds) || !Number.isFinite(duration) || duration <= 0 || seconds <= 0 || seconds >= duration) return false;
 const period = missionPeriod(seconds / duration * 24);
 if (title.trim().toLocaleLowerCase('sv-SE') !== period.title.toLocaleLowerCase('sv-SE')) return false;
 const periodSeconds = duration / 4;
 return seconds % periodSeconds >= periodSeconds - Math.min(3, periodSeconds * 0.15);
}

export function missionCelebrating(title: string | undefined, seconds: number, duration: number) {
 return missionEnding(title, seconds, duration) && missionPeriod(seconds / duration * 24).start !== 12;
}

export function missionFailing(title: string | undefined, seconds: number, duration: number) {
 return missionEnding(title, seconds, duration) && missionPeriod(seconds / duration * 24).start === 12;
}
