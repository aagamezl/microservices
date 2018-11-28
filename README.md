# Monolith Manga Reader
Esta rama contiene una estructura de servicios normal donde todos los servicios son expuesto por medio de una API REST usando `fastify` para el servidor web.

## Estructura del proyecto
La estructura del proyecto se divide de la siguiente forma:
* `src`: Este folder es la base del proyecto en el cual se pueden encontrar todos los recursos del servidor como por ejemplo, las rutas, esquemas de la base de datos etc.
  * `cache`: Contiene una serie de utilidades que permiten almacenar en un archivo el resultado del scrapping con el fin de optimizar las solicitudes que se hacen a la pagina web de manga.
  * `database`: Expone una serie de utilidades para la gestion de la base de datos como por ejemplo el metodo `connect` que permite conectarse a la base de datos, el metodo `findDocuments` que permite en una coleccion buscar los documentos que coincidan con el query especificado, entre otros metodos.
  * `routes`: Expone todos los servicios de la aplicación
  * `scrappers`: En scrappers podemos encontrar todas las utilidades que son utilizadas para hacer el [scrapping](https://es.wikipedia.org/wiki/Web_scraping) de la aplicacion web como por ejemplo el fecth a la pagina y el procesamiento del html para obtener la información.
  * `config.js`: Este archivo contiene los parametros de configuracion de la cache, la base de datos y el secret del jwt token.
  * `server.js`: Este archivo es el que se encarga de ejecutar el servidor de la API usando `fastify`, adicionalmente tambien en este archivo se registran las rutas que exponer la API.
  * `utils.js`: Contiene las utilidades generales usadas en la aplicación.

## Dominios de la aplicación
* **Auth**: Contiene todos los servicios y utilidades que hacen referencia al ciclo de autenticacion de usuarios. La autenticacion emplea JWT y la authenticacion se hace con un basic auth, se tienen 2 rutas la de registro y login.
* **Bookmarks**: Contiene los servicios y utilidades para la gestion de bookmarks como por ejemplo la creación, lectura y eliminación.
* **Chapters**: Contiene los servicios y utilidades que permiten obtener capitulos de manga.
* **Search**: Contiene los servicios y utilidades para la busqueda de mangas especificamente por el titulo del manga o por el author.

## Ejecución del proyecto
Para poner en funcionamiento el proyecto, primero debemos asegurarnos de que la base de datos de mongoDB esta corriendo y escuchando el puerto 27017, luego de esto se deben correr los siguientes comandos:

``` bash
npm install
npm start
```
Luego de ejecutar estos comandos, si todo esta bien, el servidor va a estar ejecutandose en `http://localhost:3000`, como mecanismo de verificacion podemos ingresar a [https://localhost:3000/](https://localhost:3000/) y deberiamos poder observar el siguiente mensaje:
```
{ "hello": "world"}
```

> *Nota*: Para poder intereactar con la aplicación primero debemos crear un usuario, haciendo uso de los servicios que expone la plataforma.

## Endpoints
Para poder interactuar con la API REST expuesta, se puede hacer uso de la herramienta llamada `postman` que permite construir y enviar peticiones http.

### Auth
* **Register**
  * httpMethod: `POST`
  * url: `http://localhost:3000/register`
  * headers
    * Authorization: `Basic`
      * username: testUser
      * password: testPassword
    * Content-Type: application/json
  * Body:
  ```
    { "name": "usernaName" }
  ```
* **Login**
  * httpMethod: `POST`
  * url: `http://localhost:3000/login`
  * headers
    * Authorization: `Basic`
      * username: testUser
      * password: testPassword

### Bookmarks
* **Leer Bookmarks**
  * httpMethod: `GET`
  * url: `http://localhost:3000/bookmarks`
  * headers
    * x-access-token: `<jwt-token>`
* **Crear Bookmarks**
  * httpMethod: `POST`
  * url: `http://localhost:3000/bookmarks`
  * headers
    * x-access-token: `<jwt-token>`
    * Content-Type: application/json
  * Body:
  ```
    {
	    "testKey": "testValue"
    }
  ```
* **Eliminar un bookmar especifico**
  * httpMethod: `DELETE`
  * url: `http://localhost:3000/bookmarks/:id`
  * headers
    * x-access-token: `<jwt-token>`
    * Content-Type: application/json
  * params
    * id: User id
  * Body
  ```
    {
	    "testKey": "testValue"
    }
  ```
* **Eliminar todos los bookmarks**
  * httpMethod: `DELETE`
  * url: `http://localhost:3000/bookmarks`
  * headers
    * x-access-token: `<jwt-token>`
    * Content-Type: application/json

### Chapter
* **Obtener capitulo**
  * httpMethod: `GET`
  * url: `http://localhost:3000/chapter/:name`
  * headers
    * x-access-token: `<jwt-token>`
  * params
    * name: Nombre del capitulo

### Search
* **Buscar por nombre de autor**
  * httpMethod: `GET`
  * url: `http://localhost:3000/search/author/:query`
  * headers
    * x-access-token: `<jwt-token>`
  * params
    * query: Nombre del autor
* **Buscar por titulo**
  * httpMethod: `GET`
  * url: `http://localhost:3000/search/title/:query`
  * headers
    * x-access-token: `<jwt-token>`
  * params
    * query: titulo del manga


Una vez ya hemos comprendido el funcionamiento del monolito y hemos interactuado con el ya podemos hacer la migracion de estos servicios a micro servicios, para esto debemos pasarnos a la rama llamada `microservices-manga`, usando los siguientes comandos:
```
git checkout -b microservices-manga
git pull origin microservices-manga
```
