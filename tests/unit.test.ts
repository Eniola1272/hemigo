import test from "node:test";
import assert from "node:assert/strict";
import { formatNaira } from "../src/lib/utils";
import { checkoutSchema } from "../src/lib/validation/checkout";
import { windowSchema } from "../src/lib/validation/vendor";

test("formats integer kobo as Naira",()=>{assert.match(formatNaira(550000),/₦\s?5,500/)});
test("checkout requires a delivery address",()=>{const parsed=checkoutSchema.safeParse({windowId:"window",customerName:"Tolu Ajayi",customerPhone:"08012345678",customerEmail:"tolu@example.com",fulfillmentType:"Delivery",items:[{windowProductId:"product",quantity:1}]});assert.equal(parsed.success,false)});
test("selling window must close after it opens",()=>{const parsed=windowSchema.safeParse({name:"Test",opensAt:new Date("2026-09-20"),closesAt:new Date("2026-09-19"),theme:"CLASSIC",publish:true,products:[{productId:"p",priceNaira:1000,inventoryLimit:1,maxPerCustomer:1}]});assert.equal(parsed.success,false)});
