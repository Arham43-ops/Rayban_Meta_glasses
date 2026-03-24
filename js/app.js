const PRODUCTS = [
    {
        id: 1,
        name: "Ray-Ban Meta Wayfarer",
        category: "Wayfarer",
        description: "The original classic, now with hands-free camera and AI.",
        price: 24999,
        image: "img/p1.png"
    },
    {
        id: 2,
        name: "Ray-Ban Meta Headliner",
        category: "Headliner",
        description: "Modern rounded style for the next generation of storytellers.",
        price: 27999,
        image: "img/p2.png"
    },
    {
        id: 3,
        name: "Ray-Ban Meta Skyler",
        category: "Skyler",
        description: "Elegantly refined silhouette with cat-eye inspiration.",
        price: 29999,
        image: "img/p3.png"
    }
];

class EcommerceApp {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.updateCartCount();
        this.renderProducts();
        this.renderCart();
        this.renderCheckout();
        this.setupEventListeners();
    }

    formatPrice(price) {
        return '₹' + price.toLocaleString('en-IN');
    }

    updateCartCount() {
        const counts = document.querySelectorAll('.cart-count');
        const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        counts.forEach(c => c.textContent = total);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    addToCart(productId) {
        const product = PRODUCTS.find(p => p.id === productId);
        const existing = this.cart.find(item => item.id === productId);

        if (existing) {
            existing.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.showToast(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.renderCart();
    }

    renderProducts() {
        const container = document.getElementById('products-container');
        if (!container) return;

        // Determine if we are in a subdirectory (like /pages/)
        const isSubDir = window.location.pathname.includes('/pages/');
        const basePath = isSubDir ? '../' : '';

        container.innerHTML = PRODUCTS.map(p => `
            <div class="product-card animate">
                <div class="product-img-wrapper" style="position: relative; overflow: hidden; height: 300px; border-radius: 8px;">
                    <img src="${basePath}${p.image}" alt="${p.name}" class="product-img" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease;">
                </div>
                <div class="product-info" style="padding: 20px 0;">
                    <span style="font-size: 12px; text-transform: uppercase; color: var(--accent); letter-spacing: 2px;">${p.category}</span>
                    <h3 style="margin: 10px 0; font-size: 20px;">${p.name}</h3>
                    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">${p.description}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="price" style="font-size: 18px; font-weight: 600;">${this.formatPrice(p.price)}</span>
                        <button class="btn btn-primary" style="padding: 10px 20px;" onclick="app.addToCart(${p.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderCart() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 50px 0;">Your cart is empty.</p>';
            const subtotalEl = document.getElementById('cart-subtotal');
            const totalEl = document.getElementById('cart-total');
            if (subtotalEl) subtotalEl.textContent = this.formatPrice(0);
            if (totalEl) totalEl.textContent = this.formatPrice(0);
            return;
        }

        container.innerHTML = this.cart.map(item => `
            <div class="cart-item" style="display: flex; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <div>
                    <h4>${item.name}</h4>
                    <p style="font-size: 12px; color: var(--text-muted);">Quantity: ${item.quantity}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 20px;">
                    <span>${this.formatPrice(item.price * item.quantity)}</span>
                    <button onclick="app.removeFromCart(${item.id})" style="background: none; border: none; color: #ff4d4d; cursor: pointer;">&times;</button>
                </div>
            </div>
        `).join('');

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const subtotalEl = document.getElementById('cart-subtotal');
        const totalEl = document.getElementById('cart-total');
        if (subtotalEl) subtotalEl.textContent = this.formatPrice(subtotal);
        if (totalEl) totalEl.textContent = this.formatPrice(subtotal);
    }

    renderCheckout() {
        const container = document.getElementById('checkout-items-summary');
        if (!container) return;

        container.innerHTML = this.cart.map(item => `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <span>${item.name} (x${item.quantity})</span>
                <span>${this.formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');

        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalEl = document.getElementById('checkout-total');
        if (totalEl) totalEl.textContent = this.formatPrice(subtotal);
    }

    showToast(message) {
        let toast = document.getElementById('toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.style.cssText = `
                position: fixed; bottom: 20px; right: 20px;
                background: var(--accent); color: white;
                padding: 16px 24px; border-radius: var(--radius-md);
                z-index: 2000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                transition: transform 0.3s ease;
                font-weight: 500; letter-spacing: 0.5px;
            `;
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.transform = 'translateY(0)';
        setTimeout(() => toast.style.transform = 'translateY(150px)', 3000);
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 50) header.style.padding = '10px 0';
            else header.style.padding = '20px 0';
        });

        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showToast('Your cart is empty!');
                    return;
                }
                window.location.href = 'checkout.html';
            });
        }

        const completeOrderBtn = document.getElementById('complete-order-btn');
        if (completeOrderBtn) {
            completeOrderBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const form = document.querySelector('form');
                if (form && !form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
                this.cart = [];
                this.saveCart();
                window.location.href = 'thanks.html';
            });
        }
    }
}

const app = new EcommerceApp();
