// app.js - Pehnava Platform Logic

document.addEventListener("DOMContentLoaded", () => {

  // --- PREMIUM SVG PLACEHOLDER GENERATOR ---
  const categoryColors = {
    "Sarees":       { bg1: "#4a1c2e", bg2: "#8b2252", accent: "#c5a880" },
    "Lehengas":     { bg1: "#2d1810", bg2: "#5c3a28", accent: "#d4af37" },
    "Indo-Western": { bg1: "#1c2833", bg2: "#2c3e50", accent: "#bfc9ca" },
    "Co-ords":      { bg1: "#1c1917", bg2: "#44403c", accent: "#a8a29e" },
    "Sherwanis":    { bg1: "#1a1a2e", bg2: "#16213e", accent: "#e2c275" },
    "default":      { bg1: "#292524", bg2: "#57534e", accent: "#c5a880" }
  };

  function getPlaceholderSVG(name, category) {
    const colors = categoryColors[category] || categoryColors["default"];
    const safeName = name.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    // Truncate name for display
    const displayName = safeName.length > 28 ? safeName.substring(0, 25) + "..." : safeName;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:${colors.bg1}"/><stop offset="100%" style="stop-color:${colors.bg2}"/></linearGradient></defs><rect width="400" height="500" fill="url(#g)"/><circle cx="320" cy="80" r="60" fill="${colors.accent}" opacity="0.08"/><circle cx="80" cy="420" r="90" fill="${colors.accent}" opacity="0.06"/><line x1="140" y1="240" x2="260" y2="240" stroke="${colors.accent}" stroke-width="0.5" opacity="0.4"/><text x="200" y="260" text-anchor="middle" font-family="Georgia,serif" font-size="18" fill="${colors.accent}" letter-spacing="2">${displayName}</text><text x="200" y="290" text-anchor="middle" font-family="sans-serif" font-size="10" fill="${colors.accent}" opacity="0.5" letter-spacing="4" text-transform="uppercase">${category || "PEHNAVA"}</text></svg>`)}`;
  }


  // --- STATE SYSTEM ---
  const state = {
    currentCity: "Mumbai",
    currentView: "discover", // 'discover' | 'boutique-detail' | 'merchant-dashboard' | 'order-tracking'
    selectedBoutiqueId: null,
    selectedProductId: null,
    selectedSize: null,
    cart: [],
    currentOrderId: null,
    
    // Seeded reservations for merchant portal demo
    reservations: [
      {
        id: "res-101",
        customerName: "Aishwarya Rai",
        phone: "+91 98200 12345",
        boutiqueId: "jharokha-heritage",
        boutiqueName: "Jharokha Heritage",
        productName: "Varanasi Kadwa Silk Saree",
        price: 85000,
        type: "Home Trial",
        date: "2026-06-18",
        time: "11:00 AM - 01:00 PM",
        address: "Juhu Scheme, Villa 12, Mumbai",
        status: "Pending"
      },
      {
        id: "res-102",
        customerName: "Mira Rajput",
        phone: "+91 98110 54321",
        boutiqueId: "shunya-design-studio",
        boutiqueName: "Shunya Design Studio",
        productName: "Architectural Drape Saree-Gown",
        price: 58000,
        type: "Purchase Reservation",
        date: "2026-06-17",
        time: "Express Dispatch",
        address: "Worli Sea Face, Flat 18B, Mumbai",
        status: "Approved"
      },
      {
        id: "res-103",
        customerName: "Deepika Padukone",
        phone: "+91 98450 99887",
        boutiqueId: "mehrab-couture",
        boutiqueName: "Mehrab Couture",
        productName: "Qutub Ivory Zardozi Lehenga",
        price: 320000,
        type: "In-Store VIP",
        date: "2026-06-20",
        time: "02:00 PM - 04:00 PM",
        address: "Mehrauli Studio Lounge, Delhi",
        status: "Pending"
      }
    ],
    
    activeFilter: "All",
    chatHistory: [
      {
        sender: "assistant",
        text: "Namaste, I am Ananya, your Pehnava personal fashion concierge. I can recommend premium boutiques matching your aesthetic, arrange personalized styling sessions, or check custom lead times for you.<br><br>What silhouette or occasion are you styling for today?",
        time: "15:30"
      }
    ],
    
    // Orders (payment history)
    orders: typeof ORDERS_DATA !== "undefined" ? ORDERS_DATA : []
  };

  // --- DOM CACHE ---
  const elements = {
    appView: document.getElementById("app-view"),
    citySelect: document.getElementById("city-select"),
    brandLogoBtn: document.getElementById("brand-logo-btn"),
    navBtnDiscover: document.getElementById("nav-btn-discover"),
    navBtnTrackOrder: document.getElementById("nav-btn-track-order"),
    toggleMerchantView: document.getElementById("toggle-merchant-view"),
    
    // Drawers
    sharedBackdrop: document.getElementById("shared-drawer-backdrop"),
    productDrawer: document.getElementById("product-detail-drawer"),
    productDrawerContent: document.getElementById("product-drawer-content"),
    bookingDrawer: document.getElementById("booking-drawer"),
    cartDrawer: document.getElementById("cart-drawer"),
    cartItemsContainer: document.getElementById("cart-items-container"),
    cartDrawerFooter: document.getElementById("cart-drawer-footer"),
    cartSubtotalVal: document.getElementById("cart-subtotal-val"),
    conciergeDrawer: document.getElementById("concierge-drawer"),
    chatHistoryContainer: document.getElementById("chat-history-container"),
    chatInput: document.getElementById("chat-input"),
    btnSendChat: document.getElementById("btn-send-chat"),
    chatSuggestions: document.getElementById("chat-suggestions"),
    
    // Drawer Triggers/Closes
    btnOpenCart: document.getElementById("btn-open-cart"),
    btnOpenConcierge: document.getElementById("btn-open-concierge"),
    btnCloseProduct: document.getElementById("btn-close-product"),
    btnCloseBooking: document.getElementById("btn-close-booking"),
    btnCloseCart: document.getElementById("btn-close-cart"),
    btnCloseConcierge: document.getElementById("btn-close-concierge"),
    
    // Badges
    cartBadge: document.getElementById("cart-badge"),
    conciergeBadge: document.getElementById("concierge-badge"),
    
    // Dialog Buttons/Forms
    btnProductBook: document.getElementById("btn-product-book"),
    btnProductAddCart: document.getElementById("btn-product-add-cart"),
    btnSubmitBooking: document.getElementById("btn-submit-booking"),
    btnCartCheckout: document.getElementById("btn-cart-checkout"),
    bookingForm: document.getElementById("booking-form"),
    bookingModeHome: document.getElementById("booking-mode-home"),
    bookingModeInstore: document.getElementById("booking-mode-instore"),
    bookingAddressGroup: document.getElementById("booking-address-group"),
    
    // Success Modals
    checkoutModal: document.getElementById("checkout-success-modal"),
    bookingModal: document.getElementById("booking-success-modal"),
    btnCloseCheckoutModal: document.getElementById("btn-close-checkout-modal"),
    btnCloseBookingModal: document.getElementById("btn-close-booking-modal"),
    
    // Checkout drawer
    checkoutDrawer: document.getElementById("checkout-drawer"),
    checkoutForm: document.getElementById("checkout-form"),
    btnCloseCheckout: document.getElementById("btn-close-checkout"),
    btnPayRazorpay: document.getElementById("btn-pay-razorpay"),
    paymentModal: document.getElementById("payment-success-modal"),
    btnViewOrderTracking: document.getElementById("btn-view-order-tracking"),
    checkoutOrderSummary: document.getElementById("checkout-order-summary"),
    checkoutSubtotal: document.getElementById("checkout-subtotal"),
    checkoutServiceFee: document.getElementById("checkout-service-fee"),
    checkoutTotal: document.getElementById("checkout-total")
  };

  // --- DRAWER HELPER FUNCTIONS ---
  function openDrawer(drawerElement) {
    elements.sharedBackdrop.classList.add("open");
    drawerElement.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevents background scroll
  }

  function closeAllDrawers() {
    elements.sharedBackdrop.classList.remove("open");
    elements.productDrawer.classList.remove("open");
    elements.bookingDrawer.classList.remove("open");
    elements.cartDrawer.classList.remove("open");
    elements.conciergeDrawer.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Bind closes
  elements.sharedBackdrop.addEventListener("click", closeAllDrawers);
  elements.btnCloseProduct.addEventListener("click", closeAllDrawers);
  elements.btnCloseBooking.addEventListener("click", closeAllDrawers);
  elements.btnCloseCart.addEventListener("click", closeAllDrawers);
  elements.btnCloseConcierge.addEventListener("click", closeAllDrawers);
  elements.btnCloseCheckout.addEventListener("click", closeAllDrawers);

  // Bind triggers
  elements.btnOpenCart.addEventListener("click", () => {
    updateCartDrawer();
    openDrawer(elements.cartDrawer);
  });
  
  elements.btnOpenConcierge.addEventListener("click", () => {
    elements.conciergeBadge.style.display = "none"; // Read notification
    openDrawer(elements.conciergeDrawer);
    scrollToBottom(elements.chatHistoryContainer);
  });

  // --- SPA ROUTER & RENDERING ---
  function navigateTo(viewName, selectedId = null) {
    state.currentView = viewName;
    if (viewName === "order-tracking") {
      state.selectedBoutiqueId = selectedId; // Use boutiqueId field to pass order ID for order-tracking
    } else {
      state.selectedBoutiqueId = selectedId;
    }
    closeAllDrawers();
    
    // Modify body styling depending on view
    if (viewName === "merchant-dashboard") {
      document.body.classList.add("merchant-mode");
      elements.navBtnDiscover.classList.remove("active");
      elements.navBtnTrackOrder.classList.remove("active");
      elements.toggleMerchantView.classList.add("active");
    } else {
      document.body.classList.remove("merchant-mode");
      elements.toggleMerchantView.classList.remove("active");
      if (viewName === "discover") {
        elements.navBtnDiscover.classList.add("active");
        elements.navBtnTrackOrder.classList.remove("active");
      } else if (viewName === "order-tracking") {
        elements.navBtnDiscover.classList.remove("active");
        elements.navBtnTrackOrder.classList.add("active");
      } else {
        elements.navBtnDiscover.classList.remove("active");
        elements.navBtnTrackOrder.classList.remove("active");
      }
    }
    
    renderActiveView();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Bind nav links
  elements.brandLogoBtn.addEventListener("click", () => navigateTo("discover"));
  elements.navBtnDiscover.addEventListener("click", () => navigateTo("discover"));
  elements.navBtnTrackOrder.addEventListener("click", () => navigateTo("order-tracking"));
  elements.toggleMerchantView.addEventListener("click", () => navigateTo("merchant-dashboard"));

  elements.citySelect.addEventListener("change", (e) => {
    state.currentCity = e.target.value;
    // If we're on discover or merchant view, refresh
    navigateTo("discover");
  });

  function renderActiveView() {
    elements.appView.innerHTML = "";
    
    if (state.currentView === "discover") {
      renderDiscoverPage();
    } else if (state.currentView === "boutique-detail") {
      renderBoutiquePage();
    } else if (state.currentView === "merchant-dashboard") {
      renderMerchantDashboard();
    } else if (state.currentView === "order-tracking") {
      renderOrderTracking();
    }
  }

  // --- LANDING / DISCOVER VIEW RENDERER ---
  function renderDiscoverPage() {
    // Filter boutiques by selected city
    const boutiques = BOUTIQUES_DATA.filter(b => b.city === state.currentCity);
    
    // 1. Hero banner HTML (aesthetic luxury feel)
    let html = `
      <section class="hero-section fade-in">
        <div class="hero-overlay"></div>
        <img class="hero-image" src="assets/images/hero_boutique.jpg" alt="Luxury boutique setup" onerror="this.style.display='none'; this.parentNode.style.backgroundColor='#1c1917';">
        <div class="hero-content">
          <span class="hero-tag">A Curated Gateway</span>
          <h2 class="hero-title">Discover India's Handpicked Couturiers</h2>
          <p class="hero-description">Connecting urban elites with a select circle of 15–20 high-end fashion boutiques in ${state.currentCity}. Experience bespoke tailoring, heritage textiles, and private fitting lounges.</p>
          <button class="btn btn-accent" id="hero-action-btn">Explore Local Studios</button>
        </div>
      </section>

      <section class="section-header fade-in">
        <div class="section-title-wrapper">
          <h2>Verified Local Boutiques</h2>
          <span class="section-subtitle">Exclusivity & Trust • Selected for ${state.currentCity}</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--color-accent-dark); font-weight: 500;">
          Showing ${boutiques.length} Boutiques
        </div>
      </section>

      <div class="boutique-grid fade-in">
    `;

    // 2. Loop boutiques
    if (boutiques.length === 0) {
      html += `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p>We are currently onboarding elite designers in ${state.currentCity}. Switch to Mumbai or Delhi for active curation.</p>
        </div>
      `;
    } else {
      boutiques.forEach(boutique => {
        // Find categories from product catalog
        const categories = [...new Set(boutique.inventory.map(item => item.category))].join(" • ");
        
        html += `
          <article class="boutique-card" data-boutique-id="${boutique.id}">
            <div class="boutique-card-image-wrapper">
              <span class="boutique-card-badge">${boutique.neighborhood}</span>
              <img class="boutique-card-image" src="${boutique.coverImage}" alt="${boutique.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eae3db%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 font-family=%22serif%22 font-size=%2224%22 fill=%22%231c1917%22>${boutique.name}</text></svg>'">
            </div>
            <div class="boutique-card-info">
              <div class="boutique-card-meta">
                <span>${categories}</span>
                <span class="boutique-card-rating"><svg viewBox="0 0 12 12" width="12" height="12" fill="var(--color-accent-dark)" style="vertical-align:-1px;margin-right:2px;"><polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9,11 6,9.5 3,11 3.5,7.5 1,5 4.5,4.5"/></svg>${boutique.rating} (${boutique.reviewsCount})</span>
              </div>
              <h3 class="boutique-card-title">${boutique.name}</h3>
              <p class="boutique-card-story">${boutique.story}</p>
              <div class="boutique-card-footer">
                <div class="boutique-card-designer">Designer: <span>${boutique.designer}</span></div>
                <div class="boutique-card-link">Explore Collection <span class="arrow-icon">&#x2192;</span></div>
              </div>
            </div>
          </article>
        `;
      });
    }

    html += `
      </div>

      <!-- Feature highlight banner -->
      <section class="features-section fade-in">
        <div class="feature-box">
          <div class="feature-icon-wrapper">
            <svg viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
          </div>
          <h3>Curated Exclusivity</h3>
          <p>No endless scrolling. We partner strictly with 15-20 verified fashion houses per city to guarantee premium craftsmanship.</p>
        </div>
        <div class="feature-box">
          <div class="feature-icon-wrapper">
            <svg viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h3>Private Fitting Trial</h3>
          <p>Reserve up to 3 outfits for Home Curator Trial or book a dedicated VIP Suite session inside the physical boutique.</p>
        </div>
        <div class="feature-box">
          <div class="feature-icon-wrapper">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>
          </div>
          <h3>Convenient Bespoke</h3>
          <p>Enjoy digitized store inventory, real-time availability check, sizing consultations, and curated door-to-door delivery.</p>
        </div>
      </section>
    `;

    elements.appView.innerHTML = html;

    // Attach click listeners
    const cards = elements.appView.querySelectorAll(".boutique-card");
    cards.forEach(card => {
      card.addEventListener("click", () => {
        navigateTo("boutique-detail", card.dataset.boutiqueId);
      });
    });

    const heroAction = document.getElementById("hero-action-btn");
    if (heroAction) {
      heroAction.addEventListener("click", () => {
        const grid = document.querySelector(".section-header");
        if (grid) grid.scrollIntoView({ behavior: "smooth" });
      });
    }
  }

  // --- BOUTIQUE DETAIL STOREFRONT VIEW RENDERER ---
  function renderBoutiquePage() {
    const boutique = BOUTIQUES_DATA.find(b => b.id === state.selectedBoutiqueId);
    if (!boutique) {
      navigateTo("discover");
      return;
    }

    // Get unique categories for side filter
    const categories = ["All", ...new Set(boutique.inventory.map(item => item.category))];

    // Filter products
    const filteredProducts = state.activeFilter === "All" 
      ? boutique.inventory 
      : boutique.inventory.filter(item => item.category === state.activeFilter);

    let html = `
      <!-- Boutique Cover Banner -->
      <section class="boutique-header-banner fade-in">
        <div class="boutique-header-overlay"></div>
        <img class="boutique-header-img" src="${boutique.coverImage}" alt="${boutique.name}" onerror="this.style.display='none'; this.parentNode.style.backgroundColor='#1c1917';">
        <div class="boutique-header-content">
          <div class="boutique-header-text">
            <span class="boutique-header-aesthetic">${boutique.aesthetic}</span>
            <h2 class="boutique-header-title">${boutique.name}</h2>
            <p class="boutique-header-desc">${boutique.story}</p>
          </div>
          <div class="boutique-header-designer-box">
            <div class="boutique-header-designer-lbl">Lead Designer</div>
            <div class="boutique-header-designer-val">${boutique.designer}</div>
          </div>
        </div>
      </section>

      <!-- Back Link -->
      <div class="fade-in" style="margin-bottom: var(--spacing-lg);">
        <button class="btn-text" id="btn-back-to-discover"><span class="arrow-icon">&#x2190;</span> Back to Curations in ${state.currentCity}</button>
      </div>

      <!-- Catalog Layout -->
      <div class="catalog-section fade-in">
        
        <!-- Sidebar filters -->
        <aside class="catalog-sidebar">
          <div class="filter-group">
            <h4 class="filter-group-title">Aesthetic Categories</h4>
            <ul class="filter-list">
    `;

    categories.forEach(cat => {
      const count = cat === "All" 
        ? boutique.inventory.length 
        : boutique.inventory.filter(item => item.category === cat).length;
      
      const activeClass = state.activeFilter === cat ? "active" : "";
      
      html += `
        <li class="filter-item">
          <button class="filter-btn ${activeClass}" data-filter="${cat}">
            <span>${cat}</span>
            <span class="filter-count">${count}</span>
          </button>
        </li>
      `;
    });

    html += `
            </ul>
          </div>
          <div style="margin-top: var(--spacing-xl); padding: var(--spacing-md); border-radius: var(--radius-sm); border: 1px dashed var(--color-accent); font-size: 0.75rem; color: var(--color-text-muted);">
            <strong style="color: var(--color-primary); display: block; margin-bottom: var(--spacing-xs);">Need assistance?</strong>
            Let our personal shopper select sizes or schedule customized modifications. Send a request in the concierge styling chat.
          </div>
        </aside>

        <!-- Product Grid -->
        <section class="product-collection">
          <div class="section-header" style="margin-bottom: var(--spacing-lg); padding-bottom: var(--spacing-sm);">
            <h3 style="font-size: 1.5rem;">The Curated Catalog</h3>
            <span style="font-size: 0.8rem; color: var(--color-secondary);">${filteredProducts.length} Exclusive Silhouettes</span>
          </div>

          <div class="product-grid">
    `;

    if (filteredProducts.length === 0) {
      html += `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <p>No items found in this category.</p>
        </div>
      `;
    } else {
      filteredProducts.forEach(product => {
        html += `
          <article class="product-card" data-product-id="${product.id}">
            <div class="product-card-image-wrapper">
              <img class="product-card-image" src="${product.images[0]}" alt="${product.name}" onerror="this.onerror=null; this.src='${getPlaceholderSVG(product.name, product.category)}'">
              ${product.customizable ? `<span class="product-card-customizable">Customizable</span>` : ""}
            </div>
            <div class="product-card-info">
              <span class="product-card-category">${product.category}</span>
              <h4 class="product-card-name">${product.name}</h4>
              <p class="product-card-fabric">${product.fabric}</p>
              <div class="product-card-footer">
                <span class="product-card-price">₹${product.price.toLocaleString("en-IN")}</span>
                <span class="product-card-btn">View Details <span class="arrow-icon">&#x2192;</span></span>
              </div>
            </div>
          </article>
        `;
      });
    }

    html += `
          </div>
        </section>
      </div>
    `;

    elements.appView.innerHTML = html;

    // Attach button events
    document.getElementById("btn-back-to-discover").addEventListener("click", () => {
      navigateTo("discover");
    });

    const filterBtns = elements.appView.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        state.activeFilter = btn.dataset.filter;
        renderBoutiquePage();
      });
    });

    const productCards = elements.appView.querySelectorAll(".product-card");
    productCards.forEach(card => {
      card.addEventListener("click", () => {
        openProductDetailDrawer(card.dataset.productId);
      });
    });
  }

  // --- PRODUCT DETAIL DRAWER RENDERING ---
  function openProductDetailDrawer(productId) {
    state.selectedProductId = productId;
    state.selectedSize = null; // reset sizing
    
    // Find product across selected boutique
    const boutique = BOUTIQUES_DATA.find(b => b.id === state.selectedBoutiqueId);
    const product = boutique.inventory.find(p => p.id === productId);
    
    if (!product) return;

    // Build Drawer HTML
    let sizesHtml = "";
    product.sizes.forEach(size => {
      sizesHtml += `
        <button class="size-option-btn" data-size="${size}">${size}</button>
      `;
    });

    elements.productDrawerContent.innerHTML = `
      <div class="detail-img-container">
        <img class="detail-img" src="${product.images[0]}" alt="${product.name}" onerror="this.onerror=null; this.src='${getPlaceholderSVG(product.name, product.category)}'">
      </div>
      
      <div class="detail-boutique-lbl">${boutique.name}</div>
      <h3 class="detail-name" id="selected-product-title">${product.name}</h3>
      <div class="detail-price">₹${product.price.toLocaleString("en-IN")}</div>
      
      <p class="detail-description">${product.description}</p>
      
      <div class="detail-info-grid">
        <div>
          <span class="detail-info-grid-label">Fabric / Textile</span>
          <div class="detail-info-item-value">${product.fabric}</div>
        </div>
        <div>
          <span class="detail-info-grid-label">Craftsmanship</span>
          <div class="detail-info-item-value">${product.craftsmanship}</div>
        </div>
        <div>
          <span class="detail-info-grid-label">Custom Sizing</span>
          <div class="detail-info-item-value">${product.customizable ? "Available via Designer Call" : "Standard fits only"}</div>
        </div>
        <div>
          <span class="detail-info-grid-label">Tailoring Lead Time</span>
          <div class="detail-info-item-value">${product.leadTime}</div>
        </div>
      </div>

      <div class="size-selector-group">
        <span class="size-label">Select Fit / Measurement Option</span>
        <div class="size-options" id="drawer-size-options">
          ${sizesHtml}
        </div>
      </div>
    `;

    // Size Select logic
    const sizeBtns = elements.productDrawerContent.querySelectorAll(".size-option-btn");
    sizeBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        sizeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.selectedSize = btn.dataset.size;
      });
    });

    openDrawer(elements.productDrawer);
  }

  // --- BUTTON CLICKS FOR PRODUCT DRAWER ---
  elements.btnProductAddCart.onclick = () => {
    if (!state.selectedProductId) return;
    if (!state.selectedSize) {
      alert("Please select a sizing option before reserving.");
      return;
    }
    
    const boutique = BOUTIQUES_DATA.find(b => b.id === state.selectedBoutiqueId);
    const product = boutique.inventory.find(p => p.id === state.selectedProductId);

    // Add to cart
    state.cart.push({
      product: product,
      boutique: boutique,
      size: state.selectedSize
    });

    // Update Cart UI
    updateCartBadge();
    closeAllDrawers();
    setTimeout(() => {
      updateCartDrawer();
      openDrawer(elements.cartDrawer);
    }, 400);
  };

  elements.btnProductBook.onclick = () => {
    if (!state.selectedProductId) return;
    
    // Auto populate date
    const today = new Date();
    today.setDate(today.getDate() + 1); // tomorrow as min date
    const tomorrowStr = today.toISOString().split("T")[0];
    document.getElementById("booking-date").setAttribute("min", tomorrowStr);
    document.getElementById("booking-date").value = tomorrowStr;
    
    // Toggle address input based on booking mode default
    elements.bookingAddressGroup.style.display = "flex";

    closeAllDrawers();
    setTimeout(() => {
      openDrawer(elements.bookingDrawer);
    }, 400);
  };

  // --- SCHEDULER TRIAL SELECTION ---
  elements.bookingModeHome.onclick = () => {
    elements.bookingModeHome.classList.add("active");
    elements.bookingModeInstore.classList.remove("active");
    elements.bookingAddressGroup.style.display = "flex";
    document.getElementById("booking-address").setAttribute("required", "true");
  };

  elements.bookingModeInstore.onclick = () => {
    elements.bookingModeInstore.classList.add("active");
    elements.bookingModeHome.classList.remove("active");
    elements.bookingAddressGroup.style.display = "none";
    document.getElementById("booking-address").removeAttribute("required");
  };

  elements.btnSubmitBooking.onclick = () => {
    const name = document.getElementById("booking-name").value.trim();
    const phone = document.getElementById("booking-phone").value.trim();
    const date = document.getElementById("booking-date").value;
    const slot = document.getElementById("booking-time").value;
    const address = document.getElementById("booking-address").value.trim();
    const notes = document.getElementById("booking-notes").value.trim();
    
    if (!name || !phone || !date) {
      alert("Please fill out your Name, Phone Number, and Date.");
      return;
    }

    const mode = elements.bookingModeHome.classList.contains("active") ? "Home Trial" : "In-Store VIP";
    const boutique = BOUTIQUES_DATA.find(b => b.id === state.selectedBoutiqueId);
    const product = boutique.inventory.find(p => p.id === state.selectedProductId);

    // Save to reservations list
    const newReservation = {
      id: "res-" + Math.floor(Math.random() * 900 + 100),
      customerName: name,
      phone: phone,
      boutiqueId: boutique.id,
      boutiqueName: boutique.name,
      productName: product.name,
      price: product.price,
      type: mode,
      date: date,
      time: slot,
      address: mode === "Home Trial" ? address : `${boutique.name} Studio - ${boutique.neighborhood}`,
      status: "Pending"
    };

    state.reservations.push(newReservation);
    
    // Reset form
    elements.bookingForm.reset();
    closeAllDrawers();
    
    // Open Success Dialog
    setTimeout(() => {
      openModal(elements.bookingModal);
    }, 400);
  };

  // --- SHOPPING CART MANAGEMENT ---
  function updateCartBadge() {
    elements.cartBadge.innerText = state.cart.length;
  }

  function updateCartDrawer() {
    elements.cartItemsContainer.innerHTML = "";
    
    if (state.cart.length === 0) {
      elements.cartItemsContainer.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <p>No outfits reserved yet.</p>
        </div>
      `;
      elements.cartDrawerFooter.style.display = "none";
      return;
    }

    let subtotal = 0;
    
    state.cart.forEach((item, index) => {
      subtotal += item.product.price;
      
      elements.cartItemsContainer.innerHTML += `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.product.images[0]}" alt="${item.product.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23faf8f5%22/></svg>'">
          <div class="cart-item-info">
            <div>
              <h4 class="cart-item-name">${item.product.name}</h4>
              <div class="cart-item-meta">${item.boutique.name} • Fit: <strong>${item.size}</strong></div>
            </div>
            <div class="cart-item-price-row">
              <span class="cart-item-price">₹${item.product.price.toLocaleString("en-IN")}</span>
              <button class="cart-item-remove" data-index="${index}">Remove</button>
            </div>
          </div>
        </div>
      `;
    });

    elements.cartSubtotalVal.innerText = `₹${subtotal.toLocaleString("en-IN")}`;
    elements.cartDrawerFooter.style.display = "block";

    // Remove buttons bind
    const removeBtns = elements.cartItemsContainer.querySelectorAll(".cart-item-remove");
    removeBtns.forEach(btn => {
      btn.onclick = () => {
        const idx = parseInt(btn.dataset.index);
        state.cart.splice(idx, 1);
        updateCartBadge();
        updateCartDrawer();
      };
    });
  }

  elements.btnCartCheckout.onclick = () => {
    if (state.cart.length === 0) return;

    // Prepare checkout form with order details
    let subtotal = 0;
    let summaryHtml = "";
    
    state.cart.forEach(item => {
      subtotal += item.product.price;
      summaryHtml += `
        <div style="margin-bottom: var(--spacing-sm);">
          <div style="display: flex; justify-content: space-between; font-weight: 500;">
            <span>${item.product.name}</span>
            <span>₹${item.product.price.toLocaleString("en-IN")}</span>
          </div>
          <div style="font-size: 0.8rem; color: #666;">from ${item.boutique.name}</div>
        </div>
      `;
    });
    
    const serviceFee = Math.ceil(subtotal * 0.05); // 5% service fee
    const total = subtotal + serviceFee;
    
    elements.checkoutOrderSummary.innerHTML = summaryHtml;
    elements.checkoutSubtotal.innerText = `₹${subtotal.toLocaleString("en-IN")}`;
    elements.checkoutServiceFee.innerText = `₹${serviceFee.toLocaleString("en-IN")}`;
    elements.checkoutTotal.innerText = `₹${total.toLocaleString("en-IN")}`;
    
    // Store checkout data in state
    state.checkoutData = {
      subtotal: subtotal,
      serviceFee: serviceFee,
      total: total,
      items: [...state.cart]
    };

    closeAllDrawers();
    setTimeout(() => {
      openDrawer(elements.checkoutDrawer);
    }, 400);
  };

  // --- PAYMENT MODAL (SIMULATED GATEWAY) ---
  elements.btnPayRazorpay.onclick = () => {
    const name = document.getElementById("checkout-fullname").value.trim();
    const email = document.getElementById("checkout-email").value.trim();
    const phone = document.getElementById("checkout-phone").value.trim();
    const address = document.getElementById("checkout-address").value.trim();
    const city = document.getElementById("checkout-city").value;
    const pincode = document.getElementById("checkout-pincode").value.trim();

    if (!name || !email || !phone || !address || !city || !pincode) {
      // Highlight empty fields
      [
        { id: "checkout-fullname", val: name },
        { id: "checkout-email", val: email },
        { id: "checkout-phone", val: phone },
        { id: "checkout-address", val: address },
        { id: "checkout-city", val: city },
        { id: "checkout-pincode", val: pincode }
      ].forEach(({ id, val }) => {
        const el = document.getElementById(id);
        if (!val) {
          el.style.borderColor = "#ef4444";
          el.addEventListener("input", () => { el.style.borderColor = ""; }, { once: true });
        }
      });
      const firstEmpty = document.querySelector("#checkout-form input[required]:invalid, #checkout-form select[required]:invalid");
      if (firstEmpty) firstEmpty.focus();
      else document.getElementById("checkout-city").focus();
      return;
    }

    if (!state.checkoutData) {
      return;
    }

    // Generate Order ID
    const orderId = "PHNV-" + String(Math.floor(100000 + Math.random() * 900000)).padStart(6, "0");
    const totalFormatted = `₹${state.checkoutData.total.toLocaleString("en-IN")}`;

    // Build and inject payment modal overlay
    const existingModal = document.getElementById("payment-gateway-modal");
    if (existingModal) existingModal.remove();

    const gatewayModal = document.createElement("div");
    gatewayModal.id = "payment-gateway-modal";
    gatewayModal.style.cssText = `
      position: fixed; inset: 0; z-index: 500;
      background: rgba(10,10,15,0.75); backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center;
      animation: fadeInUp 0.35s ease both;
    `;
    gatewayModal.innerHTML = `
      <div style="
        background: #fff; border-radius: 16px; width: 420px; max-width: 95vw;
        box-shadow: 0 24px 60px rgba(0,0,0,0.25); overflow: hidden;
        font-family: var(--font-sans);
      ">
        <!-- Gateway Header -->
        <div style="
          background: #1c1917; padding: 18px 24px;
          display: flex; justify-content: space-between; align-items: center;
        ">
          <div style="display:flex; align-items:center; gap:10px;">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#c5a880" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <div>
              <div style="color:#c5a880; font-weight:700; font-size:0.85rem; letter-spacing:0.1em; text-transform:uppercase;">Pehnava</div>
              <div style="color:#94a3b8; font-size:0.7rem;">Secure Payment</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="color:#fff; font-weight:700; font-size:1.2rem;">${totalFormatted}</div>
            <div style="color:#94a3b8; font-size:0.7rem;">Order ${orderId}</div>
          </div>
        </div>

        <!-- Payment Method Tabs -->
        <div style="display:flex; border-bottom: 1px solid #f0f0f0; background:#fafafa;">
          <button id="tab-upi" onclick="switchPayTab('upi')" style="
            flex:1; padding:12px 8px; border:none; background:none; font-size:0.78rem;
            font-weight:600; cursor:pointer; border-bottom:2px solid #1c1917; color:#1c1917;
            font-family:inherit; transition: all 0.2s;
          ">UPI</button>
          <button id="tab-card" onclick="switchPayTab('card')" style="
            flex:1; padding:12px 8px; border:none; background:none; font-size:0.78rem;
            font-weight:600; cursor:pointer; border-bottom:2px solid transparent; color:#78716c;
            font-family:inherit; transition: all 0.2s;
          ">Card</button>
          <button id="tab-netbank" onclick="switchPayTab('netbank')" style="
            flex:1; padding:12px 8px; border:none; background:none; font-size:0.78rem;
            font-weight:600; cursor:pointer; border-bottom:2px solid transparent; color:#78716c;
            font-family:inherit; transition: all 0.2s;
          ">Net Banking</button>
        </div>

        <!-- Tab Content -->
        <div style="padding:24px;">

          <!-- UPI Tab -->
          <div id="pay-upi" style="display:block;">
            <div style="font-size:0.8rem; color:#78716c; margin-bottom:14px;">Enter your UPI ID to pay instantly</div>
            <div style="position:relative; margin-bottom:16px;">
              <input id="upi-input" type="text" placeholder="yourname@upi" style="
                width:100%; padding:12px 14px; border:1.5px solid #e7e5e4; border-radius:8px;
                font-size:0.9rem; outline:none; box-sizing:border-box; font-family:inherit;
                transition: border-color 0.2s;
              " onfocus="this.style.borderColor='#c5a880'" onblur="this.style.borderColor='#e7e5e4'">
            </div>
            <div style="display:flex; gap:10px; margin-bottom:18px; flex-wrap:wrap;">
              ${["GPay", "PhonePe", "Paytm", "BHIM"].map(app => `
                <button onclick="document.getElementById('upi-input').value='${name.split(' ')[0].toLowerCase()}@${app.toLowerCase()}'; document.getElementById('upi-input').focus();" style="
                  padding:6px 12px; border:1px solid #e7e5e4; background:#fafafa; border-radius:6px;
                  font-size:0.75rem; cursor:pointer; font-weight:500; font-family:inherit;
                  transition: all 0.15s; color:#292524;
                " onmouseover="this.style.borderColor='#c5a880'" onmouseout="this.style.borderColor='#e7e5e4'">${app}</button>
              `).join("")}
            </div>
          </div>

          <!-- Card Tab -->
          <div id="pay-card" style="display:none;">
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <div style="font-size:0.72rem; font-weight:600; color:#292524; margin-bottom:5px; text-transform:uppercase; letter-spacing:0.05em;">Card Number</div>
                <input id="card-num" type="text" placeholder="1234 5678 9012 3456" maxlength="19" style="
                  width:100%; padding:11px 14px; border:1.5px solid #e7e5e4; border-radius:8px;
                  font-size:0.9rem; outline:none; box-sizing:border-box; font-family:inherit;
                  transition: border-color 0.2s; letter-spacing:0.05em;
                " oninput="this.value=this.value.replace(/[^0-9]/g,'').replace(/(.{4})/g,'$1 ').trim()" onfocus="this.style.borderColor='#c5a880'" onblur="this.style.borderColor='#e7e5e4'">
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                <div>
                  <div style="font-size:0.72rem; font-weight:600; color:#292524; margin-bottom:5px; text-transform:uppercase; letter-spacing:0.05em;">Expiry</div>
                  <input id="card-exp" type="text" placeholder="MM / YY" maxlength="7" style="
                    width:100%; padding:11px 14px; border:1.5px solid #e7e5e4; border-radius:8px;
                    font-size:0.9rem; outline:none; box-sizing:border-box; font-family:inherit;
                    transition: border-color 0.2s;
                  " oninput="let v=this.value.replace(/[^0-9]/g,''); if(v.length>=3) v=v.slice(0,2)+' / '+v.slice(2); this.value=v;" onfocus="this.style.borderColor='#c5a880'" onblur="this.style.borderColor='#e7e5e4'">
                </div>
                <div>
                  <div style="font-size:0.72rem; font-weight:600; color:#292524; margin-bottom:5px; text-transform:uppercase; letter-spacing:0.05em;">CVV</div>
                  <input id="card-cvv" type="password" placeholder="•••" maxlength="4" style="
                    width:100%; padding:11px 14px; border:1.5px solid #e7e5e4; border-radius:8px;
                    font-size:0.9rem; outline:none; box-sizing:border-box; font-family:inherit;
                    transition: border-color 0.2s;
                  " onfocus="this.style.borderColor='#c5a880'" onblur="this.style.borderColor='#e7e5e4'">
                </div>
              </div>
              <div>
                <div style="font-size:0.72rem; font-weight:600; color:#292524; margin-bottom:5px; text-transform:uppercase; letter-spacing:0.05em;">Name on Card</div>
                <input id="card-name" type="text" placeholder="${name}" value="${name}" style="
                  width:100%; padding:11px 14px; border:1.5px solid #e7e5e4; border-radius:8px;
                  font-size:0.9rem; outline:none; box-sizing:border-box; font-family:inherit;
                  transition: border-color 0.2s;
                " onfocus="this.style.borderColor='#c5a880'" onblur="this.style.borderColor='#e7e5e4'">
              </div>
            </div>
          </div>

          <!-- Net Banking Tab -->
          <div id="pay-netbank" style="display:none;">
            <div style="font-size:0.8rem; color:#78716c; margin-bottom:14px;">Select your bank</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:16px;">
              ${["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak", "Yes Bank"].map(bank => `
                <label style="
                  display:flex; align-items:center; gap:8px; padding:10px 12px;
                  border:1.5px solid #e7e5e4; border-radius:8px; cursor:pointer;
                  font-size:0.8rem; font-weight:500; color:#292524;
                  transition: all 0.15s;
                " onmouseover="this.style.borderColor='#c5a880';this.style.background='#fdfbf9'" onmouseout="if(!this.querySelector('input').checked){this.style.borderColor='#e7e5e4';this.style.background='#fff'}">
                  <input type="radio" name="bank-select" value="${bank}" style="accent-color:#c5a880; width:14px; height:14px; flex-shrink:0;" onclick="document.querySelectorAll('[name=bank-select]').forEach(r=>r.closest('label').style.borderColor=r.checked?'#c5a880':'#e7e5e4'); this.closest('label').style.background='#fdfbf9'">
                  ${bank}
                </label>
              `).join("")}
            </div>
          </div>

          <!-- Pay Button -->
          <button id="btn-confirm-payment" onclick="confirmPayment('${orderId}', '${name}', '${email}', '${phone}', '${address}', '${city}', '${pincode}')" style="
            width:100%; padding:14px; background:#1c1917; color:#fff;
            border:none; border-radius:8px; font-size:0.85rem; font-weight:600;
            text-transform:uppercase; letter-spacing:0.12em; cursor:pointer;
            font-family:inherit; transition: all 0.2s; margin-top:4px;
          " onmouseover="this.style.background='#c5a880';this.style.color='#1c1917'" onmouseout="this.style.background='#1c1917';this.style.color='#fff'">
            Pay ${totalFormatted} Securely
          </button>

          <!-- Close / Cancel -->
          <button onclick="document.getElementById('payment-gateway-modal').remove()" style="
            width:100%; padding:10px; background:none; border:none; color:#78716c;
            font-size:0.78rem; cursor:pointer; margin-top:8px; font-family:inherit;
          ">Cancel</button>

        </div>

        <!-- Security Footer -->
        <div style="background:#fafafa; padding:10px 24px; border-top:1px solid #f0f0f0; display:flex; align-items:center; justify-content:center; gap:6px;">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="#94a3b8" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span style="font-size:0.68rem; color:#94a3b8;">256-bit SSL Encrypted · PCI DSS Compliant</span>
        </div>
      </div>
    `;

    document.body.appendChild(gatewayModal);
  };

  // Tab switching for payment modal
  window.switchPayTab = function(tab) {
    ["upi", "card", "netbank"].forEach(t => {
      document.getElementById("pay-" + t).style.display = t === tab ? "block" : "none";
      const btn = document.getElementById("tab-" + t);
      btn.style.borderBottomColor = t === tab ? "#1c1917" : "transparent";
      btn.style.color = t === tab ? "#1c1917" : "#78716c";
    });
  };

  // Confirm payment handler (global scope for inline onclick)
  window.confirmPayment = function(orderId, name, email, phone, address, city, pincode) {
    const btn = document.getElementById("btn-confirm-payment");
    if (!btn) return;

    // Animate button to processing state
    btn.disabled = true;
    btn.style.background = "#c5a880";
    btn.style.color = "#1c1917";
    btn.innerHTML = `
      <span style="display:inline-flex; align-items:center; gap:8px;">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite;">
          <circle cx="12" cy="12" r="10" stroke-dasharray="28 34" stroke-linecap="round"/>
        </svg>
        Processing Payment...
      </span>
    `;

    // Add spin keyframe if not present
    if (!document.getElementById("spin-style")) {
      const style = document.createElement("style");
      style.id = "spin-style";
      style.textContent = "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }";
      document.head.appendChild(style);
    }

    // Simulate payment processing delay
    setTimeout(() => {
      // Remove gateway modal
      const modal = document.getElementById("payment-gateway-modal");
      if (modal) modal.remove();

      // Simulate payment response
      const fakeResponse = {
        razorpay_payment_id: "pay_sim_" + Math.random().toString(36).substr(2, 12).toUpperCase()
      };

      handlePaymentSuccess(orderId, name, email, phone, address, city, pincode, fakeResponse);
    }, 2200);
  };


  function handlePaymentSuccess(orderId, name, email, phone, address, city, pincode, paymentResponse) {
    // Create order object
    const order = {
      orderId: orderId,
      customerName: name,
      email: email,
      phone: phone,
      billingAddress: {
        address: address,
        city: city,
        pincode: pincode
      },
      items: state.checkoutData.items,
      subtotal: state.checkoutData.subtotal,
      serviceFee: state.checkoutData.serviceFee,
      total: state.checkoutData.total,
      orderDate: new Date(),
      paymentId: paymentResponse.razorpay_payment_id,
      paymentStatus: "Completed",
      orderStatus: "Confirmed",
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      timeline: [
        { status: "Order Confirmed", date: new Date(), completed: true },
        { status: "Payment Verified", date: new Date(Date.now() + 1000), completed: true },
        { status: "Boutique Processing", date: new Date(Date.now() + 24 * 60 * 60 * 1000), completed: false },
        { status: "Customization In Progress", date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), completed: false },
        { status: "Quality Check", date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), completed: false },
        { status: "Shipped", date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), completed: false },
        { status: "Delivered", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), completed: false }
      ]
    };
    
    // Convert cart items to reservations
    state.cart.forEach(item => {
      state.reservations.push({
        id: "res-" + Math.floor(Math.random() * 900 + 100),
        customerName: name,
        phone: phone,
        boutiqueId: item.boutique.id,
        boutiqueName: item.boutique.name,
        productName: item.product.name,
        price: item.product.price,
        type: "Purchase Confirmed",
        date: new Date().toISOString().split("T")[0],
        time: "Delivery Pending",
        address: address,
        status: "Approved"
      });
    });
    
    // Save order
    state.orders.push(order);
    state.currentOrderId = orderId;
    state.cart = [];
    
    // Close checkout drawer and show success modal
    closeAllDrawers();
    setTimeout(() => {
      document.getElementById("payment-order-id").innerText = orderId;
      openModal(elements.paymentModal);
    }, 800);
  }

  // Payment success modal handlers
  elements.btnViewOrderTracking.onclick = () => {
    closeModal(elements.paymentModal);
    navigateTo("order-tracking", state.currentOrderId);
  };

  // --- MODAL UTILS ---
  function openModal(modal) {
    modal.classList.add("open");
  }

  function closeModal(modal) {
    modal.classList.remove("open");
  }

  elements.btnCloseCheckoutModal.onclick = () => {
    closeModal(elements.checkoutModal);
    navigateTo("discover");
  };

  elements.btnCloseBookingModal.onclick = () => {
    closeModal(elements.bookingModal);
  };

  // --- CONCIERGE CHAT LOGIC ---
  function addChatMessage(sender, text) {
    const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    state.chatHistory.push({ sender, text, time });
    
    const isUser = sender === "user";
    const bubbleClass = isUser ? "user" : "assistant";
    
    elements.chatHistoryContainer.innerHTML += `
      <div class="chat-bubble ${bubbleClass}">
        ${text}
        <span class="chat-bubble-time">${time}</span>
      </div>
    `;
    scrollToBottom(elements.chatHistoryContainer);
  }

  function scrollToBottom(container) {
    container.scrollTop = container.scrollHeight;
  }

  elements.btnSendChat.onclick = handleChatSubmit;
  elements.chatInput.onkeydown = (e) => {
    if (e.key === "Enter") handleChatSubmit();
  };

  function handleChatSubmit() {
    const msg = elements.chatInput.value.trim();
    if (!msg) return;

    elements.chatInput.value = "";
    addChatMessage("user", msg);
    triggerAutoReply(msg);
  }

  // Handle Suggestion Chips
  const chips = elements.chatSuggestions.querySelectorAll("button");
  chips.forEach(chip => {
    chip.onclick = () => {
      const msg = chip.dataset.msg;
      addChatMessage("user", msg);
      triggerAutoReply(msg);
    };
  });

  function triggerAutoReply(userMsg) {
    const normalized = userMsg.toLowerCase();
    let replyText = "";

    // Show dynamic simulated response
    if (normalized.includes("delhi") || normalized.includes("lehenga")) {
      replyText = "For wedding silhouettes in Delhi, I highly recommend checking out <strong>Mehrab Couture</strong> in Mehrauli. Their <em>Qutub Ivory Zardozi Lehenga</em> represents pristine heritage design (note: tailoring takes 12 weeks). For pastel tones or lighter budgets, <strong>Dori & Dhaga</strong> in Shahpur Jat specializes in custom organza Anarkali designs with a fast 10-day lead time.";
    } else if (normalized.includes("custom") || normalized.includes("time") || normalized.includes("fast")) {
      replyText = "Most of our elite boutiques handcraft garments to order, taking 3-8 weeks. However, <strong>Dori & Dhaga</strong> is excellent for faster dispatch, tailoring orders in 10-14 days. <strong>Kora Silk House</strong> in Bengaluru maintains ready-to-ship inventory of high-zari pure Kanjeevarams, which can be custom-fitted in 48 hours.";
    } else if (normalized.includes("mumbai") || normalized.includes("minimal")) {
      replyText = "If you value structural or minimalist aesthetics, <strong>Shunya Design Studio</strong> in Juhu is spectacular. Designer Rohan Mehta cuts out heavy zari for raw materials, offering outstanding <em>Onyx Raw Silk Pantsuits</em> and modern drape saree-gowns.";
    } else {
      replyText = "Of course! Let me help you narrow your search. Tell me what event or occasion you are shopping for, or if you require specific customization capabilities in Delhi, Mumbai, or Bengaluru.";
    }

    // Typing effect simulator
    setTimeout(() => {
      addChatMessage("assistant", replyText);
    }, 800);
  }

  // --- MERCHANT PORTAL VIEWS & METRICS RENDERER ---
  function renderOrderTracking() {
    let orderId = state.selectedBoutiqueId; // Using selectedBoutiqueId to pass order ID
    let order = state.orders.find(o => o.orderId === orderId);

    if (!order && state.orders.length > 0) {
      // If no specific order found, show the latest
      order = state.orders[state.orders.length - 1];
      orderId = order.orderId;
    }

    if (!order) {
      let html = `
        <div class="fade-in" style="padding: var(--spacing-xl);">
          <button class="btn-text" id="btn-back-discover" style="margin-bottom: var(--spacing-xl);"><span class="arrow-icon">&#x2190;</span> Back to Discovery</button>
          <div class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
            <h3>No Orders Found</h3>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          </div>
        </div>
      `;
      elements.appView.innerHTML = html;
      document.getElementById("btn-back-discover").onclick = () => navigateTo("discover");
      return;
    }

    const orderDate = new Date(order.orderDate);
    const estimatedDeliveryDate = new Date(order.estimatedDelivery);

    let orderSelectHtml = "";
    if (state.orders.length > 1) {
      orderSelectHtml = `
        <div style="margin-bottom: var(--spacing-lg); display: flex; align-items: center; gap: var(--spacing-sm); background: var(--color-bg-alt); padding: var(--spacing-md); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
          <label for="order-select" style="font-weight: 600; font-size: 0.9rem; color: var(--color-primary);">Switch Active Order:</label>
          <select id="order-select" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-family: var(--font-sans); background: var(--color-bg); color: var(--color-text); font-weight: 500;">
            ${state.orders.map(o => `<option value="${o.orderId}" ${o.orderId === orderId ? "selected" : ""}>Order ${o.orderId} (${o.customerName})</option>`).join("")}
          </select>
        </div>
      `;
    }

    let html = `
      <div class="fade-in order-tracking-container">
        
        <button class="btn-text" id="btn-back-to-discover" style="margin-bottom: var(--spacing-lg);"><span class="arrow-icon">&#x2190;</span> Back to Discovery</button>

        ${orderSelectHtml}

        <!-- Order Header -->
        <div class="order-header-card">
          <div>
            <h2 style="font-size: 1.8rem; margin-bottom: var(--spacing-xs);">Order ${orderId}</h2>
            <p style="color: var(--color-text-muted); font-size: 0.9rem;">
              Ordered on ${orderDate.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
            </p>
          </div>
          <div style="text-align: right;">
            <div style="color: var(--color-success); font-weight: 600; font-size: 1.2rem; margin-bottom: var(--spacing-xs);">
              <span style="display:inline-flex;align-items:center;gap:4px;"><svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor"><path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-7z"/></svg>${order.paymentStatus}</span>
            </div>
            <p style="color: var(--color-text-muted); font-size: 0.85rem;">Payment ID: ${order.paymentId.substring(0, 15)}...</p>
          </div>
        </div>

        <!-- Order Status Timeline -->
        <div class="order-section">
          <h3 class="order-section-title">Order Status Timeline</h3>
          <div class="timeline">
    `;

    order.timeline.forEach((step, index) => {
      const stepDate = new Date(step.date);
      const isCompleted = step.completed;
      const isCurrent = !isCompleted && (index === 0 || order.timeline[index - 1].completed);

      html += `
        <div class="timeline-item ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}">
          <div class="timeline-marker">
            ${isCompleted ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>' : '<div class="timeline-dot"></div>'}
          </div>
          <div class="timeline-content">
            <h4 class="timeline-status">${step.status}</h4>
            <p class="timeline-date">${stepDate.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>
      `;
    });

    html += `
          </div>
          <div class="estimated-delivery" style="margin-top: var(--spacing-lg); padding: var(--spacing-md); background: var(--color-accent-light); border-radius: var(--radius-md);">
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: var(--spacing-xs);">Estimated Delivery</p>
            <p style="font-size: 1.3rem; font-weight: 600; color: var(--color-primary);">
              ${estimatedDeliveryDate.toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>

        <!-- Ordered Items -->
        <div class="order-section">
          <h3 class="order-section-title">Order Items (${order.items.length})</h3>
          <div class="order-items-list">
    `;

    order.items.forEach(item => {
      html += `
        <div class="order-item-card">
          <img class="order-item-image" src="${item.product.images[0]}" alt="${item.product.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23f5f3f0%22/></svg>'">
          <div class="order-item-details">
            <h4>${item.product.name}</h4>
            <p class="order-item-meta">from <strong>${item.boutique.name}</strong></p>
            <p class="order-item-meta" style="margin-top: var(--spacing-xs);">
              Fit: <strong>${item.size}</strong> • Fabric: <strong>${item.product.fabric}</strong>
            </p>
            <p class="order-item-meta" style="margin-top: var(--spacing-xs); color: var(--color-accent); font-weight: 600;">
              Lead Time: ${item.product.leadTime}
            </p>
          </div>
          <div class="order-item-price">₹${item.product.price.toLocaleString("en-IN")}</div>
        </div>
      `;
    });

    html += `
          </div>
        </div>

        <!-- Customization Status -->
        <div class="order-section">
          <h3 class="order-section-title">Customization Progress</h3>
          <div style="background: var(--color-bg-alt); padding: var(--spacing-lg); border-radius: var(--radius-md); border-left: 4px solid var(--color-accent);">
            <p style="color: var(--color-text-muted); margin-bottom: var(--spacing-md);">
              Our master artisans at each boutique are working on your custom designs. Customization typically takes 2-4 weeks depending on the complexity and embroidery.
            </p>
            <div class="customization-progress-bar">
              <div class="progress-fill" style="width: 45%;"></div>
            </div>
            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: var(--spacing-md);">45% Complete • Estimated 8-10 days remaining</p>
          </div>
        </div>

        <!-- Billing & Delivery Info -->
        <div class="order-section">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-lg);">
            
            <!-- Billing Address -->
            <div>
              <h3 class="order-section-title" style="font-size: 1rem; margin-bottom: var(--spacing-md);">Billing Address</h3>
              <div style="background: var(--color-bg-alt); padding: var(--spacing-md); border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.8;">
                <div style="font-weight: 600; margin-bottom: var(--spacing-sm);">${order.customerName}</div>
                <div>${order.billingAddress.address}</div>
                <div>${order.billingAddress.city} - ${order.billingAddress.pincode}</div>
                <div style="margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid var(--color-border);">
                  <strong>Phone:</strong> ${order.phone}<br>
                  <strong>Email:</strong> ${order.email}
                </div>
              </div>
            </div>

            <!-- Boutique Contact -->
            <div>
              <h3 class="order-section-title" style="font-size: 1rem; margin-bottom: var(--spacing-md);">Boutique Contacts</h3>
              <div class="boutique-contacts-list">
    `;

    // Get unique boutiques from order items
    const uniqueBoutiques = [...new Set(order.items.map(item => item.boutique.id))];
    uniqueBoutiques.forEach(boutId => {
      const boutique = BOUTIQUES_DATA.find(b => b.id === boutId);
      if (boutique) {
        html += `
          <div style="background: var(--color-bg-alt); padding: var(--spacing-md); border-radius: var(--radius-md); margin-bottom: var(--spacing-md);">
            <div style="font-weight: 600; margin-bottom: var(--spacing-sm); color: var(--color-accent);">${boutique.name}</div>
            <div style="font-size: 0.9rem; line-height: 1.6; color: var(--color-text-muted);">
              <div><strong>Designer:</strong> ${boutique.designer}</div>
              <div><strong>Location:</strong> ${boutique.neighborhood}, ${boutique.city}</div>
              <div style="margin-top: var(--spacing-sm);">
                <button class="btn btn-secondary" style="font-size: 0.85rem; padding: 0.4rem 0.8rem; display:inline-flex; align-items:center; gap:6px;" id="btn-chat-boutique-${boutId}">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>Chat with Boutique
                </button>
              </div>
            </div>
          </div>
        `;
      }
    });

    html += `
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="order-section">
          <h3 class="order-section-title">Order Summary</h3>
          <div style="background: var(--color-bg-alt); padding: var(--spacing-lg); border-radius: var(--radius-md);">
            <div class="order-summary-row">
              <span>Subtotal</span>
              <span>₹${order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div class="order-summary-row">
              <span>Service Fee (5%)</span>
              <span>₹${order.serviceFee.toLocaleString("en-IN")}</span>
            </div>
            <div class="order-summary-row" style="border-top: 1px solid var(--color-border); padding-top: var(--spacing-md); margin-top: var(--spacing-md); font-weight: 600; font-size: 1.1rem;">
              <span>Total Amount Paid</span>
              <span style="color: var(--color-accent);">₹${order.total.toLocaleString("en-IN")}</span>
            </div>
            <div style="margin-top: var(--spacing-lg); padding-top: var(--spacing-lg); border-top: 1px solid var(--color-border);">
              <p style="font-size: 0.85rem; color: var(--color-success); font-weight: 600; margin-bottom: var(--spacing-xs); display:flex; align-items:center; gap:4px;"><svg viewBox="0 0 12 12" width="12" height="12" fill="currentColor"><path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-7z"/></svg>Payment Confirmed</p>
              <p style="font-size: 0.8rem; color: var(--color-text-muted);">Payment ID: ${order.paymentId}</p>
            </div>
          </div>
        </div>

      </div>
    `;

    elements.appView.innerHTML = html;

    // Bind order selection dropdown
    const orderSelect = document.getElementById("order-select");
    if (orderSelect) {
      orderSelect.onchange = (e) => {
        navigateTo("order-tracking", e.target.value);
      };
    }

    // Bind back button
    document.getElementById("btn-back-to-discover").onclick = () => {
      navigateTo("discover");
    };

    // Bind boutique chat buttons
    uniqueBoutiques.forEach(boutId => {
      const chatBtn = document.getElementById("btn-chat-boutique-" + boutId);
      if (chatBtn) {
        chatBtn.onclick = () => {
          openDrawer(elements.conciergeDrawer);
          elements.chatInput.focus();
          elements.chatInput.placeholder = "Ask about your order...";
          scrollToBottom(elements.chatHistoryContainer);
        };
      }
    });
  }

  // --- MERCHANT PORTAL VIEWS & METRICS RENDERER ---
  function renderMerchantDashboard() {
    // We simulate a dashboard showing merchant performance
    // Calculate total values from state.reservations
    const approvedList = state.reservations.filter(r => r.status === "Approved");
    const pendingList = state.reservations.filter(r => r.status === "Pending");
    
    const totalSales = approvedList.reduce((sum, r) => sum + r.price, 0);
    // Platform commission is 20% average
    const commissionVal = totalSales * 0.20;
    const activeListings = BOUTIQUES_DATA.reduce((sum, b) => sum + b.inventory.length, 0);
    const scheduledTrials = state.reservations.filter(r => r.status === "Approved" && r.type !== "Purchase Reservation").length;

    let html = `
      <div class="merchant-container fade-in">
        
        <!-- Dashboard Header -->
        <div class="section-header" style="margin-bottom: var(--spacing-xl); border-bottom-color: var(--merchant-border);">
          <div>
            <h2 style="color: var(--merchant-text); font-size: 2rem;">Boutique Partner Portal</h2>
            <span style="font-size: 0.85rem; color: var(--merchant-text-muted); text-transform: uppercase;">Central Operations & Verification Simulator</span>
          </div>
          <div>
            <span class="status-badge status-approved">Curation Level 1 • Verified Hub</span>
          </div>
        </div>

        <!-- KPIs -->
        <div class="merchant-grid">
          <div class="merchant-metric-card">
            <div class="merchant-metric-lbl">Total Sales Generated</div>
            <div class="merchant-metric-val">₹${totalSales.toLocaleString("en-IN")}</div>
            <div class="merchant-metric-sub" style="color: #34d399;">+14.2% this month</div>
          </div>
          <div class="merchant-metric-card">
            <div class="merchant-metric-lbl">Pehnava Commission (20%)</div>
            <div class="merchant-metric-val">₹${commissionVal.toLocaleString("en-IN")}</div>
            <div class="merchant-metric-sub" style="color: var(--color-accent);">Includes delivery curation fees</div>
          </div>
          <div class="merchant-metric-card">
            <div class="merchant-metric-lbl">Active Curated Items</div>
            <div class="merchant-metric-val">${activeListings}</div>
            <div class="merchant-metric-sub" style="color: var(--merchant-text-muted);">Strict limit of 20 per store</div>
          </div>
          <div class="merchant-metric-card">
            <div class="merchant-metric-lbl">Active Fitted Trials</div>
            <div class="merchant-metric-val">${scheduledTrials} Sessions</div>
            <div class="merchant-metric-sub">In home & private suites</div>
          </div>
        </div>

        <!-- split list / form section -->
        <div class="merchant-sections">
          
          <!-- Reservations list -->
          <div class="merchant-panel-box">
            <h3 class="merchant-panel-title">Incoming Customer Requests</h3>
            
            <div class="merchant-table-wrapper">
              <table class="merchant-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Source Studio</th>
                    <th>Garment</th>
                    <th>Service Mode</th>
                    <th>Preferred Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
    `;

    state.reservations.slice().reverse().forEach(res => {
      let statusClass = "status-pending";
      if (res.status === "Approved") statusClass = "status-approved";
      if (res.status === "Declined") statusClass = "status-declined";

      let actionHtml = "";
      if (res.status === "Pending") {
        actionHtml = `<button class="merchant-action-btn" data-res-id="${res.id}">Approve</button>`;
      } else {
        actionHtml = `<span style="color: var(--merchant-text-muted); font-size: 0.75rem;">Completed</span>`;
      }

      html += `
        <tr>
          <td>
            <strong>${res.customerName}</strong><br>
            <span style="color: var(--merchant-text-muted); font-size: 0.75rem;">${res.phone}</span>
          </td>
          <td>${res.boutiqueName}</td>
          <td>${res.productName}</td>
          <td>
            <span style="font-weight: 500;">${res.type}</span><br>
            <span style="color: var(--merchant-text-muted); font-size: 0.75rem;">${res.time}</span>
          </td>
          <td>${res.date}</td>
          <td>₹${res.price.toLocaleString("en-IN")}</td>
          <td><span class="status-badge ${statusClass}">${res.status}</span></td>
          <td>${actionHtml}</td>
        </tr>
      `;
    });

    html += `
                </tbody>
              </table>
            </div>
          </div>

          <!-- Inventory manager simulation -->
          <div class="merchant-panel-box">
            <h3 class="merchant-panel-title">List Exclusive Garment</h3>
            
            <p style="font-size: 0.8rem; color: var(--merchant-text-muted); margin-bottom: var(--spacing-md);">
              Simulate uploading a new creation to the <strong style="color: var(--color-accent);">Jharokha Heritage</strong> boutique. Approved uploads list immediately.
            </p>

            <form class="merchant-add-form" id="merchant-add-product-form" onsubmit="event.preventDefault();">
              <input type="text" id="add-prod-name" placeholder="Garment Name (e.g. Mughal Brocade Sherwani)" required>
              <input type="number" id="add-prod-price" placeholder="Price in INR (e.g. 75000)" required>
              <select id="add-prod-cat" required>
                <option value="Sarees">Sarees</option>
                <option value="Lehengas">Lehengas</option>
                <option value="Indo-Western">Indo-Western</option>
                <option value="Co-ords">Co-ords</option>
                <option value="Sherwanis">Sherwanis</option>
              </select>
              <input type="text" id="add-prod-fabric" placeholder="Fabric (e.g. Pure Georgette Silk)" required>
              <input type="text" id="add-prod-craft" placeholder="Craftsmanship (e.g. Moti hand-embroidery)" required>
              <textarea id="add-prod-desc" rows="2" placeholder="Description of the look and draping technique..." required></textarea>
              <button type="submit" class="merchant-btn" id="btn-merchant-add-product">Submit to Pehnava Curation</button>
            </form>

            <h4 style="margin-top: var(--spacing-xl); font-size: 1rem; border-bottom: 1px solid var(--merchant-border); padding-bottom: var(--spacing-xs); margin-bottom: var(--spacing-md);">Jharokha Heritage Active Collection</h4>
            <div class="merchant-inventory-list">
    `;

    // Render Jharokha inventory list
    const jharokha = BOUTIQUES_DATA.find(b => b.id === "jharokha-heritage");
    jharokha.inventory.forEach(item => {
      html += `
        <div class="merchant-inventory-item">
          <img class="merchant-inventory-img" src="${item.images[0]}" alt="${item.name}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23334155%22/></svg>'">
          <div class="merchant-inventory-info">
            <div class="merchant-inventory-name">${item.name}</div>
            <div class="merchant-inventory-price">₹${item.price.toLocaleString("en-IN")}</div>
            <div class="merchant-inventory-stock">${item.fabric} • Ready</div>
          </div>
        </div>
      `;
    });

    html += `
            </div>
          </div>
        </div>

      </div>
    `;

    elements.appView.innerHTML = html;

    // Attach approve buttons actions
    const approveBtns = elements.appView.querySelectorAll(".merchant-action-btn");
    approveBtns.forEach(btn => {
      btn.onclick = () => {
        const resId = btn.dataset.resId;
        const res = state.reservations.find(r => r.id === resId);
        if (res) {
          res.status = "Approved";
          renderMerchantDashboard();
        }
      };
    });

    // Handle add product submission
    const addProductForm = document.getElementById("merchant-add-product-form");
    addProductForm.onsubmit = (e) => {
      e.preventDefault();
      
      const name = document.getElementById("add-prod-name").value.trim();
      const price = parseFloat(document.getElementById("add-prod-price").value);
      const cat = document.getElementById("add-prod-cat").value;
      const fabric = document.getElementById("add-prod-fabric").value.trim();
      const craft = document.getElementById("add-prod-craft").value.trim();
      const desc = document.getElementById("add-prod-desc").value.trim();

      if (!name || isNaN(price) || !fabric || !desc) {
        alert("Please fill out all product details.");
        return;
      }

      const newProduct = {
        id: "jh-" + name.toLowerCase().replace(/\s+/g, "-"),
        name: name,
        price: price,
        category: cat,
        fabric: fabric,
        craftsmanship: craft,
        customizable: true,
        leadTime: "3 - 4 weeks",
        images: ["data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%25%22 height=%22100%25%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23eae3db%22/><text x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 font-family=%22serif%22 font-size=%2216%22 fill=%22%231c1917%22>Uploaded Creation</text></svg>"],
        description: desc,
        sizes: ["S", "M", "L", "Custom Fit"]
      };

      jharokha.inventory.push(newProduct);
      addProductForm.reset();
      renderMerchantDashboard();
      alert("Garment successfully curated and listed on Jharokha Heritage storefront!");
    };
  }

  // --- INITIALIZE APPLICATION ---
  navigateTo("discover");
  updateCartBadge();
});
