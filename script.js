/* ==============================================
   MELA-PLUS- JAVASCRIPT
   ============================================== */

// ========== CONSTANTS & CORE FUNCTIONS ==========
const CART_STORAGE_KEY = 'melaPlusCart';

// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartCount();
}

// Update cart count display across all pages
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('#cartCount');
    cartCountElements.forEach(el => {
        if (el) el.textContent = totalItems;
    });
}

// Calculate discount (10% off)
function calculateDiscount(subtotal) {
    return subtotal * 0.10;
}

// Calculate tax (15%)
function calculateTax(subtotalAfterDiscount) {
    return subtotalAfterDiscount * 0.15;
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== PRODUCTS PAGE MODULE ==========
// Products Array (8 items)
const products = [
    { 
        id: 1, 
        name: "Rich Melanin Foundation", 
        brand: "Fenty Beauty",
        price: 34.99, 
        image: "Fen.jpg", 
        description: "Full-coverage foundation with 50+ inclusive shades for deep skin tones." 
    },
    { 
        id: 2, 
        name: "Gold Rush Highlighter", 
        brand: "Pat McGrath Labs",
        price: 24.99, 
        image: "haus.jpg", 
        description: "Golden sheen highlighter that gives a radiant glow on melanin." 
    },
    { 
        id: 3, 
        name: "Audaciuos Lipstick", 
        brand: "NARS Cosmetics",
        price: 18.99, 
        image: "l.jpg", 
        description: "Hydrating matte lipstick with intense berry pigment for bold lips." 
    },
    { 
        id: 4, 
        name: "Soul Matte Eyeshadow Palette", 
        brand: "Juvia's Place",
        price: 42.99, 
        image: "palette.jpg", 
        description: "12 warm nudes and bold pops perfectly pigmented for dark skin." 
    },
    { 
        id: 5, 
        name: "Blushing Rose Blush", 
        brand: "Haus Labs",
        price: 22.99, 
        image: "blush.jpg", 
        description: "Buildable blush that gives a natural rosy flush on deeper skin." 
    },
    { 
        id: 6, 
        name: "Perfect Brow Pencil", 
        brand: "Anastasia Beverly Hills",
        price: 16.99, 
        image: "pen.jpg", 
        description: "Ultra-fine brow pencil for natural, defined brows on all shades." 
    },
    { 
        id: 7, 
        name: "Bronze Goddess Bronzer", 
        brand: "Fenty Beauty",
        price: 32.99, 
        image: "bronze.jpg", 
        description: "Warm bronzer that adds dimension without looking ashy." 
    },
    { 
        id: 8, 
        name: "Gloss Bomb Lip Luminizer", 
        brand: "Fenty Beauty",
        price: 19.99, 
        image: "gloss.png", 
        description: "High-shine gloss that looks stunning on every skin tone." 
    }
];

// Add product to cart
function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            quantity: 1,
            image: product.image
        });
    }
    
    saveCart(cart);
    return cart;
}

// Show temporary feedback when item is added
function showAddedFeedback(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = '#2d6a4f';
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.style.background = '';
    }, 1500);
}

// Render products grid
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-brand">${product.brand}</span>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">$${product.price.toFixed(2)}</div>
                <button class="btn-add" data-id="${product.id}">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    
    // Attach event listeners to all add to cart buttons
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            const product = products.find(p => p.id === id);
            if (product) {
                addToCart(product);
                showAddedFeedback(btn);
            }
        });
    });
}

// Initialize Products Page
if (document.getElementById('productsGrid')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderProducts();
        updateCartCount();
    });
}

// ========== CART PAGE MODULE ==========
// Update quantity of an item
function updateQuantity(productId, newQuantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity <= 0) {
            const index = cart.findIndex(i => i.id === productId);
            cart.splice(index, 1);
        } else {
            item.quantity = newQuantity;
        }
        saveCart(cart);
    }
    renderCart();
}

// Remove item from cart
function removeItem(productId) {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        saveCart(cart);
    }
    renderCart();
}

// Clear entire cart
function clearCart() {
    if (confirm('Are you sure you want to remove all items from your cart?')) {
        saveCart([]);
        renderCart();
    }
}

