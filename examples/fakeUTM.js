console.log('Starting fakeUTM system...')

let dnp3 = require('../')
let argv = process.argv

if (argv.length < 7) {
  console.log(
    'Usage: ' + argv[0] + ' ' + argv[1] + ' <masterDir> <slaveHost> <slavePort> <slaveDir> <request>\n' +
        '\n' +
        'Options:\n' +
        '  masterDir\tDNP 3.0 master dir\n' +
        '  slaveHost\tSlave IP\n' +
        '  slavePort\tSlave port\n' +
        '  slaveDir\tDNP 3.0 slave dir\n' +
        '  request\tRequest to send to slave\n' +
        '\n' +
        'Documentation can be found at https://github.com/IvanGaravito/dnp3'
  )
  process.exit(1)
}

let masterDir = process.argv[2]
let slaveHost = process.argv[3]
let slavePort = process.argv[4]
let slaveDir = process.argv[5]
let userRequest = process.argv[6]

let master = new dnp3.Master({ dir: masterDir })

let slave = master.slave('fakeUTR', {
  host: slaveHost,
  port: slavePort,
  dir: slaveDir
}).connect()

let request = slave.request()

if (userRequest in request && typeof request[userRequest] === 'function') {
  request[userRequest](function (data) {
    console.log('fakeUTM# Link status response:', data)
    process.exit()
  })
} else {
  console.log('fakeUTM# Error: request "' + userRequest + '" not available')
  process.exit(2)
}
