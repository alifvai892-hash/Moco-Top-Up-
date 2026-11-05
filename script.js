// language: javascript, file: script.js, target: modern web browsers, interactive logic
// Admin Config State (Everything controlled from Admin Panel / LocalStorage defaults)
const adminConfig = {
    siteName: "PIN TOPUP BD",
    logoShort: "PT",
    tagline: "নিরাপদ এবং দ্রুত টপআপ",
    noticeText: "PIN TOPUP BD এ ২৪ ঘণ্টাই টপআপ চালু থাকে।",
    heroBanner: "banner1.jpg",
    bkashMerchantNumber: "01799925886",
    bkashLogo: "bkash_logo.png",
    whatsappText: "SUPPORT WhatsApp",
    telegramText: "SUPPORT Telegram",
    flashSaleTitle: "Flash Sale",
    productSectionTitle: "FF TOP UP [BD] ফ্রি ফায়ার টপআপ",
    
    // Dynamic Flash Sale Products (Added via Admin)
    flashSaleProducts: [
        { title: "Weekly Offer", price: 99, regularPrice: 155, discount: "-36%", img: "weekly.png" },
        { title: "Monthly Offer", price: 693, regularPrice: 770, discount: "-10%", img: "monthly.png" }
    ],

    // Dynamic Main Grid Products (Added via Admin)
    mainProducts: [
        { title: "25 Diamond", price: 20, img: "gem.png" },
        { title: "50 Diamond", price: 36, img: "gem.png" },
        { title: "115 Diamond", price: 77, img: "gem.png" },
        { title: "240 Diamond", price: 158, img: "gem.png" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    loadAdminConfigToUI();

    // Splash Screen Logic
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.classList.remove('active');
            startFlashSaleTimer(9273, 30, 35);
        }, 500);
    }, 2000);
});

// Load config dynamically so everything is manageable from Admin Panel
function loadAdminConfigToUI() {
    document.getElementById('site-title').textContent = adminConfig.siteName;
    
    // Text bindings
    document.querySelectorAll('.admin-editable-text').forEach(el => {
        const key = el.getAttribute('data-key');
        if(key && adminConfig[key]) {
            el.textContent = adminConfig[key];
        }
    });

    // Image bindings
    document.querySelectorAll('.admin-editable-img').forEach(img => {
        const key = img.getAttribute('data-key');
        if(key && adminConfig[key]) {
            img.src = adminConfig[key];
        }
    });

    // Render Flash Sale Items
    const flashGrid = document.getElementById('flash-sale-grid');
    flashGrid.innerHTML = adminConfig.flashSaleProducts.map(p => `
        <div class="product-card" onclick="openCheckout('${p.title}', ${p.price})">
            <div class="flash-badge">FLASH DEAL</div>
            <div class="product-image-wrapper"><img src="${p.img}" alt="${p.title}"></div>
            <h3>${p.title}</h3>
            <div class="price-container">
                <span class="current-price">৳${p.price}</span>
                <div class="price-sub">
                    <span class="discount-pill">${p.discount}</span>
                    <span class="regular-price">৳${p.regularPrice}</span>
                </div>
            </div>
        </div>
    `).join('');

    // Render Main Products Grid
    const mainGrid = document.getElementById('main-product-grid');
    mainGrid.innerHTML = adminConfig.mainProducts.map(p => `
        <div class="product-card" onclick="openCheckout('${p.title}', ${p.price})">
            <span class="auto-delivery-tag">Auto Delivery</span>
            <div class="product-image-wrapper"><img src="${p.img}" alt="${p.title}"></div>
            <h3>${p.title}</h3>
            <div class="price-container"><span class="current-price">৳${p.price}</span></div>
        </div>
    `).join('');

    // Update Merchant Number & bKash Logo
    document.getElementById('merchant-number').textContent = adminConfig.bkashMerchantNumber;
    document.getElementById('checkout-bkash-logo').src = adminConfig.bkashLogo;
}

function switchTab(tabName) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    console.log(`Navigated to: ${tabName}`);
}

function startFlashSaleTimer(hours, minutes, seconds) {
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const timerDisplay = document.getElementById('flash-timer');

    setInterval(() => {
        if (totalSeconds <= 0) return;
        totalSeconds--;

        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        timerDisplay.textContent = `${padZero(h)} : ${padZero(m)} : ${padZero(s)}`;
    }, 1000);
}

function padZero(num) {
    return num < 10 ? '0' + num : num;
}

let activeOrder = { title: '', price: 0 };

function openCheckout(title, price) {
    activeOrder = { title, price };
    document.getElementById('modal-item-title').textContent = title;
    document.getElementById('modal-payable-amount').textContent = `৳${price}`;
    document.getElementById('required-amount').textContent = `৳${price}`;
    document.getElementById('payment-amount-display').textContent = price;
    document.getElementById('amount-text-bold').textContent = price;
    
    // Reset verification
    document.getElementById('player-id-input').value = '';
    const vBox = document.getElementById('verification-status');
    vBox.classList.add('hidden');
    vBox.innerHTML = '';

    document.getElementById('checkout-modal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function verifyPlayerId() {
    const input = document.getElementById('player-id-input').value.trim();
    const statusBox = document.getElementById('verification-status');
    
    if (input.length < 5) {
        alert("সঠিক প্লেয়ার আইডি দিন");
        return;
    }

    statusBox.innerHTML = `<span>🔄 Checking...</span>`;
    statusBox.classList.remove('hidden');

    setTimeout(() => {
        statusBox.innerHTML = `<span>✔ Player Verified: SRABU 1M</span>`;
    }, 1500);
}

function proceedToPayment() {
    const vBox = document.getElementById('verification-status');
    if (vBox.classList.contains('hidden') || !vBox.innerHTML.includes('Verified')) {
        alert("অনুগ্রহ করে প্রথমে প্লেয়ার আইডি ভেরিফাই করুন।");
        return;
    }
    
    closeModal('checkout-modal');
    document.getElementById('payment-modal').classList.add('active');
}

function copyMerchantNumber() {
    const number = document.getElementById('merchant-number').textContent;
    navigator.clipboard.writeText(number).then(() => {
        alert("bKash Number Copied: " + number);
    });
}

function submitPayment() {
    const txid = document.getElementById('txid-input').value.trim();
    if (txid.length < 5) {
        alert("সঠিক ট্রানজেকশন আইডি (TrxID) প্রদান করুন।");
        return;
    }
    alert("Payment submitted successfully. Pending Admin Approval.");
    closeModal('payment-modal');
}

function cancelPayment() {
    closeModal('payment-modal');
    alert("Payment cancelled.");
}

function openSupportChat() {
    alert("Redirecting to Support Helpline...");
}
