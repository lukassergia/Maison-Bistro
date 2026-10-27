// Get the cart elements
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const clearCartButton = document.getElementById("clearCart");
const checkoutButton = document.getElementById("checkoutBtn");

// Display the cart
function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "0.00";
        updateCartCount();
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <article class="cart-item">
            <img src="${item.image}" alt="${item.name}">

            <div>
                <h3>${item.name}</h3>
                <p>$${item.price.toFixed(2)} each</p>

                <button data-action="decrease" data-id="${item.id}">
                    −
                </button>

                <span>${item.quantity}</span>

                <button data-action="increase" data-id="${item.id}">
                    +
                </button>

                <button data-action="remove" data-id="${item.id}">
                    Remove
                </button>

                <p>
                    Subtotal: $${(item.price * item.quantity).toFixed(2)}
                </p>
            </div>
        </article>
    `).join("");

    const total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    cartTotal.textContent = total.toFixed(2);

    updateCartCount();
}

// Handle quantity and remove buttons
cartItems.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;
    const cart = getCart();
    const item = cart.find(dish => dish.id === id);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            const index = cart.findIndex(dish => dish.id === id);
            cart.splice(index, 1);
        }
    }

    if (action === "remove") {
        const index = cart.findIndex(dish => dish.id === id);
        cart.splice(index, 1);
    }

    localStorage.setItem("savoraCart", JSON.stringify(cart));

    renderCart();
});

// Empty the entire cart
clearCartButton.addEventListener("click", function() {
    // if (!confirm("Are you sure you want to clear your cart?")) {
    //     return;
    // }

    localStorage.removeItem("savoraCart");
    renderCart();
});

// Checkout placeholder
checkoutButton.addEventListener("click", function() {
    const cart = getCart();

    if (cart.length === 0) {
       return;
     }

    // alert("Checkout is not connected yet. We'll add it in a later step.");
});

// Display the cart when the page loads
renderCart();