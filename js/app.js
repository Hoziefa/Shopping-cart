const elements = {
    bannerShopBtn: document.querySelector(".hero .banner button"),
    cartBtn: document.querySelector(".navbar div.cart-btn"),
    totalCarts: document.querySelector(".navbar div.cart-btn .cart-items"),
    cartOverlay: document.querySelector(".cart-overlay"),
    cart: document.querySelector(".cart-overlay .cart"),
    closeCart: document.querySelector(".cart-overlay .cart .close-cart"),
    clearCartBtn: document.querySelector(".cart-overlay .cart .clear-cart"),
    totalCartsPrices: document.querySelector(".cart .cart-total"),

    productsContainer: document.querySelector(".products .products-center"),
    cartsContainer: document.querySelector(".cart-overlay .cart .cart-content"),
};

const state = {};

let carts = [];

class Products {
    async getProducts() {
        this.items = [
            {
                sys: {
                    id: "1",
                },
                fields: {
                    title: "queen panel bed",
                    price: 10.99,
                    image: {
                        fields: {
                            file: {
                                url: "./images/product-one.jpeg",
                            },
                        },
                    },
                },
            },
            {
                sys: {
                    id: "2",
                },
                fields: {
                    title: "king panel bed",
                    price: 12.99,
                    image: {
                        fields: {
                            file: {
                                url: "./images/product-two.jpeg",
                            },
                        },
                    },
                },
            },
            {
                sys: {
                    id: "3",
                },
                fields: {
                    title: "single panel bed",
                    price: 12.99,
                    image: {
                        fields: {
                            file: {
                                url: "./images/product-three.jpeg",
                            },
                        },
                    },
                },
            },
            {
                sys: {
                    id: "4",
                },
                fields: {
                    title: "twin panel bed",
                    price: 22.99,
                    image: {
                        fields: {
                            file: {
                                url: "./images/product-four.jpeg",
                            },
                        },
                    },
                },
            },
            {
                sys: {
                    id: "5",
                },
                fields: {
                    title: "fridge",
                    price: 88.99,
                    image: {
                        fields: {
                            file: {
                                url: "./images/product-five.jpeg",
                            },
                        },
                    },
                },
            },
            {
                sys: {
                    id: "6",
                },
                fields: {
                    title: "dresser",
                    price: 32.99,
                    image: {
                        fields: {
                            file: {
                                url: "./images/product-six.jpeg",
                            },
                        },
                    },
                },
            },
            {
                sys: {
                    id: "7",
                },
                fields: {
                    title: "couch",
                    price: 45.99,
                    image: {
                        fields: {
                            file: {
                                url: "./images/product-seven.jpeg",
                            },
                        },
                    },
                },
            },
            {
                sys: {
                    id: "8",
                },
                fields: {
                    title: "table",
                    price: 33.99,
                    image: {
                        fields: {
                            file: {
                                url: "./images/product-eight.jpeg",
                            },
                        },
                    },
                },
            },
        ].map(({ sys: { id }, fields: { title, price, image: { fields: { file: { url } } } } }) => ({
            id,
            title,
            price,
            url,
        }));
    }
}

class UI {
    renderProduct({ id, title, price, url }) {
        let markup = `
        <article class="product" id="${id}">
            <div class="img-container">
                <img src="${url}" alt="${title}" class="product-img" />

                <button class="bag-btn" data-id="${id}">
                    <i class="fas fa-shopping-cart"></i> add to bag
                </button>
            </div>

            <h3>${title}</h3>
            <h4>$${price}</h4>
        </article>
    `;

        elements.productsContainer.insertAdjacentHTML("beforeend", markup);
    }

    renderCart({ id, title, price, url, amount }) {
        let markup = `
        <div class="cart-item" id="cart-${id}">
            <img src="${url}" alt="${title}" />

            <div>
                <h4>${title}</h4>
                <h5>$${price}</h5>
                <span class="remove-item">remove</span>
            </div>

            <div>
                <i class="fas fa-chevron-up"></i>
                <p class="item-amount">${amount}</p>
                <i class="fas fa-chevron-down"></i>
            </div>
        </div>
    `;

        elements.cartsContainer.insertAdjacentHTML("beforeend", markup);
    }

