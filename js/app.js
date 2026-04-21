/**
 * SUNRISEDREAMS RESTAURANT — DIGITAL SELF-ORDERING SYSTEM
 * Main App Controller
 *
 * Based on the capstone design (Group 7, UST):
 * "Design and Development of Order Processing for Store Operations"
 *
 * Flow: Welcome → QR Scan → Menu (tabs + search) → Item Detail → Cart → Confirm
 *       POS Dashboard receives all submitted orders.
 */

const App = (() => {

  // ── State ────────────────────────────────────────────────
  let currentScreen   = "welcome";
  let selectedItem    = null;   // item being viewed in detail
  let currentQty      = 1;      // quantity on detail screen
  let currentCategory = CATEGORIES[0];
  let qrScanner       = null;
  let posRefreshTimer = null;

  // ── Screen Navigation ────────────────────────────────────

  function goTo(screenName) {
    // Hide all
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    // Show target
    const target = document.getElementById(`screen-${screenName}`);
    if (!target) return;
    target.classList.add("active");
    currentScreen = screenName;

    // Screen-specific init
    if (screenName === "menu")    initMenuScreen();
    if (screenName === "cart")    initCartScreen();
    if (screenName === "pos")     initPOSScreen();
    if (screenName === "scan")    initScanScreen();

    // Stop QR scanner when leaving scan screen
    if (screenName !== "scan")    stopQRScanner();
    // Stop POS refresh when leaving POS
    if (screenName !== "pos")     stopPOSRefresh();
  }

  // ── WELCOME ──────────────────────────────────────────────

  function goToScan() { goTo("scan"); }
  function goToPOS()  { goTo("pos"); }

  // ── QR SCAN ──────────────────────────────────────────────

  function initScanScreen() {
    // Small delay so screen is visible before camera starts
    setTimeout(startQRScanner, 400);
  }

  function startQRScanner() {
    const container = document.getElementById("qr-reader");
    if (!container) return;
    container.innerHTML = ""; // clear previous

    if (typeof Html5Qrcode === "undefined") {
      container.innerHTML = `<div style="padding:24px;text-align:center;color:#888;font-size:0.9rem;">
        📷 QR scanner requires internet to load.<br>Use the table buttons below instead.</div>`;
      return;
    }

    qrScanner = new Html5Qrcode("qr-reader");
    qrScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 220, height: 220 } },
      (decodedText) => handleQRResult(decodedText),
      () => {} // ignore per-frame errors
    ).catch(err => {
      container.innerHTML = `<div style="padding:24px;text-align:center;color:#888;font-size:0.9rem;">
        📷 Camera not available.<br>Use the table buttons below.</div>`;
    });
  }

  function stopQRScanner() {
    if (qrScanner) {
      qrScanner.stop().catch(() => {});
      qrScanner = null;
    }
  }

  /**
   * Parse the QR code payload.
   * Expected format: {"table":"TABLE 16","type":"DINE_IN"}
   * Or plain text: "TABLE 16"
   */
  function handleQRResult(rawText) {
    stopQRScanner();

    let table, type;
    try {
      if (rawText.trim().startsWith("{")) {
        const data = JSON.parse(rawText);
        table = data.table || "TABLE 1";
        type  = data.type  || "DINE_IN";
      } else {
        table = rawText.trim().toUpperCase();
        type  = table.includes("TAKE") ? "TAKE_OUT" : "DINE_IN";
      }
    } catch (e) {
      table = rawText.trim().toUpperCase();
      type  = "DINE_IN";
    }

    selectTable(table, type);
  }

  function selectTable(table, type) {
    CartManager.setSession(table, type);

    showToast(`✓ ${table} · ${CartManager.getDisplayType()}`);

    setTimeout(() => goTo("menu"), 500);
  }

  // ── MENU ─────────────────────────────────────────────────

  function initMenuScreen() {
    // Update table label
    const label = CartManager.getTableNumber() + " · " + CartManager.getDisplayType();
    document.getElementById("menu-table-label").textContent = label;

    // Build category tabs (only once)
    buildCategoryTabs();

    // Clear search
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";

    // Render first category
    renderCategory(currentCategory);

    // Update cart badge
    updateCartBadge();
  }

  function buildCategoryTabs() {
    const container = document.getElementById("category-tabs");
    if (container.children.length > 0) return; // already built

    CATEGORIES.forEach((cat, i) => {
      const btn = document.createElement("button");
      btn.className = "cat-tab" + (i === 0 ? " active" : "");
      btn.textContent = cat;
      btn.addEventListener("click", () => {
        document.querySelectorAll(".cat-tab").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = cat;
        // Clear search when switching tabs
        const si = document.getElementById("search-input");
        if (si) si.value = "";
        renderCategory(cat);
      });
      container.appendChild(btn);
    });
  }

  function renderCategory(cat) {
    const items = getItemsByCategory(cat);
    renderMenuGrid(items);
  }

  function filterMenu(query) {
    if (!query.trim()) {
      renderCategory(currentCategory);
      return;
    }
    const results = searchItems(query);
    renderMenuGrid(results);
  }

  function renderMenuGrid(items) {
    const grid = document.getElementById("menu-grid");
    grid.innerHTML = "";

    if (items.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;padding:48px 24px;text-align:center;color:var(--gray-text);">
        <div style="font-size:2.5rem;margin-bottom:8px;">🔍</div>
        <p>No items found</p></div>`;
      return;
    }

    items.forEach(item => {
      const card = buildMenuCard(item);
      grid.appendChild(card);
    });
  }

  function buildMenuCard(item) {
    const card = document.createElement("div");
    card.className = "menu-card" + (item.available ? "" : " card-unavailable");

    // Image or emoji placeholder
    let imgHtml;
    if (item.img) {
      imgHtml = `<img class="card-img" src="${item.img}" alt="${item.name}" onerror="this.outerHTML='<div class=\\'card-img-placeholder\\'>${item.emoji}</div>'" />`;
    } else {
      imgHtml = `<div class="card-img-placeholder">${item.emoji}</div>`;
    }

    card.innerHTML = `
      ${imgHtml}
      <div class="card-body">
        <div class="card-name">${item.name}</div>
        <div class="card-bottom">
          <span class="card-price">Php ${item.price}</span>
          <button class="btn-quick-add" title="Quick add">+</button>
        </div>
      </div>`;

    // Tap card body → go to detail
    card.querySelector(".card-body .card-name").addEventListener("click", () => openDetail(item));
    card.querySelector(".card-img-placeholder, .card-img")?.addEventListener("click", () => openDetail(item));

    // Quick add button
    card.querySelector(".btn-quick-add").addEventListener("click", (e) => {
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
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  }

  // ── ITEM DETAIL ──────────────────────────────────────────

  function openDetail(item) {
    selectedItem = item;
    currentQty   = 1;

    // Image
    const imgWrap = document.getElementById("detail-img");
    if (item.img) {
      imgWrap.outerHTML = `<img id="detail-img" class="detail-img-placeholder" src="${item.img}" alt="${item.name}" style="object-fit:cover;width:100%;height:100%" onerror="this.outerHTML='<div id=\\'detail-img\\' class=\\'detail-img-placeholder\\'>${item.emoji}</div>'" />`;
    } else {
      const el = document.getElementById("detail-img");
      el.textContent = item.emoji;
      el.className = "detail-img-placeholder";
    }

    document.getElementById("detail-name").textContent = item.name;
    document.getElementById("detail-price").textContent = `Php ${item.price}`;
    document.getElementById("detail-desc").textContent  = item.desc;

    // Allergens
    const allergenBox = document.getElementById("allergen-box");
    const allergenTxt = document.getElementById("detail-allergens");
    if (item.allergens && item.allergens.length > 0) {
      allergenTxt.textContent = item.allergens.join(", ");
      allergenBox.style.display = "block";
    } else {
      allergenBox.style.display = "none";
    }

    // Reset
    document.getElementById("detail-remarks").value = "";
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
    const total = selectedItem.price * currentQty;
    document.getElementById("btn-add-cart").textContent =
      `ADD TO CART  •  Php ${total.toFixed(0)}`;
  }

  function addToCart() {
    if (!selectedItem) return;
    const remarks = document.getElementById("detail-remarks").value.trim();
    CartManager.addItem(selectedItem, currentQty, remarks);
    updateCartBadge();
    showToast(`${currentQty}x ${selectedItem.name} added!`);
    goTo("menu");
  }

  // ── CART ─────────────────────────────────────────────────

  function goToCart() { goTo("cart"); }

  function initCartScreen() {
    document.getElementById("cart-table-label").textContent =
      CartManager.getTableNumber() + " · " + CartManager.getDisplayType();
    renderCart();
  }

  function renderCart() {
    const items   = CartManager.getItems();
    const container = document.getElementById("cart-items");
    const emptyMsg  = document.getElementById("cart-empty");
    const totals    = document.getElementById("cart-totals");
    const orderBtn  = document.getElementById("btn-order");

    container.innerHTML = "";

    if (items.length === 0) {
      emptyMsg.classList.remove("hidden");
      totals.style.visibility   = "hidden";
      orderBtn.disabled = true;
      orderBtn.style.opacity = "0.4";
      return;
    }

    emptyMsg.classList.add("hidden");
    totals.style.visibility = "visible";
    orderBtn.disabled = false;
    orderBtn.style.opacity = "1";

    items.forEach((cartEntry, index) => {
      const row = document.createElement("div");
      row.className = "cart-row";

      const remark = cartEntry.remarks
        ? `<span class="cart-item-remark">📝 ${cartEntry.remarks}</span>` : "";

      row.innerHTML = `
        <div class="cart-item-name">
          ${cartEntry.item.name}
          ${remark}
        </div>
        <div class="cart-qty-controls">
          <button class="cq-btn" data-action="dec" data-index="${index}">−</button>
          <span class="cq-num">${cartEntry.qty}</span>
          <button class="cq-btn" data-action="inc" data-index="${index}">+</button>
          <button class="cq-btn delete" data-action="del" data-index="${index}" title="Remove">🗑</button>
        </div>
        <span class="cart-item-price">Php ${(cartEntry.item.price * cartEntry.qty).toFixed(0)}</span>`;

      // Qty buttons
      row.querySelectorAll(".cq-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const i   = parseInt(btn.dataset.index);
          const act = btn.dataset.action;
          if (act === "inc") CartManager.updateQty(i, CartManager.getItems()[i].qty + 1);
          if (act === "dec") CartManager.updateQty(i, CartManager.getItems()[i].qty - 1);
          if (act === "del") CartManager.removeItem(i);
          renderCart();
          updateCartBadge();
        });
      });

      container.appendChild(row);
    });

    // Totals
    document.getElementById("tot-sub").textContent    = `PHP ${CartManager.getSubtotal().toFixed(2)}`;
    document.getElementById("tot-svc").textContent    = `PHP ${CartManager.getServiceCharge().toFixed(2)}`;
    document.getElementById("tot-grand").textContent  = `PHP ${CartManager.getTotal().toFixed(2)}`;
  }

  function placeOrder() {
    if (CartManager.isEmpty()) return;
    showOrderConfirmDialog();
  }

  function showOrderConfirmDialog() {
    // Simple inline confirm UI — no browser alert
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,0.55);
      display:flex;align-items:flex-end;justify-content:center;
      z-index:9999;padding:0;animation:fadeIn 0.2s ease;`;

    const sheet = document.createElement("div");
    sheet.style.cssText = `
      background:var(--white);border-radius:24px 24px 0 0;
      padding:28px 24px 40px;width:100%;max-width:480px;
      font-family:'DM Sans',sans-serif;`;

    sheet.innerHTML = `
      <div style="width:40px;height:4px;background:var(--gray-mid);border-radius:4px;margin:0 auto 20px;"></div>
      <h3 style="font-family:'Playfair Display',serif;font-size:1.3rem;color:var(--brown);margin-bottom:8px;">
        Confirm Your Order
      </h3>
      <p style="color:var(--gray-text);font-size:0.9rem;margin-bottom:20px;">
        ${CartManager.getTableNumber()} · ${CartManager.getDisplayType()}<br>
        <strong style="color:var(--brown);">${CartManager.getCount()} item(s) · PHP ${CartManager.getTotal().toFixed(2)}</strong>
      </p>
      <label style="font-size:0.82rem;font-weight:700;color:var(--brown);display:block;margin-bottom:6px;">
        SPECIAL INSTRUCTIONS (optional)
      </label>
      <textarea id="order-notes" style="
        width:100%;border:1.5px solid var(--cream-dark);border-radius:8px;
        padding:10px 14px;font-family:inherit;font-size:0.9rem;
        color:var(--brown);background:var(--cream);resize:none;height:64px;
        outline:none;margin-bottom:20px;" placeholder="Any special requests?"></textarea>
      <div style="display:flex;gap:12px;">
        <button id="modal-cancel" style="
          flex:1;padding:14px;border:2px solid var(--cream-dark);background:transparent;
          color:var(--gray-text);border-radius:50px;font-weight:700;cursor:pointer;font-size:0.9rem;">
          Review Cart
        </button>
        <button id="modal-confirm" style="
          flex:1;padding:14px;background:var(--brown);color:var(--cream);
          border:none;border-radius:50px;font-weight:700;cursor:pointer;font-size:0.9rem;">
          PLACE ORDER
        </button>
      </div>`;

    overlay.appendChild(sheet);
    document.body.appendChild(overlay);

    document.getElementById("modal-cancel").onclick = () => document.body.removeChild(overlay);
    document.getElementById("modal-confirm").onclick = () => {
      const notes = document.getElementById("order-notes").value.trim();
      document.body.removeChild(overlay);
      submitOrder(notes);
    };
    // Tap backdrop to close
    overlay.addEventListener("click", e => { if (e.target === overlay) document.body.removeChild(overlay); });
  }

  function submitOrder(notes) {
    const order = CartManager.submitOrder(notes);
    if (!order) return;

    updateCartBadge();
    renderOrderConfirmation(order);
    goTo("confirm");
  }

  // ── ORDER CONFIRMATION ───────────────────────────────────

  function renderOrderConfirmation(order) {
    document.getElementById("conf-id").textContent    = order.id;
    document.getElementById("conf-table").textContent = `${order.tableNumber} · ${order.displayType}`;
    document.getElementById("conf-time").textContent  = order.timestamp;
    document.getElementById("conf-total").textContent = `PHP ${order.total.toFixed(2)}`;

    const itemsEl = document.getElementById("conf-items");
    itemsEl.innerHTML = order.items.map(i =>
      `<div style="display:flex;justify-content:space-between;">
        <span>${i.qty}×  ${i.name}</span>
        <span>PHP ${i.subtotal.toFixed(0)}</span>
      </div>`
    ).join("");
  }

  function resetSession() {
    CartManager.clearCart();
    goTo("welcome");
  }

  // ── POS DASHBOARD ────────────────────────────────────────

  function initPOSScreen() {
    renderPOSOrders();
    startPOSRefresh();
  }

  function renderPOSOrders() {
    const orders  = CartManager.getAllOrders();
    const container = document.getElementById("pos-orders");
    const emptyMsg  = document.getElementById("pos-empty");
    const countBadge = document.getElementById("pos-active-count");

    const active = CartManager.getActiveOrders();
    countBadge.textContent = `${active.length} active`;

    container.innerHTML = "";

    if (orders.length === 0) {
      emptyMsg.style.display = "flex";
      return;
    }
    emptyMsg.style.display = "none";

    // Show newest first
    [...orders].reverse().forEach(order => {
      const card = buildPOSCard(order);
      container.appendChild(card);
    });
  }

  function buildPOSCard(order) {
    const statusClass = {
      PENDING:   "",
      PREPARING: "status-preparing",
      READY:     "status-ready",
      SERVED:    "status-served",
      CANCELLED: "status-served"
    }[order.status] || "";

    const card = document.createElement("div");
    card.className = `pos-card ${statusClass}`;
    card.id = `pos-card-${order.id.replace("#","")}`; 

    const itemRows = order.items.map(i =>
      `<div class="pos-item-row">
        <span>${i.qty}×  ${i.name}${i.remarks ? ` <em style="opacity:0.6">(${i.remarks})</em>` : ""}</span>
        <span>PHP ${i.subtotal.toFixed(0)}</span>
      </div>`
    ).join("");

    const notesHtml = order.notes
      ? `<div style="font-size:0.78rem;color:rgba(255,255,255,0.5);margin-top:8px;">📝 ${order.notes}</div>` : "";

    const statuses = ["PENDING","PREPARING","READY","SERVED"];
    const statusBtns = statuses.map(s => `
      <button class="pos-status-btn ${s === order.status ? "active" : ""} ${s==="SERVED"?"done-btn":""}"
        data-order="${order.id}" data-status="${s}">
        ${{ PENDING:"⏳ Pending", PREPARING:"🔥 Preparing", READY:"✅ Ready", SERVED:"🍽 Served" }[s]}
      </button>`
    ).join("");

    card.innerHTML = `
      <div class="pos-card-header">
        <span class="pos-order-id">${order.id}</span>
        <span class="pos-time">${order.timestamp}</span>
      </div>
      <div class="pos-table">${order.tableNumber} · ${order.displayType}</div>
      <div class="pos-items">${itemRows}${notesHtml}</div>
      <div class="pos-total">PHP ${order.total.toFixed(2)}</div>
      <div class="pos-status-row">${statusBtns}</div>`;

    card.querySelectorAll(".pos-status-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        CartManager.updateStatus(btn.dataset.order, btn.dataset.status);
        renderPOSOrders();
      });
    });

    return card;
  }

  function startPOSRefresh() {
    stopPOSRefresh();
    posRefreshTimer = setInterval(renderPOSOrders, 5000);
  }

  function stopPOSRefresh() {
    if (posRefreshTimer) { clearInterval(posRefreshTimer); posRefreshTimer = null; }
  }

  // ── TOAST ────────────────────────────────────────────────

  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.remove("hidden");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add("hidden"), 2200);
  }

  // ── Public API ───────────────────────────────────────────
  return {
    goTo,
    goToScan,
    goToPOS,
    selectTable,
    filterMenu,
    openDetail,
    changeQty,
    addToCart,
    goToCart,
    placeOrder,
    resetSession,
    showToast
  };

})();

// ── Boot ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  App.goTo("welcome");
});
