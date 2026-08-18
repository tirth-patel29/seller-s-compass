# Seller's Compass

Build a functional, scalable MVP web application called ExportSetu.

ExportSetu is a digital export-enablement platform for Indian artisans, small traders and MSMEs. It helps a small Indian seller create a professional product listing, reach international buyers, receive an order, complete export-readiness requirements, submit the order into a DNK export workflow, and track the shipment.

This is an SIH 2026 internal hackathon prototype based on the Dak Ghar Niryat Kendra (DNK) problem statement.

The goal is NOT to rebuild the Government of India DNK system, customs infrastructure, payment infrastructure, or logistics infrastructure.

The goal is to demonstrate the missing digital layer connecting:

Indian Seller → International Buyer → Order → Export Readiness → DNK → Shipment → Tracking

1. CORE PRODUCT IDEA

Build a trusted digital marketplace + export assistant.

A seller with limited technical knowledge should be able to:

Register

Create a seller profile

Add a product

Get AI-assisted product content

Publish the product internationally

Receive an international order

Complete export-readiness requirements

Submit the order to a simulated DNK integration

View shipment status

An international buyer should be able to:

Browse Indian products

View seller trust information

Purchase a product

View order/export status

Track the shipment

2. IMPORTANT IMPLEMENTATION RULES

DO NOT:

Build a generic Amazon clone

Build a traditional government portal

Implement real customs infrastructure

Implement real ICEGATE integration

Implement real DNK production APIs

Implement a real payment gateway

Build a complex microservice architecture

Add unnecessary libraries

Add unnecessary features simply to make the app larger

Use fake government claims

Pretend that a simulated API is an official government integration

Instead:

Build a clean functional MVP

Use mock data initially

Keep external integrations behind service interfaces

Make the architecture ready for future official API integration

Keep the code modular and maintainable

Make the main user journey completely clickable

3. TECH STACK

Use:

Frontend:

React

TypeScript

Tailwind CSS

Routing:

React Router

Backend / Data:

Supabase-ready architecture

Supabase Auth

Supabase PostgreSQL

Supabase Storage

For the initial prototype:

Use seeded/mock data where necessary.

Do NOT block the application because real Supabase credentials or government API credentials are unavailable.

Create a clean service layer so mock services can later be replaced with real APIs.

Suggested service structure:

src/services/

authService

productService

orderService

exportService

shipmentService

aiService

dnkService

The application should be able to run with mock data while maintaining the same service interfaces.

4. USER ROLES

Create three roles:

SELLER

Indian artisan / MSME / small exporter.

Permissions:

Manage profile

Create products

Manage products

View marketplace performance

View orders

Complete export readiness

Submit export request

Track shipments

BUYER

International customer.

Permissions:

Browse marketplace

View products

View seller verification

Place orders

View orders

Track shipments

ADMIN

Operational dashboard.

Permissions:

View sellers

View orders

View export requests

View shipment status

View DNK requests

5. MAIN DEMO STORY

The application must be designed around one complete demo journey.

Use this example data:

Seller:
Meena Handicrafts

Location:
Kutch, Gujarat, India

Product:
Handcrafted Kutch Embroidery Bag

Price:
₹1,999

Destination:
United States

Buyer:
Emily Carter

DNK:
Anand DNK

The demo flow should be:

Seller Login
→
Seller Dashboard
→
Add Product
→
AI Listing Assistance
→
Publish Product
→
Buyer Marketplace
→
Product Details
→
Seller Trust
→
Checkout
→
Order Created
→
Seller Orders
→
Export Readiness
→
Complete Missing Information
→
Submit to DNK
→
DNK Success Response
→
Shipment Tracking
→
Buyer Tracking

Every important step must be clickable.

6. ROUTES

Create these routes:

Public:

/
/marketplace
/product/:id
/seller/:id
/login

Seller:

/seller/dashboard
/seller/products
/seller/products/new
/seller/products/:id/edit
/seller/orders
/seller/orders/:id
/seller/orders/:id/export
/seller/orders/:id/dnk
/seller/shipments/:id

Buyer:

