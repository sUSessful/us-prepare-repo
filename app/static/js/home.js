async function addimage(image_src, productImage) {
    const image = document.createElement("img");
    image.src = image_src;
    image.height = 50;
    productImage.appendChild(image);
}

async function messageBoxClient(message) {
    const message_box = document.createElement("div");
    message_box.classList.add("info-box");
    const text_inner = document.createElement("p");
    text_inner.innerHTML = message;
    message_box.appendChild(text_inner);
    const button_destroy = document.createElement("button");
    button_destroy.innerHTML = "OK";
    button_destroy.addEventListener("click", async function() {
        while (message_box.firstChild) {
            message_box.removeChild(message_box.firstChild);

        }
        message_box.remove();
    });
}

function renderProductCardHome(product) {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const productImage = document.createElement("div");
    productImage.classList.add("product-image");
    //addimage(product.image, productImage);
    productCard.appendChild(productImage);

    const productName = document.createElement("p");
    productName.textContent = product.name;
    productCard.appendChild(productName);

    const productPrice = document.createElement("p");
    productPrice.textContent = `Price: ${product.price} ${product.currency}`;
    productCard.appendChild(productPrice);

    const productBrand = document.createElement("p");
    productBrand.textContent = `Brand: ${product.brand}`;
    productCard.appendChild(productBrand);

    let buy = document.createElement("button");
    buy.classList.add("button-buy");
    buy.setAttribute("id", product._id);
    buy.setAttribute("name", product.name);
    buy.innerHTML = "Buy";
    eventClickedItemHome(buy);
    productCard.appendChild(buy);
    return productCard;
}

async function eventClickedItemHome(itemClick) {
    // Clear item click view
    itemClick.addEventListener("click", async function() {
        const workspaceContainer = document.querySelector(".main-workspace-container-header");
        while (workspaceContainer.firstChild) {
            workspaceContainer.removeChild(workspaceContainer.firstChild);
        }

        // Item click
        const item = document.createElement("div");
        item.classList.add("item-view-container");

        const barbutton = document.createElement("div");
        barbutton.classList.add("item-view-container-line-button");

        let itemButtonClose = document.createElement("button");
        itemButtonClose.classList.add("button-close-item-view");
        const imagePath = "/static/images/close.png";
        // Creating the image element
        const imageElement = document.createElement("img");
        imageElement.src = imagePath;
        itemButtonClose.appendChild(imageElement);
        itemButtonClose.addEventListener("click", function() {
            while (workspaceContainer.firstChild) {
                workspaceContainer.removeChild(workspaceContainer.firstChild);
            }
            workspaceContainer.style.height = "0px";
        });
        barbutton.appendChild(itemButtonClose);
        item.appendChild(barbutton);

        const content = document.createElement("div");
        content.classList.add("item-view-container-line");

        const itemName = document.createElement("p");
        itemName.innerHTML = itemClick.getAttribute("name");
        content.appendChild(itemName);

        const item_id = itemClick.getAttribute("id");
        const itemDescription = document.createElement("p");
        fetch('/description_get', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id })
            })
            .then(response => response.json())
            .then(description => {
                itemDescription.textContent = description;
                content.appendChild(itemDescription);
            });

        item.appendChild(content);
        const barButtonCard = document.createElement("div");
        barButtonCard.classList.add("item-view-container-line-button-cart");

        let buttonCart = document.createElement("button");
        buttonCart.classList.add("button-cart");
        buttonCart.innerHTML = "Add Product to Cart";
        buttonCart.addEventListener("click", async function() {
            const request = await fetch('/cart_add', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ item_id })
            });

            const response = await request.json();
            if (response.success === true) {
                while (workspaceContainer.firstChild) {
                    workspaceContainer.removeChild(workspaceContainer.firstChild);
                }
                const textMessage = document.createElement("p");
                textMessage.classList.add("item-view-container-line");
                textMessage.innerHTML = "Success";
                workspaceContainer.appendChild(textMessage);
                const buttonDestroy = document.createElement("button");
                buttonDestroy.innerHTML = "OK";
                buttonDestroy.classList.add("button-item-add-destroy");
                buttonDestroy.addEventListener("click", async function() {
                    while (workspaceContainer.firstChild) {
                        workspaceContainer.removeChild(workspaceContainer.firstChild);
                    }
                    workspaceContainer.style.height = "0px";
                });
                workspaceContainer.appendChild(buttonDestroy);
            } else {
                while (workspaceContainer.firstChild) {
                    workspaceContainer.removeChild(workspaceContainer.firstChild);
                }
                const textMessage = document.createElement("p");
                textMessage.classList.add("item-view-container-line");
                textMessage.innerHTML = "Fail";
                workspaceContainer.appendChild(textMessage);
                const buttonDestroy = document.createElement("button");
                buttonDestroy.innerHTML = "OK";
                buttonDestroy.classList.add("button-item-add-destroy");
                buttonDestroy.addEventListener("click", async function() {
                    while (workspaceContainer.firstChild) {
                        workspaceContainer.removeChild(workspaceContainer.firstChild);
                    }
                    workspaceContainer.style.height = "0px";

                });
                workspaceContainer.appendChild(buttonDestroy);
            }
        });

        barButtonCard.appendChild(buttonCart);
        item.appendChild(barButtonCard);
        workspaceContainer.appendChild(item);
        workspaceContainer.style.height = "300px";
    });
}

