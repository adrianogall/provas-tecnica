
/*###########################################
    SCRIPT - Prova Técnica | Adriano Gall
###########################################*/


//Variáveis iniciais
var numPage = 1,
    qntPage = 20,
    Xmlhttp = new XMLHttpRequest(),
    arqJsonProd = "../../project/files/mock-products.json",
    getParamUrl = getParamUrl(),
    filter = "valor-desc",
    urlInitial = true;
    
//Verifica de tem parâmetros de filtros passados na url no carregamento da página
if(getParamUrl.hasOwnProperty('q')){  

    urlInitial = false;
    filter = getParamUrl.q;
    window.document.getElementById("change-filter").value = filter;
    
    if(getParamUrl.hasOwnProperty('page'))
        numPage = getParamUrl.page;
} 

//Função que inicia a sessão de produtos.
setStorageListProd();

//Função start para as funcinalidades de filtro e paginação
function getStartListProd(filter, numPage){
    objJsonProd = localStorage.getItem('objJsonProd');
    objJsonProd = JSON.parse(objJsonProd).products;
    orderFilterJson(objJsonProd, filter, numPage);
    setUrlFilter(filter, numPage); 
}

//Faz leitura do arquivo json e salva a lista de produtos em sessão
function setStorageListProd(){ 

    Xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            localStorage.setItem("objJsonProd", this.responseText);
            getStartListProd(filter, numPage);                   
        }
    };
    Xmlhttp.open("GET", arqJsonProd, true);
    Xmlhttp.send();    
}    

//Atualiza os parâmetros na url
function setUrlFilter(filter, numPage){
    window.history.replaceState('', '', window.location.href.split('?')[0] + "?q=" + filter + "&page=" + numPage);
}

//Contrutor da listagem de produtos
function constListProducts(arrProd, numPage) {

    var htmlListProd = "",
        targetProd = parseInt(numPage-1) * parseInt(qntPage),
        i2 = 0;

    for(var i = 0; i < arrProd.length; i++) {
        if(targetProd <= i && i2 < qntPage){
            htmlListProd += `<li>
                                <div class="cont">
                                    <a class="link" href="javascript:void(0)" title="` + arrProd[i].name + `" class="` + arrProd[i].name+`"></a>
                                    <div class="thumb"><img alt="` + arrProd[i].name + `" title="` + arrProd[i].name + `" src="` + arrProd[i].image + `"></div>
                                    <div class="desc">
                                        <h3>` + arrProd[i].name + `</h3>
                                        <p> <span>R$ ` + numberToReal(arrProd[i].price); + `</span></p>
                                    </div>
                                </div>
                            </li>`;
            i2++;
        }                       
    }
    document.getElementById("list-products").innerHTML = htmlListProd;
}

//Busca os parâmetros da url para executar alistagem de produtos
function getParamUrl(){

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
        contrPag = parseInt(qntTotal-1) / parseInt(qntPage);
        
    for(var i = 1; i <= Math.ceil(contrPag); i++) {
        if(numPage == i)
            htmlListPag += `<li class="active"><span>` + i + `</span></li>`;
        else
            htmlListPag += `<li><a href="javascript:void(0)" onClick="getStartListProd('` + filter + `',` + i + `);">` + i + `</a></li>`;             
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

function numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}