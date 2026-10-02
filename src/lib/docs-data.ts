export interface DocHeading {
  id: string;
  title: string;
}

export interface DocSection {
  slug: string;
  title: string;
  category: string;
  subtitle: string;
  readingTime: string;
  headings: DocHeading[];
  content: {
    overview: string;
    sections: {
      id: string;
      heading: string;
      body: string;
      callout?: {
        tone: "info" | "tip" | "warning";
        title: string;
        text: string;
      };
      steps?: {
        stepNumber: string;
        title: string;
        description: string;
        actionLink?: { label: string; href: string };
      }[];
      keyPoints?: string[];
      codeSnippet?: {
        language: string;
        code: string;
        filename?: string;
      };
    }[];
  };
}

export interface DocCategory {
  name: string;
  items: {
    slug: string;
    title: string;
    badge?: string;
    description: string;
  }[];
}

export const DOCS_CATEGORIES: DocCategory[] = [
  {
    name: "Get started",
    items: [
      {
        slug: "introduction",
        title: "Introduction",
        description: "What is Hemigo and why it transforms social commerce.",
      },
      {
        slug: "quickstart",
        title: "Quickstart Guide",
        badge: "5 min",
        description: "Step-by-step to launch your storefront and take orders.",
      },
    ],
  },
  {
    name: "Core Concepts",
    items: [
      {
        slug: "selling-windows",
        title: "Selling Windows",
        description: "Batch drops, countdown deadlines, and continuous shops.",
      },
      {
        slug: "products-and-inventory",
        title: "Products & Cloud Media",
        description: "Product catalogs, cloud photo uploads, and event tickets.",
      },
    ],
  },
  {
    name: "Fulfillment & Operations",
    items: [
      {
        slug: "fulfillment-and-orders",
        title: "Fulfillment & Prep Lists",
        description: "Automated totals, packing slips, and order lifecycle.",
      },
      {
        slug: "messaging-and-invoicing",
        title: "Chat & Invoicing",
        description: "3-panel messaging inbox, custom invoices, and buyer notes.",
      },
    ],
  },
  {
    name: "Payments & Settlement",
    items: [
      {
        slug: "payments-and-payouts",
        title: "Payments, Fees & Payouts",
        description: "Paystack checkout, receipts, pricing, and bank settlements.",
      },
    ],
  },
  {
    name: "Growth & Tips",
    items: [
      {
        slug: "sharing-and-growth",
        title: "Sharing & Social Commerce",
        description: "WhatsApp tips, Instagram bio links, and QR codes.",
      },
    ],
  },
];

