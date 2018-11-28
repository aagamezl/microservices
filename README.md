# Workshop de microservicios
Micromanga es una applicacion que hace un web scrapping sobre una pagina de manga con la cual se puede consultar informacion sobre los distintos mangas que hay en el mercado, adicionalmente permite almacenar bookmarks con la informacion que consideres mas importante.

## ¿Qué haremos?
La idea de este workshop es migrar una aplicación monolita a microservicios usando micro y consul para el descubrimiento de servicios.

## ¿Que necesitamos?
Antes de comenzar este workshop necesitamos tener instalado las siguientes herramientas:
* MongoDB v3.4.x
* NodeJS minimo la v8.12.0
* Postman
* Consul

## Configuracion del entorno
### Instalación de NodeJS
Para instalar nodeJS se puede descargar directamente por medio de este [enlace](https://nodejs.org/en/)

Si usas linux o maxOSX tambien puedes instalar nodeJS por medio de NVM(Node Version Manager). NVM es un gestor de versiones para nodeJS con el cual se puede instalar diferentes versiones de Node e ir cambiadolas como se desee, para instalar NVM puedes seguir los pasos descritos en este [enlace](https://github.com/creationix/nvm).

Si usas windows puedes instalar NVM siguiendo los pasos descritos en este [enlace](https://github.com/coreybutler/nvm-windows).

### Instalación de MongoDB
Para instalar mongoDB se pueden seguir los pasos de la documentacion oficial dependiendo del sistema operativo que estes usando.
* [Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/).
* [MacOSX](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/).
* [Linux](https://docs.mongodb.com/manual/administration/install-on-linux/).

Si tienes instalado docker tambien puedes instalar mongoDB de la siguiente forma:
```
docker pull mongo:3.4
```
Luego de tener descargada la imagen de mongoDB ya puedes correr el contenedor con el siguiente comando:
```
docker run -itd --name MongoDB-3.4 --hostname mongodb-server -p 27017:27017 mongo:3.4
```
>*Nota*: Al correr el contenedor de esta forma es completamente stateless esto quiere decir que si se elimina o se detiene el contenedor, la data va ser eliminada.

Para que la data sea persistente debes crear un volumen en el lugar que se desee y posteriormente ejecutar el siguiente comando.
```
docker run -itd --name MongoDB-3.4 --hostname mongodb-server -v volumen-path:/data/db -p 27017:27017 mongo:3.4
```
>*Nota*: El argument `-v` indica el espacio donde se va almacenar la data del contenedor en la maquina local.

### Instalación de consul
Para la instalacion de consul primero se debe descargar el binario por medio de este [link](https://www.consul.io/downloads.html) dependiendo del sistema operativo que se este usando.

Luego de tener descargado el binario, para correr el servidor lo primero que se debe hacer es ir a la carpeta donde se tiene descargado el binario y posteriormente ejecutar el siguiente comando:
```
./consul agent -dev
```
>*Nota*: Este comando va a correr el agente y adicionalmente corre un servidor web en el cual se pueden visualizar todos los servicios que se registran en consul por medio de la siguiente url `http://localhost:8500`

Si quieres conocer un poco mas sobre consul puedes consultar este [enlace](https://www.hashicorp.com/blog/consul-and-external-services).

Una vez ya tenemos todos los requerimientos instalados en nuestras maquinas podemos clonar el proyecto por medio del comando:
```
git clone https://github.com/aagamezl/microservices.git
```

Para comenzar debemos pasarnos a la rama `monolith-manga` usando los siguientes comandos:
```
git checkout -b monolith-manga
git pull origin monolith-manga
```