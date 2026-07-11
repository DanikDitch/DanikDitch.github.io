
let menuItems = [];

// 1. Визначаємо чіткий порядок категорій, який нам потрібен
const categoryOrder = ["Супи", "Гарячі страви", "Салати", "Гарніри", "Десерти"];

async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) throw new Error('Помилка сервера');

        menuItems = await response.json();

        // 2. Сортуємо масив страв перед рендерингом
        menuItems.sort((a, b) => {
            // Отримуємо індекс категорії кожної страви у нашому списку пріоритетів
            let indexA = categoryOrder.indexOf(a.category);
            let indexB = categoryOrder.indexOf(b.category);

            // Якщо якоїсь категорії немає в нашому списку, відправляємо її в самий кінець
            if (indexA === -1) indexA = 99;
            if (indexB === -1) indexB = 99;

            return indexA - indexB;
        });

        // Передаємо вже відсортований масив у функцію відображення
        initializeMenu(menuItems);

    } catch (error) {
        console.error('Не вдалося завантажити меню:', error);
    }
}

// Функція renderMenu(items) залишається без змін, вона просто відобразить
// елементи в тому порядку, в якому вони тепер йдуть у масиві.


        let cart = {};

        function initializeMenu(items) {
            const menuGrid = document.getElementById('menuGrid');
            menuGrid.innerHTML = '';


            items.forEach(item => {
                const menuItemElement = document.createElement('div');
                menuItemElement.className = 'menu-item';
                menuItemElement.innerHTML = `
                    <div class="menu-item-content">
                        <div class="item-header">
                            <div class="card-image-container">
                                <img src="${item.image}" alt="${item.name}" class="item-image" />
                            </div>
                            <div class="item-rating">
                                <svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                <span>${item.rating}</span>
                            </div>
                            <span class="item-category">${item.category}</span>
                        </div>
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-description">${item.description}</p>
                        <div class="item-footer">
                            <span class="item-price">${item.price.toFixed(2)} ₴</span>
                            <div class="item-controls">
                                <button class="control-btn minus-btn ${!cart[item.id] ? 'hidden' : ''}" onclick="removeFromCart(${item.id})">-</button>
                                <span class="quantity ${!cart[item.id] ? 'hidden' : ''}" id="quantity-${item.id}">${cart[item.id]?.quantity || 0}</span>
                                <button class="control-btn plus-btn" onclick="addToCart(${item.id})">+</button>
                            </div>
                        </div>
                    </div>
                `;
                menuGrid.appendChild(menuItemElement);
            });
        }

document.addEventListener('DOMContentLoaded', () => {
loadMenu();
});

        function addToCart(itemId) {
            const item = menuItems.find(i => i.id === itemId);
            if (!cart[itemId]) {
                cart[itemId] = { ...item, quantity: 0 };
            }
            cart[itemId].quantity++;
            updateUI();
        }

        function removeFromCart(itemId) {
            if (cart[itemId]) {
                cart[itemId].quantity--;
                if (cart[itemId].quantity <= 0) {
                    delete cart[itemId];
                }
            }
            updateUI();
        }

        function updateUI() {
            // Update cart count and button
            const cartCount = getCartItemCount();
            const cartTotal = getCartTotal();

            const cartCountElement = document.getElementById('cartCount');
            const cartBtn = document.getElementById('cartBtn');
            const floatingCart = document.getElementById('floatingCart');
            const floatingCartText = document.getElementById('floatingCartText');

            if (cartCount > 0) {
                cartCountElement.textContent = cartCount;
                cartCountElement.classList.remove('hidden');
                cartBtn.classList.add('active');
                cartBtn.disabled = false;

                floatingCart.classList.add('show');
                floatingCartText.textContent = `${cartCount} items • ${cartTotal.toFixed(2)} ₴`;
            } else {
                cartCountElement.classList.add('hidden');
                cartBtn.classList.remove('active');
                cartBtn.disabled = true;

                floatingCart.classList.remove('show');
            }

            // Re-render menu with updated quantities
//            initializeMenu();
        }

        function getCartItemCount() {
            return Object.values(cart).reduce((total, item) => total + item.quantity, 0);
        }

        function getCartTotal() {
            return Object.values(cart).reduce((total, item) => total + (item.price * item.quantity), 0);
        }

        function showCheckout() {
            if (getCartItemCount() > 0) {
                document.getElementById('mainContent').classList.add('hidden');
                document.getElementById('checkout').classList.add('show');
                updateCheckoutSummary();
            }
        }

        function backToMenu() {
            document.getElementById('checkout').classList.remove('show');
            document.getElementById('mainContent').classList.remove('hidden');
        }

        function updateCheckoutSummary() {
            const orderSummary = document.getElementById('orderSummary');
            const checkoutTotal = document.getElementById('checkoutTotal');

            orderSummary.innerHTML = '';
            Object.values(cart).forEach(item => {
                const orderItem = document.createElement('div');
                orderItem.className = 'order-item';
                orderItem.innerHTML = `
                    <div>
                        <span style="font-weight: 600;">${item.name}</span>
                        <span style="color: #6b7280; margin-left: 0.5rem;">x${item.quantity}</span>
                    </div>
                    <span style="font-weight: 600;">${(item.price * item.quantity).toFixed(2)} ₴</span>
                `;
                orderSummary.appendChild(orderItem);
            });

            checkoutTotal.textContent = `${getCartTotal().toFixed(2)} ₴`;
        }

        function placeOrder() {
            const total = getCartTotal();
            alert(`Order placed successfully! Total: ${total.toFixed(2)} ₴`);
            cart = {};
            updateUI();
            backToMenu();
        }

        // Initialize the application
        document.addEventListener('DOMContentLoaded', function() {
            initializeMenu();
            updateUI();
        });