/buyer/orders
/buyer/orders/:id

Admin:

/admin
/admin/export-orders

7. GLOBAL LAYOUT

Create two primary application layouts.

Marketplace Layout

Top navigation:

ExportSetu logo

Explore
Categories
Verified Sellers
How It Works

Right:

Search
Login

Buyer account when logged in.

Seller Dashboard Layout

Left sidebar:

Dashboard
Products
Orders
Export Readiness
Shipments

Settings

Bottom:

Profile / seller name

Top header:

Search
Notifications
Profile

The interface must feel like a polished modern SaaS product.

8. VISUAL DESIGN

Use a clean, trustworthy visual system.

Primary:
Deep navy / dark blue

Accent:
Subtle saffron/orange inspired by Indian identity

Success:
Green

Background:
White / very light neutral

Text:
Dark charcoal

Cards:
White with subtle borders

Use:

Rounded cards

Clean typography

Consistent spacing

Minimal shadows

Strong hierarchy

Accessible contrast

Responsive design

Do NOT use:

Excessive gradients

Heavy glassmorphism

Neon colors

Cartoon visuals

Excessive animation

Overly rounded childish UI

Old government-portal styling

Animations should be subtle:

Hover

Page transitions

Progress updates

Toast notifications

Loading states

9. LANDING PAGE

Hero:

Headline:

Take Your Products From India to the World.

Subheadline:

Create your digital storefront, reach international buyers and simplify your export journey through DNK-enabled logistics.

CTA:

Start Selling

Secondary CTA:

Explore Products

Hero visual should represent:

Indian Seller
→
International Buyer
→
DNK
→
Global Delivery

Below hero show four trust metrics:

1,000+ DNKs
Verified Sellers
International Shipping
End-to-End Tracking

Create a section:

Everything a small exporter needs to go global.

Feature cards:

Global Marketplace
Seller Verification
AI Product Assistant
Export Readiness
DNK Workflow
Shipment Tracking

Add a simple "How it works" section with four steps:

List

Sell

Export

Deliver

10. SELLER ONBOARDING

Create a clean multi-step onboarding page.

Progress:

Profile
Business
Verification
Ready

Fields:

Full Name
Business / Artisan Name
Mobile Number
Email
Location
Business Type
Primary Category

Use example:

Meena Handicrafts
Kutch, Gujarat

Verification state:

Verified

Do not build real KYC integration.

Use simulated verification state:

"Identity verification completed"

11. SELLER DASHBOARD

Dashboard header:

Good morning, Meena 👋

Stats:

Products
12

Active Orders
8

Export Orders
5

Revenue
₹48,250

Main cards:

Export Readiness

82%
Almost Ready

3 orders need attention

Button:
Review Orders

Recent Orders

Order ID
Product
Buyer
Destination
Value
Status

Product Performance

Views
Orders
Conversion

Keep this dashboard useful but not overloaded.

12. PRODUCT CREATION

Create:

/seller/products/new

Fields:

Product Name
Category
Description
Price
Currency
Weight
Dimensions
Available Quantity
Country of Origin

Image upload.

Important feature:

Generate with AI

Clicking it should populate:

Suggested Product Title
International Description
Keywords
Category

Use mocked AI generation if no API is connected.

Allow user to edit generated content before saving.

Buttons:

Generate
Regenerate
Use Listing
Save Draft
Publish Product

13. MARKETPLACE

Create a polished international marketplace.

Top:

Search products

Filters:

Category
Price
Country of Origin
Verified Sellers
International Shipping

Product cards:

Image
Product Name
Price
Origin
Seller
Verified badge
Shipping Available

Example product:

Handcrafted Kutch Embroidery Bag

₹1,999

Gujarat, India

✓ Verified Seller

International Shipping

The marketplace should feel global and premium.

14. PRODUCT DETAILS

Layout:

Left:
Large product image gallery

Right:

Product Name
Price
Seller
Origin
Availability
Shipping estimate

Trust area:

✓ Seller Verified
✓ Product Origin Declared
✓ International Shipping
✓ Shipment Tracking

CTA:

