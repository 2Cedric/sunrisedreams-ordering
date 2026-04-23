/**
 * SUNRISEDREAMS RESTAURANT — MENU DATA
 * Images: set `img` to a filename in your images/ folder.
 *         Leave as null to show the placeholder emoji instead.
 *
 * HOW TO ADD A DISH — copy this block and paste it inside MENU_ITEMS:
 *   {
 *     id: 99,                        ← pick a unique number not used by any other item
 *     name: "Your Dish Name",
 *     desc: "Short description here.",
 *     price: 150,                    ← number only, no Php symbol
 *     category: "MAIN DISH",         ← must exactly match one of the CATEGORIES above
 *     img: null,                     ← or "images/your_photo.jpg"
 *     emoji: "🍽",                   ← fallback if no photo
 *     allergens: ["Gluten"],         ← list allergens, or [] for none
 *     available: true                ← set false to grey it out
 *   },
 *
 * HOW TO REMOVE A DISH — delete the entire block from { to }, including the comma after }
 *
 * HOW TO EDIT — just change the value after the colon on any line
 */

const CATEGORIES = [
  "APPETIZERS",
  "ALL DAY BREAKFAST",
  "MAIN DISH",
  "MERIENDA",
  "DRINKS",
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
    img: null,
    allergens: ["Gluten"],
    available: true
  },
  {
    id: 2,
    name: "Fish and Chips",
    desc: "Beer-battered fish fillet served with crispy fries.",
    price: 335,
    category: "APPETIZERS",
    img: "images/fish_chips.jpg",
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
    allergens: ["Pork"],
    available: true
  },
  {
    id: 6,
    name: "Beef Tapa",
    desc: "Marinated beef strips served with garlic rice and egg.",
    price: 299,
    category: "ALL DAY BREAKFAST",
    img: "images/tapa.jpg",
    allergens: ["Beef", "Egg"],
    available: true
  },
  {
    id: 7,
    name: "Hungarian",
    desc: "Savory Hungarian sausage with garlic rice and egg.",
    price: 190,
    category: "ALL DAY BREAKFAST",
    img: null,
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
    allergens: ["Beef", "Gluten"],
    available: true
  },
  {
    id: 10,
    name: "Crispy Kare-Kare",
    desc: "Crispy pork belly in classic peanut sauce with bagoong.",
    price: 459,
    category: "MAIN DISH",
    img: "images/crispy_pork_karekare.jpg",
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
    allergens: ["Pork"],
    available: true
  },
  {
    id: 13,
    name: "Pork Steak",
    desc: "Pork chop simmered in soy sauce-calamansi marinade with egg",
    price: 425,
    category: "MAIN DISH",
    img: "images/pork_steak.jpg",
    allergens: ["Pork", "Egg"],
    available: true
  },
  {
    id: 14,
    name: "Bicol Express",
    desc: "Spicy pork cooked in coconut milk with chili.",
    price: 200,
    category: "MAIN DISH",
    img: null,
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
    allergens: ["Pork", "Gluten"],
    available: true
  },

  // ──────────────────────────────────────────────
  // MERIENDA
  // ──────────────────────────────────────────────
  {
    id: 17,
    name: "Grilled Cheese Sandwich",
    desc: "Classic grilled cheese sandwich with crispy chips.",
    price: 139,
    category: "MERIENDA",
    img: "images/grilled_cheese.jpg",
    allergens: ["Dairy", "Gluten"],
    available: true
  },
  {
    id: 18,
    name: "Lumpiang Gulay",
    desc: "Fresh vegetable spring roll served with vinegar sauce.",
    price: 299,
    category: "MERIENDA",
    img: "images/lumpiang_gulay.jpg",
    allergens: ["Gluten"],
    available: true
  },

  // ──────────────────────────────────────────────
  // DRINKS
  // ──────────────────────────────────────────────
  {
    id: 19,
    name: "Sunrise Signature Leche Flan",
    desc: "Sunrisedreams' best-selling signature leche flan drink. Must-try!",
    price: 233,
    category: "DRINKS",
    img: "images/leche_flan.jpg",
    allergens: ["Dairy", "Egg"],
    available: true
  },
  {
    id: 23,
    name: "Blended Dark Chocolate",
    desc: "Rich and creamy blended dark chocolate drink.",
    price: 209,
    category: "DRINKS",
    img: "images/blended_dark_chocolate.jpg",
    allergens: ["Dairy"],
    available: true
  },
  {
    id: 24,
    name: "Hot Mocha",
    desc: "Classic hot mocha made with espresso and chocolate.",
    price: 133,
    category: "DRINKS",
    img: "images/hot_mocha.jpg",
    allergens: ["Dairy"],
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
