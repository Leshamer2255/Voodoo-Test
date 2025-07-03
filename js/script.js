const apiEndpoint = 'https://voodoo-sandbox.myshopify.com/products.json';
const productsPerPage = 24;
let currentPage = 1;
let totalPages = 25;
let filteredProducts = [];
let searchQuery = '';
let selectedCategory = 'all';
let sortBy = 'name'; // 'name', 'price', 'rating'

// Cart functionality
let cart = [];
let wishlist = [];
const cartItems = document.querySelector('.cart-items');
const itemCount = document.querySelector('.item-count');
const totalCartPrice = document.querySelector('.total-cart-price');
const cartModal = document.getElementById('cartModal');
const closeButton = document.querySelector('.close-button');
const cartIcon = document.querySelector('.cart-icon');

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

// Login Modal functionality
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginButton = document.querySelector('.button-login');
const signupButton = document.querySelector('.button-signup');
const loginCloseButton = loginModal.querySelector('.close-button');
const signupCloseButton = signupModal.querySelector('.close-button');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');

// Payment modal logic
const paymentModal = document.getElementById('paymentModal');
const paymentBtns = paymentModal.querySelectorAll('.payment-btn');
const paymentStatus = paymentModal.querySelector('.payment-status');
const paymentCloseBtns = paymentModal.querySelectorAll('.close-button');
const checkoutButton = document.querySelector('.checkout-button');

