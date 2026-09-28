/** Run in the browser: datetime-local values belong to the user's timezone. */
export function serializeWindowSchedule(schedule: {
  mode: string;
  opensAt: string;
  closesAt: string;
  fulfillmentAt: string;
}) {
  if (schedule.mode === "SHOP") {
    return { opensAt: null, closesAt: null, fulfillmentAt: null };
  }
  const toInstant = (value: string, label: string, required = true) => {
    if (!value && !required) return null;
    const date = new Date(value);
    if (!value || !Number.isFinite(date.getTime())) {
      throw new Error(`Choose a valid ${label} time.`);
    }
    return date.toISOString();
  };
  const opensAt = toInstant(schedule.opensAt, "opening")!;
  const closesAt = toInstant(schedule.closesAt, "closing")!;
  if (new Date(closesAt) <= new Date(opensAt)) {
    throw new Error("Closing time must be after opening time.");
  }
  return {
    opensAt,
    closesAt,
    fulfillmentAt: toInstant(schedule.fulfillmentAt, "fulfillment", false),
  };
}
