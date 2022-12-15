
modalCardHandler();
getProducts();
getCategories();
searchProcessing();

function searchProcessing(){
    
}

async function getProducts() {
    // отправляет запрос и получаем ответ
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    const category = urlParams.get("category")
    const searchString = urlParams.get("search");
    let url = "https://fakestoreapi.com/products/";

    if(category !== null){
        url = url + "category/" + category;
    }
    

    const response = await fetch(url, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const products = await response.json();
        
        let productContainer = document.getElementById("product-list");
        let rowElements = [];

        //для поисковой строки обработка
        for(let i = 0; i < products.length; i++){
            if(searchString != null){
                if(!products[i].title.includes(searchString)){
                    continue;
                }
            }
            
            if (i % 3 == 0 && i != 0){
                productContainer.append(buildProductRow(rowElements))
                rowElements.length = 0;
            }

            rowElements.push(products[i]);

            if(i === products.length - 1){
                productContainer.append(buildProductRow(rowElements));
            }
        }
    }
    else{
        console.log("Failed to get product");
    }
}

function buildProductRow(productRow){
    const row = document.createElement("div");
    row.setAttribute("class", "row");
    productRow.forEach(product => {
        let col = document.createElement("div");
        col.setAttribute("class", "col");
        let productCard = document.createElement("div");
        productCard.setAttribute("class", "card product-card");

        const image = document.createElement("img");
        image.setAttribute("class", "card-img-top rounded mx-auto d-block");
        image.setAttribute("src", product.image);
        image.setAttribute("alt", "Card image cap");
        productCard.append(image);

        const cardBody = document.createElement("div");
        cardBody.setAttribute("class", "card-body");

        const title = document.createElement("h5");
        title.setAttribute("class", "card-title");
        title.append(product.title);
        cardBody.append(title);

        const price = document.createElement("p");
        price.append(product.price + "$");
        cardBody.append(price);
        
        const buy = document.createElement("button");

        buy.setAttribute("class", "btn btn-primary buy-link");
        buy.setAttribute("style", "color: white");
        buy.append("Buy");
        //adding onclick handler 
        buy.onclick = function() {localStorageSet(product.id, buildLocalStorageCartEntry(product))}
        cardBody.append(buy);
        productCard.append(cardBody);
        col.append(productCard);
        row.append(col);
    });
    if(productRow.length < 3){
        for(let i = 0; i < 3 - productRow.length;i++){
            let col = document.createElement("div");
            row.append(col)
        }
    }
    return row;
}

async function getCategories(){
    const response = await fetch('https://fakestoreapi.com/products/categories',{
        method: "GET",
        headers: {"Accept": "application/json" }
    });

    if(response.ok === true){
        const categories = await response.json();
        let categoriesList = document.getElementById("categories-list")
        categories.forEach(category =>{
            categoriesList.append(buildCategorieLink(category));
        });
    }
}

function buildCategorieLink(category){
    let link = document.createElement("a");
    link.setAttribute("class", "btn btn-primary category-link");
    link.setAttribute("href", "?category="+ category);
    link.setAttribute("role", "button");
    link.append(category)
    return link
}

function modalCardHandler(){
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
      });
      let card = document.getElementById("card");
      card.addEventListener("click", modalCartBuilder)
}

async function modalCartBuilder(){
    let chartList = allStorage();
    let chartObjects = makeChart(chartList);
    let modalBody = document.getElementById("modal-card-body");
    modalBody.innerHTML = "";
    let i = 1;
    chartObjects.forEach(chartElement => {
        
        let tr = document.createElement("tr");

        let thElementNumber = document.createElement("th");
        thElementNumber.setAttribute("scope", "row");
        thElementNumber.append(i);
        tr.append(thElementNumber);

        let tdProductName = document.createElement("td");

        tdProductName.append(chartElement.title);
        tr.append(tdProductName);

        let tdPrice = document.createElement("td");
        tdPrice.append(chartElement.price);
        tr.append(tdPrice);

        let tdQuantity = document.createElement("td");
        tdQuantity.append(chartElement.quantity);
        tr.append(tdQuantity);

        let tdRemove = document.createElement("td");
        let removeButton = document.createElement("button");

        removeButton.setAttribute("class", "btn btn-primary remove-chart-link");
        removeButton.setAttribute("style", "color: white");
        removeButton.append("X");

        removeButton.onclick = function() {removeFromChart(chartElement)}

        tdRemove.append(removeButton);
        tr.append(tdRemove);
        modalBody.append(tr);
        i++;
    })
    let totalPrice = countTotalPrice(chartObjects).toFixed(2) + "$";
    let totalPriceDiv = document.getElementById("totalPrice");
    totalPriceDiv.innerHTML="";
    totalPriceDiv.innerHTML = "<b>Total</b> "
    totalPriceDiv.append(totalPrice);
}

function countTotalPrice(chartObjects){
    let totalPrice = 0;
    chartObjects.forEach(x =>{
        for(let i = 0; i < x.quantity; i++){
            totalPrice +=Number(x.price.substring(0, x.price.length-1));
        }
    })
    return totalPrice;
}
function makeChart(chartList){
    var chart = [];
    chartList.forEach(x => {
        var splitResult =  x.split("  ");
        var chartElement = {
            title: splitResult[0],
            price: splitResult[1],
            quantity: splitResult[2]
        };
        chart.push(chartElement);
    });
    return chart;
}
function makeELementOfChart(chartRow){
    var splitResult = chartRow.split("  ");
    return {
        title: splitResult[0],
        price: splitResult[1],
        quantity: splitResult[2]
    };
}

function removeFromChart(chartElement){
    localStorageRemoveByPrice(chartElement.price);
    modalCartBuilder();
}

// local storage API
function localStorageSet(key, value) { localStorage.setItem(key, value); }
function localStorageGet(key) { return localStorage.getItem(key); }
function localStorageRemove(key) { return localStorage.removeItem(key); }

function localStorageRemoveByPrice(price) {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        let item = localStorage.getItem(keys[i]);
        if(item.split("  ")[1] === price){
            localStorageRemove(keys[i]);
        }
    }
}

function buildLocalStorageCartEntry(product){
    let quantity;

    if(localStorageGet(product.id) === null){
        quantity = 1;
    }
    else{
        let findedProductRow = localStorageGet(product.id);
        var quantityString = findedProductRow.split("  ").pop();
        quantity = Number(quantityString) + 1;
    }
    return product.title.substring(0, 15) + "..." + "  " + product.price + "$" + "  " + quantity
}

//getting all storage
function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]) );
    }

    return values;
}