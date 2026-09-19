import type { LocationVisibility, ProductType, SellingMode, WindowStatus } from "@prisma/client";

type WindowTiming = {
  mode: SellingMode;
  status: WindowStatus;
  opensAt: Date | null;
  closesAt: Date | null;
};

export function isWindowAcceptingOrders(window: WindowTiming, now = new Date()) {
  if (window.status === "DRAFT" || window.status === "CLOSED") return false;
  if (window.mode === "SHOP") return true;
  return Boolean(window.opensAt && window.closesAt && window.opensAt <= now && window.closesAt > now);
}

export function effectiveWindowStatus(window: WindowTiming, now = new Date()) {
  if (window.status === "DRAFT") return "DRAFT" as const;
  if (window.mode === "SHOP") return "LIVE" as const;
  if (!window.opensAt || !window.closesAt) return "DRAFT" as const;
  if (window.opensAt > now) return "UPCOMING" as const;
  if (window.closesAt <= now) return "CLOSED" as const;
  return "LIVE" as const;
}

export function needsPhysicalFulfillment(types: ProductType[]) {
  return types.some((type) => type === "PHYSICAL" || type === "FOOD");
}

export function publicLocation({
  visibility,
  location,
  publicLocation,
}: {
  visibility: LocationVisibility;
  location: string | null;
  publicLocation: string | null;
}) {
  if (visibility === "PUBLIC") return location || publicLocation;
  if (visibility === "GENERAL_AREA") return publicLocation || location;
  return publicLocation || "Location shared after payment";
}
