# ☀ Sunrisedreams Restaurant — Digital Self-Ordering System

Built based on the UST IE Capstone Design Project (Group 7, 2026).
Replaces the manual paper slip order transmission described in the paper.

---
WORKING LINK (any browser): https://2cedric.github.io/sunrisedreams-ordering/

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
