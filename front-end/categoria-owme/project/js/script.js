
/*###########################################
    SCRIPT - Prova Técnica | Adriano Gall
###########################################*/


//Busca os parâmetros da url para executar alistagem de produtos
const getParameterUrl = () => {
    
    let query = location.search.slice(1);
    let partes = query.split('&');
    let data = {};

    partes.forEach(parte => {
        if(parte != ''){
            let chaveValor = parte.split('='); 
            let chave = chaveValor[0];
            let valor = chaveValor[1];
            data[chave] = valor;
        }            
    });
    return data;
}

//Variáveis iniciais
let numPage = 1;
const  qntPage = 20;
let Xmlhttp = new XMLHttpRequest();
let arqJsonProd = "../../project/files/mock-products.json";
let getParamUrl = getParameterUrl();
let filter = "valor-desc";
let urlInitial = true;
    
//Verifica de tem parâmetros de filtros passados na url no carregamento da página
if(getParamUrl.hasOwnProperty('q')){  

    urlInitial = false;
    filter = getParamUrl.q;
    window.document.getElementById("change-filter").value = filter;
    
    if(getParamUrl.hasOwnProperty('page'))
        numPage = getParamUrl.page;
} 

//Função start para as funcinalidades de filtro e paginação
const getStartListProd = (filter, numPage) => {
    
    document.getElementById("bg-loader").style.display = "block";
    objJsonProd = localStorage.getItem('objJsonProd');
    objJsonProd = JSON.parse(objJsonProd).products;
    orderFilterJson(objJsonProd, filter, numPage);
    setUrlFilter(filter, numPage);    
    document.getElementById("bg-loader").style.display = "none";
}

const request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
                return;
            }
            reject(xhr.statusText);
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};

request({url: arqJsonProd, method: 'GET'})
    .then(data => {
        localStorage.setItem("objJsonProd", data);
        getStartListProd(filter, numPage);  
    })
    .catch(error => {
        console.log(error);
});
 
//Atualiza os parâmetros na url
const setUrlFilter = (filter, numPage) => 
    window.history.replaceState('', '', window.location.href.split('?')[0] + "?q=" + filter + "&page=" + numPage);

//Contrutor da listagem de produtos
const constListProducts = (arrProd, numPage) => {

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

//Contrutor da paginação
const constPaginator = (objList, filter, numPage) => {

    let qntTotal = Object.keys(objList).length,
        htmlListPag = "",
        contrPag = parseInt(qntTotal-1) / parseInt(qntPage);
        
    for(let i = 1; i <= Math.ceil(contrPag); i++) {
        if(numPage == i)
            htmlListPag += `<li class="active"><span>` + i + `</span></li>`;
        else
            htmlListPag += `<li><a href="javascript:void(0)" onClick="getStartListProd('` + filter + `',` + i + `);">` + i + `</a></li>`;             
    }
    document.getElementById("pag-prod-nav").innerHTML = htmlListPag;
}

//Ordena o abjeto de produtos de acordo com o filtro
const orderFilterJson = (objList, filter, numPage) => { 

    let arrFilter = filter.split('-');
    objList.sort(dynamicSort(arrFilter));   
    let arrProd = Object.values(objList);
    
    //Construtor da listagem de produtos
    constListProducts(arrProd, numPage);
    
    //Construtor da paginação
    constPaginator(objList, filter, numPage);
    
    window.scrollTo(0, 50);
}

//Ordena o object de produtos conforme os parâmetros passados
const dynamicSort = arrtFilter => {

    let sortOrder = 1,
        result;

    if(arrtFilter[0] === "-") {
        sortOrder = -1;
        arrtFilter = arrtFilter.substr(1);
    }

    return (a,b) => {
        if(arrtFilter[1] == 'asc')
            result = (a[arrtFilter[0]] < b[arrtFilter[0]]) ? -1 : (a[arrtFilter[0]] > b[arrtFilter[0]]) ? 1 : 0;
        else
            result = (a[arrtFilter[0]] > b[arrtFilter[0]]) ? -1 : (a[arrtFilter[0]] < b[arrtFilter[0]]) ? 1 : 0;
        return result * sortOrder;
    }
}

//Trata o valor inteiro em reais.
const numberToReal = numero => {

    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}
