const elements = {
    bannerShopBtn: document.querySelector(".hero .banner button"),
    cartBtn: document.querySelector(".navbar div.cart-btn"),
    totalCarts: document.querySelector(".navbar div.cart-btn .cart-items"),
    cartOverlay: document.querySelector(".cart-overlay"),
    domCart: document.querySelector(".cart-overlay .cart"),
    closeCart: document.querySelector(".cart-overlay .cart .close-cart"),
    clearCartBtn: document.querySelector(".cart-overlay .cart .clear-cart"),
    totalCartsPrices: document.querySelector(".cart .cart-total"),

    productsContainer: document.querySelector(".products .products-center"),
    cartsContainer: document.querySelector(".cart-overlay .cart .cart-content"),
    domMessage: document.querySelector(".message"),
};

const state = { products: null, UI: null, storage: null, carts: [] };

const setState = (update = {}, prevState = state || {}) => Object.assign(prevState, update);

class Products {
    async getProducts() {
        this.products = [
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
        const { carts } = state;

        let totalPrices = carts.reduce((acc, { price, amount }) => price * amount + acc, 0);

        elements.totalCartsPrices.textContent = totalPrices.toFixed(2);

        elements.totalCarts.textContent = carts.reduce((acc, { amount }) => acc + amount, 0);
    }

    removeCart(id) {
        const { storage, UI } = state;

        setState({ carts: state.carts.filter(({ id: cartID }) => cartID !== id) });

        document.querySelector(`.cart #cart-${id}`)?.remove();

        storage.addCartsToLocal(state.carts);

        UI.calcTotalCartsPrice();

        const domProductAddBtn = document.querySelector(`button[data-id*="${id}"]`);
        domProductAddBtn.textContent = "";
        domProductAddBtn.insertAdjacentHTML("afterbegin", `<i class="fas fa-shopping-cart"></i> add to bag`);
    }

    timeout;
    sweetAlert(message = "") {
        elements.domMessage.textContent = message;

        elements.domMessage.classList.add("show-message");

        this.timeout && clearTimeout(this.timeout);

        this.timeout = setTimeout(_ => elements.domMessage.classList.remove("show-message"), 1500);
    }
}

class Storage {
    addCartsToLocal(carts) {
        localStorage.setItem("carts", JSON.stringify(carts));
    }

    getLocalCarts() {
        const { UI } = state;

        setState({ carts: JSON.parse(localStorage.getItem("carts")) || [] });

        state.carts.forEach(cart => {
            UI.renderCart(cart);

            document.querySelector(`button[data-id*="${cart.id}"]`).textContent = "Cart in bag";
        });

        UI.calcTotalCartsPrice();
    }
}

elements.bannerShopBtn.addEventListener("click", _ => {
    document.querySelector(".products").scrollIntoView({ behavior: "smooth" });
});

document.addEventListener("click", ({ target }) => {
    const { cartBtn, closeCart, cartOverlay, domCart } = elements;

    const selectorsGroup = [
        `.${closeCart.classList[0]}`,
        `.${cartBtn.classList[0]}`,
        `.${cartOverlay.classList[0]}`,
    ];

    if (!target.matches(selectorsGroup.join())) return;

    cartOverlay.classList.toggle("transparentBcg");

    domCart.classList.toggle("show-cart");
});

document.addEventListener("DOMContentLoaded", async _ => {
    setState({ products: new Products(), UI: new UI(), storage: new Storage() });

    await state.products.getProducts();

    state.products.products.forEach(state.UI.renderProduct);

    state.storage.getLocalCarts();
});

elements.productsContainer.addEventListener("click", async ({ target }) => {
    if (!target.matches("button[data-id]")) return;

    const { carts, UI, storage, products: { products } = {} } = state;

    let { id: domProductID } = target.dataset;

    const product = products.find(({ id }) => id === domProductID);

    let isCartPresent = carts.some(({ id }) => id === domProductID);

    if (isCartPresent) return UI.sweetAlert(`"${product.title}" Product is Already in the Bag!`);

    const newCart = { ...product, amount: 1 };

    UI.renderCart(newCart);

    setState({ carts: [...carts, newCart] });

    storage.addCartsToLocal(state.carts);

    UI.calcTotalCartsPrice();

    UI.sweetAlert(`"${product.title}" Product added successfully`);

    target.textContent = "Cart in bag";

    elements.cartOverlay.classList.add("transparentBcg");

    elements.domCart.classList.add("show-cart");
});

elements.domCart.addEventListener("click", ({ target }) => {
    if (target.matches(`.${elements.clearCartBtn.classList[0]}`)) {
        localStorage.clear();
        location.reload();
    }

    const { carts, UI, storage } = state;

    let domCart = target.closest(".cart-item");

    if (!domCart) return;

    const [, id] = domCart?.id.split("-") || [];

    const domAmount = domCart?.querySelector(".item-amount");

    const cart = carts.find(({ id: cartID }) => cartID === id);

    if (target.matches(".remove-item")) {
        !UI.removeCart(id);
        return UI.sweetAlert(`"${cart.title}" Deleted Successfully!`);
    }

    if (target.matches(".fa-chevron-up")) {
        domAmount.textContent = ++cart.amount;

        storage.addCartsToLocal(carts);

        UI.calcTotalCartsPrice();
    }

    if (target.matches(".fa-chevron-down")) {
        domAmount.textContent = --cart.amount;

        if (cart.amount <= 0) {
            UI.removeCart(id);
            return UI.sweetAlert(`"${cart.title}" Deleted Successfully!`);
        }

        storage.addCartsToLocal(carts);

        UI.calcTotalCartsPrice();
    }
});
