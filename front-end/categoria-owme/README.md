# Prova Técnica para Front-End

Orientação de desenvolvimento e manutenção da aplicação.


### 1 - instalação

Instalar o pacote npm no repositório raiz.

```
npm install
```

### 2 - Start Gulp Dev (Watch)

Iniciar o Gulp Dev para iniciar desenvolvimento no repositório raiz.

```
gulp dev
```

### 3 - Start Server

Em outro terminal, iniciar o servidor em paralelo ao gulp dev dentro do repositório build, que é usado para a requisição xhr e rodar a aplicação no navegador(/index.html).

```
cd /build
```

```
http-server
```

### 4 - Build Prod Version

Gerar a build de publicação.

```
gulp build
```

### TECNOLOGIA:

* ES6 via [babel](https://babeljs.io/) (v7)
