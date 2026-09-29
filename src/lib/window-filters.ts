import { effectiveWindowStatus } from "./commerce";

export const windowFilters = [
  { value: "all", label: "All", status: null },
  { value: "live", label: "Live", status: "LIVE" },
  { value: "upcoming", label: "Upcoming", status: "UPCOMING" },
  { value: "closed", label: "Closed", status: "CLOSED" },
  { value: "drafts", label: "Drafts", status: "DRAFT" },
] as const;

export function resolveWindowFilter(value: string | string[] | undefined) {
  return windowFilters.find((filter) => filter.value === value) ?? windowFilters[0];
}

export function filterSellingWindows<T extends Parameters<typeof effectiveWindowStatus>[0]>(
  windows: T[],
  value: string | string[] | undefined,
  now = new Date(),
) {
  const filter = resolveWindowFilter(value);
  return windows.filter((window) => !filter.status || effectiveWindowStatus(window, now) === filter.status);
}
