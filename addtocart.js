// Global variables
let cartCount = 0;
let totalOrderAmount = 0;

// DOM elements
const addCartButton = document.querySelectorAll(".add-to-cart-button");
const cartQuantity = document.querySelector(".cart-quantity");
const quantityOrder = document.querySelectorAll(".quantity-order");
const orderList = document.querySelector(".order-list");
const addedItem = document.querySelector(".added-item");
const orderedItem = document.querySelector(".ordered-items");
const emptyCartImage = document.querySelector(".empty-cart-image");
const totalOrder = document.querySelector(".total-order-p");
const totalProductsOrdered = document.querySelector(".totalproducts-ordered");
const confirmedButton = document.querySelector(".confirm-order-button");
const confirmedModalOrder = document.querySelector(".confirmed-order-modal");
const newOrderButton = document.querySelector(".new-order-button");
const itemsOrdered = document.querySelector(".items-ordered");

// Event listeners
addCartButton.forEach((button) => {
  button.addEventListener("click", addProductToCart);
});

confirmedButton.addEventListener("click", confirmedOrder);

newOrderButton.addEventListener("click", () => {
  confirmedModalOrder.classList.add("hidden"); // Hide the modal
  resetCart(); // Reset the cart
  totalOrder.style.display = "none"; //Hide the total order section
  addedItem.style.display = "flex"; // Show the added item section
});

window.addEventListener("click", (event) => {
  if (event.target === confirmedModalOrder) {
    confirmedModalOrder.classList.add("hidden"); // Hide the modal
    resetCart();
  }
});

// Add product to cart
function addProductToCart(e) {
  const button = e.target.closest(".add-to-cart-button");
  const productId = button.getAttribute("data-product-id");
  button.style.display = "none";

  const quantityOrder = document.querySelector(
    `.quantity-order[data-product-id="${productId}"]`
  );
  quantityOrder.style.display = "flex";
  confirmedButton.classList.remove("hidden");

  cartCount++; // Increment cart count
  cartQuantity.textContent = `Your Cart (${cartCount})`;
  addedItem.style.display = "none";
  emptyCartImage.style.display = "none";
  totalOrder.style.display = "flex";
  totalProductsOrdered.innerHTML = `<div class="style-orderedproducts"><p class="total-items">Order Total </p><span class="total-items-span">$${totalOrderAmount.toFixed(
    2
  )}</span></div>`;

  const productContainer = button.closest(".product-container");
  const productImageSrc = productContainer.querySelector(".product-image").src;
  const productDetails = productContainer.nextElementSibling;
  const productName = productDetails.querySelector("h3").textContent;
  const productPrice = parseFloat(
    productDetails.querySelector("span").textContent.replace("$", "")
  );

  let cart = JSON.parse(localStorage.getItem("confirmedOrder")) || [];

  if (!Array.isArray(cart)) {
    cart = [];
  }

  const existingProduct = cart.find((item) => item.id === productId);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      image: productImageSrc,
      price: productPrice,
      quantity: 1,
    });
  }

  localStorage.setItem("confirmedOrder", JSON.stringify(cart));

  updateTotalOrder(productPrice);

  createOrderedProduct(
    productImageSrc,
    productName,
    productPrice,
    quantityOrder,
    button
  );
}

// Create ordered product
function createOrderedProduct(
  productImageSrc,
  productName,
  productPrice,
  quantityOrder,
  button
) {
  const orderedProduct = document.createElement("div");
  orderedProduct.classList.add("ordered-product");

  const productImage = document.createElement("img");
  productImage.src = productImageSrc;
  productImage.classList.add("ordered-product-image");

  const productDetailsDiv = document.createElement("div");
  productDetailsDiv.classList.add("ordered-product-details");

  const productNameElement = document.createElement("h3");
  productNameElement.textContent = productName;
  productNameElement.classList.add("ordered-product-name");

  let quantity = 1;
  const productQuantityElement = document.createElement("p");
  productQuantityElement.innerHTML = `<div class ="quantity-container">
   <span class="quantity">${quantity}x</span>
  <span class="standard-price">@$${productPrice.toFixed(2)}</span> 
  <span class ="calculated-price">@$${(productPrice * quantity).toFixed(
    2
  )} </span>
  </div>`;

  const removeIcon = document.createElement("img");
  removeIcon.src = "Images/icon-remove-item.svg";
  removeIcon.classList.add("remove-icon");
  removeIcon.addEventListener("click", () => {
    orderedProduct.remove();
    removeProductFromCart(productPrice * quantity);
    updateCartData(productName, 0);
    if (button) {
      button.style.display = "flex"; // Show the corresponding "Add to Cart" button
    }
    if (quantityOrder) {
      quantityOrder.style.display = "none";
      quantityOrder.querySelector(".order-quantity").textContent = "1"; // Reset quantity to 1
    }

    const orderedItems = document.querySelectorAll(".ordered-product");
    if (orderedItems.length === 0) {
      const confirmedButton = document.querySelector(".confirm-order-button");
      if (confirmedButton) {
        confirmedButton.classList.add("hidden");
        addedItem.style.display = "block";
        const totalProductsOrdered = document.querySelector(
          ".totalproducts-ordered"
        );
        totalProductsOrdered.style.display = "none";
      }
    }
  });

  const incrementButton = quantityOrder.querySelector(".increment-quantity");
  const decrementButton = quantityOrder.querySelector(".decrement-quantity");
  const orderQuantity = quantityOrder.querySelector(".order-quantity");

  incrementButton.addEventListener("click", () => {
    quantity++;
    orderQuantity.textContent = quantity;
    productQuantityElement.innerHTML = `<div class ="quantity-container">
 <span class="quantity">${quantity}x</span>
 <span class="standard-price">@$${productPrice.toFixed(2)}</span> 
   <span class ="calculated-price">@$${(productPrice * quantity).toFixed(
     2
   )} </span>
   </div>`;
    updateTotalOrder(productPrice);
    updateCartData(productName, quantity);
  });

  decrementButton.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      orderQuantity.textContent = quantity;
      productQuantityElement.innerHTML = `<div class ="quantity-container">
 <span class="quantity">${quantity}x</span>
  <span class="standard-price">@$${productPrice.toFixed(2)}</span> 
   <span class ="calculated-price">@$${(productPrice * quantity).toFixed(
     2
   )} </span>
  </div>`;
      updateTotalOrder(-productPrice);
      updateCartData(productName, quantity);
    }
  });

  productDetailsDiv.appendChild(productNameElement);
  productDetailsDiv.appendChild(productQuantityElement);

  orderedProduct.appendChild(productDetailsDiv);
  orderedProduct.appendChild(removeIcon);

  orderedItem.appendChild(orderedProduct);
}

