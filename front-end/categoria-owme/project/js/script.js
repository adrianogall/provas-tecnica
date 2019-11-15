/*###########################################
    SCRIPT - Prova Técnica | Adriano Gall
###########################################*/


//Busca os parâmetros da url para executar alistagem de produtos
const getParameterUrl = () => {

  let query = location.search.slice(1);
  let partes = query.split('&');
  let data = {};

  partes.forEach(parte => {

    if (parte != '') {

      let chavePrice = parte.split('=');
      let chave = chavePrice[0];
      let price = chavePrice[1];
      data[chave] = price;
    }
  });
  return data;
}

//Elementos iniciais
let currentPage = 1;
const qntProdPerPage = 20;
let Xhrhttp = new XMLHttpRequest();
let urlJsonProd = "../files/mock-products.json";
let getParamUrl = getParameterUrl();
let paramsUrlFilters;
let filter = "price-desc";
let firstRefresh = true;

//Verifica se possui parâmetros de filtros passados na url no carregamento da página
if (getParamUrl.hasOwnProperty('q')) {

  firstRefresh = false;
  const elFilter = window.document.getElementById("change-filter");
  filter = getParamUrl.q;
  elFilter.value = filter;

  if (getParamUrl.hasOwnProperty('page'))
    currentPage = getParamUrl.page;
}

//Função start para as funcinalidades de filtro e paginação
const getStartListProd = (filter, currentPage) => {

  let elLoader = document.getElementById("bg-loader");
  elLoader.style.display = "block";
  let objJsonProd = localStorage.getItem('objJsonProd');
  objJsonProd = JSON.parse(objJsonProd).products;

  orderFilterJson(objJsonProd, filter, currentPage);
  setUrlFilter(filter, currentPage);
  setTimeout(function () {
    elLoader.style.display = "none";
  }, 300);
}

const request = obj => {

  return new Promise((resolve, reject) => {

    Xhrhttp.open(obj.method || "GET", obj.url);

    if (obj.headers) {
      Object.keys(obj.headers).forEach(key => {
        Xhrhttp.setRequestHeader(key, obj.headers[key]);
      });
    }

    Xhrhttp.onload = () => {

      if (Xhrhttp.status >= 200 && Xhrhttp.status < 300) {

        resolve(Xhrhttp.response);
        return;
      }

      reject(Xhrhttp.statusText);
    };

    Xhrhttp.onerror = () => reject(Xhrhttp.statusText);
    Xhrhttp.send(obj.body);
  });
};

request({

    url: urlJsonProd,
    method: 'GET'
  })
  .then(data => {

    localStorage.setItem("objJsonProd", data);
    getStartListProd(filter, currentPage);
  })
  .catch(error => {
    console.log(error);
  });

//Atualiza os parâmetros na url
const setUrlFilter = (filter, currentPage) => {

  paramsUrlFilters = "";
  if(!firstRefresh){
    paramsUrlFilters = "?q=" + filter + "&page=" + currentPage
  }else
    firstRefresh = false;

  window.history.replaceState('', '', window.location.href.split('?')[0] + paramsUrlFilters);
}

//Contrutor da listagem de produtos
const constListProducts = (arrProd, currentPage) => {

  const elContProd = document.getElementById("list-products");
  let htmlListProd = "";
  let targetProd = parseInt(currentPage - 1) * parseInt(qntProdPerPage);
  let count = 0;

  for (let i = 0; i < arrProd.length; i++) {

    if (targetProd <= i && count < qntProdPerPage) {

      htmlListProd += `<li>
                          <div class="cont">
                              <a class="link" href="javascript:void(0)" title="` + arrProd[i].name + `" class="` + arrProd[i].name + `"></a>
                              <div class="thumb"><img alt="` + arrProd[i].name + `" title="` + arrProd[i].name + `" src="` + arrProd[i].image + `"></div>
                              <div class="desc">
                                  <h3>` + arrProd[i].name + `</h3>
                                  <p> <span>R$ ` + numberToReal(arrProd[i].price); + `</span></p>
                              </div>
                          </div>
                      </li>`;
      count++;
    }
  }

  elContProd.innerHTML = htmlListProd;
}

//Contrutor da paginação
const constPaginator = (objListProd, filter, currentPage) => {

  let elPagination = document.getElementById("pag-prod-nav");
  let qntTotalProd = Object.keys(objListProd).length;
  let htmlListPagination = "";
  let qntPagination = parseInt(qntTotalProd) / parseInt(qntProdPerPage);

  for (let i = 1; i <= Math.ceil(qntPagination); i++) {

    if (currentPage == i)
      htmlListPagination += `<li class="active"><span>` + i + `</span></li>`;
    else
      htmlListPagination += `<li><a href="javascript:void(0)" onClick="getStartListProd('` + filter + `',` + i + `);">` + i + `</a></li>`;
  }

  elPagination.innerHTML = htmlListPagination;
}

//Ordena o abjeto de produtos de acordo com o filtro
const orderFilterJson = (objListProd, filter, currentPage) => {

  let arrFilter = filter.split('-');
  objListProd.sort(orderFilterSort(arrFilter));
  let arrListProd = Object.values(objListProd);

  //Construtor da listagem de produtos
  constListProducts(arrListProd, currentPage);

  //Construtor da paginação
  constPaginator(objListProd, filter, currentPage);

  if (!firstRefresh)
    window.scrollTo(0, 50);
}

//Ordena o object de produtos conforme o array de parâmetros/filtro passados
const orderFilterSort = arrtFilter => {

  let sortOrder = 1;
  let result;

  if (arrtFilter[0] === "-") {

    sortOrder = -1;
    arrtFilter = arrtFilter.substr(1);
  }

  return (a, b) => {

    if (arrtFilter[1] == 'asc')
      result = (a[arrtFilter[0]] < b[arrtFilter[0]]) ? -1 : (a[arrtFilter[0]] > b[arrtFilter[0]]) ? 1 : 0;
    else
      result = (a[arrtFilter[0]] > b[arrtFilter[0]]) ? -1 : (a[arrtFilter[0]] < b[arrtFilter[0]]) ? 1 : 0;

    return result * sortOrder;
  }
}

//Trata o preço inteiro em reais.
const numberToReal = numero => {

  var numero = numero.toFixed(2).split('.');
  numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');

  return numero.join(',');
}
