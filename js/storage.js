/**
 * STORAGE MANAGER
 * Persists all orders and customer data using localStorage.
 * Data survives page refresh and browser close.
 *
 * Keys used:
 *   sd_customers  — { [customerId]: { id, tableNumber, orderType, orders:[] } }
 *   sd_pos_orders — [ ...allSubmittedOrders ]
 */

const Storage = (() => {

  const KEY_CUSTOMERS  = "sd_customers";
  const KEY_POS_ORDERS = "sd_pos_orders";

  // ── Helpers ──────────────────────────────────────────────

  function loadCustomers() {
    try {
      return JSON.parse(localStorage.getItem(KEY_CUSTOMERS)) || {};
    } catch { return {}; }
  }

  function saveCustomers(data) {
    localStorage.setItem(KEY_CUSTOMERS, JSON.stringify(data));
  }

  function loadPOSOrders() {
    try {
      return JSON.parse(localStorage.getItem(KEY_POS_ORDERS)) || [];
    } catch { return []; }
  }

  function savePOSOrders(data) {
    localStorage.setItem(KEY_POS_ORDERS, JSON.stringify(data));
  }

  // ── Customer operations ──────────────────────────────────

  /**
   * Generate a unique Customer ID like "SD-4821"
   */
  function generateCustomerId() {
    const num = Math.floor(Math.random() * 9000 + 1000);
    return `SD-${num}`;
  }

  /**
   * Create a new customer record and return the customer ID.
   */
  function createCustomer(tableNumber, orderType) {
    const customers = loadCustomers();
    let id = generateCustomerId();
    // Ensure uniqueness
    while (customers[id]) id = generateCustomerId();

    customers[id] = {
      id,
      tableNumber,
      orderType,
      createdAt: Date.now(),
      orders: []
    };
    saveCustomers(customers);
    return id;
  }

  /**
   * Find a customer by ID. Returns customer object or null.
   */
  function findCustomer(customerId) {
    const customers = loadCustomers();
    return customers[customerId.toUpperCase()] || null;
  }

  /**
   * Add a submitted order to the customer's history.
   */
  function addOrderToCustomer(customerId, order) {
    const customers = loadCustomers();
    if (!customers[customerId]) return;
    customers[customerId].orders.push(order);
    saveCustomers(customers);
  }

  /**
   * Get all orders for a customer.
   */
  function getCustomerOrders(customerId) {
    const customer = findCustomer(customerId);
    return customer ? customer.orders : [];
  }

  // ── POS orders ───────────────────────────────────────────

  /**
   * Add a new order to the POS list.
   */
  function addPOSOrder(order) {
    const orders = loadPOSOrders();
    orders.push(order);
    savePOSOrders(orders);
  }

  /**
   * Get all POS orders (newest first).
   */
  function getAllPOSOrders() {
    return loadPOSOrders().reverse();
  }

  /**
   * Update the status of an order in POS.
   */
  function updatePOSOrderStatus(orderId, newStatus) {
    const orders = loadPOSOrders();
    const order  = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      savePOSOrders(orders);
    }
  }

  /**
   * Count active (not served/cancelled) POS orders.
   */
  function getActivePOSCount() {
    return loadPOSOrders().filter(
      o => o.status !== "SERVED" && o.status !== "CANCELLED"
    ).length;
  }

  // ── Public API ───────────────────────────────────────────
  return {
    createCustomer,
    findCustomer,
    addOrderToCustomer,
    getCustomerOrders,
    addPOSOrder,
    getAllPOSOrders,
    updatePOSOrderStatus,
    getActivePOSCount
  };

})();
