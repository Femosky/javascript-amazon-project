export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
    cart = [
        {
            productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
            quantity: 2,
        },
        {
            productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
            quantity: 1,
        },
    ];
}

export let cartQuantity = parseInt(localStorage.getItem('cartQuantity')) || 0;

export function calculateCartQuantity() {
    cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    });

    saveCartQuantityToStorage();

    return cartQuantity;
}

export function displayCartQuantity() {
    if (typeof currentScript !== 'undefined') {
        if (currentScript === 'amazon.js') {
            // document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity() || 0;
            console.log('its working');
        } else if (currentScript === 'checkout.js') {
            console.log('its working too');
            // document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`;
        }
    }
}

export function updateQuantity(productId, newQuantity) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    matchingItem.quantity = newQuantity;

    saveToStorage();
}

function saveCartQuantityToStorage() {
    localStorage.setItem('cartQuantity', cartQuantity);
}

function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId) {
    let matchingItem;

    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1,
        });
    }

    saveToStorage();
}

export function removeFromCart(productId) {
    const newCart = [];

    cart.forEach((cartItem) => {
        if (cartItem.productId !== productId) {
            newCart.push(cartItem);
        }
    });

    cart = newCart;

    saveToStorage();
}
