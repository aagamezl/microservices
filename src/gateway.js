const { uuid } = require('./utils')

const {
  deregister,
  register,
  discover,
} = require('./helpers')

async function init () {
  // const details = {id: 'b7617c9e-7a4e-47dd-a900-d512a683a1a2'}

  // let result = await deregister(details)

  // console.log(`result %o`, result)

  // const details = {
  //   name: 'searchByTitle',
  //   address: 'https://127.0.0.1/search/title/',
  //   port: 3003,
  //   id: uuid(),
  //   check: {
  //     ttl: '10s',
  //     deregister_critical_service_after: '1m'
  //   }
  // }

  // try {
  //   let result = await register(details)

  //   console.log(`service registered: ${result}`)
  // } catch (error) {
  //   console.log(error)
  // }

  try {
    result = await discover()

    console.log(JSON.stringify(result, null, '  '))
  } catch (error) {
    console.log(error)
  }
}

init()

// var consul = require('consul')()

// const { uuid } = require('./helpers/utils')

// const CONSUL_ID = uuid()
// const details = {
//   name: 'register',
//   address: 'https://127.0.0.1/login',
//   port: 3001,
//   id: CONSUL_ID,
//   check: {
//     ttl: '10s',
//     deregister_critical_service_after: '1m'
//   }
// }

// consul.agent.service.register(details, err => {
//   // schedule heartbeat
//   if (err) throw err

  // consul.agent.service.list(function(err, result) {
  //   if (err) throw err

  //   console.log(result)
  // })
// })


// const { discover } = require('./helpers/discover')

// const etcd = require('nodejs-etcd')

// const e = new etcd({
//   url: 'https://127.0.0.1:2379'
// })

// e.read({'key': '/services'}, function (error, result, body) {
//   if (error) throw error

//   console.log(result.value)
// })

// discover('login', { wait: true }, (error, node, watcher) => {
//   if (error) {
//     console.log(error.message)

//     process.exit(1)
//   }

//   // console.log(pkgjson.name + ' discovered node: ', node)

//   watcher
//     .on('change', function (data) {
//       console.log('Value changed new value: ', node)
//     })
//     .on('expire', function (data) {
//       console.log('Value expired.')
//     })
//     .on('delete', function (data) {
//       console.log('Value deleted.')
//     })
// })