function renderWorkspaceHome(data_render) {
    const workspace = document.querySelector(".main-workspace-container-body");
    data_render.forEach(element => {
        const productCard = renderProductCardHome(element);
        workspace.appendChild(productCard);
    });
}

async function chatInit() {
    const chatBox = document.querySelector(".chat-box");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("mt-3", "p-3", "rounded");
    messageDiv.classList.add("bot-message");
    messageDiv.innerHTML = `<img src="static/images/icons-bot.png" class="bot-icon"><p>Please describe the product you are looking for</p>`;
    chatBox.appendChild(messageDiv);

    // Scroll the chat box to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function renderProductViewHome() {
    const response = await fetch("/product", { method: "GET" });
    const productData = await response.json();
    renderWorkspaceHome(productData);
    chatInit();
}

function changeHeightClose() {
    const box = document.querySelector(".chat-box-container");
    const chat_entry = document.querySelector(".chat-entry");
    const button_box = document.querySelector(".chat-button-bar");
    // Check the current height and toggle between 400px and 25px
    // Check the current height and toggle between 400px and 25px
    box.style.height = "33px";
    box.style.width = "350px";
    chat_entry.style.visibility = "hidden";
    button_box.style.borderBottomRightRadius = "12px";
    button_box.style.borderBottomLeftRadius = "12px";
}

function changeHeightOpen() {
    const box = document.querySelector(".chat-box-container");
    const button_box = document.querySelector(".chat-button-bar");
    const chat_entry = document.querySelector(".chat-entry");
    // Check the current height and toggle between 400px and 25px
    box.style.height = "500px";
    box.style.width = "350px";
    chat_entry.style.height = "46px";
    button_box.style.borderBottomRightRadius = "0px";
    button_box.style.borderBottomLeftRadius = "0px";
    chat_entry.style.visibility = "visible";
    chat_entry.style.marginTop = "10%"
}

function changeHeightFullScreen() {
    const box = document.querySelector(".chat-box-container");
    const button_box = document.querySelector(".chat-button-bar");
    const chat_entry = document.querySelector(".chat-entry");
    // Check the current height and toggle between 400px and 25px
    box.style.height = "800px";
    box.style.width = "600px";
    chat_entry.style.height = "46px";
    button_box.style.borderBottomRightRadius = "0px";
    button_box.style.borderBottomLeftRadius = "0px";
    chat_entry.style.visibility = "visible";
    chat_entry.style.marginTop = "50%"
}

window.addEventListener("load", renderProductViewHome);