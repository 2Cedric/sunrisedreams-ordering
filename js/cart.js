/**
 * CART MANAGER
 * Manages the current session cart in memory.
 * On checkout, saves to Storage (localStorage).
 */

const CartManager = (() => {

  let cartItems    = [];
  let tableNumber  = "TABLE 1";
  let orderType    = "DINE_IN";
  let customerId   = null;   // set after createCustomer or lookupCustomer

  // ── Session ──────────────────────────────────────────────

  function startNewSession(table, type) {
    tableNumber = table;
    orderType   = type;
    cartItems   = [];
    // Create a new customer ID in storage
    customerId  = Storage.createCustomer(table, type);
    return customerId;
  }

  function resumeSession(existingCustomerId, table, type) {
    customerId  = existingCustomerId;
    tableNumber = table;
    orderType   = type;
    cartItems   = [];
  }

  function getTableNumber()  { return tableNumber; }
  function getOrderType()    { return orderType; }
  function getCustomerId()   { return customerId; }
  function getDisplayType()  { return orderType === "TAKE_OUT" ? "Take Out" : "Dine In"; }

  // ── Cart operations ──────────────────────────────────────

  function addItem(item, qty, remarks) {
    const existing = cartItems.find(c => c.item.id === item.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cartItems.push({ item, qty, remarks: remarks || "" });
    }
  }

  function removeItem(index) {
    cartItems.splice(index, 1);
  }

  function updateQty(index, newQty) {
    if (newQty <= 0) removeItem(index);
    else cartItems[index].qty = newQty;
  }

  function clearCart()   { cartItems = []; }
  function getItems()    { return [...cartItems]; }
  function isEmpty()     { return cartItems.length === 0; }

  function getCount() {
    return cartItems.reduce((s, c) => s + c.qty, 0);
  }
  function getSubtotal() {
    return cartItems.reduce((s, c) => s + c.item.price * c.qty, 0);
  }
  function getServiceCharge() { return getSubtotal() * 0.10; }
  function getTotal()         { return getSubtotal() + getServiceCharge(); }

  // ── Submit (checkout) ────────────────────────────────────

  function submitOrder(notes) {
    if (isEmpty()) return null;

    const now    = new Date();
    const timeStr = now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
    const idNum  = Math.floor(Math.random() * 90000 + 10000);

    const order = {
      id:            `#${idNum}`,
      customerId:    customerId,
      tableNumber:   tableNumber,
      orderType:     orderType,
      displayType:   getDisplayType(),
      items:         cartItems.map(c => ({
                       name:     c.item.name,
                       qty:      c.qty,
                       price:    c.item.price,
                       subtotal: c.item.price * c.qty,
                       remarks:  c.remarks
                     })),
      subtotal:      getSubtotal(),
      serviceCharge: getServiceCharge(),
      total:         getTotal(),
      notes:         notes || "",
      status:        "PENDING",
      timestamp:     timeStr,
      date:          dateStr,
      createdAt:     Date.now()
    };

    // Save to customer history
    Storage.addOrderToCustomer(customerId, order);
    // Save to POS
    Storage.addPOSOrder(order);

    clearCart();
    return order;
  }

  // ── Public API ───────────────────────────────────────────
  return {
    startNewSession,
    resumeSession,
    getTableNumber,
    getOrderType,
    getCustomerId,
    getDisplayType,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    getItems,
    isEmpty,
    getCount,
    getSubtotal,
    getServiceCharge,
    getTotal,
    submitOrder
  };

})();
