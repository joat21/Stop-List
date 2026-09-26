import {
  Dish,
  StopListEntry,
  StopListEntryView,
  StopListStatus,
} from "@stop-list/shared";

export const MS_PER_MINUTE = 60_000;

export function isActive(entry: StopListEntry, now: Date): boolean {
  if (entry.returnedAt !== null) return false;
  return new Date(entry.expiresAt).getTime() > now.getTime();
}

export function getStatus(entry: StopListEntry, now: Date): StopListStatus {
  if (entry.returnedAt !== null) return StopListStatus.RETURNED;
  return isActive(entry, now) ? StopListStatus.ACTIVE : StopListStatus.EXPIRED;
}

export function minutesLeft(entry: StopListEntry, now: Date): number {
  if (!isActive(entry, now)) return 0;
  return Math.ceil(
    (new Date(entry.expiresAt).getTime() - now.getTime()) / MS_PER_MINUTE,
  );
}

export function toView(
  entry: StopListEntry,
  dish: Dish,
  now: Date,
): StopListEntryView {
  return {
    ...entry,
    dish,
    status: getStatus(entry, now),
    minutesLeft: minutesLeft(entry, now),
  };
}