// Sample product data with more products
const products = [
    {
        id: 1,
        name: "Neon Gaming Headset",
        price: 129.99,
        image: "img/Neon Gaming Headset.jpeg",
        category: "Electronics",
        description: "High-quality gaming headset with neon accents and 7.1 surround sound",
        rating: 4.5,
        reviews: 128,
        inStock: true,
        isOnSale: true,
        salePrice: 99.99,
        saleEnd: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 години від зараз
    },
    {
        id: 2,
        name: "Cyberpunk Keyboard",
        price: 199.99,
        image: "img/Cyberpunk Keyboard.jpeg",
        category: "Electronics",
        description: "RGB mechanical keyboard with neon backlight and customizable switches",
        rating: 4.8,
        reviews: 89,
        inStock: true,
        isOnSale: false
    },
    {
        id: 3,
        name: "Neon Gaming Mouse",
        price: 79.99,
        image: "https://via.placeholder.com/300x300?text=Gaming+Mouse",
        category: "Electronics",
        description: "Ergonomic gaming mouse with neon effects and 16000 DPI sensor",
        rating: 4.3,
        reviews: 156,
        inStock: true
    },
    {
        id: 4,
        name: "Gaming Chair Pro",
        price: 299.99,
        image: "img/Gaming Chair Pro.jpeg",
        category: "Furniture",
        description: "Ergonomic gaming chair with lumbar support and adjustable armrests",
        rating: 4.6,
        reviews: 203,
        inStock: true
    },
    {
        id: 5,
        name: "LED Strip Lights",
        price: 49.99,
        image: "https://via.placeholder.com/300x300?text=LED+Strip",
        category: "Lighting",
        description: "RGB LED strip lights with remote control and music sync",
        rating: 4.2,
        reviews: 342,
        inStock: true
    },
    {
        id: 6,
        name: "Gaming Desk",
        price: 399.99,
        image: "https://via.placeholder.com/300x300?text=Gaming+Desk",
        category: "Furniture",
        description: "Large gaming desk with cable management and cup holder",
        rating: 4.7,
        reviews: 67,
        inStock: false
    },
    {
        id: 7,
        name: "Webcam HD",
        price: 89.99,
        image: "https://via.placeholder.com/300x300?text=Webcam",
        category: "Electronics",
        description: "1080p HD webcam with built-in microphone and privacy cover",
        rating: 4.4,
        reviews: 189,
        inStock: true
    },
    {
        id: 8,
        name: "Gaming Mousepad",
        price: 29.99,
        image: "https://via.placeholder.com/300x300?text=Mousepad",
        category: "Accessories",
        description: "Large RGB gaming mousepad with non-slip base",
        rating: 4.1,
        reviews: 278,
        inStock: true
    },
    {
        id: 9,
        name: "Ultra Gaming Monitor",
        price: 599.99,
        image: "https://via.placeholder.com/300x300?text=Gaming+Monitor",
        category: "Electronics",
        description: "27-inch 4K gaming monitor with 144Hz refresh rate and HDR",
        rating: 4.9,
        reviews: 156,
        inStock: true
    },
    {
        id: 10,
        name: "Gaming Microphone",
        price: 149.99,
        image: "https://via.placeholder.com/300x300?text=Microphone",
        category: "Electronics",
        description: "Professional USB condenser microphone with RGB lighting",
        rating: 4.6,
        reviews: 98,
        inStock: true
    },
    {
        id: 11,
        name: "Gaming Console Stand",
        price: 89.99,
        image: "https://via.placeholder.com/300x300?text=Console+Stand",
        category: "Furniture",
        description: "Multi-level console stand with cable management",
        rating: 4.3,
        reviews: 134,
        inStock: true
    },
    {
        id: 12,
        name: "Neon Wall Lights",
        price: 79.99,
        image: "https://via.placeholder.com/300x300?text=Wall+Lights",
        category: "Lighting",
        description: "LED neon wall lights with customizable colors",
        rating: 4.4,
        reviews: 89,
        inStock: true
    },
    {
        id: 13,
        name: "Gaming Controller",
        price: 69.99,
        image: "https://via.placeholder.com/300x300?text=Controller",
        category: "Accessories",
        description: "Wireless gaming controller with vibration feedback",
        rating: 4.2,
        reviews: 245,
        inStock: true
    },
    {
        id: 14,
        name: "Gaming Speakers",
        price: 199.99,
        image: "https://via.placeholder.com/300x300?text=Speakers",
        category: "Electronics",
        description: "2.1 gaming speaker system with subwoofer",
        rating: 4.5,
        reviews: 167,
        inStock: true
    },
    {
        id: 15,
        name: "Gaming Shelf Unit",
        price: 159.99,
        image: "https://via.placeholder.com/300x300?text=Shelf+Unit",
        category: "Furniture",
        description: "Multi-tier shelf unit for gaming accessories",
        rating: 4.1,
        reviews: 78,
        inStock: true
    },
    {
        id: 16,
        name: "Smart LED Bulbs",
        price: 39.99,
        image: "https://via.placeholder.com/300x300?text=Smart+Bulbs",
        category: "Lighting",
        description: "WiFi-enabled smart LED bulbs with app control",
        rating: 4.3,
        reviews: 203,
        inStock: true
    },
    {
        id: 17,
        name: "Gaming Headset Stand",
        price: 24.99,
        image: "https://via.placeholder.com/300x300?text=Headset+Stand",
        category: "Accessories",
        description: "RGB headset stand with USB hub",
        rating: 4.0,
        reviews: 156,
        inStock: true
    },
    {
        id: 18,
        name: "Gaming Laptop Stand",
        price: 119.99,
        image: "https://via.placeholder.com/300x300?text=Laptop+Stand",
        category: "Furniture",
        description: "Adjustable laptop stand with cooling fans",
        rating: 4.4,
        reviews: 92,
        inStock: true
    },
    {
        id: 19,
        name: "Gaming Cable Organizer",
        price: 19.99,
        image: "img/Gaming Cable Organizer.jpeg",
        category: "Accessories",
        description: "Cable management kit with clips and ties",
        rating: 4.2,
        reviews: 189,
        inStock: true
    },
    {
        id: 20,
        name: "Ambient Light Bar",
        price: 129.99,
        image: "img/Ambient Light Bar.jpeg",
        category: "Lighting",
        description: "TV/monitor ambient light bar with music sync",
        rating: 4.7,
        reviews: 134,
        inStock: true,
        isOnSale: true,
        salePrice: 89.99,
        saleEnd: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 години від зараз
    }
];

// Categories for filtering
const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Electronics', name: 'Electronics' },
    { id: 'Furniture', name: 'Furniture' },
    { id: 'Lighting', name: 'Lighting' },
    { id: 'Accessories', name: 'Accessories' }
];

function updateCurrentPageNumber() {
    document.getElementById('currentPage').textContent = currentPage;
}

function createPageButtons() {
    const paginationButtons = document.querySelector('.pagination-buttons');
    paginationButtons.innerHTML = '';

    const maxVisibleButtons = 5;
    const maxButtons = Math.ceil(filteredProducts.length / productsPerPage);

    for (let page = 1; page <= maxButtons; page++) {
        if (page <= maxVisibleButtons || page === maxButtons) {
            const pageButton = document.createElement('button');
            pageButton.textContent = page;
            pageButton.classList.add('page-button');
            if (page === currentPage) {
                pageButton.classList.add('active-page');
            }
            pageButton.addEventListener('click', () => {
                changePage(page);
            });
            paginationButtons.appendChild(pageButton);
        } else if (page === maxVisibleButtons + 1) {
            const emptyButton = document.createElement('span');
            emptyButton.textContent = '...';
            emptyButton.classList.add('pagination-ellipsis');
            paginationButtons.appendChild(emptyButton);
        }
    }
}

