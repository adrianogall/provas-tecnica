
/*
    
*/


//Variáveis iniciais
var numPage = 1,
    qntPage = 20,
    xmlhttp = new XMLHttpRequest(),
    url = "../../project/files/mock-products.json",
    getUrl = getUrl(),
    filter= "valor-desc";
    
//Verifica de tem parâmetros de filtros passados na url no carregamento da página
if(getUrl.hasOwnProperty('q')){  

    filter = getUrl.q;
    if(getUrl.hasOwnProperty('page'))
        numPage = getUrl.page;
} 

getStartListProd(filter,numPage);

//Faz leitura do arquivo json e inicia a construção do filtro
function getStartListProd(filter, numPage){

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            objJsonProd = JSON.parse(this.responseText).products;
            orderFilterJson(objJsonProd, filter, numPage);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}    

//Contrutor da listagem de produtos
function constListProducts(arrProd, numPage) {

    var htmlListProd = "",
        targetProd = parseInt(numPage) * parseInt(qntPage),
        i2 = 0;

    for(var i = 0; i < arrProd.length; i++) {
        if(targetProd < i && i2 < qntPage){
            htmlListProd += `<li>
                                <div class="cont">
                                    <a class="link" href="javascript:void(0)" title="`+arrProd[i].name+`" class="`+arrProd[i].name+`"></a>
                                    <div class="thumb"><img alt="`+arrProd[i].name+`" title="`+arrProd[i].name+`" src="`+arrProd[i].image+`"></div>
                                    <div class="desc">
                                        <h3>`+arrProd[i].name+`</h3>
                                        <p> <span>`+arrProd[i].price+`</span></p>
                                    </div>
                                </div>
                            </li>`;
            i2++;
        }                       
    }
    document.getElementById("list-products").innerHTML = htmlListProd;
}

//Busca os parâmetros da url para executar alistagem de produtos
function getUrl(){

    var query = location.search.slice(1);
    var partes = query.split('&');
    var data = {};

    partes.forEach(function (parte) {
        if(parte != ''){
            var chaveValor = parte.split('=');
            var chave = chaveValor[0];
            var valor = chaveValor[1];
            data[chave] = valor;
        }            
    });
    return data;
}

//Contrutor da paginação
function constPaginator(objList, filter, numPage){

    var qntTotal = Object.keys(objList).length,
        htmlListPag = "",
        contrPag = parseInt(qntTotal) / parseInt(qntPage);
        
    for(var i = 1; i < contrPag; i++) {
        if(numPage == i)
            htmlListPag += `<li class="active"><span>`+i+`</span></li>`;
        else
            htmlListPag += `<li><a href="javascript:void(0)" onClick="getStartListProd('`+filter+`',`+i+`);">`+i+`</a></li>`;             
    }
    document.getElementById("pag-prod-nav").innerHTML = htmlListPag;
}

//Ordena o abjeto de produtos de acordo com o filtro
function orderFilterJson(objList, filter, numPage){ 

    var arrFilter = filter.split('-');
    objList.sort(dynamicSort(arrFilter));   
    var arrProd = Object.values(objList);
    
    //Construtor da listagem de produtos
    constListProducts(arrProd, numPage);
    
    //Construtor da paginação
    constPaginator(objList, filter, numPage);
}

//Ordena o object de produtos conforme os parâmetros passados
function dynamicSort(arrtFilter) {

    var sortOrder = 1;
    if(arrtFilter[0] === "-") {
        sortOrder = -1;
        arrtFilter = arrtFilter.substr(1);
    }

    return function (a,b) {
        if(arrtFilter[1] == 'asc')
            var result = (a[arrtFilter[0]] < b[arrtFilter[0]]) ? -1 : (a[arrtFilter[0]] > b[arrtFilter[0]]) ? 1 : 0;
        else
            var result = (a[arrtFilter[0]] > b[arrtFilter[0]]) ? -1 : (a[arrtFilter[0]] < b[arrtFilter[0]]) ? 1 : 0;
        return result * sortOrder;
    }
}