# HEMIGO — MASTER MVP BUILD PROMPT

You are a senior full-stack product engineer and product designer.

Your task is to design and build the first production-quality MVP of **Hemigo**, a Nigerian SaaS platform for vendors who sell through limited selling windows, pre-orders, weekend drops, bulk purchases, food batches, thrift releases, farm produce aggregation, and similar time-sensitive commerce.

Hemigo replaces chaotic WhatsApp ordering, screenshots of bank transfers, manual order tracking, and spreadsheet fulfillment.

The product should feel polished enough to be shown to paying vendors and early investors.

Do not build a generic admin template.

Do not create something that looks like a typical Bootstrap dashboard.

The final product should feel intentionally designed, modern, warm, premium, slightly playful, and extremely easy to understand.

---

# 1. PRODUCT POSITIONING

Hemigo enables a vendor to:

1. Create a storefront.
2. Add products.
3. Create a selling window.
4. Set when ordering opens and closes.
5. Define limited inventory.
6. Share one link with customers.
7. Accept online payments.
8. Automatically stop accepting orders when the window closes.
9. See all orders in one dashboard.
10. See aggregated quantities required for fulfillment.
11. Track revenue.
12. Manage customer fulfillment.
13. Receive their portion of payments through Paystack split payments.

The simplest description of Hemigo is:

> Sell in batches. Close on schedule. Fulfill without chaos.

Alternative internal positioning:

> Scheduled commerce for modern African sellers.

The product should especially appeal to:

- food vendors
- weekend caterers
- bakers
- thrift sellers
- fashion vendors
- farm produce aggregators
- group-buy organizers
- cosmetics vendors
- importers
- limited stock sellers
- pre-order vendors

Hemigo should NOT feel limited to food.

---

# 2. MVP GOAL

The MVP should demonstrate the full journey:

### Vendor journey

Register

→ Create business

→ Create product

→ Create selling window

→ Add products to selling window

→ Set stock

→ Set closing date/time

→ Publish storefront

→ Share storefront URL

→ Receive orders

→ See aggregated fulfillment

→ See customer list

→ See revenue

→ Mark orders fulfilled

### Customer journey

Open shared Hemigo storefront

→ View vendor

→ See countdown

→ Browse available products

→ Add item to cart

→ Checkout

→ Pay

→ Receive confirmation

→ See order summary

The experience should require almost no explanation.

---

# 3. TECH STACK

Build using:

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma ORM OR Drizzle ORM
- Next.js App Router
- Server Actions and/or Route Handlers where appropriate
- Paystack integration
- Zod validation
- React Hook Form where useful

Optional:

- Framer Motion for subtle animation
- Lucide icons
- Recharts for lightweight dashboard visualizations

Do not over-engineer the MVP.

Do not use microservices.

Keep the architecture clean enough that the platform can scale later.

---

# 4. BRAND NAME

Product name:

# HEMIGO

Display logo text simply as:

Hemigo

The brand should feel:

- modern
- trustworthy
- energetic
- African but globally polished
- friendly
- operationally reliable
- consumer-grade rather than enterprise-boring

Avoid stereotypical African patterns.

Avoid fintech clichés.

Avoid excessive gradients.

---

# 5. HEMIGO COLOR SYSTEM

Implement these as design tokens.

## Primary — Trust & Structure

### Deep Indigo

```css
#4338CA
```

Tailwind equivalent:

```text
indigo-700
```

Use for:

- Hemigo branding
- vendor navigation
- primary vendor CTA
- active dashboard elements
- links
- selected states

---

## Neutral — Slate

Use the Tailwind Slate scale.

Primary values:

```css
#F8FAFC
#F1F5F9
#E2E8F0
#CBD5E1
#64748B
#475569
#334155
#0F172A
```

Use for:

- page backgrounds
- cards
- borders
- table headers
- body copy
- secondary information

Dashboard background:

```css
#F8FAFC
```

---

# 6. SUCCESS COLOR

### Vibrant Emerald

```css
#10B981
```

Tailwind:

```text
emerald-500
```

Use sparingly.

