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
    let dishCount = mainDish['count'];
    let dishPrice = mainDish["price"].toFixed(2).replace('.', ',') + '€';
    return { dishName, dishDescription,dishCount, dishPrice };
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
        let { dishName, dishDescription, dishCount, dishPrice } = processMainDish(mainDish);
        basketContainer.innerHTML += generateHtmlRenderShoppingBasket(dishName, dishDescription, dishCount, dishPrice, i);
    }
}

function generateHtmlRenderShoppingBasket(dishName, dishDescription, dishCount, dishPrice, i){
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

function updateCount(action, i, dishCount) {
    if ((action === 'remove'+`${i}`) && dishCount > 1) {
        shoppingBasket[i].count--;
    } else if (action === 'add'+`${i}`) {
        shoppingBasket[i].count++;
    }
    renderShoppingBasket();
    calculateTotalAmount();
}

function removeItem(i) {
    shoppingBasket[i].count = 0;
    shoppingBasket.splice(i, 1);
    if (shoppingBasket.length === 0) {
        let basketContainer = document.getElementById('shoppingBasket');
        basketContainer.innerHTML = `
            <div class="shopping-basket">
                <span class="material-symbols-outlined mso-shopping_bag">shopping_bag</span>
                <h2>Fülle deinen Warenkorb</h2>
                <span class="text-align">Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</span>
            </div>`; 
    } else {
        renderShoppingBasket(); 
    }
}




let deliveryOption = 'liefern'; // Standardmäßig Lieferung ausgewählt

function setDeliveryOption(option) {
    deliveryOption = option;
}

function calculateTotalAmount() {
    // Überprüfung des Mindestbestellwerts nur für Lieferung
    if (deliveryOption === 'liefern') {
        let totalAmount = shoppingBasket.reduce((total, dish) => total + dish.count * dish.price, 0);

        if (totalAmount < 20) {
            alert("Mindestbestellwert nicht erreicht. Bitte bestellen Sie mindestens im Wert von 20€ für die Lieferung.");
            return;
        }
    }

    // Berechnung des Gesamtpreises mit Lieferkosten, falls Lieferung ausgewählt wurde
    let totalAmount = shoppingBasket.reduce((total, dish) => total + dish.count * dish.price, 0);
    if (deliveryOption === 'liefern') {
        totalAmount += 3.95; // Lieferkosten
    }

    // Aktualisierung des Gesamtpreis-Containers
    let totalAmountContainer = document.getElementById('totalAmountContainer');
    let totalAmountSpan = totalAmountContainer.querySelector('#totalAmount');
    totalAmountSpan.textContent = `${totalAmount.toFixed(2)}€`;

    alert(`Gesamtbetrag: ${totalAmount.toFixed(2)}€`);
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
