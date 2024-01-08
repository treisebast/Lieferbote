async function init() {
    await includeHTML();
    renderDishs();
    checkShoppingBasket();
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


function renderDishs() {
    renderMenu('appetizers');
    renderMenu('mainDishs');
}


function renderMenu(option) {
    let menuCard = document.getElementById(option + 'Container');
    menuCard.innerHTML = "";
    let dishesArray = option === 'appetizers' ? appetizers : mainDishs;
    for (let i = 0; i < dishesArray.length; i++) {
        let dish = dishesArray[i];
        let { dishName, dishDescription, dishPrice } = processDish(dish);
        menuCard.innerHTML += generateHtmlRenderDish(dishName, dishDescription, dishPrice, i, option);
    }
}


function processDish(dish) {
    let dishName = dish["dishName"];
    let dishDescription = dish["description"];
    let dishCount = dish["count"];
    let dishPrice = dish["price"].toFixed(2).replace(".", ",") + "€";
    return { dishName, dishDescription, dishCount, dishPrice };
}


function generateHtmlRenderDish(dishName, dishDescription, dishPrice, i, category) {
    return `
        <div class="dish-card-addIcon" data-category="${category}">
            <div class="dish-card">
                <h3 class="dish-name">${dishName}</h3>
                <span>${dishDescription}</span>
                <span class="dish-price">${dishPrice}</span>
            </div>
            <span class="material-symbols-outlined mso-add-circle" onclick="addToShoppingBasket(${i}, '${category}')">add_circle</span>
        </div>`;
}


function addToShoppingBasket(i, category) {
    let selectedDish = category === 'appetizers' ? appetizers[i] : mainDishs[i];
    let existingDish = shoppingBasket.find((dish) => dish.dishName === selectedDish.dishName);
    if (existingDish) {
        existingDish.count++;
    } else {
        selectedDish.count++;
        shoppingBasket.push(selectedDish);
    }
    udateElements();
}


function renderShoppingBasket() {
    let basketContainer = document.getElementById("shoppingBasket");
    basketContainer.innerHTML = "";
    for (let i = 0; i < shoppingBasket.length; i++) {
        let currentDish = shoppingBasket[i];
        let { dishName, dishDescription, dishCount, dishPrice } = processDish(currentDish);
        basketContainer.innerHTML += generateHtmlRenderShoppingBasket(dishName, dishDescription, dishCount, dishPrice, i);
    }
}


function generateHtmlRenderShoppingBasket(dishName, dishDescription, dishCount, dishPrice, i) {
    return `
            <div class = "sb-dish-card-addIcon">
                <div class = "sb-name-price">
                    <h3 class = "sb-dish-name">${dishName}</h3>
                    <span class = "sb-dish-price">${dishPrice}</span>
                </div>
                <div class = "sb-add-remove-update">
                    <div class ="update-count">
                        <span class ="counter">Anzahl: </span> <span id ="sbCount${i}" class = "sbCount">${dishCount}</span>
                        <span class="material-symbols-outlined mso-circle-sb" onclick ="updateCount('remove${i}', ${i}, ${dishCount})">do_not_disturb_on</span>
                        <span class="material-symbols-outlined mso-circle-sb" onclick ="updateCount('add${i}', ${i}, ${dishCount})">add_circle</span>
                    </div>     
                    
                    <span class="material-symbols-outlined mso-circle-sb" onclick="removeItem(${i})">delete</span>    
                </div>
            </div>`;
}


// Update Counter from Item
function updateCount(action, i, dishCount) {
    if (action === "remove" + `${i}` && dishCount > 1) {
        shoppingBasket[i].count--;
    } else if (action === "add" + `${i}`) {
        shoppingBasket[i].count++;
    }
    udateElements();
}


// Delete Item from Basket
function removeItem(i) {
    shoppingBasket[i].count = 0;
    shoppingBasket.splice(i, 1);
    if (shoppingBasket.length === 0) {
        returnBasketContainer();
    } else {
        renderShoppingBasket();
    }
    calculateTotalAmount();
    checkShoppingBasket();
}


function returnBasketContainer(){
    let basketContainer = document.getElementById("shoppingBasket");
    basketContainer.innerHTML = `
        <div class="shopping-basket">
            <span class="material-symbols-outlined mso-shopping_bag">shopping_bag</span>
            <h2>Fülle deinen Warenkorb</h2>
            <span class="text-align">Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</span>
        </div>`;
}


// DialogModal for beginn delivery or collection
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('overlay').style.display = 'flex';
});

function closeDialog() {
    document.getElementById('overlay').style.display = 'none';
}


let deliveryOption;

