document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartIcon = document.querySelector('.cart-icon');
    const cartPopup = document.getElementById('cart-popup');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.querySelector('.cart-count');

    // Function to load cart from localStorage
    function loadCart() {
        const cartData = localStorage.getItem('cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    // Retrieve cart data from localStorage or initialize it
    let cart = loadCart();

    // Function to save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Function to update cart display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = ''; // Clear existing items

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
        } else {
            let totalPrice = 0;
            cart.forEach((item, index) => { // Added index
                const itemElement = document.createElement('div');
                itemElement.classList.add('cart-item');
                itemElement.innerHTML = `
                    <p>${item.name} - ${item.price} ₽</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" data-index="${index}" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                    <button class="remove-from-cart" data-index="${index}">Удалить</button>
                `;
                cartItemsContainer.appendChild(itemElement);
                totalPrice += item.price * item.quantity;
            });
            const totalElement = document.createElement('div');
            totalElement.classList.add('cart-total');
            totalElement.innerHTML = `<p>Итого: ${totalPrice} ₽</p>`;
            cartItemsContainer.appendChild(totalElement);

            // Attach event listeners to quantity buttons
            const quantityButtons = document.querySelectorAll('.quantity-btn');
            quantityButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const indexToChange = parseInt(this.dataset.index);
                    const operation = this.classList.contains('plus') ? 'plus' : 'minus';
                    changeQuantity(indexToChange, operation);
                });
            });

            // Attach event listeners to remove buttons
            const removeButtons = document.querySelectorAll('.remove-from-cart');
            removeButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const indexToRemove = parseInt(this.dataset.index);
                    removeFromCart(indexToRemove);
                });
            });
        }

        // Обновляем значение над иконкой корзины
        cartCountElement.textContent = cart.length;
    }

    // Function to add item to cart
    function addItemToCart(productId) {
        const productItem = document.querySelector(`.merch-item[data-product-id="${productId}"]`);
        const productName = productItem.querySelector('h3').textContent;
        const productPrice = parseFloat(productItem.querySelector('.price').textContent);

        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => item.id === productId);

        if (existingItemIndex !== -1) {
            // If item exists, increase quantity
            cart[existingItemIndex].quantity += 1;
        } else {
            // If item doesn't exist, add it to cart with quantity 1
            const newItem = {
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1
            };
            cart.push(newItem);
        }

        saveCart(); // Save cart after adding
        updateCartDisplay();
        showNotification('Товар добавлен в корзину', 'success');
        // Animation
        animateCartIcon(cartIcon);
        }

// Adding this function:
        function animateCartIcon(cartIcon) {
            cartIcon.classList.add('animate');
            setTimeout(() => {
            cartIcon.classList.remove('animate');
        }, 500); // Adjust time to match css animation
    }

    // Function to remove item from cart
    function removeFromCart(indexToRemove) {
        cart.splice(indexToRemove, 1);
        saveCart(); // Save cart after removing
        updateCartDisplay();
        showNotification('Товар удален из корзины', 'success');
    }

    // Function to change quantity of item in cart
    function changeQuantity(indexToChange, operation) {
        if (operation === 'plus') {
            cart[indexToChange].quantity += 1;
        } else if (operation === 'minus' && cart[indexToChange].quantity > 1) {
            cart[indexToChange].quantity -= 1;
        }

        saveCart();
        updateCartDisplay();
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productItem = event.target.closest('.merch-item');
            const productId = productItem.dataset.productId;

            addItemToCart(productId);
        });
    });

    // Toggle cart popup
    cartIcon.addEventListener('click', (event) => {
        event.preventDefault();
        cartPopup.classList.toggle('show');
    });

    // Initialize cart display on page load
    updateCartDisplay();

});