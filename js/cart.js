/**
 * CART MANAGER
 * Manages cart state and the POS order list in memory.
 * This is the in-browser "POS receiving" system —
 * replacing the paper slip delivery described in the capstone.
 */

const CartManager = (() => {

  let cartItems   = [];  // { item, qty, remarks }
  let posOrders   = [];  // all submitted orders
  let tableNumber = "TABLE 1";
  let orderType   = "DINE_IN";

  // ── Session setup ────────────────────────────────────────

  function setSession(table, type) {
    tableNumber = table;
    orderType   = type;
    cartItems   = [];  // fresh cart per table session
  }

  function getTableNumber() { return tableNumber; }
  function getOrderType()   { return orderType; }
  function getDisplayType() { return orderType === "TAKE_OUT" ? "Take Out" : "Dine In"; }

  // ── Cart operations ──────────────────────────────────────

  function addItem(item, qty, remarks) {
    // If same item already in cart, increase quantity
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
    if (newQty <= 0) {
      removeItem(index);
    } else {
      cartItems[index].qty = newQty;
    }
  }

  function clearCart() {
    cartItems = [];
  }

  function getItems()  { return [...cartItems]; }
  function isEmpty()   { return cartItems.length === 0; }

  function getCount() {
    return cartItems.reduce((sum, c) => sum + c.qty, 0);
  }

  function getSubtotal() {
    return cartItems.reduce((sum, c) => sum + (c.item.price * c.qty), 0);
  }

  function getServiceCharge() { return getSubtotal() * 0.10; }
  function getTotal()         { return getSubtotal() + getServiceCharge(); }

  // ── Submit order to POS ──────────────────────────────────

  function submitOrder(notes) {
    if (isEmpty()) return null;

    const now    = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const idNum  = Math.floor(Math.random() * 9000 + 1000);

    const order = {
      id:           `#${idNum}`,
      tableNumber:  tableNumber,
      orderType:    orderType,
      displayType:  getDisplayType(),
      items:        cartItems.map(c => ({
                      name:     c.item.name,
                      qty:      c.qty,
                      price:    c.item.price,
                      subtotal: c.item.price * c.qty,
                      remarks:  c.remarks
                    })),
      subtotal:     getSubtotal(),
      serviceCharge: getServiceCharge(),
      total:        getTotal(),
      notes:        notes || "",
      status:       "PENDING",
      timestamp:    timeStr,
      createdAt:    Date.now()
    };

    posOrders.push(order);
    clearCart();
    return order;
  }

  // ── POS order management ─────────────────────────────────

  function getAllOrders()     { return [...posOrders]; }
  function getActiveOrders() {
    return posOrders.filter(o => o.status !== "SERVED" && o.status !== "CANCELLED");
  }

  function updateStatus(orderId, newStatus) {
    const order = posOrders.find(o => o.id === orderId);
    if (order) order.status = newStatus;
  }

  // ── Public API ───────────────────────────────────────────
  return {
    setSession,
    getTableNumber,
    getOrderType,
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
    submitOrder,
    getAllOrders,
    getActiveOrders,
    updateStatus
  };

})();
