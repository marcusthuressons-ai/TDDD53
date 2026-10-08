export type MissionPower = { consumptionWatts?: number; productionWatts?: number };

export const fullScaleWatts = 1000;

export function validMissionPower(mission: MissionPower) {
  return [mission.consumptionWatts, mission.productionWatts].every(value =>
    value === undefined || (typeof value === 'number' && Number.isFinite(value) && value >= 0));
}

function smoothstep(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

// Follow simulation time so pausing, changing day length and looping stay in sync.
export function missionPowerValue(mission: MissionPower | null, seconds: number, duration: number) {
  if (!mission || !validMissionPower(mission) || !Number.isFinite(seconds) || !Number.isFinite(duration) || duration <= 0 || seconds <= 0 || seconds >= duration) return 50;
  const periodSeconds = duration / 4;
  const elapsed = seconds % periodSeconds;
  const attackSeconds = Math.min(2, periodSeconds * 0.15);
  const settledBeforeEnd = Math.min(0.75, periodSeconds * 0.03);
  const returnEnd = periodSeconds - settledBeforeEnd;
  const returnSeconds = Math.min(5, periodSeconds * 0.25);
  const envelope = smoothstep(elapsed / attackSeconds) * (1 - smoothstep((elapsed - (returnEnd - returnSeconds)) / returnSeconds));
  const net = (mission.productionWatts ?? 0) - (mission.consumptionWatts ?? 0);
  const offset = Math.max(-1, Math.min(1, net / fullScaleWatts)) * 50;
  return 50 + offset * envelope;
}