// Search and filter functionality
function filterProducts() {
    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    
    // Sort products
    sortProducts();
    
    currentPage = 1;
    displayProducts();
    createPageButtons();
    updatePaginationButtons();
}

// Sort products
function sortProducts() {
    switch (sortBy) {
        case 'price':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'name':
        default:
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
}

// Create sort dropdown
function createSortDropdown() {
    const productsSection = document.querySelector('.products-section');
    if (!productsSection) return;

    const sortContainer = document.createElement('div');
    sortContainer.classList.add('sort-container');
    sortContainer.innerHTML = `
        <label for="sort-select">Sort by:</label>
        <select id="sort-select" class="sort-select">
            <option value="name">Name A-Z</option>
            <option value="price">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating: High to Low</option>
        </select>
    `;

    // Insert after the title
    const title = productsSection.querySelector('.section-title');
    if (title) {
        title.parentNode.insertBefore(sortContainer, title.nextSibling);
    }

    // Add event listener
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortBy = e.target.value;
            filterProducts();
            saveUserPreferences();
        });
    }
}

// Create category filter buttons
function createCategoryFilters() {
    const categoriesSection = document.querySelector('.categories-section');
    if (!categoriesSection) return;

    const filterContainer = document.createElement('div');
    filterContainer.classList.add('category-filters');
    
    categories.forEach(category => {
        const filterButton = document.createElement('button');
        filterButton.textContent = category.name;
        filterButton.classList.add('category-filter-btn');
        if (category.id === selectedCategory) {
            filterButton.classList.add('active');
        }
        filterButton.addEventListener('click', () => {
            selectedCategory = category.id;
            document.querySelectorAll('.category-filter-btn').forEach(btn => btn.classList.remove('active'));
            filterButton.classList.add('active');
            filterProducts();
            saveUserPreferences();
        });
        filterContainer.appendChild(filterButton);
    });

    // Insert after the title
    const title = categoriesSection.querySelector('.section-title');
    if (title) {
        title.parentNode.insertBefore(filterContainer, title.nextSibling);
    }
}

async function fetchData(page) {
    const response = await fetch(`${apiEndpoint}?limit=${productsPerPage}&page=${page}`);
    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }
    const data = await response.json();
    return data;
}