Use for:

- successful payment
- paid state
- fulfilled state
- payout confirmation
- available/open indicators
- storefront "Claim Order" / checkout CTA

Do not use emerald as the main brand color.

---

# 7. URGENCY COLOR

### Warm Amber

```css
#F59E0B
```

Tailwind:

```text
amber-500
```

This color is extremely important to Hemigo.

Use it for:

- countdown timers
- "closing soon"
- low stock
- reservation timer
- warning states
- selling window alerts

Never use red unless something has genuinely failed.

Hemigo urgency should feel exciting, not alarming.

---

# 8. HYPE MODE

Some storefronts may use a darker storefront design.

Primary background:

```css
#18181B
```

Tailwind:

```text
zinc-900
```

Highlight:

```css
#BEF264
```

Tailwind:

```text
lime-300
```

Use for:

- fashion drops
- sneaker drops
- thrift releases
- limited weekend food releases
- high-energy storefront templates

This should eventually become a vendor-selectable storefront theme.

For the MVP, build at least one dark storefront example.

---

# 9. DESIGN INSPIRATION

The overall experience should take inspiration from companies such as:

- Chowdeck
- Linear
- Stripe
- Shopify
- Notion
- Airbnb
- modern Nigerian fintech interfaces

However:

DO NOT COPY THEIR UI.

Take inspiration from:

- confident whitespace
- large typography
- expressive illustrations
- playful microcopy
- clear information hierarchy
- strong CTA buttons
- soft visual storytelling
- polished onboarding
- friendly empty states

Hemigo should have a distinct visual personality.

---

# 10. ILLUSTRATION SYSTEM

Illustrations are important.

Use clean, modern editorial illustrations throughout the platform.

The visual style should feel somewhat similar to high-quality contemporary African startup illustrations.

Illustrations should feature relatable commerce scenarios such as:

- food vendor packaging orders
- clothes on a rack
- stack of delivery packages
- overflowing WhatsApp-style messages turning into a clean dashboard
- countdown clock
- shopping bag
- storefront
- vendor receiving orders
- customers buying limited items
- farmers and produce boxes
- baker preparing a batch
- successful payout

Keep illustrations:

- flat or semi-flat
- warm
- clean
- friendly
- slightly playful
- not childish
- not overly corporate

Do not use cheesy stock photography.

Create placeholder illustration components or use temporary SVG artwork if production illustrations are unavailable.

Leave clear component boundaries so custom illustrations can be swapped in later.

---

# 11. TYPOGRAPHY

Use a clean modern sans-serif.

Recommended:

```text
Inter
```

or:

```text
Geist
```

Heading personality should come primarily from:

- scale
- weight
- whitespace

not decorative typography.

Suggested:

```text
Hero: 64–72px desktop
H1: 48px
H2: 36px
H3: 24px
Body large: 18px
Body: 16px
Metadata: 13–14px
```

Use strong headline contrast.

---

# 12. PUBLIC MARKETING SITE

Create:

```text
/
```

The homepage needs to immediately explain Hemigo.

## Navbar

Logo:

Hemigo

Links:

- Product
- How it works
- Who it's for
- Pricing

Right:

Log in

Primary button:

Start selling

Sticky navbar on desktop.

Clean mobile navigation.

---

# 13. HOMEPAGE HERO

Suggested headline:

> Sell in batches. Fulfill without chaos.

Alternative supporting copy:

> Create a storefront, set when orders close, collect payments and know exactly what you need to prepare.

Primary CTA:

> Start selling

Secondary:

> See how it works

Hero visual:

Show an illustration or interactive UI composition where:

left:

Vendor storefront

center:

Countdown:

```text
Orders close in
02:14:37
```

right:

Aggregated fulfillment:

```text
Jollof Rice
45 portions

Chicken
37 portions

Plantain
26 portions
```

The visual should explain Hemigo without requiring text.

---

# 14. PAIN SECTION

Headline:

> WhatsApp was never meant to run your business.

Show chaotic commerce problems.

Examples:

```text
"Please send account number"

"Have you seen my payment?"

"Add two chicken"

"Can I still order?"

"I transferred since yesterday"

"Please confirm my order"
```

Use message bubbles visually.

Then transition into:

> Hemigo turns all of that into one selling link.

Illustration:

chaotic DMs

→

organized Hemigo dashboard.

---

# 15. HOW HEMIGO WORKS

Use four steps.

### 01

Create your selling window.

### 02

Add what you're selling.

### 03

Share your Hemigo link.

### 04

Prepare exactly what was ordered.

Use simple illustrations for each.

---

# 16. CORE PRODUCT FEATURES

Create a clean features section.

## Selling Windows

Set exactly when ordering starts and stops.

Example:

```text
Friday Lunch Batch

Opens
Thursday 10:00 AM

Closes
Friday 8:00 AM
```

---

## Live Countdown

Storefront automatically displays:

```text
Closes in

05:42:18
```

When the window closes:

```text
Orders are closed.
```

Do not rely only on browser state.

Backend must enforce this.

---

## Inventory Limits

Example:

```text
Only 7 left
```

Vendor can define inventory available inside each selling window.

---

## Automatic Fulfillment Summary

Example:

```text
WHAT YOU NEED TO PREPARE

Jollof Rice        45

Fried Rice         28

Chicken            61

Plantain           33
```

This should be a hero Hemigo feature.

---

## Automatic Payments

Explain:

Customer pays online.

Hemigo automatically takes its platform fee.

Vendor receives their portion through Paystack split payments.

---

# 17. INDUSTRY EXAMPLES

Show Hemigo being used by several types of vendors.

Cards:

### Weekend Food

```text
Saturday Food Box
Closes Friday 6PM
```

### Thrift

```text
Vintage September Release
24 items available
```

### Farm Produce

```text
September Tomato Batch
Orders close Wednesday
```

### Cakes

```text
Friday Cake Batch
12 slots remaining
```

Do not make Hemigo visually food-specific.

---

# 18. CTA

Final marketing CTA:

> Your next batch should be easier.

Button:

> Create your first Hemigo

Secondary:

> Log in

---

# 19. AUTHENTICATION

Routes:

```text
/login
/signup
```

Support:

- email
- password

Structure the code so phone login can be added later.

Signup UI should be minimal.

Do not overwhelm users.

---

# 20. VENDOR ONBOARDING

After signup:

```text
/onboarding
```

Create a friendly onboarding flow.

Step 1:

```text
What should customers call your business?
```

Fields:

Business name

Business category

---

Step 2:

```text
Your Hemigo link
```

Example:

```text
hemigo.ng/amaka-kitchen
```

Allow slug editing.

---

Step 3:

```text
How should customers reach you?
```

Phone

WhatsApp

Email

---

Step 4:

```text
Where should we send your money?
```

Bank

Account number

Account name

This eventually creates a Paystack Subaccount.

For development:

support test/mock payout setup.

---

# 21. DASHBOARD LAYOUT

Route:

```text
/dashboard
```

Desktop:

left navigation sidebar.

Top:

Hemigo logo

Workspace selector:

```text
Amaka's Kitchen
```

Navigation:

- Overview
- Windows
- Products
- Orders
- Customers
- Payouts

Bottom:

- Settings
- Help
- Profile

Use Deep Indigo carefully.

Do NOT create a giant indigo sidebar covering everything.

Prefer:

white/slate shell

with indigo branding and active navigation states.

Dashboard should feel calm and operational.

---

# 22. DASHBOARD OVERVIEW

Headline:

```text
Good morning, Amaka.
```

Supporting text:

```text
Here's what's happening with your store.
```

Primary CTA:

```text
+ New selling window
```

Stats:

```text
₦482,500
Sales this month
```

```text
126
Orders
```

```text
4
Selling windows
```

```text
₦463,200
Payouts
```

---

# 23. ACTIVE WINDOW COMPONENT

Large dashboard card:

```text
ACTIVE WINDOW

Sunday Lunch Batch

Closes in
04:32:18

42 orders

₦286,500 revenue
```

Buttons:

```text
View orders
```

```text
Open storefront
```