    calcTotalCartsPrice() {
        let totalPrices = carts.reduce((acc, { price, amount }) => price * amount + acc, 0).toFixed(2);

        elements.totalCartsPrices.textContent = totalPrices;

        elements.totalCarts.textContent = carts.reduce((acc, { amount }) => acc + amount, 0);
    }

    removeCart(id) {
        carts = carts.filter(({ id: cartID }) => cartID !== id);

        document.querySelector(`.cart #cart-${id}`)?.remove();

        state.storage.addCartsToLocal(carts);

        state.UI.calcTotalCartsPrice();

        const domProductAddBtn = document.querySelector(`button[data-id*="${id}"]`);
        domProductAddBtn.textContent = "";
        domProductAddBtn.insertAdjacentHTML("afterbegin", `<i class="fas fa-shopping-cart"></i> add to bag`);
    }
}

class Storage {
    addCartsToLocal(carts) {
        localStorage.setItem("carts", JSON.stringify(carts));
    }

    getLocalCarts() {
        carts = JSON.parse(localStorage.getItem("carts")) || [];

        carts.forEach(cart => {
            state.UI.renderCart(cart);

            document.querySelector(`button[data-id*="${cart.id}"]`).textContent = "Cart in bag";
        });

        state.UI.calcTotalCartsPrice();
    }
}

elements.bannerShopBtn.addEventListener("click", _ => {
    document.querySelector(".products").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("click", ({ target }) => {
    const { cartBtn, closeCart, cartOverlay, cart } = elements;

    const selectorsGroup = [
        `.${closeCart.classList[0]}`,
        `.${cartBtn.classList[0]}`,
        `.${cartOverlay.classList[0]}`,
    ];

    if (!target.matches(selectorsGroup.join())) return;

    cartOverlay.classList.toggle("transparentBcg");
    cart.classList.toggle("showCart");
});

document.addEventListener("DOMContentLoaded", async _ => {
    if (!state.products) state.products = new Products();
    if (!state.UI) state.UI = new UI();
    if (!state.storage) state.storage = new Storage();

    await state.products.getProducts();

    state.products.items.forEach(state.UI.renderProduct);

    state.storage.getLocalCarts();
});

elements.productsContainer.addEventListener("click", async ({ target }) => {
    if (!target.matches("button[data-id]")) return;

    let { id: domProductID } = target.dataset;

    let isCartPresent = carts.some(({ id }) => id === domProductID);
    if (isCartPresent) return;

    const product = state.products.items.find(({ id }) => id === domProductID);
    const newCart = { ...product, amount: 1 };

    state.UI.renderCart(newCart);

    carts.push(newCart);

    state.storage.addCartsToLocal(carts);

    state.UI.calcTotalCartsPrice();

    target.textContent = "Cart in bag";

    elements.cartOverlay.classList.add("transparentBcg");
    elements.cart.classList.add("showCart");
});

elements.cart.addEventListener("click", ({ target }) => {
    if (target.matches(`.${elements.clearCartBtn.classList[0]}`)) {
        localStorage.clear();
        location.reload();
    }

    let domCart = target.closest(".cart-item");

    if (!domCart) return;

    const [, id] = domCart?.id.split("-") || [];

    const domAmount = domCart?.querySelector(".item-amount");

    const cart = carts.find(({ id: cartID }) => cartID === id);

    if (target.matches(".remove-item")) return state.UI.removeCart(id);

    if (target.matches(".fa-chevron-up")) {
        domAmount.textContent = ++cart.amount;

        state.storage.addCartsToLocal(carts);
        state.UI.calcTotalCartsPrice();
    }

    if (target.matches(".fa-chevron-down")) {
        domAmount.textContent = --cart.amount;

        cart.amount <= 0 && state.UI.removeCart(id);

        state.storage.addCartsToLocal(carts);
        state.UI.calcTotalCartsPrice();
    }
});
