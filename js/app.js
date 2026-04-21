/**
 * SUNRISEDREAMS RESTAURANT — DIGITAL SELF-ORDERING SYSTEM
 * Main App Controller
 *
 * Flow:
 *   Customer scans QR → Welcome screen (table already known from URL)
 *   ↓ NEW ORDER        → creates Customer ID → Menu
 *   ↓ CONTINUE ORDER   → enter Customer ID → Menu (with history)
 *   Menu → Item Detail → Cart → Checkout (QR for cashier)
 *   POS Dashboard shows all incoming orders with status controls.
 *
 * QR code format for table stickers:
 *   https://2cedric.github.io/sunrisedreams-ordering/?table=1&type=DINE_IN
 */

const App = (() => {

  // ── State ────────────────────────────────────────────────
  let currentCategory = CATEGORIES[0];
  let selectedItem    = null;
  let currentQty      = 1;
  let posTimer        = null;

  // Table info read from URL params
  let urlTable = "TABLE 1";
  let urlType  = "DINE_IN";

  // ── Boot ─────────────────────────────────────────────────

  function init() {
    // Read ?table=1&type=DINE_IN from the URL
    const params = new URLSearchParams(window.location.search);
    const t = params.get("table");
    const tp = params.get("type");

    if (t) {
      // table=1 → "TABLE 1", table=TAKE+OUT → "TAKE OUT"
      urlTable = isNaN(t) ? t.toUpperCase() : `TABLE ${t}`;
    }
    if (tp) urlType = tp.toUpperCase();

    // Show table info on welcome screen
    const infoEl = document.getElementById("welcome-table-info");
    if (infoEl) {
      const displayType = urlType === "TAKE_OUT" ? "Take Out" : "Dine In";
      infoEl.textContent = `📍 ${urlTable} · ${displayType}`;
      infoEl.style.display = t ? "block" : "none";
    }

    goTo("welcome");
  }

  // ── Screen Navigation ────────────────────────────────────

  function goTo(name) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const el = document.getElementById(`screen-${name}`);
    if (el) el.classList.add("active");

    if (name === "menu")     initMenuScreen();
    if (name === "cart")     initCartScreen();
    if (name === "history")  initHistoryScreen();
    if (name === "pos")      initPOSScreen();
    if (name !== "pos")      stopPOSTimer();
  }

  // ── WELCOME ACTIONS ──────────────────────────────────────

  function newOrder() {
    // Create brand new customer ID, start fresh cart
    CartManager.startNewSession(urlTable, urlType);
    showToast(`Welcome! Your ID: ${CartManager.getCustomerId()}`);
    goTo("menu");
  }

  function showContinueInput() {
    document.getElementById("input-customer-id").value = "";
    document.getElementById("continue-error").classList.add("hidden");
    goTo("continue");
  }

  function lookupCustomer() {
    const input = document.getElementById("input-customer-id");
    const id    = input.value.trim().toUpperCase();
    const errEl = document.getElementById("continue-error");

    if (!id) return;

    const customer = Storage.findCustomer(id);
    if (!customer) {
      errEl.classList.remove("hidden");
      input.focus();
      return;
    }

    errEl.classList.add("hidden");
    CartManager.resumeSession(id, urlTable, urlType);
    showToast(`Welcome back! ID: ${id}`);
    goTo("menu");
  }

  function goToPOS() { goTo("pos"); }

  // ── MENU ─────────────────────────────────────────────────

  function initMenuScreen() {
    const table = CartManager.getTableNumber();
    const type  = CartManager.getDisplayType();
    document.getElementById("menu-table-label").textContent = `${table} · ${type}`;

    const cidEl = document.getElementById("menu-customer-id");
    cidEl.textContent = `Customer ID: ${CartManager.getCustomerId() || "—"}`;

    buildCategoryTabs();

    const si = document.getElementById("search-input");
    if (si) si.value = "";

    renderCategory(currentCategory);
    updateCartBadge();
  }

  function buildCategoryTabs() {
    const container = document.getElementById("category-tabs");
    if (container.children.length > 0) return;

    CATEGORIES.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "cat-tab" + (i === 0 ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = cat;
        const si = document.getElementById("search-input");
        if (si) si.value = "";
        renderCategory(cat);
      });
      container.appendChild(btn);
    });
  }

  function renderCategory(cat) {
    renderMenuGrid(getItemsByCategory(cat));
  }

  function filterMenu(query) {
    if (!query.trim()) { renderCategory(currentCategory); return; }
    renderMenuGrid(searchItems(query));
  }

  function renderMenuGrid(items) {
    const grid = document.getElementById("menu-grid");
    grid.innerHTML = "";

    if (!items.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;padding:48px 24px;text-align:center;color:var(--gray-text);">
        <div style="font-size:2.5rem;margin-bottom:8px;">🔍</div><p>No items found</p></div>`;
      return;
    }

    items.forEach(item => grid.appendChild(buildMenuCard(item)));
  }

  function buildMenuCard(item) {
    const card = document.createElement("div");
    card.className = "menu-card" + (!item.available ? " card-unavailable" : "");

    const imgHtml = item.img
      ? `<img class="card-img" src="${item.img}" alt="${item.name}"
             onerror="this.outerHTML='<div class=\\'card-img-placeholder\\'>${item.emoji}</div>'" />`
      : `<div class="card-img-placeholder">${item.emoji}</div>`;

    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div class="card-bottom">
          <span class="card-price">Php ${item.price}</span>
          <button class="btn-quick-add" title="Quick add">+</button>
        </div>
      </div>`;

    // Tap image or name → detail page
    card.querySelector(".card-img-placeholder, .card-img")
        ?.addEventListener("click", () => openDetail(item));
    card.querySelector(".card-name")
        .addEventListener("click", () => openDetail(item));

    // Quick add
    card.querySelector(".btn-quick-add").addEventListener("click", e => {
      e.stopPropagation();
      CartManager.addItem(item, 1, "");
      updateCartBadge();
      showToast(`${item.name} added to cart!`);
    });

    return card;
  }

  function updateCartBadge() {
    const count = CartManager.getCount();
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle("hidden", count === 0);
  }

  // ── ITEM DETAIL ──────────────────────────────────────────

  function openDetail(item) {
    selectedItem = item;
    currentQty   = 1;

    // Image
    const imgWrap = document.getElementById("detail-img");
    if (item.img) {
      imgWrap.innerHTML = "";
      const img = document.createElement("img");
      img.src = item.img;
      img.style.cssText = "width:100%;height:100%;object-fit:cover;";
      img.onerror = () => { imgWrap.textContent = item.emoji; };
      imgWrap.appendChild(img);
    } else {
      imgWrap.textContent = item.emoji;
      imgWrap.className = "detail-img-placeholder";
    }

    document.getElementById("detail-name").textContent  = item.name;
    document.getElementById("detail-price").textContent = `Php ${item.price}`;
    document.getElementById("detail-desc").textContent  = item.desc;

    const allergenBox = document.getElementById("allergen-box");
    const allergenTxt = document.getElementById("detail-allergens");
    if (item.allergens?.length) {
      allergenTxt.textContent = item.allergens.join(", ");
      allergenBox.style.display = "block";
    } else {
      allergenBox.style.display = "none";
    }

    document.getElementById("detail-remarks").value    = "";
    document.getElementById("qty-display").textContent = "1";
    updateAddToCartBtn();
    goTo("detail");
  }

  function changeQty(delta) {
    currentQty = Math.max(1, currentQty + delta);
    document.getElementById("qty-display").textContent = currentQty;
    updateAddToCartBtn();
  }

  function updateAddToCartBtn() {
    if (!selectedItem) return;
    document.getElementById("btn-add-cart").textContent =
      `ADD TO CART  •  Php ${(selectedItem.price * currentQty).toFixed(0)}`;
  }

  function addToCart() {
    if (!selectedItem) return;
    const remarks = document.getElementById("detail-remarks").value.trim();
    CartManager.addItem(selectedItem, currentQty, remarks);
    updateCartBadge();
    showToast(`${currentQty}× ${selectedItem.name} added!`);
    goTo("menu");
  }

  // ── CART ─────────────────────────────────────────────────

  function goToCart() { goTo("cart"); }

  function initCartScreen() {
    document.getElementById("cart-table-label").textContent =
      `${CartManager.getTableNumber()} · ${CartManager.getDisplayType()}`;
    renderCart();
  }

  function renderCart() {
    const items    = CartManager.getItems();
    const container = document.getElementById("cart-items");
    const emptyMsg  = document.getElementById("cart-empty");
    const totalsEl  = document.getElementById("cart-totals");
    const orderBtn  = document.getElementById("btn-order");

    container.innerHTML = "";
    const empty = items.length === 0;
    emptyMsg.classList.toggle("hidden", !empty);
    totalsEl.style.visibility = empty ? "hidden" : "visible";
    orderBtn.disabled = empty;
    orderBtn.style.opacity = empty ? "0.4" : "1";

    items.forEach((entry, index) => {
      const row = document.createElement("div");
      row.className = "cart-row";
      const remarkHtml = entry.remarks
        ? `<span class="cart-item-remark">📝 ${entry.remarks}</span>` : "";

      row.innerHTML = `
        <div class="cart-item-name">${entry.item.name}${remarkHtml}</div>
        <div class="cart-qty-controls">
          <button class="cq-btn" data-action="dec" data-i="${index}">−</button>
          <span class="cq-num">${entry.qty}</span>
          <button class="cq-btn" data-action="inc" data-i="${index}">+</button>
          <button class="cq-btn delete" data-action="del" data-i="${index}">🗑</button>
        </div>
        <span class="cart-item-price">Php ${(entry.item.price * entry.qty).toFixed(0)}</span>`;

      row.querySelectorAll(".cq-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const i   = parseInt(btn.dataset.i);
          const act = btn.dataset.action;
          const cur = CartManager.getItems()[i]?.qty || 0;
          if (act === "inc") CartManager.updateQty(i, cur + 1);
          if (act === "dec") CartManager.updateQty(i, cur - 1);
          if (act === "del") CartManager.removeItem(i);
          renderCart();
          updateCartBadge();
        });
      });

      container.appendChild(row);
    });

    document.getElementById("tot-sub").textContent   = `PHP ${CartManager.getSubtotal().toFixed(2)}`;
    document.getElementById("tot-svc").textContent   = `PHP ${CartManager.getServiceCharge().toFixed(2)}`;
    document.getElementById("tot-grand").textContent = `PHP ${CartManager.getTotal().toFixed(2)}`;
  }

  function checkout() {
    if (CartManager.isEmpty()) return;
    showCheckoutConfirmDialog();
  }

  function showCheckoutConfirmDialog() {
    const overlay = document.createElement("div");
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,0.55);
      display:flex;align-items:flex-end;justify-content:center;z-index:9999;`;

    const sheet = document.createElement("div");
    sheet.style.cssText = `background:var(--white);border-radius:24px 24px 0 0;
      padding:28px 24px 40px;width:100%;max-width:480px;font-family:'DM Sans',sans-serif;`;

    sheet.innerHTML = `
      <div style="width:40px;height:4px;background:var(--gray-mid);border-radius:4px;margin:0 auto 20px;"></div>
      <h3 style="font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--brown);margin-bottom:8px;">
        Ready to Checkout?
      </h3>
      <p style="color:var(--gray-text);font-size:0.9rem;margin-bottom:20px;">
        ${CartManager.getTableNumber()} · ${CartManager.getDisplayType()}<br>
        <strong style="color:var(--brown);">
          ${CartManager.getCount()} item(s) · PHP ${CartManager.getTotal().toFixed(2)}
        </strong>
      </p>
      <label style="font-size:0.82rem;font-weight:700;color:var(--brown);display:block;margin-bottom:6px;">
        SPECIAL INSTRUCTIONS (optional)
      </label>
      <textarea id="order-notes" style="width:100%;border:1.5px solid var(--cream-dark);
        border-radius:8px;padding:10px 14px;font-family:inherit;font-size:0.9rem;
        color:var(--brown);background:var(--cream);resize:none;height:64px;outline:none;
        margin-bottom:20px;" placeholder="Any special requests for the kitchen?"></textarea>
      <div style="display:flex;gap:12px;">
        <button id="modal-cancel" style="flex:1;padding:14px;border:2px solid var(--cream-dark);
          background:transparent;color:var(--gray-text);border-radius:50px;font-weight:700;
          cursor:pointer;font-size:0.9rem;">Back to Cart</button>
        <button id="modal-confirm" style="flex:1;padding:14px;background:var(--brown);
          color:var(--cream);border:none;border-radius:50px;font-weight:700;
          cursor:pointer;font-size:0.9rem;">CONFIRM ORDER</button>
      </div>`;

    overlay.appendChild(sheet);
    document.body.appendChild(overlay);

    document.getElementById("modal-cancel").onclick  = () => document.body.removeChild(overlay);
    document.getElementById("modal-confirm").onclick = () => {
      const notes = document.getElementById("order-notes").value.trim();
      document.body.removeChild(overlay);
      submitAndShowCheckout(notes);
    };
    overlay.addEventListener("click", e => {
      if (e.target === overlay) document.body.removeChild(overlay);
    });
  }

  function submitAndShowCheckout(notes) {
    const order = CartManager.submitOrder(notes);
    if (!order) return;
    updateCartBadge();
    renderCheckoutScreen(order);
    goTo("checkout");
  }

  // ── CHECKOUT SCREEN ──────────────────────────────────────

  function renderCheckoutScreen(order) {
    document.getElementById("checkout-order-id").textContent    = order.id;
    document.getElementById("checkout-table-info").textContent  =
      `${order.tableNumber} · ${order.displayType} · ${order.date} ${order.timestamp}`;
    document.getElementById("checkout-customer-id").textContent = order.customerId;

    // Items list
    const itemsEl = document.getElementById("checkout-items");
    itemsEl.innerHTML = order.items.map(i =>
      `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.88rem;">
        <span>${i.qty}×  ${i.name}${i.remarks ? ` <em style="color:var(--gray-text)">(${i.remarks})</em>` : ""}</span>
        <span>PHP ${i.subtotal.toFixed(0)}</span>
      </div>`
    ).join("");

    // Totals
    document.getElementById("co-sub").textContent   = `PHP ${order.subtotal.toFixed(2)}`;
    document.getElementById("co-svc").textContent   = `PHP ${order.serviceCharge.toFixed(2)}`;
    document.getElementById("co-grand").textContent = `PHP ${order.total.toFixed(2)}`;

    // Generate QR code for cashier
    // QR encodes the order summary as JSON so cashier can scan it
    const qrContainer = document.getElementById("checkout-qr");
    qrContainer.innerHTML = "";

    const qrData = JSON.stringify({
      orderId:    order.id,
      customerId: order.customerId,
      table:      order.tableNumber,
      total:      order.total.toFixed(2),
      items:      order.items.length
    });

    try {
      new QRCode(qrContainer, {
        text:          qrData,
        width:         180,
        height:        180,
        colorDark:     "#3B2A14",
        colorLight:    "#FFFFFF",
        correctLevel:  QRCode.CorrectLevel.M
      });
    } catch (e) {
      qrContainer.innerHTML = `<div style="padding:20px;text-align:center;color:var(--gray-text);font-size:0.85rem;">
        QR unavailable — show Order ID to cashier</div>`;
    }
  }

  function finishSession() {
    CartManager.clearCart();
    updateCartBadge();
    // Reset category tabs so they rebuild for next session
    document.getElementById("category-tabs").innerHTML = "";
    goTo("welcome");
  }

  // ── ORDER HISTORY ────────────────────────────────────────

  function goToHistory() { goTo("history"); }

  function initHistoryScreen() {
    const cid = CartManager.getCustomerId();
    document.getElementById("history-customer-id").textContent = cid || "—";

    const orders = cid ? Storage.getCustomerOrders(cid) : [];
    const listEl = document.getElementById("history-list");
    listEl.innerHTML = "";

    if (!orders.length) {
      listEl.innerHTML = `<div style="padding:48px 24px;text-align:center;color:var(--gray-text);">
        <div style="font-size:2.5rem;margin-bottom:8px;">📋</div>
        <p>No previous orders found.</p></div>`;
      return;
    }

    // Newest first
    [...orders].reverse().forEach(order => {
      const card = document.createElement("div");
      card.className = "history-card";
      card.innerHTML = `
        <div class="history-card-header">
          <span class="history-order-id">${order.id}</span>
          <span class="history-date">${order.date} ${order.timestamp}</span>
        </div>
        <div class="history-items">
          ${order.items.map(i => `<div class="history-item-row">
            <span>${i.qty}× ${i.name}</span>
            <span>PHP ${i.subtotal.toFixed(0)}</span>
          </div>`).join("")}
        </div>
        <div class="history-total">
          <span>Total</span><strong>PHP ${order.total.toFixed(2)}</strong>
        </div>
        <div class="history-status status-${order.status.toLowerCase()}">${order.status}</div>`;
      listEl.appendChild(card);
    });
  }

  // ── POS DASHBOARD ────────────────────────────────────────

  function initPOSScreen() {
    renderPOSOrders();
    posTimer = setInterval(renderPOSOrders, 5000);
  }

  function stopPOSTimer() {
    if (posTimer) { clearInterval(posTimer); posTimer = null; }
  }

  function renderPOSOrders() {
    const orders     = Storage.getAllPOSOrders();
    const container  = document.getElementById("pos-orders");
    const emptyMsg   = document.getElementById("pos-empty");
    const countBadge = document.getElementById("pos-active-count");

    countBadge.textContent = `${Storage.getActivePOSCount()} active`;
    container.innerHTML    = "";

    if (!orders.length) {
      emptyMsg.style.display = "flex";
      return;
    }
    emptyMsg.style.display = "none";

    orders.forEach(order => container.appendChild(buildPOSCard(order)));
  }

  function buildPOSCard(order) {
    const statusClass = {
      PENDING:   "",
      PREPARING: "status-preparing",
      READY:     "status-ready",
      SERVED:    "status-served"
    }[order.status] || "";

    const card = document.createElement("div");
    card.className = `pos-card ${statusClass}`;

    const itemRows = order.items.map(i =>
      `<div class="pos-item-row">
        <span>${i.qty}× ${i.name}${i.remarks ? ` <em style="opacity:0.55">(${i.remarks})</em>` : ""}</span>
        <span>PHP ${i.subtotal.toFixed(0)}</span>
      </div>`
    ).join("");

    const notesHtml = order.notes
      ? `<div style="font-size:0.78rem;color:rgba(255,255,255,0.45);margin-top:6px;">📝 ${order.notes}</div>` : "";

    const statuses = ["PENDING","PREPARING","READY","SERVED"];
    const statusBtns = statuses.map(s =>
      `<button class="pos-status-btn ${s === order.status ? "active" : ""} ${s==="SERVED"?"done-btn":""}"
        data-order="${order.id}" data-status="${s}">
        ${{ PENDING:"⏳ Pending", PREPARING:"🔥 Preparing", READY:"✅ Ready", SERVED:"🍽 Served" }[s]}
      </button>`
    ).join("");

    card.innerHTML = `
      <div class="pos-card-header">
        <span class="pos-order-id">${order.id}</span>
        <span class="pos-time">${order.date} ${order.timestamp}</span>
      </div>
      <div class="pos-table">
        ${order.tableNumber} · ${order.displayType}
        <span style="margin-left:8px;font-size:0.75rem;opacity:0.6;">ID: ${order.customerId}</span>
      </div>
      <div class="pos-items">${itemRows}${notesHtml}</div>
      <div class="pos-total">PHP ${order.total.toFixed(2)}</div>
      <div class="pos-status-row">${statusBtns}</div>`;

    card.querySelectorAll(".pos-status-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        Storage.updatePOSOrderStatus(btn.dataset.order, btn.dataset.status);
        renderPOSOrders();
      });
    });

    return card;
  }

  // ── TOAST ────────────────────────────────────────────────

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.remove("hidden");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), 2500);
  }

  // ── Public API ───────────────────────────────────────────
  return {
    goTo,
    goToPOS,
    newOrder,
    showContinueInput,
    lookupCustomer,
    filterMenu,
    openDetail,
    changeQty,
    addToCart,
    goToCart,
    goToHistory,
    checkout,
    finishSession,
    showToast
  };

})();

// Boot on page load
document.addEventListener("DOMContentLoaded", App.init || (() => {}));

// Read URL params on load
window.addEventListener("load", () => {
  const params = new URLSearchParams(window.location.search);
  const t  = params.get("table");
  const tp = params.get("type");

  let urlTable = t ? (isNaN(t) ? t.toUpperCase() : `TABLE ${t}`) : "TABLE 1";
  let urlType  = tp ? tp.toUpperCase() : "DINE_IN";

  const infoEl = document.getElementById("welcome-table-info");
  if (infoEl) {
    infoEl.textContent = t
      ? `📍 ${urlTable} · ${urlType === "TAKE_OUT" ? "Take Out" : "Dine In"}`
      : "";
  }

  // Patch App so newOrder and continue use the URL values
  const _newOrder = App.newOrder;
  App.newOrder = function() {
    CartManager.startNewSession(urlTable, urlType);
    App.showToast(`Welcome! Your ID: ${CartManager.getCustomerId()}`);
    App.goTo("menu");
  };

  const _lookupCustomer = App.lookupCustomer;
  App.lookupCustomer = function() {
    const input = document.getElementById("input-customer-id");
    const id    = input.value.trim().toUpperCase();
    const errEl = document.getElementById("continue-error");
    if (!id) return;
    const customer = Storage.findCustomer(id);
    if (!customer) {
      errEl.classList.remove("hidden");
      input.focus();
      return;
    }
    errEl.classList.add("hidden");
    CartManager.resumeSession(id, urlTable, urlType);
    App.showToast(`Welcome back! ID: ${id}`);
    App.goTo("menu");
  };
});