function setDeliveryOption(option) {
    deliveryOption = option;
    if (deliveryOption === "delivery") {
        document.getElementById("delivery").style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.getElementById("collection").style.backgroundColor = "";
    } else {
        document.getElementById("collection").style.backgroundColor = "rgba(0, 0, 0, 0.25)";
        document.getElementById("delivery").style.backgroundColor = '';
    }
    howMuchCostDeliveryCollection();
    checkShoppingBasket();
}


//Versand oder Lieferung
function howMuchCostDeliveryCollection(){
    let cdCost = document.getElementById('cdCost');
    if (deliveryOption === 'delivery') {
        let costs = 3.95;
        let cost = costs.toFixed(2).replace('.', ',');
        cdCost.innerHTML = `
            <span>zzgl. Lieferung</span>
            <span>${cost}€</span>`;
    } else {
        let costs = 0;
        let cost = costs.toFixed(2).replace('.', ',');
        cdCost.innerHTML = `
            <span>Abholung</span>
            <span>${cost}€</span>`;
    }
    calculateTotalAmount();
}


// Preisrechner
function calculateTotalAmount() {
    let pricePlace = document.getElementById('totalAmount');
    let amount = calculateBill();
    let totalAmount;
    if (deliveryOption === 'delivery') {
        totalAmount = amount + 3.95;
    } else {
        totalAmount = amount;
    }
    pricePlace.innerHTML = `${totalAmount.toFixed(2).replace('.',',')}€`;
}


function calculateBill(){
    return shoppingBasket.reduce((total, dish) => total + dish.count * dish.price, 0);
}


// Open ConfirmModal
function openOrderConfirmation() {
    resetDishCounts();
    document.getElementById('orderConfirmationModal').style.display = 'block';
    shoppingBasket = [];
    udateElements(); 
}


//Zurücksetzen der Counts der Gerichte
function resetDishCounts() {
    for (let i = 0; i < mainDishs.length; i++) {
        mainDishs[i].count = 0;
    }
    for (let j = 0; j < appetizers.length; j++) {
        appetizers[j].count = 0;
    }
}


//Update mehrerer Funktionen
function udateElements(){
    renderShoppingBasket();
    calculateTotalAmount();
    checkShoppingBasket(); 
}


// Close ConfirmModal
function closeOrderConfirmationModal() {
    document.getElementById('orderConfirmationModal').style.display = 'none';
    returnBasketContainer();
}


// Abled / Disabled Button
function checkShoppingBasket() {
    let openOrderConfirmationBtn = document.getElementById('openOrderConfirmationBtn');
    let msoSCC = document.getElementById('msoSCC');
    if (!(shoppingBasket.length > 0) || calculateBill() < 30) {
        openOrderConfirmationBtn.disabled = true;
        openOrderConfirmationBtn.classList.remove('btn-total-amount-hover');
        msoSCC.style.color = "rgba(0, 0, 0, 0.3)";
    }
    if (calculateBill() > 30) {
        disabledTheBuyButtonEffects(openOrderConfirmationBtn);
    }
    if (deliveryOption === 'collection') {
        disabledTheBuyButtonEffects(openOrderConfirmationBtn);
    }
}


function disabledTheBuyButtonEffects(openOrderConfirmationBtn){
    openOrderConfirmationBtn.disabled = false;
    openOrderConfirmationBtn.classList.add('btn-total-amount-hover');
    msoSCC.style.color = "black";
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
    filterAppetizers(search);
    filterMainDishs (search);
}


function filterAppetizers(search){
    let appetizersContainer = document.getElementById("appetizersContainer");
    appetizersContainer.innerHTML = "";
    for (let i = 0; i < appetizers.length; i++) {
        let appetizer = appetizers[i];
        if (isDishMatchingSearch(appetizer, search)) {
            let { dishName, dishDescription, dishPrice } = processDish(appetizer);
            appetizersContainer.innerHTML += generateHtmlRenderDish(dishName, dishDescription, dishPrice, i);
        }
    }
}


function filterMainDishs (search){
    let mainDishsContainer = document.getElementById("mainDishsContainer");
    mainDishsContainer.innerHTML = "";
    for (let j = 0; j < mainDishs.length; j++) {
        let mainDish = mainDishs[j];
        if (isDishMatchingSearch(mainDish, search)) {
            let { dishName, dishDescription, dishPrice } = processDish(mainDish);
            mainDishsContainer.innerHTML += generateHtmlRenderDish(dishName, dishDescription, dishPrice, j);
        }
    }
}


function isDishMatchingSearch(dish, search) {
    return dish.dishName.toLowerCase().includes(search);
}


//Menu / Warenkorb responsiv
function toggleShoppingCart() {
    var shoppingCard = document.getElementById('shoppingCard');
    var isHidden = shoppingCard.classList.contains('respon-hidden');
    if (isHidden) {
        shoppingCard.classList.remove('respon-hidden');
    } else {
        shoppingCard.classList.add('respon-hidden');
    }
}