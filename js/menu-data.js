/**
 * SUNRISEDREAMS RESTAURANT — MENU DATA
 * All categories and items from the capstone paper.
 * Images: set `img` to a filename in your images/ folder.
 *         Leave as null to show the placeholder emoji instead.
 */

const CATEGORIES = [
  "APPETIZERS",
  "ALL DAY BREAKFAST",
  "MAIN DISH",
  "MERIENDA",
  "ADD-ONS"
];

const MENU_ITEMS = [

  // ──────────────────────────────────────────────
  // APPETIZERS
  // ──────────────────────────────────────────────
  {
    id: 1,
    name: "Chicken and Chips",
    desc: "Crispy chicken pieces served with golden fries.",
    price: 175,
    category: "APPETIZERS",
    img: null,          // e.g. "images/chicken_chips.jpg"
    emoji: "🍗",
    allergens: ["Gluten"],
    available: true
  },
  {
    id: 2,
    name: "Fish and Chips",
    desc: "Beer-battered fish fillet served with crispy fries.",
    price: 185,
    category: "APPETIZERS",
    img: null,
    emoji: "🐟",
    allergens: ["Seafood", "Gluten"],
    available: true
  },
  {
    id: 3,
    name: "Fries (Solo)",
    desc: "Crispy golden fries, solo serving.",
    price: 85,
    category: "APPETIZERS",
    img: null,
    emoji: "🍟",
    allergens: [],
    available: true
  },
  {
    id: 4,
    name: "Fries (Sharing)",
    desc: "Crispy golden fries, sharing serving.",
    price: 145,
    category: "APPETIZERS",
    img: null,
    emoji: "🍟",
    allergens: [],
    available: true
  },

  // ──────────────────────────────────────────────
  // ALL DAY BREAKFAST
  // ──────────────────────────────────────────────
  {
    id: 5,
    name: "Tocino",
    desc: "Sweet cured pork served with garlic rice and egg.",
    price: 195,
    category: "ALL DAY BREAKFAST",
    img: null,
    emoji: "🍳",
    allergens: ["Pork"],
    available: true
  },
  {
    id: 6,
    name: "Tapa",
    desc: "Marinated beef strips served with garlic rice and egg.",
    price: 210,
    category: "ALL DAY BREAKFAST",
    img: null,
    emoji: "🥩",
    allergens: ["Beef"],
    available: true
  },
  {
    id: 7,
    name: "Hungarian",
    desc: "Savory Hungarian sausage with garlic rice and egg.",
    price: 190,
    category: "ALL DAY BREAKFAST",
    img: null,
    emoji: "🌭",
    allergens: ["Pork", "Gluten"],
    available: true
  },
  {
    id: 8,
    name: "Longganisa",
    desc: "Classic Filipino sweet sausage with garlic rice and egg.",
    price: 185,
    category: "ALL DAY BREAKFAST",
    img: null,
    emoji: "🌭",
    allergens: ["Pork"],
    available: true
  },

  // ──────────────────────────────────────────────
  // MAIN DISH
  // ──────────────────────────────────────────────
  {
    id: 9,
    name: "Beef Caldereta",
    desc: "Slow-cooked beef in rich tomato and liver sauce.",
    price: 415,
    category: "MAIN DISH",
    img: null,
    emoji: "🥘",
    allergens: ["Beef", "Gluten"],
    available: true
  },
  {
    id: 10,
    name: "Crispy Pork Kare-Kare",
    desc: "Crispy pork belly in classic peanut sauce with bagoong.",
    price: 450,
    category: "MAIN DISH",
    img: null,
    emoji: "🍲",
    allergens: ["Pork", "Peanut", "Seafood"],
    available: true
  },
  {
    id: 11,
    name: "Beef Sinigang",
    desc: "Sour tamarind soup with tender beef and fresh vegetables.",
    price: 440,
    category: "MAIN DISH",
    img: null,
    emoji: "🍜",
    allergens: ["Beef"],
    available: true
  },
  {
    id: 12,
    name: "Pork Sinigang",
    desc: "Sour tamarind soup with pork and vegetables.",
    price: 425,
    category: "MAIN DISH",
    img: null,
    emoji: "🍜",
    allergens: ["Pork"],
    available: true
  },
  {
    id: 13,
    name: "Chicken Tinola",
    desc: "Ginger-based broth with chicken, malunggay, and sayote.",
    price: 355,
    category: "MAIN DISH",
    img: null,
    emoji: "🍵",
    allergens: ["Chicken"],
    available: true
  },
  {
    id: 14,
    name: "Bicol Express",
    desc: "Spicy pork cooked in coconut milk with chili.",
    price: 200,
    category: "MAIN DISH",
    img: null,
    emoji: "🌶",
    allergens: ["Pork", "Coconut"],
    available: true
  },
  {
    id: 15,
    name: "Laing",
    desc: "Taro leaves slow-cooked in coconut milk and chili.",
    price: 215,
    category: "MAIN DISH",
    img: null,
    emoji: "🥬",
    allergens: ["Coconut"],
    available: true
  },
  {
    id: 16,
    name: "Lumpiang Shanghai",
    desc: "Crispy pork spring rolls served with sweet chili sauce.",
    price: 335,
    category: "MAIN DISH",
    img: null,
    emoji: "🥢",
    allergens: ["Pork", "Gluten"],
    available: true
  },

  // ──────────────────────────────────────────────
  // MERIENDA
  // ──────────────────────────────────────────────
  {
    id: 17,
    name: "Spaghetti and Meatballs",
    desc: "Filipino-style sweet spaghetti with juicy pork meatballs.",
    price: 185,
    category: "MERIENDA",
    img: null,
    emoji: "🍝",
    allergens: ["Gluten", "Pork"],
    available: true
  },
  {
    id: 18,
    name: "Lumpiang Gulay",
    desc: "Fresh vegetable spring roll served with sweet sauce.",
    price: 120,
    category: "MERIENDA",
    img: null,
    emoji: "🥗",
    allergens: ["Gluten"],
    available: true
  },
  {
    id: 19,
    name: "Sunrise Signature Leche Flan",
    desc: "Sunrisedreams' best-selling signature leche flan drink. Must-try!",
    price: 233,
    category: "MERIENDA",
    img: null,
    emoji: "🧋",
    allergens: ["Dairy", "Egg"],
    available: true
  },

  // ──────────────────────────────────────────────
  // ADD-ONS
  // ──────────────────────────────────────────────
  {
    id: 20,
    name: "Egg",
    desc: "One egg cooked your way (sunny side up or scrambled).",
    price: 35,
    category: "ADD-ONS",
    img: null,
    emoji: "🍳",
    allergens: ["Egg"],
    available: true
  },
  {
    id: 21,
    name: "Fried Egg",
    desc: "One fried egg.",
    price: 35,
    category: "ADD-ONS",
    img: null,
    emoji: "🍳",
    allergens: ["Egg"],
    available: true
  },
  {
    id: 22,
    name: "Boiled Egg",
    desc: "One hard-boiled egg.",
    price: 30,
    category: "ADD-ONS",
    img: null,
    emoji: "🥚",
    allergens: ["Egg"],
    available: true
  }
];

/**
 * Returns items filtered by category.
 */
function getItemsByCategory(cat) {
  return MENU_ITEMS.filter(i => i.category === cat);
}

/**
 * Returns items matching a search query (name or description).
 */
function searchItems(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return MENU_ITEMS.filter(i =>
    i.name.toLowerCase().includes(q) ||
    i.desc.toLowerCase().includes(q)
  );
}

/**
 * Find an item by its id.
 */
function getItemById(id) {
  return MENU_ITEMS.find(i => i.id === id) || null;
}
