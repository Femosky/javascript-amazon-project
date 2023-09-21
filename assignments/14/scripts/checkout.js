import { cart, calculateCartQuantity, removeFromCart, updateQuantity, displayCartQuantity } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

const currentScript = 'checkout.js';

let cartSummaryHTML = '';

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
        if (product.id === productId) {
            matchingProduct = product;
        }
    });

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">Delivery date: Tuesday, June 21</div>

        <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}" />

            <div class="cart-item-details">
                <div class="product-name">${matchingProduct.name}</div>
                <div class="product-price">$${formatCurrency(matchingProduct.priceCents)}</div>
                <div class="product-quantity">
                    <span> Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${
        cartItem.quantity
    }</span> </span>
                    <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${
                        matchingProduct.id
                    }"> Update </span>
                    <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                    <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${
                        matchingProduct.id
                    }">Save</span>
                    <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${
                        matchingProduct.id
                    }"> Delete </span>
                </div>
            </div>

            <div class="delivery-options">
                <div class="delivery-options-title">Choose a delivery option:</div>
                <div class="delivery-option">
                    <input type="radio" checked class="delivery-option-input" name="delivery-option-1" />
                    <div>
                        <div class="delivery-option-date">Tuesday, June 21</div>
                        <div class="delivery-option-price">FREE Shipping</div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input" name="delivery-option-1" />
                    <div>
                        <div class="delivery-option-date">Wednesday, June 15</div>
                        <div class="delivery-option-price">$4.99 - Shipping</div>
                    </div>
                </div>
                <div class="delivery-option">
                    <input type="radio" class="delivery-option-input" name="delivery-option-1" />
                    <div>
                        <div class="delivery-option-date">Monday, June 13</div>
                        <div class="delivery-option-price">$9.99 - Shipping</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
});

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`;

document.querySelectorAll('.js-delete-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const { productId } = link.dataset;
        removeFromCart(productId);

        for (let i = 0; i < cart.length; i++) {
            const cartItem = cart[i];

            if (cartItem === productId) {
                cart.splice(i, 1);
            }
        }

        let cartQuantity = 0;

        cart.forEach((cartItem) => {
            cartQuantity += cartItem.quantity;
        });
        console.log(cartQuantity);

        document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
    });
});

document.querySelectorAll('.js-update-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const { productId } = link.dataset;

        const container = document.querySelector(`.js-cart-item-container-${productId}`);

        container.classList.add('is-editing-quantity');
    });
});

function updateInputQuantity(productId) {
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const quantityInput = document.querySelector(`.js-quantity-input-${productId}`);
    const newQuantity = Number(quantityInput.value);

    if (newQuantity >= 1 && newQuantity < 1000) {
        container.classList.remove('is-editing-quantity');

        if (quantityInput.classList.contains('quantity-input-error')) {
            quantityInput.classList.remove('quantity-input-error');
        }
        updateQuantity(productId, newQuantity);

        document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
        document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`;
    } else {
        quantityInput.classList.add('quantity-input-error');
    }
}

document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
    link.addEventListener('click', () => {
        const { productId } = link.dataset;

        updateInputQuantity(productId);
    });

    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const { productId } = link.dataset;

            updateInputQuantity(productId);
        }
    });
});
