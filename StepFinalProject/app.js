// 1. Our restaurant dishes
const dishes = [
    {
        id: 1,
        name: "Classic Burger",
        category: "Burgers",
        price: 12,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=75",
        description: "Juicy burger with fresh vegetables."
    },
    {
        id: 2,
        name: "Italian Pizza",
        category: "Pizza",
        price: 15,
        image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=75",
        description: "Delicious pizza with cheese and tomatoes."
    },
    {
        id: 3,
        name: "Fresh Salad",
        category: "Salads",
        price: 9,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=75",
        description: "Fresh vegetables and healthy ingredients."
    },
    {
        id: 4,
        name: "Chocolate Cake",
        category: "Desserts",
        price: 7,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=75",
        description: "Rich chocolate cake for dessert lovers."
    },
    {
        id: 5,
        name: "Cheese Pizza",
        category: "Pizza",
        price: 13,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=75",
        description: "Pizza topped with melted cheese."
    },
    {
        id: 6,
        name: "Chicken Burger",
        category: "Burgers",
        price: 11,
        image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=600&q=75",
        description: "Crispy chicken with a soft bun."
    }
];


// 2. Get the saved cart
function getCart() {
    return JSON.parse(localStorage.getItem("savoraCart")) || [];
}


// 3. Update the cart counter
function updateCartCount() {
    const cartCount = document.getElementById("cartCount");

    if (!cartCount) return;

    const cart = getCart();

    const total = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    cartCount.textContent = total;
}


// 4. Add a dish to the cart
// 4. Add a dish to the cart — login required
async function addToCart(id) {

    // Check whether Supabase is ready
    if (typeof supabaseClient === "undefined") {
        console.error("Supabase is not initialized.");
        return;
    }

    // Check the logged-in user
    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error(error.message);
        return;
    }

    // If the user is not logged in, open the login page
    if (!data.session) {
        window.location.href = "login.html#login";
        return;
    }

    // Existing cart logic
    const cart = getCart();
    const dish = dishes.find(item => item.id === id);

    if (!dish) return;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...dish,
            quantity: 1
        });
    }

    localStorage.setItem("savoraCart", JSON.stringify(cart));

    updateCartCount();
}


// 5. Render dishes on the page
function renderDishes(container, items) {
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = "<p>No dishes found.</p>";
        return;
    }

    container.innerHTML = items.map(dish => `
        <article class="dish-card">

            <a href="details.html?id=${dish.id}">
                <img src="${dish.image}" alt="${dish.name}" loading="lazy">
            </a>

            <div class="dish-info">
                <h3>
                    <a href="details.html?id=${dish.id}">
                        ${dish.name}
                    </a>
                </h3>

                <p>${dish.description}</p>
                <p><strong>$${dish.price.toFixed(2)}</strong></p>

                <a href="details.html?id=${dish.id}">View Details</a>

                <br>

                <button data-id="${dish.id}" class="add-to-cart">
                    Add to Cart
                </button>
            </div>

        </article>
    `).join("");

    container.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", () => {
            addToCart(Number(button.dataset.id));
        });
    });
}

// 10. Menu page and filters
const menuDishes = document.getElementById("menuDishes");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");

function filterDishes() {
    const searchText = searchInput.value.toLowerCase().trim();
    const category = categoryFilter.value;
    const maxPrice = priceFilter.value;

    const filteredDishes = dishes.filter(dish => {
        const matchesSearch = dish.name.toLowerCase().includes(searchText);

        const matchesCategory =
            category === "all" || dish.category === category;

        const matchesPrice =
            maxPrice === "all" || dish.price <= Number(maxPrice);

        return matchesSearch && matchesCategory && matchesPrice;
    });

    renderDishes(menuDishes, filteredDishes);
}

if (menuDishes) {
    // Read an optional category from the URL
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get("category");

    if (
        selectedCategory &&
        [...categoryFilter.options].some(
            option => option.value === selectedCategory
        )
    ) {
        categoryFilter.value = selectedCategory;
    }

    searchInput.addEventListener("input", filterDishes);
    categoryFilter.addEventListener("change", filterDishes);
    priceFilter.addEventListener("change", filterDishes);

    filterDishes();
}


// 6. Make the burger menu work
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}


// 7. Show featured dishes on the homepage
const featuredDishes = document.getElementById("featuredDishes");

renderDishes(featuredDishes, dishes.slice(0, 3));


// 8. Display the current year
const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// 9. Initialize the cart counter
updateCartCount();