Countdown should use Amber.

---

# 24. RECENT ORDERS TABLE

Columns:

```text
Customer
Order
Items
Amount
Payment
Fulfillment
Date
```

Example:

```text
Tolu Ajayi

#HMG-1023

3 items

₦12,500

Paid

Pending

Today 11:42
```

Statuses should use clean badges.

Avoid overly rounded UI.

Use moderate border radius only.

---

# 25. SELLING WINDOWS

Route:

```text
/dashboard/windows
```

Show:

```text
Selling Windows
```

CTA:

```text
Create window
```

Filters:

- All
- Live
- Upcoming
- Closed
- Drafts

Card example:

```text
Sunday Lunch Batch

LIVE

Closes today
6:00 PM

42 Orders

₦286,500

View
```

---

# 26. CREATE WINDOW FLOW

Route:

```text
/dashboard/windows/new
```

Make this one of the best screens in the application.

Fields:

Window name

Example:

```text
Sunday Lunch Batch
```

Description

Order opening date

Order opening time

Closing date

Closing time

Optional fulfillment date

Storefront theme:

```text
Classic

Hype
```

CTA:

```text
Continue
```

---

# 27. ADD PRODUCTS TO WINDOW

Next screen:

```text
What are you selling?
```

Vendor can choose existing products.

Each selected product allows:

```text
Price

Quantity available

Maximum per customer
```

Example:

```text
Jollof Rice + Chicken

₦5,500

50 available

Max 5 / customer
```

Allow:

```text
Unlimited stock
```

if appropriate.

---

# 28. PUBLISH WINDOW

Final preview.

Show storefront preview.

Information:

```text
Sunday Lunch Batch

Opens:
Saturday 8AM

Closes:
Sunday 8AM

3 products

120 total units
```

CTA:

```text
Publish selling window
```

After publishing:

display:

```text
Your selling window is live 🎉
```

Share URL:

```text
hemigo.ng/amaka-kitchen/sunday-lunch
```

Buttons:

```text
Copy link
```

```text
Share on WhatsApp
```

WhatsApp sharing is extremely important for the Nigerian market.

---

# 29. PRODUCTS

Route:

```text
/dashboard/products
```

Display:

product image

name

default price

windows sold in

status

CTA:

```text
Add product
```

Example:

```text
Jollof Rice + Chicken

₦5,500

Used in 8 windows
```

---

# 30. ORDERS

Route:

```text
/dashboard/orders
```

This is an operational screen.

Top filters:

- All
- Paid
- Pending
- Fulfilled

Search:

```text
Search customer, phone or order number
```

Table:

```text
Order
Customer
Phone
Window
Items
Amount
Payment
Fulfillment
```

Opening an order should show a clean detail drawer or page.

---

# 31. ORDER DETAILS

Example:

```text
Order #HMG-1023
```

Customer:

```text
Tolu Ajayi
080...
```

Items:

```text
Jollof + Chicken ×2
₦11,000

Chapman ×1
₦2,000
```

Total:

```text
₦13,000
```

Payment:

```text
Paid
```

Fulfillment:

```text
Pending
```

CTA:

```text
Mark as fulfilled
```

---

# 32. FULFILLMENT VIEW

This is one of Hemigo's most important screens.

Route:

```text
/dashboard/windows/[id]/fulfillment
```

Headline:

```text
Sunday Lunch Batch
```

Show:

```text
42 customers
```

```text
₦286,500 revenue
```

And most importantly:

# Prepare

```text
Jollof Rice + Chicken

45 portions
```

```text
Fried Rice + Turkey

28 portions
```

```text
Plantain

34 portions
```

```text
Chapman

21 bottles
```

Add optional:

```text
Print fulfillment sheet
```

and:

```text
Export CSV
```

Later these can be functional.

---

# 33. CUSTOMER STOREFRONT

Route:

```text
/[vendorSlug]/[windowSlug]
```

This should feel completely different from the dashboard.

It should feel:

- beautiful
- consumer-first
- mobile-first
- fast
- exciting
- easy to purchase from

