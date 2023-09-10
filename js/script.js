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
      <button class="button__add">ADD TO CART</button>
    `;
    productsList.appendChild(productElement);
  });

  addCartListeners();
}

function updatePaginationButtons() {
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}

function changePage(newPage) {
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    fetchData(currentPage)
      .then(data => {
        displayCurrentPageProducts(data.products);
        updatePaginationButtons();
        updateCurrentPageNumber();
      })
      .catch(error => console.error(error));
  }
}

function addToCart(productInfo) {
  shoppingCart.push(productInfo);
  displayShoppingCart();
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

function addCartListeners() {
  const addToCartButtons = document.querySelectorAll('.button__add');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productElement = button.parentElement;
      const productName = productElement.querySelector('h2').textContent;
      const productPrice = parseFloat(productElement.querySelector('.price').textContent.replace('Price: $', ''));

      const productInfo = {
        name: productName,
        price: productPrice,
      };
      addToCart(productInfo);
    });
  });
}

document.querySelector('.next-button').addEventListener('click', () => {
  changePage(currentPage + 1);
});

document.querySelector('.prev-button').addEventListener('click', () => {
  changePage(currentPage - 1);
});

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




const disclosureElement = document.getElementById('disclosure');
        const hiddenContent = document.getElementById('hiddenContent');

        disclosureElement.addEventListener('click', () => {
            if (hiddenContent.style.display === 'none' || hiddenContent.style.display === '') {
                hiddenContent.style.display = 'block';
            } else {
                hiddenContent.style.display = 'none';
            }
        });