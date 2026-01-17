// Shopping cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentCategory = 'all';
let filteredProducts = [...products];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartCount();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.getAttribute('data-category');
            filterByCategory(category);
            
            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Sort and filter
    document.getElementById('sortSelect').addEventListener('change', handleSort);
    document.getElementById('priceFilter').addEventListener('change', handlePriceFilter);

    // Cart modal
    document.getElementById('cartBtn').addEventListener('click', openCart);
    document.getElementById('closeCart').addEventListener('click', closeCart);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);

    // Product modal
    document.getElementById('closeProductModal').addEventListener('click', closeProductModal);

    // Close modals when clicking outside
    document.getElementById('cartModal').addEventListener('click', (e) => {
        if (e.target.id === 'cartModal') closeCart();
    });
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') closeProductModal();
    });
}

// Filter products by category
function filterByCategory(category) {
    currentCategory = category;
    
    if (category === 'all') {
        filteredProducts = [...products];
        document.getElementById('sectionTitle').textContent = 'All Products';
    } else {
        filteredProducts = products.filter(p => p.category === category);
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
        document.getElementById('sectionTitle').textContent = `${categoryName}'s Collection`;
    }
    
    applyFilters();
}

// Handle sorting
function handleSort() {
    applyFilters();
}

// Handle price filtering
function handlePriceFilter() {
    applyFilters();
}

// Apply all filters
function applyFilters() {
    let result = [...filteredProducts];
    
    // Price filter
    const priceFilter = document.getElementById('priceFilter').value;
    if (priceFilter !== 'all') {
        result = result.filter(product => {
            if (priceFilter === '0-50') return product.price >= 0 && product.price <= 50;
            if (priceFilter === '50-100') return product.price > 50 && product.price <= 100;
            if (priceFilter === '100-200') return product.price > 100 && product.price <= 200;
            if (priceFilter === '200+') return product.price > 200;
            return true;
        });
    }
    
    // Sort
    const sortValue = document.getElementById('sortSelect').value;
    if (sortValue === 'price-low') {
        result.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-high') {
        result.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'name') {
        result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    renderFilteredProducts(result);
}

// Render products
function renderProducts() {
    renderFilteredProducts(filteredProducts);
}

// Render filtered products
function renderFilteredProducts(productsToRender) {
    const grid = document.getElementById('productsGrid');
    
    if (productsToRender.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #999;">No products found matching your criteria.</p>';
        return;
    }
    
    grid.innerHTML = productsToRender.map(product => `
        <div class="product-card" onclick="openProductDetail(${product.id})">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <div class="product-category">${product.category.toUpperCase()}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open product detail modal
function openProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const detailDiv = document.getElementById('productDetail');
    
    detailDiv.innerHTML = `
        <div class="product-detail-image">${product.image}</div>
        <div class="product-detail-info">
            <div class="product-detail-category">${product.category.toUpperCase()}</div>
            <h2>${product.name}</h2>
            <div class="product-detail-price">$${product.price.toFixed(2)}</div>
            <p class="product-detail-description">${product.description}</p>
            <div class="product-detail-actions">
                <button class="btn-primary" onclick="addToCart(${product.id}); closeProductModal();">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Close product detail modal
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        renderCart();
        updateCartCount();
    }
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = '0.00';
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-category">${item.category.toUpperCase()}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `).join('');
}

// Open cart modal
function openCart() {
    renderCart();
    document.getElementById('cartModal').classList.add('active');
}

// Close cart modal
function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (confirm(`Proceed to checkout?\n\nItems: ${itemCount}\nTotal: $${total.toFixed(2)}`)) {
        alert('Thank you for your purchase! Your order has been placed.\n\n(Note: This is a demo site. No actual payment will be processed.)');
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
        closeCart();
    }
}

// Scroll to products
function scrollToProducts() {
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--secondary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS animations for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