Buy Now

Secondary:

Add to Cart

Below:

Export & Delivery

Show:

Order
↓
DNK
↓
Customs
↓
International Delivery

Also show seller information.

15. SELLER TRUST PROFILE

Create:

/seller/:id

Header:

Verified Artisan

Meena Handicrafts

Kutch, Gujarat, India

Trust indicators:

Identity Verified
Business Verified
Product Origin Declared
Export Enabled

Statistics:

128 Orders
124 Successful Deliveries
4.9 Rating

Seller story:

Short human-readable story describing the artisan/business.

Display products.

This screen is important because international buyer trust is one of the core problems being solved.

16. CHECKOUT

Create a simple checkout.

Sections:

Shipping Address
Order Summary
Shipping
Payment

Show:

Product price
Shipping
Estimated fees
Total

Payment can be mocked.

Button:

Place Order

After placement:

Show success page:

Order Confirmed

Order ID:
ORD-10241

Button:

Track Order

17. SELLER ORDER DETAILS

Create:

/seller/orders/:id

Show:

Order ID
Buyer
Destination
Product
Quantity
Order Value

Primary component:

Export Readiness

Large score:

82%

Status:

Almost Ready

Checklist:

Seller Information ✓
Product Information ✓
Destination ✓
Package Information ✓
Export Information ⚠
Required Documents ⚠
DNK Information ✓

At the bottom:

2 steps remaining before DNK submission.

CTA:

Complete Export Details

18. EXPORT READINESS FLOW

This is one of the most important components.

Create a guided checklist.

Example:

Seller Details

Complete

Product Details

Complete

Destination

Complete

Package Details

Incomplete

Required Documents

Incomplete

When user clicks an incomplete item:

Show the required fields.

Example:

Package Dimensions

Length
Width
Height

After completion:

Change to:

✓ Complete

Progress automatically updates.

When everything is completed:

Show:

Export Ready

Status:
Ready for DNK submission

CTA:

Submit to DNK

19. DNK SUBMISSION

Create:

/seller/orders/:id/dnk

Show summary:

Order
Destination
Product
Package Weight
Package Value

DNK selector:

Select DNK

Default:

Anand DNK

Button:

Submit Export Request

On click, call the mock dnkService.

Simulate a short loading state.

Then show:

Export Request Created

PBE Reference:
DNK2026XXXX

DNK:
Anand DNK

Status:
Submitted

Customs:
Pending

Shipment:
Preparing

Important UI copy:

"Prototype integration. Production deployment would connect to authorized government APIs."

Do not claim real government submission has happened.

20. SHIPMENT TRACKING

Create a shipment timeline.

Stages:

Order Confirmed ✓
Export Processing ✓
DNK Submitted ✓
Customs Processing ●
Dispatched ○
In Transit ○
Delivered ○

Show:

Tracking ID
Destination
Estimated Delivery
Current Status

Use mock tracking events.

Example:

Aug 18
DNK submission created

Aug 19
Package accepted

Aug 20
Customs processing

Aug 22
International dispatch

Keep the tracking experience visually strong.

21. BUYER ORDER TRACKING

Buyer sees:

Your Order Is On Its Way

Product image

Product name

Seller

Destination

Timeline:

Order Confirmed
Export Processing
DNK Processing
Customs
International Transit
Delivered

Show:

Tracking ID
Estimated Delivery

Buyer should NOT need to understand export terminology to know what is happening.

22. ADMIN DASHBOARD

Create:

/admin

Metrics:

Total Sellers
Active Orders
Export Orders
Pending DNK Requests
Shipments In Transit

Charts can be simple.

Create:

Recent Export Orders table.

Columns:

Order ID
Seller
Destination
DNK
Value
Status
Date

Filters:

Pending
DNK Submitted
Customs
In Transit
Delivered

23. MOCK DATA

Seed enough data so the interface never looks empty.

Create at least:

8 sellers
15 products
10 orders
6 export orders
4 shipments

Use realistic Indian product examples:

Kutch embroidery
Handloom textile
Terracotta decor
Wood craft
Indian paintings
Handcrafted bags
Traditional jewelry
Decorative handicrafts

