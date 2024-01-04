async function init() {
    await includeHTML();
    await renderMenu();
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

async function renderMenu() {
    let menuCard = document.getElementById("menuCard");
    menuCard.innerHTML = "";
    for (let i = 0; i < mainDishs.length; i++) {
        let mainDish = mainDishs[i];
        let dishName = mainDish["mainDish"];
        let dishDescription = mainDish["description"];
        let dishPrice = mainDish["price"];
        let dishCount = mainDish["count"];
        console.log(dishName);
        menuCard.innerHTML += `
            <div class = "dish-card">
                <span>${dishName}</span>
                <span>${dishDescription}</span>
                <span>${dishPrice}</span>
            </div>
            `;
    }
}

window.onscroll = function () {
    let shoppingCard = document.getElementById("shoppingCard");
    shoppingCard.style.top = `${Math.max(0, 80 - window.scrollY)}px`;
};

// Search-Filter:
function filterNames() {
    let search = document.getElementById(`inputField`).value.trim().toLowerCase();
    let content = document.getElementById("content");
    content.innerHTML = "";
    for (let i = 0; i < pokemons.length; i++) {
        let pokemon = pokemons[i];
        let pokemonName = pokemon["name"].toLowerCase();
        let pokemonNumber = pokemon["id"].toString();
        if (pokemonName.includes(search) || pokemonNumber.includes(search)) {
            content.innerHTML += generateHtmlRenderPokemon(i);
            renderPokemonElement(pokemon, i, "");
        }
    }
}