export const DOCS_ARTICLES: Record<string, DocSection> = {
  introduction: {
    slug: "introduction",
    title: "Introduction to Hemigo",
    category: "Get started",
    subtitle: "Commerce built for launches, food drops, vintage releases, and calm fulfillment.",
    readingTime: "4 min read",
    headings: [
      { id: "what-is-hemigo", title: "What is Hemigo?" },
      { id: "whatsapp-problem", title: "The WhatsApp Commerce Problem" },
      { id: "how-hemigo-fixes-it", title: "How Hemigo Fixes It" },
      { id: "who-uses-hemigo", title: "Who Uses Hemigo?" },
      { id: "next-steps", title: "Where to Go Next" },
    ],
    content: {
      overview:
        "Hemigo is a modern commerce platform tailored for independent Nigerian businesses, creators, bakers, chefs, and event hosts who sell in batches or drops. Instead of managing orders through chaotic DMs and lost bank screenshots, Hemigo gives you a clean selling link, upfront Paystack payments, and automated prep summaries.",
      sections: [
        {
          id: "what-is-hemigo",
          heading: "What is Hemigo?",
          body: "Unlike traditional shopping carts designed for 10,000-SKU corporate warehouses, Hemigo is purpose-built for the rhythm of modern social commerce. You decide what you're selling, set an order cutoff deadline or leave your window open, share your link, and let Hemigo handle inventory reservation, payment collection, and fulfillment tracking.",
          callout: {
            tone: "info",
            title: "Core Philosophy",
            text: "Sell in batches. Collect upfront. Fulfill without chaos. No more recounting orders at midnight or answering 'Have you seen my transfer?'.",
          },
          keyPoints: [
            "Branded storefront URL (e.g. hemigo.com.ng/amaka-kitchen)",
            "Time-limited selling windows with live countdown timers",
            "Automatic Paystack card, bank transfer, and USSD payments",
            "Real-time prep list calculating exact item counts to fulfill",
            "Built-in customer chat box and automated receipt emails",
          ],
        },
        {
          id: "whatsapp-problem",
          heading: "The WhatsApp Commerce Problem",
          body: "Most social merchants start on WhatsApp, Instagram DMs, or Twitter. While great for chatting, social apps are awful at running a business when multiple orders come in at once:",
          steps: [
            {
              stepNumber: "01",
              title: "Payment screenshot chasing",
              description: "Sellers waste hours cross-referencing bank alerts against blurry customer transfer screenshots.",
            },
            {
              stepNumber: "02",
              title: "Accidental overselling",
              description: "By the time you tell a 5th customer their size is available, another customer has already paid for the same piece.",
            },
            {
              stepNumber: "03",
              title: "Manual tallying chaos",
              description: "Before prep day, you have to scroll through dozens of individual chat histories to write down how many bowls, shirts, or boxes were ordered.",
            },
          ],
        },
        {
          id: "how-hemigo-fixes-it",
          heading: "How Hemigo Fixes It",
          body: "Hemigo streamlines the entire process into a continuous 3-part engine:",
          keyPoints: [
            "1. You share a single clean link on your WhatsApp Status, Instagram Bio, or TikTok.",
            "2. Customers select their items, choose pickup or delivery, and pay securely via Paystack.",
            "3. Every completed order instantly reserves stock, emails a branded receipt, and adds to your live fulfillment batch dashboard.",
          ],
          callout: {
            tone: "tip",
            title: "Zero Setup Headache",
            text: "You don't need a domain registrar, hosting servers, or custom code. Your Hemigo storefront is live immediately after creating your free account.",
          },
        },
        {
          id: "who-uses-hemigo",
          heading: "Who Uses Hemigo?",
          body: "Hemigo is designed for makers and sellers whose stock is tied to batches, drops, or specific event schedules:",
          keyPoints: [
            "Chefs & Home Bakers: Taking orders for Friday cake batches or Sunday food boxes.",
            "Vintage & Thrift Curators: Launching curated fashion releases where each piece is 1-of-1.",
            "Farm Produce & Grocers: Coordinating preorders for weekly fresh harvest deliveries.",
            "Event Organizers: Selling tickets, RSVP badges, and handling entry QR check-ins.",
            "Artisans & Crafters: Releasing handcrafted leather, ceramics, candles, or jewelry.",
          ],
        },
        {
          id: "next-steps",
          heading: "Where to Go Next",
          body: "Ready to launch your first store? Follow our quickstart guide to get set up in under 5 minutes.",
          steps: [
            {
              stepNumber: "→",
              title: "Quickstart Guide",
              description: "Step-by-step walkthrough to create your account, add products, and open a selling window.",
              actionLink: { label: "Go to Quickstart", href: "/docs?topic=quickstart" },
            },
            {
              stepNumber: "→",
              title: "Understanding Selling Windows",
              description: "Deep dive into countdown deadlines, stock limits, and batch fulfillment.",
              actionLink: { label: "Learn Selling Windows", href: "/docs?topic=selling-windows" },
            },
          ],
        },
      ],
    },
  },

  quickstart: {
    slug: "quickstart",
    title: "Quickstart: Launch in 5 Minutes",
    category: "Get started",
    subtitle: "The complete checklist to go from zero to taking orders on your Hemigo storefront.",
    readingTime: "5 min read",
    headings: [
      { id: "step-1-signup", title: "1. Create Your Account" },
      { id: "step-2-store-profile", title: "2. Set Up Your Vendor Store" },
      { id: "step-3-add-products", title: "3. Add Products & Cloud Photos" },
      { id: "step-4-create-window", title: "4. Launch a Selling Window" },
      { id: "step-5-share-link", title: "5. Share Your Link & Collect Orders" },
    ],
    content: {
      overview:
        "You can launch a fully functional Hemigo store and start collecting Paystack payments in 5 minutes. This guide walks you through every step from registration to sharing your link.",
      sections: [
        {
          id: "step-1-signup",
          heading: "1. Create Your Account",
          body: "Start by registering your free account on Hemigo. You can use your work email or sign up directly with your Google account.",
          callout: {
            tone: "info",
            title: "Email Verification",
            text: "When you register, you will receive a verification link sent from hello@hemigo.com.ng. Click the link in your email to verify your store.",
          },
          steps: [
            {
              stepNumber: "01",
              title: "Visit the signup page",
              description: "Navigate to /signup and enter your name, email, and password.",
              actionLink: { label: "Open Signup", href: "/signup" },
            },
            {
              stepNumber: "02",
              title: "Check your inbox",
              description: "Confirm your email address using the link sent to your inbox to unlock your vendor dashboard.",
            },
          ],
        },
        {
          id: "step-2-store-profile",
          heading: "2. Set Up Your Vendor Store",
          body: "During your first login, the onboarding wizard will ask for your business name, bio, and your preferred store URL handle (slug).",
          keyPoints: [
            "Store Name: E.g., 'Amaka's Kitchen' or 'Urban Thrift Studio'",
            "Store URL Slug: E.g., hemigo.com.ng/amaka-kitchen (choose a clean, memorable handle)",
            "Pickup & Delivery Settings: Specify your city/location and delivery terms so buyers know what to expect.",
          ],
        },
        {
          id: "step-3-add-products",
          heading: "3. Add Products & Cloud Photos",
          body: "Go to your Vendor Dashboard → Products to add the items you want to sell. Hemigo includes built-in high-speed cloud photo uploads.",
          keyPoints: [
            "Title & Description: Clear details on sizes, ingredients, or specifications.",
            "Price (in ₦): The amount the customer will pay at checkout.",
            "Stock Quantity: Total number of units available. Hemigo automatically decrements stock when paid.",
            "Product Image: Click 'Upload Image' to upload crisp photos directly from your phone or laptop.",
          ],
          callout: {
            tone: "tip",
            title: "Cloud Photo Storage",
            text: "Hemigo uses optimized cloud storage for product photos. Upload high-res images and they will load blazing fast for your buyers across mobile networks.",
          },
        },
        {
          id: "step-4-create-window",
          heading: "4. Launch a Selling Window",
          body: "A Selling Window determines when your store is accepting orders and when checkout closes:",
          steps: [
            {
              stepNumber: "A",
              title: "Batch Launch (Drop)",
              description: "Pick an order opening date and a strict order deadline (e.g., 'Orders close Friday at 6:00 PM'). A live countdown will show on your storefront.",
            },
            {
              stepNumber: "B",
              title: "Always-Open Shop",
              description: "For merchants selling continuous stock without a fixed weekly deadline.",
            },
          ],
        },
        {
          id: "step-5-share-link",
          heading: "5. Share Your Link & Collect Orders",
          body: "Once your selling window is live, copy your link from the dashboard. Paste it into your WhatsApp status, broadcast lists, Instagram bio, or Twitter.",
          callout: {
            tone: "tip",
            title: "Pro-Tip for Drops",
            text: "Post a teaser 24 hours before your window opens. Because customers can see the countdown timer, they get ready to buy as soon as it hits zero.",
          },
        },
      ],
    },
  },

  "selling-windows": {
    slug: "selling-windows",
    title: "Understanding Selling Windows",
    category: "Core Concepts",
    subtitle: "The core mechanic of Hemigo: batch drops, countdown timers, and clean order cutoffs.",
    readingTime: "4 min read",
    headings: [
      { id: "what-is-a-window", title: "What is a Selling Window?" },
      { id: "window-modes", title: "Launch Drops vs Always-Open Shops" },
      { id: "countdown-timers", title: "How Countdown Timers Drive Sales" },
      { id: "editing-windows", title: "Editing & Modifying Active Windows" },
    ],
    content: {
      overview:
        "Selling Windows are what set Hemigo apart from typical eCommerce tools. Instead of an endlessly open cart that leaves you guessing how much stock to prepare, a window creates an organized ordering period with a defined fulfillment schedule.",
      sections: [
        {
          id: "what-is-a-window",
          heading: "What is a Selling Window?",
          body: "A Selling Window is an active sales event attached to a specific fulfillment batch. When a window is open, customers can view products and pay. When the window reaches its closing deadline, Hemigo automatically closes checkout so you can prepare all orders in peace.",
          keyPoints: [
            "Start & End Timestamps: Set the exact hour ordering opens and closes.",
            "Fulfillment Target Date: Tell customers when their orders will be shipped or ready for pickup.",
            "Order Caps & Limits: Set maximum order counts across the window to protect your operational capacity.",
          ],
        },
        {
          id: "window-modes",
          heading: "Launch Drops vs Always-Open Shops",
          body: "Hemigo supports two primary window modes depending on your business model:",
          steps: [
            {
              stepNumber: "01",
              title: "Launch / Batch Drop",
              description: "Ideal for weekly food drops, preorder runs, limited apparel drops, and events. Features an active countdown clock and automatic closure.",
            },
            {
              stepNumber: "02",
              title: "Always-Open Shop",
              description: "Ideal for standard retail where products are kept continuously in stock. Orders roll in steadily without an artificial cutoff.",
            },
          ],
        },
        {
          id: "countdown-timers",
          heading: "How Countdown Timers Drive Sales",
          body: "When you run a Launch Drop, a real-time countdown timer is displayed at the top of your storefront. This communicates urgency to buyers, discouraging procrastination and reducing uncommitted abandoned carts.",
          callout: {
            tone: "info",
            title: "Automated Cutoff",
            text: "When the countdown hits zero, the checkout button automatically locks. You never have to manually remember to turn off ordering while you are busy preparing items.",
          },
        },
        {
          id: "editing-windows",
          heading: "Editing & Modifying Active Windows",
          body: "Need to extend the closing time or adjust your pickup notes? You can edit any active window at any time:",
          steps: [
            {
              stepNumber: "01",
              title: "Open Windows list",
              description: "Go to Dashboard → Selling Windows.",
            },
            {
              stepNumber: "02",
              title: "Click Edit",
              description: "Click the Edit button on the window card to modify titles, descriptions, closing times, or fulfillment dates.",
            },
            {
              stepNumber: "03",
              title: "Save Changes",
              description: "Save changes and you are immediately returned to your window management center.",
            },
          ],
        },
      ],
    },
  },

  "products-and-inventory": {
    slug: "products-and-inventory",
    title: "Product Catalog & Cloud Media",
    category: "Core Concepts",
    subtitle: "Manage inventory, upload high-resolution photos, and configure event ticket tiers.",
    readingTime: "4 min read",
    headings: [
      { id: "adding-products", title: "Adding Products" },
      { id: "cloud-uploads", title: "Cloud Photo Uploads" },
      { id: "stock-limits", title: "Stock Limits & Preventing Overselling" },
      { id: "ticket-tiers", title: "Ticket & Event Tier Configurations" },
    ],
    content: {
      overview:
        "Your product catalog holds everything you sell: physical goods, freshly made dishes, digital items, or event tickets. With Hemigo's built-in cloud media storage, your storefront displays fast, crisp imagery.",
      sections: [
        {
          id: "adding-products",
          heading: "Adding Products",
          body: "From your dashboard, click '+ Add Product'. Each item includes a title, description, price, inventory limit, and image.",
          keyPoints: [
            "Title & Subheading: Keep it concise and appetizing or descriptive.",
            "Price: Displayed clearly in Nigerian Naira (₦).",
            "Customer Limits: You can limit the quantity a single customer can purchase to prevent hoarders from buying out entire batches.",
          ],
        },
        {
          id: "cloud-uploads",
          heading: "Cloud Photo Uploads",
          body: "Hemigo integrates cloud file storage so you don't have to compress or host images elsewhere. Drag and drop or select an image file (JPEG, PNG, WEBP) directly from your phone or computer.",
          callout: {
            tone: "tip",
            title: "Image Best Practices",
            text: "Use square or 4:3 ratio photos with bright, natural lighting. Crisp photos dramatically increase checkout conversion on mobile devices.",
          },
        },
        {
          id: "stock-limits",
          heading: "Stock Limits & Preventing Overselling",
          body: "Whenever a customer checks out via Paystack, Hemigo holds and decrements stock in real-time. If you only have 20 pieces available, Hemigo will not let a 21st buyer check out, eliminating uncomfortable refund calls.",
        },
        {
          id: "ticket-tiers",
          heading: "Ticket & Event Tier Configurations",
          body: "Selling tickets for a concert, workshop, or dinner party? Hemigo supports ticketed selling windows:",
          steps: [
            {
              stepNumber: "01",
              title: "Create Ticket Tiers",
              description: "Configure Early Bird, Regular, or VIP tickets with distinct price points and ticket allocations.",
            },
            {
              stepNumber: "02",
              title: "Automated QR Passes",
              description: "Upon payment, attendees instantly receive a digital ticket with a unique verification QR code and reference number.",
            },
            {
              stepNumber: "03",
              title: "Gate Check-In",
              description: "Use your phone camera in Dashboard → Events to scan attendees at the entrance.",
            },
          ],
        },
      ],
    },
  },

  "fulfillment-and-orders": {
    slug: "fulfillment-and-orders",
    title: "Fulfillment & Prep Lists",
    category: "Fulfillment & Operations",
    subtitle: "Turn dozens of paid orders into an exact kitchen, sourcing, or packing prep list.",
    readingTime: "4 min read",
    headings: [
      { id: "prep-summary", title: "The Automated Prep Summary" },
      { id: "order-lifecycle", title: "Order Status Lifecycle" },
      { id: "customer-delivery", title: "Customer Delivery Information" },
      { id: "packing-slips", title: "Packing Slips & Exports" },
    ],
    content: {
      overview:
        "Fulfillment is where social merchants lose the most sleep. Scrolling through 50 chats to count how many beef vs chicken boxes to make is exhausting. Hemigo automatically computes your totals the second orders are paid.",
      sections: [
        {
          id: "prep-summary",
          heading: "The Automated Prep Summary",
          body: "Under each selling window, click 'Fulfillment Prep' to see your aggregate totals:",
          keyPoints: [
            "Aggregated item totals: E.g., '48 Jollof Bowls, 22 Fried Rice, 70 Grilled Chicken'.",
            "Zero math required: No Excel spreadsheets or scrap-paper counting.",
            "Real-time updates: As last-minute buyers complete payment before the window closes, the count updates immediately.",
          ],
          callout: {
            tone: "info",
            title: "Never Overcook or Undersource",
            text: "You buy and prepare precisely what was paid for. Waste drops to zero and profitability stays high.",
          },
        },
        {
          id: "order-lifecycle",
          heading: "Order Status Lifecycle",
          body: "Track every order through clear status stages in your dashboard:",
          steps: [
            {
              stepNumber: "PAID",
              title: "Confirmed Payment",
              description: "Paystack verified the transaction. Funds are credited and receipt sent to the customer.",
            },
            {
              stepNumber: "PREPARING",
              title: "In Production / Packed",
              description: "Items are being cooked, sewn, or boxed up.",
            },
            {
              stepNumber: "READY",
              title: "Dispatched / Ready for Pickup",
              description: "Rider dispatched or customer notified for collection.",
            },
            {
              stepNumber: "COMPLETED",
              title: "Fulfilled",
              description: "Delivery received and order closed out.",
            },
          ],
        },
        {
          id: "customer-delivery",
          heading: "Customer Delivery Information",
          body: "Every order card captures the buyer's full name, phone number, delivery address, and any specific notes (such as allergy instructions or landmark directions).",
        },
        {
          id: "packing-slips",
          heading: "Packing Slips & Exports",
          body: "Need physical slips for dispatch riders or dispatch boxes? Click 'Print Packing Slips' on your window fulfillment page to generate clean, printable receipts formatted for courier bags.",
        },
      ],
    },
  },

  "messaging-and-invoicing": {
    slug: "messaging-and-invoicing",
    title: "Chat & Invoicing",
    category: "Fulfillment & Operations",
    subtitle: "Built-in 3-panel chat box, order inquiries, and custom customer invoices.",
    readingTime: "3 min read",
    headings: [
      { id: "inbox-overview", title: "The 3-Panel Messaging Inbox" },
      { id: "order-linked-chats", title: "Order-Linked Conversations" },
      { id: "custom-invoices", title: "Creating Custom Invoices" },
      { id: "verified-buyer-badges", title: "Verified Buyer Badges" },
    ],
    content: {
      overview:
        "Hemigo includes a built-in messaging suite designed specifically for commerce. Buyers can ask questions about items or delivery, and you can respond without leaving your store dashboard.",
      sections: [
        {
          id: "inbox-overview",
          heading: "The 3-Panel Messaging Inbox",
          body: "Inspired by modern desk tools, the Hemigo messaging center provides:",
          keyPoints: [
            "Left Panel: All active conversations, filterable by unread status and customer name.",
            "Center Panel: Real-time chat thread with message timestamps and delivery ticks.",
            "Right Panel: Customer context card showing the customer's purchase history, active orders, and delivery details.",
          ],
        },
        {
          id: "order-linked-chats",
          heading: "Order-Linked Conversations",
          body: "When a customer initiates a message from their order receipt, the conversation is automatically tagged with their order ID. You never have to ask 'What did you order?' or 'What is your address?'.",
        },
        {
          id: "custom-invoices",
          heading: "Creating Custom Invoices",
          body: "Have a client requesting a custom cake, bulk catering order, or wholesale order? You can generate a custom Hemigo invoice with bespoke line items, and share an instant Paystack payment link.",
          callout: {
            tone: "tip",
            title: "Fast Payment",
            text: "Custom invoices use the same one-click Paystack checkout flow as your main storefront.",
          },
        },
        {
          id: "verified-buyer-badges",
          heading: "Verified Buyer Badges",
          body: "Messages from customers who have completed paid orders display a green 'Verified Buyer' badge, helping you prioritize inquiries from active customers.",
        },
      ],
    },
  },

  "payments-and-payouts": {
    slug: "payments-and-payouts",
    title: "Payments, Fees & Payouts",
    category: "Payments & Settlement",
    subtitle: "Accept cards, USSD, and bank transfers via Paystack, transparent pricing, and bank payouts.",
    readingTime: "4 min read",
    headings: [
      { id: "paystack-integration", title: "How Paystack Checkout Works" },
      { id: "transactional-receipts", title: "Verified Email Receipts" },
      { id: "pricing-structure", title: "Transparent Pricing: ₦1,000 & 4%" },
      { id: "bank-settlement", title: "Connecting Bank Accounts & Payouts" },
    ],
    content: {
      overview:
        "Hemigo handles payment processing securely so you never have to ask for transfer receipts. Customers pay online through Paystack, and funds are tracked and settled directly into your Nigerian bank account.",
      sections: [
        {
          id: "paystack-integration",
          heading: "How Paystack Checkout Works",
          body: "When buyers click 'Pay Now' on your storefront, Paystack launches a secure inline modal supporting:",
          keyPoints: [
            "Debit / Credit Cards (Mastercard, Visa, Verve)",
            "Bank Transfer (with instantaneous instant payment confirmation)",
            "USSD & QR Code",
            "Apple Pay (where enabled)",
          ],
          callout: {
            tone: "info",
            title: "Immediate Confirmation",
            text: "No waiting for network delays or uncredited transfers. As soon as the customer authorizes payment, the order is locked in.",
          },
        },
        {
          id: "transactional-receipts",
          heading: "Verified Email Receipts",
          body: "Every completed order automatically triggers a receipt email to the buyer sent from hello@hemigo.com.ng. The email includes a secure link to view their digital receipt and track fulfillment status.",
        },
        {
          id: "pricing-structure",
          heading: "Transparent Pricing: ₦1,000 & 4%",
          body: "Hemigo is built with transparent, fair pricing designed to scale with your business:",
          steps: [
            {
              stepNumber: "FREE",
              title: "First Month Free",
              description: "New merchants enjoy full vendor access free for their first 30 days to test and launch their store.",
            },
            {
              stepNumber: "₦1,000",
              title: "Vendor Subscription",
              description: "After your trial, vendor access is just ₦1,000 monthly.",
            },
            {
              stepNumber: "4%",
              title: "Commerce Processing Fee",
              description: "A 4% fee per completed transaction covers payment gateway charges, automated transactional emails, cloud media hosting, and platform infrastructure.",
            },
          ],
        },
        {
          id: "bank-settlement",
          heading: "Connecting Bank Accounts & Payouts",
          body: "In your Vendor Dashboard → Payouts / Billing, select your Nigerian bank and enter your 10-digit NUBAN account number. Hemigo verifies the account name in real time.",
          callout: {
            tone: "tip",
            title: "Settlement Schedule",
            text: "Settlements are processed automatically into your verified bank account according to standard Paystack settlement schedules (typically T+1 business days).",
          },
        },
      ],
    },
  },

  "sharing-and-growth": {
    slug: "sharing-and-growth",
    title: "Sharing & Social Commerce Tips",
    category: "Growth & Tips",
    subtitle: "Strategies to maximize sales from WhatsApp Status, Instagram, and physical popups.",
    readingTime: "3 min read",
    headings: [
      { id: "clean-store-url", title: "Your Custom Store URL" },
      { id: "whatsapp-strategy", title: "WhatsApp Status & Broadcast Strategy" },
      { id: "instagram-bio", title: "Instagram Bio & Link Stickers" },
      { id: "printable-qr", title: "Printable QR Codes for Popups" },
      { id: "support-channels", title: "Getting Help & Contacting Support" },
    ],
    content: {
      overview:
        "Having a storefront is only half the formula — driving traffic to it is the other. Here are proven tactics used by top Hemigo merchants to sell out their windows in record time.",
      sections: [
        {
          id: "clean-store-url",
          heading: "Your Custom Store URL",
          body: "Your store URL is clean, short, and brandable: hemigo.com.ng/@your-store. It loads fast on 3G and 4G mobile connections and looks professional in bios and flyers.",
        },
        {
          id: "whatsapp-strategy",
          heading: "WhatsApp Status & Broadcast Strategy",
          body: "WhatsApp is your warmest audience. Here is a proven 3-post strategy for drop day:",
          steps: [
            {
              stepNumber: "1",
              title: "24 Hours Before: The Teaser",
              description: "Post product photos or cooking prep videos. Caption: 'Orders open tomorrow at 10 AM. Limited slots! Set your reminders.'",
            },
            {
              stepNumber: "2",
              title: "Drop Time: The Drop Link",
              description: "Post the storefront link with clear deadline: 'We are LIVE! Orders close Friday at 6 PM. Order here: hemigo.com.ng/your-store'.",
            },
            {
              stepNumber: "3",
              title: "Closing Alert: The 2-Hour Warning",
              description: "Post a screenshot of remaining slots: 'Only 6 slots left before ordering closes!'. Urgency drives the remaining sales.",
            },
          ],
        },
        {
          id: "instagram-bio",
          heading: "Instagram Bio & Link Stickers",
          body: "Place your Hemigo link directly in your Instagram bio link. In Instagram Stories, use the 'Link' sticker with customized sticker text like 'Order Here' or 'Shop the Drop'.",
        },
        {
          id: "printable-qr",
          heading: "Printable QR Codes for Popups",
          body: "Selling at a weekend market, campus fair, or popup? Generate a QR code linking to your Hemigo storefront or specific event ticket. Customers scan, choose, pay on their own phones, and show you the confirmed receipt on screen.",
        },
        {
          id: "support-channels",
          heading: "Getting Help & Contacting Support",
          body: "Need help setting up your store, configuring payments, or requesting new features? Our team is available to assist you:",
          keyPoints: [
            "Email: hello@hemigo.com.ng",
            "Contact Form: hemigo.com.ng/contact",
            "Operating Hours: Monday – Saturday, 8:00 AM – 7:00 PM WAT",
          ],
        },
      ],
    },
  },
};
