import { randomNext } from './sky';

export const missionPeriods = [
  { title: 'Nattuppdrag', start: 0, end: 6 },
  { title: 'Morgonuppdrag', start: 6, end: 12 },
  { title: 'Eftermiddagsuppdrag', start: 12, end: 18 },
  { title: 'Kvällsuppdrag', start: 18, end: 24 },
] as const;

export function missionPeriod(hour: number) {
  const normalizedHour = ((hour % 24) + 24) % 24;
  return missionPeriods[Math.floor(normalizedHour / 6)];
}

export function randomPeriodMission<T extends { id: string; title: string }>(
  cards: T[], hour: number, currentId?: string, random = Math.random,
): T | null {
  const category = missionPeriod(hour).title.toLocaleLowerCase('sv-SE');
  const matches = cards.filter(card => card.title.trim().toLocaleLowerCase('sv-SE') === category);
  return randomNext(matches, currentId, random);
}
