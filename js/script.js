const apiEndpoint = 'https://voodoo-sandbox.myshopify.com/products.json';
const productsPerPage = 24;
let currentPage = 2;
let totalPages = 25;

// Cart functionality
let cart = [];
const cartItems = document.querySelector('.cart-items');
const itemCount = document.querySelector('.item-count');
const totalCartPrice = document.querySelector('.total-cart-price');
const cartModal = document.getElementById('cartModal');
const closeButton = document.querySelector('.close-button');
const cartIcon = document.querySelector('.cart-icon');

// Login Modal functionality
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const loginButton = document.querySelector('.button-login');
const signupButton = document.querySelector('.button-signup');
const loginCloseButton = loginModal.querySelector('.close-button');
const signupCloseButton = signupModal.querySelector('.close-button');
const loginForm = document.querySelector('.login-form');
const signupForm = document.querySelector('.signup-form');

// Sample product data
const products = [
    {
        id: 1,
        name: "Neon Gaming Headset",
        price: 129.99,
        image: "https://via.placeholder.com/300x300?text=Gaming+Headset",
        category: "Electronics",
        description: "High-quality gaming headset with neon accents"
    },
    {
        id: 2,
        name: "Cyberpunk Keyboard",
        price: 199.99,
        image: "https://via.placeholder.com/300x300?text=Gaming+Keyboard",
        category: "Electronics",
        description: "RGB mechanical keyboard with neon backlight"
    },
    {
        id: 3,
        name: "Neon Gaming Mouse",
        price: 79.99,
        image: "https://via.placeholder.com/300x300?text=Gaming+Mouse",
        category: "Electronics",
        description: "Ergonomic gaming mouse with neon effects"
    }
];

function updateCurrentPageNumber() {
    document.getElementById('currentPage').textContent = currentPage;
}

function createPageButtons() {
    const paginationButtons = document.querySelector('.pagination-buttons');
    paginationButtons.innerHTML = '';

    const maxVisibleButtons = 5;
    const maxButtons = 25;

    for (let page = 1; page <= totalPages; page++) {
        if (page <= maxVisibleButtons || page === totalPages) {
            const pageButton = document.createElement('button');
            pageButton.textContent = page;
            pageButton.addEventListener('click', () => {
                changePage(page);
            });
            paginationButtons.appendChild(pageButton);
        } else if (page === maxVisibleButtons + 1) {
            const emptyButton = document.createElement('span');
            emptyButton.textContent = '...';
            paginationButtons.appendChild(emptyButton);
        }
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

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
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

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}

function changePage(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
        const previousActiveButton = document.querySelector('.pagination-buttons .active-page');
        
        if (previousActiveButton) {
            previousActiveButton.classList.remove('active-page');
        }

        currentPage = newPage;

        const newActiveButton = document.querySelector(`.pagination-buttons button:nth-child(${currentPage})`);
        if (newActiveButton) {
            newActiveButton.classList.add('active-page');
        }

        fetchData(currentPage)
            .then(data => {
                displayProducts();
                updatePaginationButtons();
                updateCurrentPageNumber();
            })
            .catch(error => console.error(error));
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    loadCart();
    createPageButtons();
    
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
});