Use realistic international destinations:

USA
UK
Germany
Australia
Canada

24. DATA MODEL

Prepare the app around these entities:

users

sellers

products

orders

order_items

export_orders

documents

shipments

tracking_events

Create logical relationships.

Conceptually:

Seller
→ Products

Buyer
→ Orders

Order
→ Export Order

Export Order
→ Shipment

Shipment
→ Tracking Events

25. SERVICE ABSTRACTION

Do NOT hard-code government/API logic directly inside pages.

Use service functions.

Example:

dnkService.submitExport(order)

shipmentService.getTracking(shipmentId)

productService.createProduct(product)

orderService.createOrder(order)

aiService.generateListing(productData)

For now these services can use mock data.

This is critical for future scalability.

26. AI FEATURE

Create an AI abstraction instead of hard-wiring the entire app to an AI provider.

Function:

generateProductListing()

Input:

Product name
Category
Description
Product image metadata

Output:

Title
Description
Keywords
Highlights

For the prototype, a deterministic mock response is acceptable.

Add an obvious place in code where a real AI provider can later be connected.

27. ERROR / LOADING / EMPTY STATES

Every major page must have:

Loading state
Error state
Empty state
Success state

Example:

No Products:

"You haven't added any products yet."

Button:

Add Your First Product

Do not leave blank pages.

28. RESPONSIVENESS

Must work on:

Desktop
Tablet
Mobile

Seller dashboard should collapse sidebar on smaller screens.

Marketplace cards should become responsive grids.

Checkout and tracking should be mobile friendly.

29. ACCESSIBILITY

Use:

Semantic HTML
Accessible labels
Keyboard navigation
Readable contrast
Visible focus states
Proper button states

30. SECURITY-READY STRUCTURE

Do not expose secrets in frontend code.

Use environment variables for:

Supabase
AI provider
Future integrations

Do not hard-code API keys.

Role checks should be represented clearly.

31. WHAT TO PRIORITIZE

Priority 1:

Seller → Product → Marketplace → Buyer → Order → Export Readiness → DNK → Tracking

Priority 2:

Seller trust
AI product listing
Admin dashboard

Priority 3:

Analytics
Advanced filters
Reviews
Advanced settings

Do not spend development effort on low-priority features before the complete primary workflow works.

32. MOST IMPORTANT REQUIREMENT

The prototype must feel like ONE CONNECTED PRODUCT.

Do not build isolated screens.

This exact interaction must work:

Seller logs in
→ adds product
→ product appears in marketplace
→ buyer opens product
→ buyer sees verified seller
→ buyer orders
→ seller receives order
→ export readiness appears
→ seller completes missing information
→ seller submits to DNK
→ simulated DNK response appears
→ shipment is created
→ tracking updates
→ buyer can see tracking

Persist state during the session so that changes in one part of the application appear in the relevant other screens.

33. DEVELOPMENT APPROACH

Start by creating:

App shell

Routing

Design system

Mock data

Service layer

Seller flow

Marketplace flow

Buyer flow

Export flow

Tracking flow

Admin flow

Do NOT spend the initial implementation on decorative visuals.

Functionality and navigation come first.

After the complete flow works, refine the visual polish.

34. FINAL PRODUCT FEEL

The finished application should communicate these five ideas immediately:

TRUST

Verified sellers and transparent export status.

SIMPLICITY

A first-time seller can understand what to do.

GLOBAL REACH

Indian products can be discovered by international customers.

EXPORT ENABLEMENT

The platform converts a normal marketplace order into an export-ready workflow.

DNK

DNK acts as the postal/export backbone rather than being unnecessarily rebuilt.

Final brand message:

ExportSetu

Take Your Products From India to the World.

Supporting line:

Digital storefront. Trusted buyers. Assisted exports. DNK-enabled delivery.

Build the MVP with production-quality component structure, but keep external integrations mocked and clearly abstracted so the project remains scalable and hackathon-feasible.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/985500ec-aa78-4578-b37a-c8c4d45b1bcb).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
