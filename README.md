# ☀ Sunrisedreams Restaurant — Digital Self-Ordering System

Built based on the UST IE Capstone Design Project (Group 7, 2026).
Replaces the manual paper slip order transmission described in the paper.

---

## 🚀 How to Run (VS Code)

### Option A — Live Server (Recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. Opens at `http://127.0.0.1:5500`

### Option B — Simple Python server
```bash
cd sunrisedreams-ordering
python -m http.server 8080
# Then open: http://localhost:8080
```

### Option C — Node.js
```bash
npx serve .
```

> ⚠️ **Do NOT open index.html directly as a file** (`file://`).
> The QR scanner requires a proper server (http://).
> The rest of the app works fine with Live Server.

---

## 📱 Customer Flow

```
Welcome Screen
    ↓ [START ORDER]
QR Scanner  ←── scan table QR code
    ↓ (or tap table button manually)
Menu Screen  ←── tabs: Appetizers | All Day Breakfast | Main Dish | Merienda | Add-Ons
    ↓ tap item card
Item Detail  ←── quantity stepper, allergens, remarks field
    ↓ [ADD TO CART]
Cart Screen  ←── review order, edit quantities, see total + 10% service charge
    ↓ [ORDER]
Confirmation ←── order ID, table, total, kitchen status
```

---

## 🖥 POS Dashboard (Kitchen / Cashier View)

- From the Welcome screen, tap **"POS Dashboard →"**
- All submitted orders appear here in real-time
- Staff can update status: **Pending → Preparing → Ready → Served**
- Auto-refreshes every 5 seconds

---

## 📷 QR Code Format

Each table QR code should encode this JSON:
```json
{"table":"TABLE 1","type":"DINE_IN"}
```

For take-out:
```json
{"table":"TAKE OUT","type":"TAKE_OUT"}
```

**Generate QR codes for free at:** https://www.qr-code-generator.com/
- Select "Text" type
- Paste the JSON above
- Print and laminate for each table

---

## 🖼 Adding Real Food Photos

1. Create an `images/` folder inside the project
2. Add your photos (e.g. `chicken_chips.jpg`, `beef_caldereta.jpg`)
3. In `js/menu-data.js`, update the `img` field for each item:
   ```js
   img: "images/chicken_chips.jpg",
   ```
4. Images display at 1:1 ratio in the menu grid and full-width in item detail

---

## 📁 Project Structure

```
sunrisedreams-ordering/
├── index.html          ← all screens in one file
├── css/
│   └── style.css       ← warm Filipino restaurant aesthetic
├── js/
│   ├── menu-data.js    ← all menu items (categories, prices, allergens)
│   ├── cart.js         ← CartManager singleton (cart + POS order list)
│   └── app.js          ← main controller (navigation, rendering, QR)
├── images/             ← create this folder and add your food photos
└── README.md
```

---

## 🍽 Menu Categories (from capstone paper)

| Category | Items |
|---|---|
| Appetizers | Chicken & Chips, Fish & Chips, Fries (Solo/Sharing) |
| All Day Breakfast | Tocino, Tapa, Hungarian, Longganisa |
| Main Dish | Beef Caldereta, Crispy Pork Kare-Kare, Beef/Pork Sinigang, Chicken Tinola, Bicol Express, Laing, Lumpiang Shanghai |
| Merienda | Spaghetti & Meatballs, Lumpiang Gulay, Sunrise Signature Leche Flan |
| Add-Ons | Egg, Fried Egg, Boiled Egg |

---

## ✅ Features Implemented

- [x] QR code scanning (html5-qrcode library, no install needed)
- [x] Manual table selection fallback
- [x] 5-category menu with tab navigation
- [x] Search/filter across all items
- [x] Quick Add (+) button per item card
- [x] Item detail page: quantity stepper, allergen warning, remarks field
- [x] Cart: edit quantities, remove items, live totals
- [x] 10% service charge calculation
- [x] Order confirmation with order ID + timestamp
- [x] POS Dashboard: all orders, status updates (Pending/Preparing/Ready/Served)
- [x] Toast notifications
- [x] Image placeholder system (add your own photos)

---

*Capstone Design Project · University of Santo Tomas · May 2026*
*Balasabas · Balatbat · Bolivar · Luto*
