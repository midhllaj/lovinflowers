/**
 * All site copy in one place, so an Arabic version (content/ar.ts) can be
 * added later with the same shape. Product text lives in /data/products.ts.
 */
export const copy = {
  nav: {
    home: "Home",
    collection: "Collection",
    events: "Events",
    about: "About",
    contact: "Contact",
    design: "Design your own",
    menu: "Menu",
    close: "Close",
    order: "Order on WhatsApp",
    skip: "Skip to content",
  },

  whatsapp: {
    enquire: "Enquire on WhatsApp",
    ask: "Ask about availability",
    float: "Chat with us on WhatsApp",
    productMessage:
      "Hello! I'm interested in {name}. Link: {url}. Could you share the price and availability for delivery in Dubai?",
    availabilityMessage:
      "Hello! I'm interested in {name}. Link: {url}. I see it's currently unavailable — could you let me know when it's back, or suggest something similar for delivery in Dubai?",
    generalMessage: "Hello! I'd like to order flowers for delivery in Dubai.",
    eventMessage: "Hello! I'd like to talk about flowers for an event.",
  },

  home: {
    eyebrow: "Florist · Dubai",
    heroLines: ["Love,", "arranged", "by hand."],
    heroIntro:
      "Bouquets and baskets made each morning in our studio, and at your door across Dubai the same day.",
    heroCta: "See the collection",
    scroll: "Scroll",

    occasionsLabel: "Shop by occasion",
    occasionsTitle: "Every reason\nto send flowers",
    occasionNotes: {
      Love: "Roses, said properly",
      Birthday: "Bright, big, unforgettable",
      Congratulations: "For the wins, big and small",
      "New Baby": "Soft colours, gentle scent",
      "Get Well": "A little sunshine, delivered",
    },

    featuredLabel: "Featured arrangements",
    featuredTitle: "This week\nfrom the studio",
    featuredAll: "View all",

    designLabel: "Made by you",
    designTitle: "Design your\n*own* bouquet",
    designBody:
      "Choose the shape, paint in your favourite flowers, pick the paper and write the ribbon. Send it to us on WhatsApp and we'll make it by hand.",
    designSteps: ["Choose a shape", "Paint in your flowers", "Send it on WhatsApp"],
    designCta: "Start designing",
    designRibbon: "Made by you",

    storyLabel: "Our story",
    storyTitle: "A small studio\nwith big flowers",
    storyBody: [
      "Lovin Flowers is a small studio with a marble counter, a full fridge and a lot of roses. Every stem is chosen by hand, and every arrangement is made the day it leaves us.",
      "We like flowers that are full, generous and a little bold — the kind that make someone stop in the doorway.",
    ],
    storyCta: "Read our story",

    marquee: ["Same-day delivery across Dubai", "Made by hand each morning", "Order on WhatsApp"],

    eventsLabel: "Events & custom orders",
    eventsTitle: "Weddings, launches,\nlobbies, dinners",
    eventsBody:
      "From a single statement piece to a full ballroom, we design flowers around your day. Tell us the date and the feeling — we'll take it from there.",
    eventsCta: "Plan an event",

    reviewsLabel: "Kind words",
    reviewsTitle: "Loved in\nAl Karama",
    reviewsRated: "Rated on Google reviews",
    reviewsCta: "Read all reviews on Google",
    reviewsIntro: "Every bouquet is made to be remembered. Here's what our customers in Dubai say about us on Google.",
    reviewsSource: "Google review",
    stars: (n: number) => `${n} out of 5 stars`,

    galleryLabel: "From the studio",
    galleryTitle: "Recently made",
  },

  collection: {
    label: "The collection",
    title: "Flowers for\nevery reason",
    intro:
      "Everything is made to order on the day. Message us on WhatsApp for prices, colours and same-day delivery across Dubai.",
    type: "Type",
    occasion: "Occasion",
    all: "All",
    count: (n: number) => (n === 1 ? "1 arrangement" : `${n} arrangements`),
    empty: "Nothing here just yet — message us and we'll make something for you.",
    clear: "Clear filters",
  },

  product: {
    back: "Back to the collection",
    delivery: "Same-day delivery across Dubai",
    deliveryNote: "Order early in the day for delivery today. Every arrangement is made fresh, the day it leaves us.",
    stems: "In the arrangement",
    occasions: "Good for",
    outOfStock: "Currently unavailable",
    related: "You may also like",
    view: "View",
    photo: (i: number, n: number) => `Photo ${i} of ${n}`,
  },

  about: {
    label: "About",
    title: "Flowers,\nmade personal",
    intro:
      "We are a Dubai flower studio with one rule: send flowers you would be proud to receive.",
    sections: [
      {
        title: "Chosen by hand",
        body: "Fresh flowers arrive at the studio through the week from growers we trust. We go through every box by hand, and only the best stems make it to the counter.",
      },
      {
        title: "Made on the day",
        body: "Nothing waits in a fridge for days. Your bouquet is made the morning it's delivered, so it opens beautifully at home and lasts.",
      },
      {
        title: "Delivered with care",
        body: "We deliver across Dubai, from the Marina to Mirdif. Flowers travel upright and out of the sun, and arrive the way they left us.",
      },
    ],
    quote: "We want the moment the door opens to feel like a celebration.",
    cta: "See what we're making",
  },

  events: {
    label: "Events",
    title: "Flowers for\nthe big days",
    intro:
      "Weddings, launches, hotel lobbies and dinners for twelve. We design around your space and your story, then build and install on the day.",
    services: [
      {
        key: "weddings",
        title: "Weddings",
        body: "Bridal bouquets, aisle arrangements, stages and tables. We meet you early, sample colours and stay with you to the last petal.",
      },
      {
        key: "corporate",
        title: "Corporate",
        body: "Launch events, gala dinners and weekly flowers for reception desks. Reliable, on brand and always on time.",
      },
      {
        key: "hotels",
        title: "Hotels & restaurants",
        body: "Lobby statements, suite welcomes and table posies, refreshed on a schedule that suits your guests.",
      },
      {
        key: "custom",
        title: "Custom designs",
        body: "A colour you can't find, a shape you've imagined, a gift with a story. Bring us the idea and we'll make it real.",
      },
    ],
    processLabel: "How it works",
    process: [
      { title: "Tell us", body: "Send the date, the place and a few pictures you love on WhatsApp." },
      { title: "We design", body: "We come back with a plan, flower choices and a clear quote." },
      { title: "We deliver", body: "Our team builds, installs and clears away. You enjoy the day." },
    ],
    cta: "Talk to us about your event",
  },

  contact: {
    label: "Contact",
    title: "Say hello",
    intro: "The quickest way to order is WhatsApp — send us a message and we'll reply with photos, prices and delivery times.",
    whatsapp: "WhatsApp",
    phone: "Phone",
    email: "Email",
    address: "Studio",
    hours: "Hours",
    instagram: "Instagram",
    tiktok: "TikTok",
    delivery: "We deliver across Dubai, seven days a week.",
    mapLabel: "Visit the studio",
    directions: "Get directions",
    pending: "Our contact details are on their way. In the meantime, use the WhatsApp button and we'll get straight back to you.",
  },

  footer: {
    line: "Luxury flowers, made by hand in Dubai.",
    explore: "Explore",
    follow: "Follow",
    rights: "All rights reserved.",
    delivery: "Same-day delivery across Dubai",
  },

  design: {
    label: "Design your own",
    title: "Your bouquet,\n*your* way",
    intro:
      "Pick a shape, paint in your flowers, choose the paper and ribbon. When it looks right, send it to us on WhatsApp and we'll make it by hand.",
    tabs: { flowers: "Flowers", wrapping: "Wrapping", finishing: "Finishing" },
    shape: "Shape",
    flowers: "Flowers",
    paintHint: "Pick a flower, then tap the bouquet or drag across it to paint.",
    eraser: "Eraser",
    fillAll: "Fill all",
    clear: "Clear",
    paper: "Paper",
    colour: "Colour",
    yourColour: "Your colour",
    ribbon: "Ribbon",
    ribbonText: "Ribbon message",
    ribbonPlaceholder: "e.g. Happy birthday, Sara",
    ribbonPosition: "Ribbon position",
    ribbonColour: "Ribbon colour",
    fillers: "Fillers",
    toppers: "A little extra",
    toppersHint: "Drag to move it. Tap × to remove.",
    removeSelected: "Remove selected",
    add: "Add",
    name: "Name your bouquet",
    namePlaceholder: "e.g. Mum's birthday",
    undo: "Undo",
    redo: "Redo",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    fit: "Fit",
    expand: "Full screen",
    collapse: "Close full screen",
    gestureHint: "Pinch or scroll to zoom",
    pieces: (n: number) => (n === 1 ? "1 piece" : `${n} pieces`),
    more: (n: number) => `+${n} more`,
    empty: "Paint some flowers to begin",
    review: "Review my bouquet",
    preparing: "Preparing…",
    startAgain: "Start again",
    startAgainConfirm: "Start again from the sample bouquet?",

    back: "Back to editing",
    reviewLabel: "Review & send",
    reviewTitle: "Looks *beautiful*",
    summary: "Your bouquet",
    shapeLabel: "Shape",
    wrapping: "Wrapping",
    ribbonLabel: "Ribbon",
    extras: "Extras",
    untitled: "My bouquet",
    detailsTitle: "Your details",
    yourName: "Your name",
    date: "Date needed",
    method: "Delivery or pickup",
    delivery: "Delivery",
    pickup: "Pickup from the studio",
    area: "Area in Dubai",
    areaPlaceholder: "e.g. Dubai Marina",
    note: "Note for us",
    notePlaceholder: "Card message, delivery time, anything else",
    send: "Send on WhatsApp",
    share: "Share bouquet image",
    download: "Download image",
    required: "Please fill this in",
    afterSend: "Your message opens in WhatsApp. Share the bouquet image in the same chat so we can see your design.",
    noPrices: "We'll reply with the price and availability.",
  },

  notFound: {
    title: "This page has wilted",
    body: "The page you're looking for isn't here. The flowers are, though.",
    cta: "Back to the collection",
  },
};

export type Copy = typeof copy;