// Update total order
function updateTotalOrder(productPrice = 0) {
  totalOrderAmount += productPrice;
  totalProductsOrdered.querySelector(
    "span"
  ).textContent = `$${totalOrderAmount.toFixed(2)}`;
}

// Update cart count
function updateCartCount() {
  cartCount--;
  cartQuantity.textContent = `Your Cart (${cartCount})`;
}

// Remove product from cart
function removeProductFromCart(productPrice) {
  updateTotalOrder(-productPrice);
  updateCartCount();
  if (cartCount === 0) {
    emptyCartImage.style.display = "block";
    totalOrder.style.display = "none";
  }
}

// Update cart data in localStorage
function updateCartData(productName, newQuantity) {
  let cart = JSON.parse(localStorage.getItem("confirmedOrder")) || [];
  const productIndex = cart.findIndex((item) => item.name === productName);

  if (productIndex !== -1) {
    if (newQuantity === 0) {
      // Remove the product if the quantity is 0
      cart.splice(productIndex, 1);
    } else {
      // Update the quantity
      cart[productIndex].quantity = newQuantity;
    }
    localStorage.setItem("confirmedOrder", JSON.stringify(cart));
  }
}

// Confirmed order
function confirmedOrder() {
  let orderData = JSON.parse(localStorage.getItem("confirmedOrder")) || [];

  itemsOrdered.innerHTML = ""; // Ensure modal content is cleared first
  itemsOrdered.style.display = "block"; // Make sure the modal is visible

  if (orderData.length > 0) {
    let totalQuantity = orderData.reduce((sum, item) => sum + item.quantity, 0); // Calculate total quantity
    let totalAmount = orderData.reduce((sum, item) => sum + item.price * item.quantity, 0); // Calculate total amount

    orderData.forEach((item) => {
      const orderDiv = document.createElement("div");
      orderDiv.classList.add("ordered-item");

      orderDiv.innerHTML = `
        <div class="modal-product-wrapper">
        <img src="${item.image}" alt="${item.name}" class="modal-product-image" />
        <div class="modal-product-details">
          <h3>${item.name}</h3>
          <p>${item.quantity}x <span class="modal-product-span">@$${item.price.toFixed(2)}</span></p>
          </div>
          <span class ="modal-calculated-price">$${(item.price * item.quantity).toFixed(
     2)}

        </div>
        </div>
      `;
      itemsOrdered.appendChild(orderDiv);
    });

    itemsOrdered.innerHTML += `
      <div>
        <p style="color:black; font-weight:800;">Order Total: $${totalAmount.toFixed(2)}</p>
      </div>
    `;
  } else {
    itemsOrdered.innerHTML = `<p>No items ordered.</p>`;
  }

  confirmedModalOrder.classList.remove("hidden"); // Show the modal
}

// Reset cart
function resetCart() {
    // Clear the cart items in modal
    itemsOrdered.innerHTML = ""; // Clear the content
    itemsOrdered.style.display = "none"; // Hide the element
  
    // Reset the order summary section
    const orderSummary = document.querySelector(".order-summary");
    if (orderSummary) {
      orderSummary.style.display = "none";
      orderSummary.innerHTML = ""; // Ensure it is properly reset
    }
  
    // Reset the cart quantity text
    cartQuantity.textContent = `Your Cart (0)`;
  
    // Show the empty cart image
    emptyCartImage.style.display = "block";
  
    // Hide ordered items
    orderedItem.innerHTML = "";
  
    // Hide confirm order button
    confirmedButton.classList.add("hidden");
  
    // Reset all quantity fields and buttons
    document.querySelectorAll(".quantity-order").forEach((quantity) => {
      quantity.style.display = "none";
      quantity.querySelector(".order-quantity").textContent = "1"; // Reset quantity to 1
    });
  
    // Show all "Add to Cart" buttons again
    document.querySelectorAll(".add-to-cart-button").forEach((button) => {
      button.style.display = "flex";
    });
  
    // Clear local storage for orders
    localStorage.removeItem("confirmedOrder");
  
    // Reset the totalProductsOrdered element
    totalProductsOrdered.innerHTML = `<div class="style-orderedproducts">
        <p class="total-items">Order Total </p>
        <span class="total-items-span">$0.00</span>
      </div>`;
    totalProductsOrdered.style.display = "none";
  
    // Reset cart count and total amount
    cartCount = 0;
    totalOrderAmount = 0;
  
    // Ensure the modal is properly hidden
    confirmedModalOrder.classList.add("hidden");
  
    // ✅ FIX: Ensure total order is displayed when adding new products
    totalOrder.style.display = "flex"; // Show total order when items are added
  }