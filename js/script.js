const apiEndpoint = 'https://voodoo-sandbox.myshopify.com/products.json';
const productsPerPage = 24;
let currentPage = 2;
let totalPages = 25;
const shoppingCart = [];

function updateCurrentPageNumber() {
  document.getElementById('currentPage').textContent = currentPage;
}

function createPageButtons() {
  const paginationButtons = document.querySelector('.pagination-buttons');
  paginationButtons.innerHTML = '';

  for (let page = 1; page <= totalPages; page++) {
    const pageButton = document.createElement('button');
    pageButton.textContent = page;
    pageButton.addEventListener('click', () => {
      changePage(page);
    });
    paginationButtons.appendChild(pageButton);
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

/* ----------------------------PRODUCT----------------------------------------------- */
function displayCurrentPageProducts(products) {
  const productsList = document.querySelector('.products-list');
  productsList.innerHTML = '';

  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.classList.add('product');
    productElement.innerHTML = `
      <h2>${product.title}</h2>
      <p>${product.body_html}</p>
      <p class="price">Price: $${product.variants[0].price}</p>
      <button class="button__add" data-product-id="${product.id}">ADD TO CART</button>
      <div class="hidden-content">
        <p>Тут буде опиc.</p>
      </div>
    `;

    const hiddenContent = productElement.querySelector('.hidden-content');
    hiddenContent.style.display = 'none';

    productElement.addEventListener('click', () => {
      toggleHiddenContent(hiddenContent);
    });

    productsList.appendChild(productElement);
  });

  addCartListeners();
}

function toggleHiddenContent(hiddenContent) {
  if (hiddenContent.style.display === 'none') {
    hiddenContent.style.display = 'block';
  } else {
    hiddenContent.style.display = 'none';
  }
}

/* ----------------------------PAGINATION----------------------------------------------- */
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

window.addEventListener('load', () => {
  createPageButtons();
});


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
        displayCurrentPageProducts(data.products);
        updatePaginationButtons();
        updateCurrentPageNumber();
      })
      .catch(error => console.error(error));
  }
}

document.querySelector('.next-button').addEventListener('click', () => {
  changePage(currentPage + 1);
});

document.querySelector('.prev-button').addEventListener('click', () => {
  changePage(currentPage - 1);
});


/* ----------------------------ADD---to----BACKET---------------------------------------- */
function addCartListeners() {
  const addToCartButtons = document.querySelectorAll('.button__add');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productElement = button.parentElement;
      const productId = productElement.querySelector('.button__add').getAttribute('data-product-id');
      const productName = productElement.querySelector('h2').textContent;
      const productPrice = parseFloat(productElement.querySelector('.price').textContent.replace('Price: $', ''));

      const productInfo = {
        id: productId, 
        name: productName,
        price: productPrice,
        quantity: 1,
      };
      addToCart(productInfo);
    });
  });
}

function addToCart(productInfo) {
  const cartItemIndex = shoppingCart.findIndex(item => item.id === productInfo.id);

  if (cartItemIndex !== -1) {
    shoppingCart[cartItemIndex].quantity += 1;
  } else {
    shoppingCart.push(productInfo);
  }

  localStorage.setItem('cart', JSON.stringify(shoppingCart));
  displayCart();
}

function displayCart() {
  const cartItems = document.getElementById('cart-items'); 
  cartItems.innerHTML = '';

  let totalQuantity = 0;
  let totalPrice = 0;

  shoppingCart.forEach(product => {
    const cartItem = document.createElement('li');
    cartItem.innerHTML = `
      <div>${product.name} - $${product.price.toFixed(2)} x${product.quantity}</div>
      <button class="remove-button" data-product-id="${product.id}">Remove</button>
    `;
    cartItems.appendChild(cartItem);

    totalQuantity += product.quantity;
    totalPrice += product.price * product.quantity;
  });

  const itemCount = document.querySelector('.item-count');
  itemCount.textContent = totalQuantity;

  const totalCartPrice = document.querySelector('.total-cart-price');
  totalCartPrice.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

window.addEventListener('load', () => {
  fetchData(currentPage)
    .then(data => {
      displayCurrentPageProducts(data.products);
      updatePaginationButtons();
      createPageButtons();
      updateCurrentPageNumber();
    })
    .catch(error => console.error(error));
});

/* -------------------------Custom Element---------------------------------------- */
const alphaBlock = document.querySelector('.alpha-header');
const disclosureContent = document.querySelector('.alpha-content');

alphaBlock.addEventListener('click', () => {
  if (disclosureContent.style.display === 'none' || disclosureContent.style.display === '') {
    disclosureContent.style.display = 'block';
  } else {
    disclosureContent.style.display = 'none';
  }
});
/* -------------------------ACOUNT---------------------------------------- */

function addToCart(productInfo) {
  shoppingCart.push(productInfo);
  displayShoppingCart();

  const itemCount = document.querySelector('.item-count');
  itemCount.textContent = shoppingCart.length;
}

function displayShoppingCart() {
  const cartItems = document.querySelector('.cart-items');
  cartItems.innerHTML = '';

  shoppingCart.forEach(product => {
    const cartItem = document.createElement('li');
    cartItem.textContent = `${product.name} - $${product.price}`;
    cartItems.appendChild(cartItem);
  });
}
 
// =======================MODAL================================================
const cartButton = document.querySelector('.cart-button');
const cartModal = document.getElementById('cartModal'); 
const closeButton = document.querySelector('.close-button'); 
const alphaHeader = document.querySelector('.alpha-header');
const alphaContent = document.querySelector('.alpha-content');

alphaHeader.addEventListener('click', () => {
  alphaContent.classList.toggle('active');
});

function openCartModal() {
    cartModal.style.display = 'block';
}

cartButton.addEventListener('click', openCartModal);

function closeCartModal() {
    cartModal.style.display = 'none';
}

closeButton.addEventListener('click', closeCartModal);

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        closeCartModal();
    }
});

// //////////////////////////////////////////////////////////////////////