// Display products
function displayProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productsToShow.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        const isInWishlist = wishlist.includes(product.id);
        const stockStatus = product.inStock ? 'In Stock' : 'Out of Stock';
        const stockClass = product.inStock ? 'in-stock' : 'out-of-stock';

        // Sale badge, price, timer
        let saleBadge = '';
        let priceBlock = `<div class="product-card__price">$${product.price.toFixed(2)}</div>`;
        let timerBlock = '';
        if (product.isOnSale && product.salePrice && product.saleEnd) {
            saleBadge = `<div class="sale-badge">SALE</div>`;
            priceBlock = `<div class="product-card__price"><span class="old-price">$${product.price.toFixed(2)}</span> <span class="sale-price">$${product.salePrice.toFixed(2)}</span></div>`;
            timerBlock = `<div class="sale-timer" data-saleend="${product.saleEnd}" data-productid="${product.id}"></div>`;
        }

        productCard.innerHTML = `
            <div class="product-card__image">
                <img src="${product.image}" alt="${product.name}">
                <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="product-card__overlay">
                    <button class="quick-view-btn" data-id="${product.id}">Quick View</button>
                </div>
                ${saleBadge}
            </div>
            <div class="product-card__content">
                <div class="product-card__category">${product.category}</div>
                <h3 class="product-card__title">${product.name}</h3>
                <div class="product-card__rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="reviews">(${product.reviews})</span>
                </div>
                <p class="product-card__description">${product.description}</p>
                ${priceBlock}
                ${timerBlock}
                <div class="product-card__stock ${stockClass}">${stockStatus}</div>
                <button class="add-to-cart" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                    ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Таймер для акційних товарів
    updateSaleTimers();

    // Add event listeners
    addProductEventListeners();
}

// Оновлення таймерів акцій
function updateSaleTimers() {
    const timers = document.querySelectorAll('.sale-timer');
    timers.forEach(timer => {
        const saleEnd = timer.getAttribute('data-saleend');
        if (!saleEnd) return;
        function update() {
            const now = new Date();
            const end = new Date(saleEnd);
            let diff = Math.max(0, end - now);
            if (diff <= 0) {
                timer.textContent = 'Sale ended';
                timer.classList.add('sale-ended');
                return;
            }
            const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
            const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
            timer.textContent = `Sale ends in: ${h}:${m}:${s}`;
        }
        update();
        setInterval(update, 1000);
    });
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<span class="star filled">★</span>';
        } else if (i === fullStars && hasHalfStar) {
            starsHTML += '<span class="star half">★</span>';
        } else {
            starsHTML += '<span class="star">★</span>';
        }
    }
    
    return starsHTML;
}

// Add event listeners to product cards
function addProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });

    // Wishlist buttons
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.wishlist-btn').dataset.id);
            toggleWishlist(productId);
        });
    });

    // Quick view buttons
    document.querySelectorAll('.quick-view-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            showQuickView(productId);
        });
    });
}

// Toggle wishlist
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
    } else {
        wishlist.push(productId);
    }
    
    saveWishlist();
    displayProducts(); // Refresh to update wishlist buttons
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Load wishlist from localStorage
function loadWishlist() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
        wishlist = JSON.parse(savedWishlist);
    }
}

// Show quick view modal
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Create quick view modal
    const modal = document.createElement('div');
    modal.classList.add('modal', 'quick-view-modal');
    modal.innerHTML = `
        <div class="modal-content">
            <div class="quick-view-content">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <h2>${product.name}</h2>
                    <div class="quick-view-rating">
                        ${generateStars(product.rating)} (${product.reviews} reviews)
                    </div>
                    <p class="quick-view-description">${product.description}</p>
                    <div class="quick-view-price">$${product.price.toFixed(2)}</div>
                    <div class="quick-view-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}">
                        ${product.inStock ? 'In Stock' : 'Out of Stock'}
                    </div>
                    <button class="add-to-cart-large" data-id="${product.id}" ${!product.inStock ? 'disabled' : ''}>
                        ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
            <a class="close-button">×</a>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'flex';

    // Add event listeners
    const closeBtn = modal.querySelector('.close-button');
    const addToCartBtn = modal.querySelector('.add-to-cart-large');

    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    addToCartBtn.addEventListener('click', () => {
        addToCart(product.id);
        document.body.removeChild(modal);
    });

    // Close when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Scroll to products section
function scrollToProducts() {
    const productsSection = document.querySelector('.products-section');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
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
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCart();
    saveCart();
    
    // Show success message
    showMessage(`${product.name} added to cart!`, 'success');
    
    // Animate cart icon
    const cartIconElement = document.querySelector('.cart-icon');
    if (cartIconElement) {
        cartIconElement.classList.add('added');
        setTimeout(() => {
            cartIconElement.classList.remove('added');
        }, 600);
    }
}

// Show message to user
function showMessage(message, type = 'success') {
    const messageElement = document.createElement('div');
    messageElement.classList.add(`${type}-message`);
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        if (document.body.contains(messageElement)) {
            document.body.removeChild(messageElement);
        }
    }, 3000);
}

// Show loading state
function showLoading(element) {
    const originalText = element.textContent;
    element.innerHTML = '<span class="loading-spinner"></span> Loading...';
    element.disabled = true;
    
    return () => {
        element.textContent = originalText;
        element.disabled = false;
    };
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCart();
}

// Update cart display
function updateCart() {
    if (!cartItems || !itemCount || !totalCartPrice) return;

    cartItems.innerHTML = '';
    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div class="cart-item__content">
                <div class="cart-item__image">
                    <img src="${products.find(p => p.id === item.id)?.image || ''}" alt="${item.name}">
                </div>
                <div class="cart-item__details">
                    <h4 class="cart-item__name">${item.name}</h4>
                    <p class="cart-item__price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item__quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-button" data-id="${item.id}">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);

        total += item.price * item.quantity;
        totalItems += item.quantity;
    });

    itemCount.textContent = totalItems;
    totalCartPrice.innerHTML = `
        <div class="cart-total">
            <div class="cart-total__items">Items: ${totalItems}</div>
            <div class="cart-total__price">Total: $${total.toFixed(2)}</div>
        </div>
    `;

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.remove-button').dataset.id);
            removeFromCart(productId);
        });
    });

    // Add event listeners to quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            const isPlus = e.target.classList.contains('plus');
            updateItemQuantity(productId, isPlus);
        });
    });
}

// Update item quantity
function updateItemQuantity(productId, isPlus) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    if (isPlus) {
        item.quantity += 1;
    } else {
        item.quantity = Math.max(1, item.quantity - 1);
    }

    updateCart();
    saveCart();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

