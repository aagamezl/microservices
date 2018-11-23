const consul = require('consul')()

// const Etcd = require('node-etcd')

// const etcd = new Etcd()

// const etcd = require('nodejs-etcd');

// const e = new etcd({
//     url: 'https://node01.example.com:4001'
// })

// e.read({'key': '/hello'}, function (err, result, body) {
//   if (err) throw err;
//   assert(result.value);
// });

const discover = () => {
  return new Promise((resolve, reject) => {
    consul.agent.service.list((error, result) => {
      if (error) {
        reject(error)

        return
      }

      resolve(result)
    })
  })
}

module.exports = {
  discover,
}
