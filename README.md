# Microservices micromanga
Para comenzar debemos comprender inicialmente que para efectos de este workshop vamos a usar un patron monorepo donde van a estar alojados los microservicios, para lograr esto la estructura del proyecto cambio un poco.

## Estructura del proyecto
* `database`: Expone una serie de utilidades para la gestion de la base de datos como por ejemplo el metodo.
* `helpers`: En esta carpeta se tienen todos los metodos necesarios para el registro, validacion, healthy check de los microservicios usando consul.
  * `deregister.js`: Este metodo es utilizado para desregistrar un microservicio del agente de consul.
  * `discover.js`: Este metodo es utilizado para listar los servicios que se encuentran registrados en el agente de consul.
  * `heartbeat.js`: Este metodo es utilizado verificar que los servicios estan activos, sirve como mecanismo de comprobacion de que los servicios estan corriendo correctamente.
  * `register.js`: Este metodo es utilizado para registrar un servicio en el agente de consul.
* `services`: En esta carpeta vamos a crear los microservicios dependiendo basados en el dominio al que pertenecen.
* `config.js`: Este archivo contiene los parametros de configuracion de la cache, la base de datos y el secret del jwt token.
* `gateway.js`: Uno de los principales cambios en la arquitectura de nuestro proyecto es que aparece un nuevo agente que es el gateway el cual es el responsable de enrutar las peticiones http a los microservicios responsables, adicionalmente el gateway es responsable de conocer que servicios tiene disponibles y si se le hace una solicitud a un servicio que el no conoce este respondera como que el servicio no esta disponible.
* `utils.js`: Contiene las utilidades generales usadas en la aplicación.

## ¿Como podemos migrar un microservicio?
Inicialmente debemos determinar cual es el dominio del servicio que buscamos migrar, con el fin de determinar la responsabilidad unica del microservicio y sobre que conjunto de datos interactua el mismo, como ejemplo vamos a establecer el dominio de autenticacion en el cual van a pertenecer todos los servicios que se encarguen de toda la capa de acceso a la aplicación, en el caso de la aplicacion monolita tenemos 2 servicios que son:
* Login
* Registro

>*Nota*: Para efectos de este workshop vamos a migrar el servicio de login a microservicio

### Endpoint de login
El endpoint `http://localhost:3000/register` de la aplicacion monolita tiene el siguiente controlador:
```js
server.post('/login', async (request, response) => {
    console.log(`executing: POST /login`)

    const credential = getCredential(request.headers.authorization)
    const hashedPassword = hashPassword(credential.password)

    const user = {
      username : credential.username,
      password : hashedPassword
    }

    try {
      const { db, client } = await mongodb.connect()

      const found = await mongodb.findDocuments(db, 'users', user)

      mongodb.close(client)
  
      if (found.length === 0) {
        response.code(404).send({
          message: `This user don't exists`
        })
  
        return
      }

      const token = generateToken({
        id: found[0]._id.toString()
      }, config.auth.secret, '1d')

      // retrieve issue and expiration times
      const { iat, exp } = jwt.decode(token)

      response.send({ iat, exp, token })
    } catch (error) {
      response.code(500).send(generateError(error))
    }
  })
```

Como se puede observar en el servicio lo que se esta realizando es una lectura del header de authorization con el fin de obtener las credenciales de acceso del usuario para posteriormente buscar en la base de datos si existe, si este usuario existe con esas credenciales el servicio devuelve un accessToken y si no existe el servicio retorna que el usuario no existe.

Con el flujo del servicio ya establecido procederemos a migrar este servicio de la siguiente forma.

* Primero debemos determinar la url y el puerto en el que va a estar escuchando el servicio de login de la siguiente forma:
```js
const name = 'login'
const port = 3001
const address = `http://127.0.0.1:${port}/login`
```
Posteriormente debemos registrar el servicio en consul para esto debemos pasarle la informacion del servicio al helper llamado `register` que es el helper creado para registrar servicios en consul.

Como parametros de registro se le deben pasar los siguientes parametros:
* `name`: Nombre del servicio, para el caso del login el name seria `login`.
* `address`: Direccion del servicio para este caso seria la url completa del servicio `http://127.0.0.1:3001/login`.
* `port`: Puerto en el que se esta va ejecutar el microservicio `3001`.
* `id`: Identificador unico del microservicio, para este caso usaremos un uuid.
* `check`: Es un objeto con el cual se comprobara si el servicio esta disponible.
  * `ttl`: Cada cuanto consul va a estar verificando si el servicio esta funcionando correctamente.
  * `deregister_critical_service_after`: En caso de que el servicio no este funcionando se determina un tiempo en el cual el servicio va ser desregistrado de consul.
```js
const { register } = require('./../../helpers')

async function init () {
  try {
    const details = {
      name,
      address,
      port,
      id: uuid(),
      check: {
        ttl: '10s',
        deregister_critical_service_after: '1m'
      }
    }
  
    const result = await register(details)
  
    console.log(`Service registered: ${result}`)
  } catch (error) {
    console.log(error)
  }
}
init()
```

Luego de registrar el servicio en consul se debe crear el controlador del servicio, en el cual migraremos la logica que teniamos en el monolito y lo unico que se cambia es la forma de responder al cliente ya que se usa el metodo `send` de la libreria `micro`, el cual recibe 3 parametros que son:
```js
const { send } = require('micro');

send(response, statusCode, payload);
```
* `response`: Objeto response pasado por el gateway.
* `statusCode`: Codigo http de respuesta.
* `payload`: Data que se le envia al cliente.
```js
 module.exports = async (request, response) => {
  const credential = getCredential(request.headers.authorization)
  const hashedPassword = hashPassword(credential.password)

  const user = {
    username : credential.username,
    password : hashedPassword
  }

  try {
    const { db, client } = await mongodb.connect()

    const found = await mongodb.findDocuments(db, 'users', user)

    mongodb.close(client)

    if (found.length === 0) {
      response.code(404).send({
        message: `This user don't exists`
      })

      return
    }

    const token = generateToken({
      id: found[0]._id.toString()
    }, config.auth.secret, '1d')

    // retrieve issue and expiration times
    const { iat, exp } = jwt.decode(token)

    send(response, 200, { iat, exp, token })
  } catch (error) {
    send(response, 500, generateError(error))
  }
}
```

Una vez finalizado el microservicio ya se puede hacer uso de el, para ejecutar el microservicio debemos seguir los siguientes pasos:
1. Correr el servidor de mongoDB
2. Correr el servidor de consul
```bash
./consul agent -dev
```
3. Correr el microservicio
```bash
npm start ./src/services/auth/login.js -- --listen tcp://localhost:3001
```
4. Correr el gateway
```bash
npm start .\src\gateway.js
```

Una vez el gateway este ejecutandose, en la consola se puede observar la cantidad de servicios que tiene registrado el gateway, adicionalmente tambien puedes observar en la url [http://localhost:8500/](http://localhost:8500/) los servicios que se encuentran registrados en el agente de consul.

Si todo esta funcionando correctamente en el deashboard del agente de consul debes tener un servicio registrado llamado login y ya puedes hacer uso del servicio usando postman.

# Reto
Ya como sabes como realizar el proceso de migracion de los servicios que se tenian en la aplicacion monolita a microservicios, te propongo que migres todos los servicios del dominio de los bookmarks. Enviame tu solucion en un PR.