function updatePaginationButtons() {
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    const maxPages = Math.ceil(filteredProducts.length / productsPerPage);

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === maxPages;
}

function changePage(newPage) {
    const maxPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (newPage >= 1 && newPage <= maxPages) {
        const previousActiveButton = document.querySelector('.pagination-buttons .active-page');
        
        if (previousActiveButton) {
            previousActiveButton.classList.remove('active-page');
        }

        currentPage = newPage;

        const newActiveButton = document.querySelector(`.pagination-buttons button:nth-child(${currentPage})`);
        if (newActiveButton) {
            newActiveButton.classList.add('active-page');
        }

        displayProducts();
        updatePaginationButtons();
        updateCurrentPageNumber();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize filtered products with all products
    filteredProducts = [...products];
    
    loadUserPreferences();
    displayProducts();
    loadCart();
    loadWishlist();
    createPageButtons();
    createCategoryFilters();
    createSortDropdown();
    
    // Add search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            filterProducts();
            saveUserPreferences();
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            filterProducts();
            saveUserPreferences();
        });
    }

    // Add cart modal functionality
    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.style.display = 'block';
        });
    }

    if (closeButton && cartModal) {
        closeButton.addEventListener('click', () => {
            cartModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Add pagination button listeners
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    if (prevButton) {
        prevButton.addEventListener('click', () => changePage(currentPage - 1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => changePage(currentPage + 1));
    }

    // Open login modal
    if (loginButton) {
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }

    // Open signup modal
    if (signupButton) {
        signupButton.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'flex';
        });
    }

    // Close modals
    if (loginCloseButton) {
        loginCloseButton.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }

    if (signupCloseButton) {
        signupCloseButton.addEventListener('click', () => {
            signupModal.style.display = 'none';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });

    // Switch between login and signup
    const signupLink = document.querySelector('.signup-link');
    const loginLink = document.querySelector('.login-link');

    if (signupLink) {
        signupLink.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'flex';
        });
    }

    if (loginLink) {
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.querySelector('input[name="remember"]').checked;

            // Here you would typically send the login data to your server
            console.log('Login attempt:', { email, password, remember });
            
            // For demo purposes, just close the modal
            loginModal.style.display = 'none';
        });
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            // Here you would typically send the signup data to your server
            console.log('Signup attempt:', { name, email, password });
            
            // For demo purposes, just close the modal
            signupModal.style.display = 'none';
        });
    }

    // Add checkout button functionality
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            paymentModal.style.display = 'flex';
            paymentStatus.textContent = '';
        });
    }

    // Payment modal logic
    paymentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentStatus.textContent = 'Processing payment via ' + btn.textContent + '...';
            paymentStatus.style.color = 'var(--color-neon, #00fff7)';
            setTimeout(() => {
                paymentStatus.textContent = 'Payment successful! Thank you for your purchase!';
                paymentStatus.style.color = 'var(--color-neon2, #39ff14)';
                clearCart();
            }, 1800);
        });
    });

    paymentCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            paymentModal.style.display = 'none';
        });
    });

    // Save user preferences
    saveUserPreferences();
});

// Save user preferences
function saveUserPreferences() {
    const preferences = {
        sortBy: sortBy,
        selectedCategory: selectedCategory,
        searchQuery: searchQuery
    };
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
}

// Load user preferences
function loadUserPreferences() {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences);
        sortBy = preferences.sortBy || 'name';
        selectedCategory = preferences.selectedCategory || 'all';
        searchQuery = preferences.searchQuery || '';
        
        // Update UI elements
        if (searchInput) {
            searchInput.value = searchQuery;
        }
    }
}

// Export cart to JSON
function exportCart() {
    if (cart.length === 0) {
        showMessage('Your cart is empty!', 'error');
        return;
    }
    
    const cartData = {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(cartData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `voodoo-cart-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showMessage('Cart exported successfully!', 'success');
}

// Import cart from JSON
function importCart(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const cartData = JSON.parse(e.target.result);
            if (cartData.items && Array.isArray(cartData.items)) {
                cart = cartData.items;
                updateCart();
                saveCart();
                showMessage('Cart imported successfully!', 'success');
            } else {
                showMessage('Invalid cart file format!', 'error');
            }
        } catch (error) {
            showMessage('Error importing cart file!', 'error');
        }
    };
    reader.readAsText(file);
}

// Clear cart
function clearCart() {
    if (cart.length === 0) {
        showMessage('Your cart is already empty!', 'error');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        updateCart();
        saveCart();
        showMessage('Cart cleared successfully!', 'success');
    }
}



