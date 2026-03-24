// Ray-Ban Meta Shop - Premium Application Logic
const Store = {
    products: [
        { id: 1, name: "Wayfarer Smart", price: 24999, image: "img/wayfarer_premium.png", category: "Wayfarer", description: "The classic shape, now with Meta's most advanced technology." },
        { id: 2, name: "Headliner Smart", price: 27999, image: "img/headliner_premium.png", category: "Headliner", description: "Bold design with seamless audio and camera integration." },
        { id: 3, name: "Skyler Smart", price: 29999, image: "img/skyler_premium.png", category: "Skyler", description: "Slim, sophisticated frame for an elevated look." },
        { id: 4, name: "Wayfarer Transitions", price: 32999, image: "img/wayfarer_classic_premium.png", category: "Wayfarer", description: "Adapts to any light condition automatically with high-tech sensors." },
        { id: 5, name: "Wayfarer Large", price: 26999, image: "img/wayfarer.png", category: "Wayfarer", description: "Oversized Wayfarer fit with enhanced spatial audio and 12MP camera." },
        { id: 6, name: "Headliner Polarized", price: 31999, image: "img/headliner.png", category: "Headliner", description: "Polarized lenses for crystal-clear vision and live streaming." },
        { id: 7, name: "Skyler Gradient", price: 33999, image: "img/skyler.png", category: "Skyler", description: "Gradient tint meets AI intelligence in an ultra-light titanium frame." },
        { id: 8, name: "Headliner Sport", price: 34999, image: "img/headliner_smart_glasses.png", category: "Headliner", description: "Sweat-resistant, sport-optimized with real-time coaching via Meta AI." }
    ],
    cart: JSON.parse(localStorage.getItem('rayban_cart')) || [],
    wishlist: JSON.parse(localStorage.getItem('rayban_wishlist')) || [],

    save() {
        localStorage.setItem('rayban_cart', JSON.stringify(this.cart));
        localStorage.setItem('rayban_wishlist', JSON.stringify(this.wishlist));
        this.updateCartCount();
    },

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        const cartItem = this.cart.find(item => item.id === productId);
        
        if (cartItem) {
            cartItem.quantity++;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        this.save();
        this.showNotification(`Added ${product.name} to Bag`);
        if (window.location.pathname.includes('cart.html')) this.renderCart();
    },

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.save();
        if (window.location.pathname.includes('cart.html')) this.renderCart();
    },

    updateQuantity(productId, delta) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.save();
                if (window.location.pathname.includes('cart.html')) this.renderCart();
            }
        }
    },

    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index === -1) {
            this.wishlist.push(productId);
            this.showNotification('Added to Wishlist');
        } else {
            this.wishlist.splice(index, 1);
            this.showNotification('Removed from Wishlist');
        }
        this.save();
        this.updateWishlistUI();
        if (window.location.pathname.includes('wishlist.html')) this.renderWishlist();
    },

    updateCartCount() {
        const counts = document.querySelectorAll('.cart-count');
        const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        counts.forEach(el => {
            el.textContent = total;
            el.style.display = total > 0 ? 'flex' : 'none';
        });

        const wishlistCounts = document.querySelectorAll('.wishlist-count');
        const wTotal = this.wishlist.length;
        wishlistCounts.forEach(el => {
            el.textContent = wTotal;
            el.style.display = wTotal > 0 ? 'flex' : 'none';
        });
    },

    updateWishlistUI() {
        const buttons = document.querySelectorAll('.wishlist-btn');
        buttons.forEach(btn => {
            const id = parseInt(btn.dataset.id);
            if (this.wishlist.includes(id)) {
                btn.classList.add('active');
                btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            } else {
                btn.classList.remove('active');
                btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
            }
        });
        this.updateCartCount();
    },

    showNotification(msg) {
        const toast = document.createElement('div');
        toast.className = 'glass-morphism animate-in';
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px; 
            padding: 15px 30px; border-radius: 12px;
            z-index: 10000; font-weight: 500; border: 1px solid var(--glass-border);
            box-shadow: 0 10px 40px rgba(0,0,0,0.4); background: rgba(0,0,0,0.9);
            backdrop-filter: blur(15px); color: white;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, 2000);
    },

    renderCart() {
        const container = document.getElementById('cart-items');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 80px; color: var(--text-muted); font-size: 1.1rem;">Your bag is currently empty.</td></tr>`;
            document.getElementById('cart-subtotal').textContent = '₹0';
            document.getElementById('cart-total').textContent = '₹0';
            return;
        }

        const isSubDir = window.location.pathname.includes('/pages/');
        const imgPrefix = isSubDir ? '../' : '';

        container.innerHTML = this.cart.map(item => {
            // Always look up image from master product list for reliability
            const masterProduct = this.products.find(p => p.id === item.id);
            const imgSrc = masterProduct ? masterProduct.image : item.image;

            return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <img src="${imgPrefix}${imgSrc}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: contain; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid var(--glass-border);">
                        <div>
                            <div style="font-weight: 600; font-size: 1.1rem;">${item.name}</div>
                            <div style="font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px;">${item.category}</div>
                        </div>
                    </div>
                </td>
                <td>₹${item.price.toLocaleString('en-IN')}</td>
                <td>
                    <div class="quantity-control" style="display: flex; align-items: center; gap: 18px; background: rgba(255,255,255,0.05); padding: 8px 20px; border-radius: 40px; border: 1px solid var(--glass-border); width: fit-content;">
                        <button onclick="Store.updateQuantity(${item.id}, -1)" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">-</button>
                        <span style="font-weight: 500;">${item.quantity}</span>
                        <button onclick="Store.updateQuantity(${item.id}, 1)" style="background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem;">+</button>
                    </div>
                </td>
                <td>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: 600; font-size: 1.1rem;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        <button onclick="Store.removeFromCart(${item.id})" style="background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.3s;" onmouseover="this.style.color='#ff4444'" onmouseout="this.style.color='var(--text-muted)'">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `}).join('');

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cart-subtotal').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        document.getElementById('cart-total').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    },

    renderWishlist() {
        const container = document.getElementById('wishlist-items');
        if (!container) return;

        const wishlistProducts = this.products.filter(p => this.wishlist.includes(p.id));

        if (wishlistProducts.length === 0) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 100px; color: var(--text-muted);">Your wishlist is currently empty.</div>`;
            return;
        }

        const isSubDir = window.location.pathname.includes('/pages/');
        const imgPrefix = isSubDir ? '../' : '';

        container.innerHTML = wishlistProducts.map(p => `
            <div class="product-card animate visible">
                <button class="wishlist-btn active" data-id="${p.id}" onclick="Store.toggleWishlist(${p.id})">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
                <img src="${imgPrefix}${p.image}" alt="${p.name}" class="product-image">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">${p.description}</p>
                    <div class="product-actions">
                        <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
                        <button class="btn btn-primary" onclick="Store.addToCart(${p.id})">Add to Bag</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
};

const UI = {
    init() {
        this.renderHeader();
        this.renderFooter();
        this.initAnimations();
        
        if (document.getElementById('product-list')) {
            this.renderProducts('product-list');
        }
        
        if (document.getElementById('shop-grid')) {
            this.renderShop('all');
        }

        if (document.getElementById('cart-items')) {
            Store.renderCart();
        }

        if (document.getElementById('wishlist-items')) {
            Store.renderWishlist();
        }

        Store.updateCartCount();
        Store.updateWishlistUI();

        if (document.getElementById('order-summary')) {
            this.renderCheckout();
        }

        // Handle checkout form
        const checkoutBtn = document.getElementById('complete-order-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Simple validation
                const inputs = document.querySelectorAll('input[required]');
                let valid = true;
                inputs.forEach(input => {
                    if (!input.value) {
                        valid = false;
                        input.style.borderColor = '#ff4444';
                    } else {
                        input.style.borderColor = 'var(--glass-border)';
                    }
                });

                if (valid) {
                    Store.cart = [];
                    Store.save();
                    window.location.href = 'thanks.html';
                } else {
                    Store.showNotification('Please fill in all required fields');
                }
            });
        }
    },

    renderHeader() {
        const header = document.querySelector('header');
        if (!header) return;

        const isSubDir = window.location.pathname.includes('/pages/');
        const pathPrefix = isSubDir ? '' : 'pages/';
        const homePath = isSubDir ? '../index.html' : 'index.html';

        header.innerHTML = `
            <div class="container">
                <nav>
                    <a href="${homePath}" class="brand">RAY-BAN <span style="font-weight:300">META</span></a>
                    <ul class="nav-links">
                        <li><a href="${pathPrefix}shop.html">Shop</a></li>
                        <li><a href="${pathPrefix}about.html">Innovation</a></li>
                        <li><a href="${pathPrefix}contact.html">Support</a></li>
                    </ul>
                    <div class="nav-actions">
                        <a href="${pathPrefix}wishlist.html" style="position: relative;" title="Wishlist">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                            <span class="wishlist-count" style="position: absolute; top: -8px; right: -8px; background: var(--accent); color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: none; align-items: center; justify-content: center; font-weight: bold;">0</span>
                        </a>
                        <a href="${pathPrefix}cart.html" style="position: relative;" title="Shopping Bag">
                            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            <span class="cart-count" style="position: absolute; top: -8px; right: -8px; background: white; color: black; border-radius: 50%; width: 18px; height: 18px; font-size: 0.7rem; display: none; align-items: center; justify-content: center; font-weight: bold;">0</span>
                        </a>
                    </div>
                </nav>
            </div>
        `;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    },

    renderFooter() {
        const footer = document.querySelector('footer');
        if (!footer) return;

        const isSubDir = window.location.pathname.includes('/pages/');
        const pathPrefix = isSubDir ? '' : 'pages/';

        footer.innerHTML = `
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <div class="brand">RAY-BAN <span style="font-weight:300">META</span></div>
                        <p style="color: var(--text-muted); margin-top: 20px;">Innovating the way we see and share the world. The ultimate wearable tech in iconic frames.</p>
                    </div>
                    <div class="footer-col">
                        <h4>Shop</h4>
                        <a href="${pathPrefix}shop.html">Wayfarer</a>
                        <a href="${pathPrefix}shop.html">Headliner</a>
                        <a href="${pathPrefix}shop.html">Skyler</a>
                    </div>
                    <div class="footer-col">
                        <h4>Innovation</h4>
                        <a href="${pathPrefix}about.html">Meta AI</a>
                        <a href="${pathPrefix}about.html">Audio Tech</a>
                        <a href="${pathPrefix}about.html">Camera Tech</a>
                    </div>
                    <div class="footer-col">
                        <h4>Account</h4>
                        <a href="${pathPrefix}wishlist.html">Wishlist</a>
                        <a href="${pathPrefix}cart.html">Shopping Bag</a>
                        <a href="${pathPrefix}contact.html">Order Help</a>
                    </div>
                </div>
                <div class="footer-bottom">
                    &copy; 2026 Ray-Ban Meta. All Rights Reserved. Localization: India (INR)
                </div>
            </div>
        `;
    },

    renderProducts(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const isSubDir = window.location.pathname.includes('/pages/');
        const imgPrefix = isSubDir ? '../' : '';

        container.innerHTML = Store.products.map(p => `
            <div class="product-card animate">
                <button class="wishlist-btn ${Store.wishlist.includes(p.id) ? 'active' : ''}" 
                        data-id="${p.id}" onclick="Store.toggleWishlist(${p.id})">
                    ${Store.wishlist.includes(p.id) ? 
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` : 
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`}
                </button>
                <div class="product-img-container">
                    <img src="${imgPrefix}${p.image}" alt="${p.name}" class="product-image">
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">${p.description}</p>
                    <div class="product-actions">
                        <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
                        <button class="btn btn-primary" onclick="Store.addToCart(${p.id})">Add to Bag</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    renderShop(category = 'all') {
        const container = document.getElementById('shop-grid');
        if (!container) return;

        // Update active button
        const btns = document.querySelectorAll('.filter-btn');
        btns.forEach(btn => {
            if (btn.textContent.toLowerCase() === category.toLowerCase()) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const isSubDir = window.location.pathname.includes('/pages/');
        const imgPrefix = isSubDir ? '../' : '';

        const products = category === 'all' 
            ? Store.products 
            : Store.products.filter(p => p.name.toLowerCase().includes(category.toLowerCase()) || p.category.toLowerCase().includes(category.toLowerCase()));

        container.innerHTML = products.map(p => `
            <div class="product-card animate visible">
                <button class="wishlist-btn ${Store.wishlist.includes(p.id) ? 'active' : ''}" 
                        data-id="${p.id}" onclick="Store.toggleWishlist(${p.id})">
                    ${Store.wishlist.includes(p.id) ? 
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` : 
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`}
                </button>
                <div class="product-img-container">
                    <img src="${imgPrefix}${p.image}" alt="${p.name}" class="product-image">
                </div>
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">${p.description}</p>
                    <div class="product-actions">
                        <span class="price">₹${p.price.toLocaleString('en-IN')}</span>
                        <button class="btn btn-primary" onclick="Store.addToCart(${p.id})">Add to Bag</button>
                    </div>
                </div>
            </div>
        `).join('');
    },

    initAnimations() {
        const observerOptions = { threshold: 0.1 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, observerOptions);
        document.querySelectorAll('.animate').forEach(el => observer.observe(el));
    },

    renderCheckout() {
        const container = document.getElementById('order-summary');
        if (!container) return;
        
        if (Store.cart.length === 0) {
            container.innerHTML = `
                <div class="glass-morphism" style="padding: 20px; text-align: center;">
                    <h3>Your bag is empty</h3>
                    <p style="margin: 15px 0;">Add some iconic frames to proceed.</p>
                    <a href="shop.html" class="btn btn-primary" style="display: inline-block;">Start Shopping</a>
                </div>
            `;
            return;
        }

        const total = Store.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        container.innerHTML = `
            <div class="glass-morphism" style="padding: 30px;">
                <h3 style="margin-bottom: 25px;">Order Summary</h3>
                <div style="max-height: 400px; overflow-y: auto; margin-bottom: 20px;">
                    ${Store.cart.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 15px; color: var(--text-muted); font-size: 0.95rem;">
                            <span style="flex: 1;">${item.name} <strong style="color: white; margin-left: 5px;">x${item.quantity}</strong></span>
                            <span>₹${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                    `).join('')}
                </div>
                <hr style="border: 0; border-top: 1px solid var(--glass-border); margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.25rem;">
                    <span>Total Amount</span>
                    <span style="color: var(--primary);">₹${total.toLocaleString('en-IN')}</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 20px; text-align: center;">
                    Secure checkout powered by Meta Pay
                </p>
            </div>
        `;
    }
};

window.Store = Store;
window.app = UI;
document.addEventListener('DOMContentLoaded', () => UI.init());