Primary customer traffic will likely come from WhatsApp.

Design mobile first.

---

# 34. STOREFRONT HEADER

Example:

```text
AMAKA'S KITCHEN

Sunday Lunch Batch
```

Seller avatar/logo.

Optional:

```text
Lagos
```

Headline:

```text
Sunday tastes better here.
```

Countdown panel:

```text
ORDERS CLOSE IN

04 : 23 : 16
```

Use Amber.

If stock is low:

```text
Selling fast
```

---

# 35. STOREFRONT PRODUCT CARD

Mobile product card:

large image.

Example:

```text
Jollof Rice + Chicken

Smoky party jollof served with grilled chicken.

₦5,500

Only 8 left
```

Quantity controls:

```text
− 1 +
```

CTA:

```text
Add to bag
```

Product imagery should dominate.

---

# 36. MOBILE CART

Sticky bottom element:

```text
3 items

₦13,500

View bag
```

Emerald CTA.

---

# 37. CART

Show:

Products

Quantities

Subtotal

Optional delivery fee

Total

Countdown warning:

```text
This selling window closes in 18 minutes.
```

CTA:

```text
Continue to checkout
```

---

# 38. CHECKOUT

Fields:

Full name

Phone number

Email optional

Fulfillment type:

```text
Delivery

Pickup
```

Delivery address if necessary.

Allow vendor to define which options are available.

Order summary.

CTA:

```text
Pay ₦13,500
```

Do not allow the browser to submit prices.

Backend should calculate everything.

---

# 39. INVENTORY RESERVATION

Critical backend requirement.

When customer starts checkout:

reserve inventory inside PostgreSQL.

Do not simply:

read stock

then update later.

Use an atomic conditional UPDATE.

Example architecture:

```sql
UPDATE window_products
SET reserved_qty = reserved_qty + $quantity
WHERE id = $product
AND (
    inventory_limit IS NULL
    OR reserved_qty + sold_qty + $quantity <= inventory_limit
)
RETURNING id;
```

If no row returns:

item is unavailable.

Use a database transaction for carts with multiple products.

Either all items reserve or none reserve.

---

# 40. INVENTORY RESERVATION EXPIRY

Reservations should expire after approximately:

```text
8 minutes
```

Display:

```text
Your items are reserved for 07:42
```

If payment fails or reservation expires:

release stock.

No item should remain permanently reserved.

---

# 41. SELLING WINDOW ENFORCEMENT

Do not rely on JavaScript countdown.

Backend must check:

```text
opens_at <= current time
```

and:

```text
closes_at > current time
```

before creating a reservation.

After the closing time:

no new checkout should be accepted.

Customers who already reserved before closing can finish payment during the reservation period.

---

# 42. PAYMENT SYSTEM

Use Paystack.

Vendor onboarding should eventually create a Paystack Subaccount.

Each Hemigo vendor stores:

```text
paystack_subaccount_code
```

Checkout:

Hemigo initializes transaction.

Transaction includes vendor Paystack subaccount.

Hemigo receives a platform percentage.

Vendor receives the remaining amount according to configured split.

For development:

use Paystack test mode.

Environment variables:

```text
PAYSTACK_SECRET_KEY

NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY
```

Do not expose the secret key.

---

# 43. PAYMENT CONFIRMATION

Never trust only the redirect page.

Implement Paystack webhook:

```text
/api/webhooks/paystack
```

Verify Paystack signature.

On successful payment:

transactionally:

```text
order.status = paid
```

Decrease:

```text
reserved_qty
```

Increase:

```text
sold_qty
```

Save:

```text
paid_at
```

Webhook processing must be idempotent.

The same payment webhook must never count inventory twice.

---

# 44. SUCCESS PAGE

Customer sees:

Illustration:

celebratory package/check.

Headline:

```text
You're in 🎉
```

Text:

```text
Your order has been confirmed.
```

Order number:

```text
#HMG-1023
```

Vendor:

```text
Amaka's Kitchen
```

Total:

```text
₦13,500
```

CTA:

```text
View order
```

Secondary:

```text
Share Hemigo
```