// Render cart contents
function renderCart() {
    const cartContainer = document.getElementById('cartContainer');
    const cart = getCart();
    
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is feeling a little empty...</p>
                <a href="product.html" class="btn-shop">Continue Shopping <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
        return;
    }
    
    let subtotal = 0;
    
    const cartHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                ${cart.map(item => {
                    const itemSubtotal = item.price * item.quantity;
                    subtotal += itemSubtotal;
                    return `
                        <tr>
                            <td>
                                <div class="cart-product">
                                    <img src="${item.image}" alt="${item.name}" class="cart-product-img">
                                    <div class="cart-product-info">
                                        <h4>${escapeHtml(item.name)}</h4>
                                        <p>${escapeHtml(item.brand || 'Mela-Plus')}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="cart-price">$${item.price.toFixed(2)}</td>
                            <td>
                                <div class="cart-quantity">
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                    <span class="quantity-value">${item.quantity}</span>
                                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                </div>
                            </td>
                            <td class="cart-subtotal">$${itemSubtotal.toFixed(2)}</td>
                            <td>
                                <button class="remove-item" onclick="removeItem(${item.id})">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
        <div class="cart-summary">
            <div class="summary-title">Order Summary</div>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Discount (10% off):</span>
                <span> -$${calculateDiscount(subtotal).toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (15%):</span>
                <span>$${calculateTax(subtotal - calculateDiscount(subtotal)).toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${(subtotal - calculateDiscount(subtotal) + calculateTax(subtotal - calculateDiscount(subtotal))).toFixed(2)}</span>
            </div>
        </div>
    `;
    
    cartContainer.innerHTML = cartHTML;
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    window.location.href = 'checkout.html';
}

// Close/back to products
function closeCart() {
    window.location.href = 'product.html';
}

// Initialize Cart Page
if (document.getElementById('cartContainer')) {
    document.addEventListener('DOMContentLoaded', () => {
        renderCart();
        updateCartCount();
        
        const clearBtn = document.getElementById('clearCartBtn');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const closeBtn = document.getElementById('closeBtn');
        
        if (clearBtn) clearBtn.addEventListener('click', clearCart);
        if (checkoutBtn) checkoutBtn.addEventListener('click', proceedToCheckout);
        if (closeBtn) closeBtn.addEventListener('click', closeCart);
    });
}

// Make cart functions globally available for onclick handlers
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

// ========== CHECKOUT PAGE MODULE ==========
// Load and display order summary
function loadOrderSummary() {
    const cart = getCart();
    const orderItemsList = document.getElementById('orderItemsList');
    const subtotalSpan = document.getElementById('subtotal');
    const discountSpan = document.getElementById('discount');
    const taxSpan = document.getElementById('tax');
    const totalSpan = document.getElementById('total');
    const amountPaidField = document.getElementById('amountPaid');
    
    if (!orderItemsList) return;
    
    if (cart.length === 0) {
        orderItemsList.innerHTML = '<p style="text-align:center; color:#a2557a; padding:40px;">Your cart is empty. Please add items first.</p>';
        if (amountPaidField) amountPaidField.value = '$0.00';
        return;
    }
    
    let subtotal = 0;
    
    // Display order items
    orderItemsList.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="order-item">
                <div class="order-item-info">
                    <div class="order-item-name">${escapeHtml(item.name)}</div>
                    <div class="order-item-meta">Qty: ${item.quantity} × $${item.price.toFixed(2)}</div>
                </div>
                <div class="order-item-price">$${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');
    
    // Calculate totals
    const discount = calculateDiscount(subtotal);
    const subtotalAfterDiscount = subtotal - discount;
    const tax = calculateTax(subtotalAfterDiscount);
    const total = subtotalAfterDiscount + tax;
    
    // Update summary display
    subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
    discountSpan.textContent = `-$${discount.toFixed(2)}`;
    taxSpan.textContent = `$${tax.toFixed(2)}`;
    totalSpan.textContent = `$${total.toFixed(2)}`;
    
    // Set amount paid field
    if (amountPaidField) {
        amountPaidField.value = `$${total.toFixed(2)}`;
    }
}

// Validate checkout form
function validateCheckoutForm(formData) {
    if (!formData.fullName.trim()) {
        alert('Please enter your full name.');
        return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
        alert('Please enter a valid email address.');
        return false;
    }
    if (!formData.phone.trim()) {
        alert('Please enter your phone number.');
        return false;
    }
    if (!formData.address.trim()) {
        alert('Please enter your shipping address.');
        return false;
    }
    if (!formData.city.trim()) {
        alert('Please enter your city.');
        return false;
    }
    if (!formData.state.trim()) {
        alert('Please enter your state.');
        return false;
    }
    if (!formData.zip.trim()) {
        alert('Please enter your zip code.');
        return false;
    }
    if (!formData.country) {
        alert('Please select your country.');
        return false;
    }
    
    return true;
}

// Show success modal
function showSuccessModal(orderData) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    const modal = document.createElement('div');
    modal.className = 'success-modal';
    modal.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <h3>Order Confirmed!</h3>
        <p>Thank you for shopping with Mela-Plus!</p>
        <p><strong>${escapeHtml(orderData.fullName)}</strong>, your order has been placed.</p>
        <div class="order-total">Total: $${orderData.total.toFixed(2)}</div>
        <p>A confirmation email has been sent to<br><strong>${escapeHtml(orderData.email)}</strong></p>
        <button onclick="location.href='product.html'">Continue Shopping</button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Clear cart after successful order
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartCount();
    
    // Close modal when clicking overlay
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Handle checkout form submission
function handleCheckout(e) {
    e.preventDefault();
    
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        window.location.href = 'product.html';
        return;
    }
    
    // Get form values
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        paymentMethod: document.querySelector('input[name="payment"]:checked')?.value || 'credit-card'
    };
    
    // Validate form
    if (!validateCheckoutForm(formData)) {
        return;
    }
    
    // Calculate totals
    let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = calculateDiscount(subtotal);
    const subtotalAfterDiscount = subtotal - discount;
    const tax = calculateTax(subtotalAfterDiscount);
    const total = subtotalAfterDiscount + tax;
    
    // Create order object
    const order = {
        orderId: 'MP-' + Date.now(),
        date: new Date().toLocaleString(),
        customer: formData,
        items: cart,
        subtotal: subtotal,
        discount: discount,
        tax: tax,
        total: total
    };
    
    // Save order to localStorage for reference
    const orders = JSON.parse(localStorage.getItem('melaPlusOrders') || '[]');
    orders.push(order);
    localStorage.setItem('melaPlusOrders', JSON.stringify(orders));
    
    // Show success modal
    showSuccessModal({
        fullName: formData.fullName,
        email: formData.email,
        total: total,
        orderId: order.orderId
    });
}

// Cancel checkout - go back to cart
function cancelCheckout() {
    if (confirm('Are you sure you want to cancel? Your cart items will be saved.')) {
        window.location.href = 'cart.html';
    }
}

// Initialize Checkout Page
if (document.getElementById('checkoutForm')) {
    document.addEventListener('DOMContentLoaded', () => {
        loadOrderSummary();
        updateCartCount();
        
        const checkoutForm = document.getElementById('checkoutForm');
        const cancelBtn = document.getElementById('cancelBtn');
        
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', handleCheckout);
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', cancelCheckout);
        }
    });
}

