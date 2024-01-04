async function init() {
    await includeHTML();
    renderMenu();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = "Page not found";
        }
    }
}

function renderMenu() {
    let menuCard = document.getElementById("menuCard");
    menuCard.innerHTML = "";
    for (let i = 0; i < mainDishs.length; i++) {
        let mainDish = mainDishs[i];
        let { dishName, dishDescription, dishPrice } = processMainDish(mainDish);
        menuCard.innerHTML += generateHtmlRenderMainDish(dishName, dishDescription, dishPrice, i);
    }
}

function processMainDish(mainDish) {
    let dishName = mainDish["mainDish"];
    let dishDescription = mainDish["description"];
    let dishPrice = mainDish["price"].toFixed(2).replace('.', ',') + '€';
    return { dishName, dishDescription, dishPrice };
}

function generateHtmlRenderMainDish(dishName, dishDescription, dishPrice, i){
return `
        <div class = "dish-card-addIcon">
            <div class = "dish-card">
                <h3 class = "dish-name">${dishName}</h3>
                <span>${dishDescription}</span>
                <span class = "dish-price">${dishPrice}</span>
            </div>
            <span class="material-symbols-outlined mso-add-circle" onclick ="addToShoppingBasket(${i})">add_circle</span>
        </div>`;
}

function addToShoppingBasket(i) {
    let selectedDish = mainDishs[i];
    let existingDish = shoppingBasket.find(dish => dish.mainDish === selectedDish.mainDish);  //Schlüssel für mainDishs[i][mainDish]
    if (existingDish) {
        existingDish.count++;
    } else {
        mainDishs[i]['count']++;
        shoppingBasket.push(mainDishs[i]);
    }
    renderShoppingBasket();
}

function renderShoppingBasket(){
    let basketContainer = document.getElementById('shoppingBasket');
    basketContainer.innerHTML = '';
    for (let i = 0; i < shoppingBasket.length; i++) {
        let mainDish = shoppingBasket[i];
        let { dishName, dishDescription, dishPrice } = processMainDish(mainDish);
        basketContainer.innerHTML += generateHtmlRenderShoppingBasket(dishName, dishDescription, dishPrice, i);
    }
}

function generateHtmlRenderShoppingBasket(dishName, dishDescription, dishPrice, i){
    return `
            <div class = "dish-card-addIcon">
                <div class = "dish-card">
                    <h3 class = "dish-name">${dishName}</h3>
                    <span>${dishDescription}</span>
                    <span class = "dish-price">${dishPrice}</span>
                </div>
                <span class="material-symbols-outlined mso-add-circle" onclick ="addToShoppingBasket(${i})">add_circle</span>
            </div>`;
    }

// Scrollfunktion
function isEndOfPage() {
    return window.innerHeight + window.scrollY >= document.body.scrollHeight + 50;
}

window.onscroll = function () {
    let shoppingCard = document.getElementById("shoppingCard");
    shoppingCard.style.top = `${Math.max(0, 80 - window.scrollY)}px`;

    if (isEndOfPage()) {
        shoppingCard.style.height = "calc(100vh - 150px)"; 
    } else {
        shoppingCard.style.height = "100vh";
    }
};

// Search-Filter:
function filterNames() {
    let search = document.getElementById(`inputField`).value.trim().toLowerCase();
    let menuCard = document.getElementById("menuCard");
    menuCard.innerHTML = "";
    for (let i = 0; i < mainDishs.length; i++) {
        let mainDish = mainDishs[i];
        let { dishName, dishDescription, dishPrice } = processMainDish(mainDish);
        if (dishName.includes(search)) {
            menuCard.innerHTML += generateHtmlRenderMainDish(dishName, dishDescription, dishPrice, i);
        }
    }
}