---

# 45. CLOSED STOREFRONT STATE

When the countdown ends:

Do not destroy the page.

Show:

```text
This selling window has closed.
```

Supporting:

```text
Amaka's Kitchen is no longer accepting orders for this batch.
```

Provide:

```text
Follow this vendor
```

or:

```text
See other selling windows
```

This can later support customer retention.

---

# 46. EMPTY STATES

Create polished illustrations and messages.

Examples:

No products:

```text
Nothing here yet.

Add your first product and make your next selling window easier.
```

No orders:

```text
Waiting for your first order.

Share your storefront link and they'll appear here.
```

No windows:

```text
Your first selling window starts here.
```

CTA:

```text
Create selling window
```

---

# 47. DEMO DATA

Seed the app.

Create sample vendor:

```text
Amaka's Kitchen
```

Products:

```text
Smoky Jollof + Chicken
₦5,500

Fried Rice + Turkey
₦6,500

Plantain
₦1,500

Chapman
₦2,000
```

Create:

```text
Sunday Lunch Batch
```

Seed approximately 20 fake customers/orders.

Also create a fashion vendor example:

```text
NOIR Lagos
```

Use the dark Hype storefront.

Products:

```text
Vintage Racing Tee

Utility Cargo

Archive Denim
```

This allows the product to demonstrate that Hemigo works outside food.

---

# 48. DATABASE MODEL

Create tables/models for:

```text
User

VendorProfile

Product

SellingWindow

WindowProduct

Order

OrderItem

Payment
```

Important:

Do not make customer and vendor separate user systems.

One user can buy and sell.

---

# 49. MONEY

Never store Naira amounts as floating-point.

Store money as:

```text
kobo integers
```

Example:

```text
₦5,500
```

becomes:

```text
550000
```

Create utility:

```ts
formatNaira();
```

---

# 50. RESPONSIVENESS

Customer storefront:

design mobile-first.

Target especially:

```text
360px
390px
430px
```

Dashboard:

desktop-first but usable on tablet and mobile.

Navigation should collapse appropriately.

---

# 51. MOTION

Use subtle animation.

Examples:

countdown number transitions

button feedback

drawer animation

publishing success

checkout success

hover elevation

Do not make the interface float or bounce excessively.

Motion must support usability.

---

# 52. COMPONENT SYSTEM

Create reusable components.

Suggested:

```text
Button
Badge
Card
Input
Select
Textarea
Modal
Drawer
Dropdown
Avatar
EmptyState
StatCard
DataTable
Countdown
Money
ProductCard
WindowCard
OrderStatus
PaymentStatus
InventoryBadge
StorefrontHeader
CartBar
IllustrationPanel
```

Create consistent variants.

---

# 53. BUTTON SYSTEM

Primary dashboard:

Indigo.

```text
bg-indigo-700
```

Customer purchase:

Emerald.

```text
bg-emerald-500
```

Warnings:

Amber.

Do not scatter random colors across the UI.

---

# 54. BORDER RADIUS

Use moderate radius.

Examples:

```text
8px

10px

12px
```

Avoid turning every element into a giant pill.

Buttons may use slightly softer rounding.

Badges may use pill rounding.

---

# 55. SHADOWS

Use subtle shadows.

Prefer borders and spacing over giant shadows.

Cards should feel structured.

---

# 56. ACCESSIBILITY

Ensure:

proper label association

keyboard navigation

focus states

contrast

button semantics

screen reader-friendly form errors

Do not use color as the only status indicator.

---

# 57. ERROR STATES

Create human-friendly errors.

Instead of:

```text
Error 500
```

Use:

```text
Something went wrong while creating your selling window.

Your changes are safe. Try again.
```

Inventory:

```text
Someone just claimed the last one.
```

or:

```text
Only 2 are left now. Update your quantity to continue.
```

---

# 58. IMPORTANT MICROCOPY

Use friendly, confident copy.

Examples:

Instead of:

```text
Submit
```

use:

```text
Publish selling window
```

Instead of:

```text
Transaction completed
```

use:

```text
You're in 🎉
```