// ========== LOGIN PAGE MODULE ==========
// Initialize Login Page
if (document.getElementById('loginForm')) {
    document.addEventListener('DOMContentLoaded', function() {
        const loginForm = document.getElementById('loginForm');
        const usernameInput = document.getElementById('loginUsername');
        const passwordInput = document.getElementById('loginPassword');
        const errorDiv = document.getElementById('loginError');

        // Clear error on input focus
        function clearError() {
            errorDiv.textContent = '';
            errorDiv.style.color = '';
            errorDiv.style.display = 'none';
        }

        usernameInput.addEventListener('focus', clearError);
        passwordInput.addEventListener('focus', clearError);

        // Style error message helper
        function styleError(message, isSuccess = false) {
            errorDiv.textContent = message;
            errorDiv.style.padding = '12px';
            errorDiv.style.borderRadius = '28px';
            errorDiv.style.display = 'block';
            
            if (isSuccess) {
                errorDiv.style.color = '#2d6a4f';
                errorDiv.style.backgroundColor = 'rgba(200, 230, 210, 0.3)';
            } else {
                errorDiv.style.color = '#c44d7a';
                errorDiv.style.backgroundColor = 'rgba(255, 200, 210, 0.3)';
            }
        }

        // Form submission handler
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Validation checks
            if (username === '' || password === '') {
                styleError('❌ Both fields are required.');
                return;
            }
            
            if (password.length < 4) {
                styleError('❌ Password must be at least 4 characters.');
                return;
            }
            
            // Simulate successful login - store user session
            localStorage.setItem('loggedInUser', username);
            localStorage.setItem('isLoggedIn', 'true');
            
            // Show success message
            styleError('✅ Login successful! Redirecting to Mela-Plus homepage...', true);
            
            // Disable submit button to prevent multiple submissions
            const submitBtn = document.querySelector('.btn-primary');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }
            
            // Redirect to home page after delay
            setTimeout(() => { 
                window.location.href = 'index.html'; 
            }, 1200);
        });
    });
}