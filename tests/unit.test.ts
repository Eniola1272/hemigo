import test from "node:test";
import assert from "node:assert/strict";
import { formatNaira } from "../src/lib/utils";
import { checkoutSchema } from "../src/lib/validation/checkout";
import { windowSchema } from "../src/lib/validation/vendor";
import { serializeWindowSchedule } from "../src/lib/window-schedule";
import { filterSellingWindows, resolveWindowFilter } from "../src/lib/window-filters";

test("selling-window filters use effective schedules and preserve draft/closed states", () => {
  const now = new Date("2026-09-28T12:00:00Z");
  const base = { mode: "LAUNCH" as const, status: "UPCOMING" as const, opensAt: new Date("2026-09-28T11:00:00Z"), closesAt: new Date("2026-09-28T13:00:00Z") };
  const windows = [
    { ...base, id: "live" },
    { ...base, id: "upcoming", opensAt: new Date("2026-09-28T12:30:00Z") },
    { ...base, id: "expired", closesAt: now },
    { ...base, id: "draft", status: "DRAFT" as const },
    { ...base, id: "closed", status: "CLOSED" as const },
    { ...base, id: "shop", mode: "SHOP" as const, opensAt: null, closesAt: null },
    { ...base, id: "closed-shop", mode: "SHOP" as const, status: "CLOSED" as const },
  ];
  const ids = (filter: string) => filterSellingWindows(windows, filter, now).map((item) => item.id);
  assert.deepEqual(ids("all"), windows.map((item) => item.id));
  assert.deepEqual(ids("live"), ["live", "shop"]);
  assert.deepEqual(ids("upcoming"), ["upcoming"]);
  assert.deepEqual(ids("closed"), ["expired", "closed", "closed-shop"]);
  assert.deepEqual(ids("drafts"), ["draft"]);
  assert.deepEqual(filterSellingWindows([windows[0]], "drafts", now), []);
  assert.equal(filterSellingWindows([base], "live", base.opensAt).length, 1);
});

test("missing, invalid and repeated window filters safely select All", () => {
  for (const value of [undefined, "invalid", ["live", "closed"]]) {
    assert.equal(resolveWindowFilter(value).value, "all");
  }
});

test("Lagos form times preserve the chosen instant on a UTC server", () => {
  const previous = process.env.TZ;
  try {
    process.env.TZ = "Africa/Lagos";
    const schedule = serializeWindowSchedule({mode:"LAUNCH",opensAt:"2026-09-28T10:00",closesAt:"2026-09-28T12:30",fulfillmentAt:"2026-09-28T14:00"});
    assert.equal(schedule.opensAt, "2026-09-28T09:00:00.000Z");
    assert.equal(schedule.closesAt, "2026-09-28T11:30:00.000Z");
    assert.equal(schedule.fulfillmentAt, "2026-09-28T13:00:00.000Z");
    process.env.TZ = "UTC";
    const parsed = windowSchema.parse({name:"Test",...schedule,theme:"CLASSIC",products:[{productId:"p",priceNaira:1000,inventoryLimit:1,maxPerCustomer:1}]});
    assert.equal(parsed.closesAt!.toISOString(), schedule.closesAt);
    assert.equal(parsed.closesAt!.getTime()-parsed.opensAt!.getTime(), 150*60_000);
    assert.equal(parsed.closesAt!.getTime()-new Date("2026-09-28T11:00:00+01:00").getTime(), 90*60_000);
  } finally {
    if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;
  }
});

test("selling-window API rejects dates without a timezone", () => {
  const base={name:"Test",theme:"CLASSIC",products:[{productId:"p",priceNaira:1000,inventoryLimit:1,maxPerCustomer:1}]};
  assert.equal(windowSchema.safeParse({...base,opensAt:"2026-09-28T10:00",closesAt:"2026-09-28T12:30"}).success,false);
  assert.equal(windowSchema.safeParse({...base,opensAt:"2026-09-28T10:00:00+01:00",closesAt:"2026-09-28T12:30:00+01:00"}).success,true);
});

test("schedule rejects missing and reversed dates and clears shop timing", () => {
  const schedule={mode:"LAUNCH",opensAt:"2026-09-28T10:00",closesAt:"2026-09-28T12:30",fulfillmentAt:""};
  assert.throws(()=>serializeWindowSchedule({...schedule,opensAt:""}),/opening/);
  assert.throws(()=>serializeWindowSchedule({...schedule,closesAt:"2026-09-28T09:00"}),/after opening/);
  assert.equal(serializeWindowSchedule(schedule).fulfillmentAt,null);
  assert.deepEqual(serializeWindowSchedule({...schedule,mode:"SHOP"}),{opensAt:null,closesAt:null,fulfillmentAt:null});
});

test("formats integer kobo as Naira",()=>{assert.match(formatNaira(550000),/₦\s?5,500/)});
test("checkout requires a delivery address",()=>{const parsed=checkoutSchema.safeParse({windowId:"window",customerName:"Tolu Ajayi",customerPhone:"08012345678",customerEmail:"tolu@example.com",fulfillmentType:"Delivery",items:[{windowProductId:"product",quantity:1}]});assert.equal(parsed.success,false)});
test("selling window must close after it opens",()=>{const parsed=windowSchema.safeParse({name:"Test",opensAt:new Date("2026-09-20"),closesAt:new Date("2026-09-19"),theme:"CLASSIC",publish:true,products:[{productId:"p",priceNaira:1000,inventoryLimit:1,maxPerCustomer:1}]});assert.equal(parsed.success,false)});