Instead of:

```text
Out of stock
```

use:

```text
All claimed
```

Instead of:

```text
Order deadline
```

use:

```text
Orders close
```

Keep language natural for Nigerian users without overusing Nigerian slang.

---

# 59. URL STRUCTURE

Marketing:

```text
/
```

Auth:

```text
/login

/signup
```

Vendor:

```text
/dashboard

/dashboard/windows

/dashboard/windows/new

/dashboard/windows/[id]

/dashboard/windows/[id]/fulfillment

/dashboard/products

/dashboard/orders

/dashboard/customers

/dashboard/payouts

/dashboard/settings
```

Storefront:

```text
/[vendorSlug]/[windowSlug]
```

Checkout:

```text
/checkout/[windowId]
```

Success:

```text
/order/[orderId]/success
```

Customer order:

```text
/order/[orderId]
```

---

# 60. MVP PRIORITIES

Do not build every imaginable feature.

Phase 1 must prioritize:

1. Vendor onboarding
2. Product creation
3. Selling window creation
4. Storefront
5. Countdown
6. Inventory
7. Cart
8. Checkout
9. Paystack
10. Orders
11. Fulfillment aggregation
12. Basic payouts visibility

Do NOT prioritize yet:

- marketplace discovery
- vendor reviews
- customer social network
- advanced CRM
- promo codes
- affiliate programs
- subscriptions
- multi-vendor checkout
- native mobile app
- complex shipping logistics
- AI features

---

# 61. DEVELOPMENT QUALITY

Use:

TypeScript strict mode.

Reusable types.

Schema validation.

Clean folder structure.

Server-side authorization.

Proper error boundaries.

Loading states.

Skeletons.

Optimistic UI only when safe.

Avoid giant components.

Do not put all business logic inside route handlers.

Create services for:

```text
checkout

inventory

payments

windows

orders
```

---

# 62. SECURITY

Never trust:

product price from client

vendor ID from client

payment result from browser

inventory value from client

Calculate these server-side.

Validate ownership before allowing vendor operations.

Protect dashboard routes.

Validate Paystack webhook signature.

Use database constraints wherever practical.

---

# 63. FINAL QUALITY STANDARD

Before considering any page complete, ask:

Does this feel like a product a real Nigerian vendor would trust with their money?

Does the customer understand what is happening within five seconds?

Is the selling deadline obvious?

Is the next action obvious?

Does the mobile storefront feel premium?

Does the vendor dashboard reduce anxiety?

Can a vendor tell what they need to prepare without opening individual orders?

Does this look custom-designed rather than assembled from a UI kit?

If the answer is no, improve it.

---

# 64. BUILD SEQUENCE

Build the project in this order.

### Stage 1 — Foundation

Create:

Next.js project

Tailwind

fonts

design tokens

component primitives

database

authentication

seed data

---

### Stage 2 — Marketing Website

Create:

navbar

hero

problem section

how it works

features

use cases

CTA

footer

---

### Stage 3 — Vendor Dashboard

Create:

dashboard shell

overview

products

selling windows

window creation

order table

fulfillment screen

---

### Stage 4 — Customer Storefront

Create:

vendor storefront

product cards

countdown

inventory indicators

cart

checkout

closed state

---

### Stage 5 — Commerce Engine

Implement:

inventory reservation

reservation expiry

concurrent checkout protection

orders

Paystack initialization

webhook

payment finalization

---

### Stage 6 — Polish

Add:

illustrations

empty states

animations

responsive layouts

loading states

error states

seeded demos

---

# 65. FIRST OUTPUT REQUIRED

Before writing large amounts of code, produce:

1. proposed project architecture
2. database ERD
3. route map
4. component hierarchy
5. design token definitions
6. implementation phases

Then begin implementation.

Do not ask broad planning questions unless a genuinely blocking technical requirement is missing.

Make sensible product decisions based on the requirements above.

The result should be a cohesive MVP, not a collection of disconnected screens.

The product is:

# HEMIGO

And the experience should make vendors feel:

> “Finally. I don't have to manage this through WhatsApp anymore.”
