// Get the dish ID from the URL
const params = new URLSearchParams(window.location.search);
const dishId = Number(params.get("id"));

const dish = dishes.find(item => item.id === dishId);

const detailsContainer = document.getElementById("dishDetails");

function renderDetails() {
    if (!dish) {
        detailsContainer.innerHTML = `
            <h2>Dish not found</h2>
            <a href="menu.html">Back to Menu</a>
        `;
        return;
    }

    detailsContainer.innerHTML = `
        <div class="details-card">
            <img src="${dish.image}" alt="${dish.name}">

            <div class="details-info">
                <p>${dish.category}</p>
                <h1>${dish.name}</h1>
                <p>${dish.description}</p>
                <h2>$${dish.price.toFixed(2)}</h2>

                <button id="addDishButton">Add to Cart</button>
            </div>
        </div>
    `;

    document.getElementById("addDishButton").addEventListener("click", () => {
        addToCart(dish.id);
    });
}

renderDetails();