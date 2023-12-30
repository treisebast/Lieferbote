async function init(){
    await includeHTML();
    await loadMenu();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

async function loadMenu() {
    try {
        let response = await fetch('food.json');
        let menus = await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Gerichte:', error);
    }
}

window.onscroll = function () {
    let shoppingCard = document.getElementById("shoppingCard");
    shoppingCard.style.top = `${Math.max(0, 90 - window.scrollY)}px`;
}

