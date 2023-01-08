
checkoutProcess();
modalCardHandler();

function checkoutProcess(){
    let br = document.createElement("br");
    let chartList = allStorage();
    let chartObjects = makeChart(chartList);
    let modalBody = document.getElementById("checkout-chart");
    let cartCount = document.getElementById("chartCount")
    let totalPrice = document.getElementById("totalPrice");
    totalPrice.innerHTML="";
    totalPrice.append(countTotalPrice(chartObjects).toFixed(2) + "$")
    cartCount.innerHTML="";
    cartCount.append(chartObjects.length)
    modalBody.innerHTML = "";
    chartObjects.forEach(chartObject => {
        console.log(chartObject)
        var par = document.createElement("p");
        par.append(chartObject.title)
        var span = document.createElement("SPAN");
        span.setAttribute("class", "price");
        span.append(chartObject.price);
        par.append(span);
        modalBody.append(par);

        modalBody.append(br)
    })
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
function modalCardHandler(){
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
      });
      let card = document.getElementById("card");
      card.addEventListener("click", modalCarBuilder)
}
async function modalCarBuilder(){

}

function localStorageSet(key, value) { localStorage.setItem(key, value); }
function localStorageGet(key) { return localStorage.getItem(key); }
function localStorageRemove(key) { return localStorage.removeItem(key); }
function allStorage() {

    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push( localStorage.getItem(keys[i]) );
    }

    return values;
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