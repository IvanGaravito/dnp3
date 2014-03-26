console.log('Starting fakeUTM system...')
var dnp3 = require('../')
  , argv = process.argv

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

var masterDir = process.argv[2]
  , slaveHost = process.argv[3]
  , slavePort = process.argv[4]
  , slaveDir = process.argv[5]
  , userRequest = process.argv[6]

var master = new dnp3.Master({
        dir: masterDir
    })
  , slave = master.slave('fakeUTR', {
        host:   slaveHost
      , port:   slavePort
      , dir:    slaveDir
    })
    .connect()
  , request = slave.request()

if (userRequest in request && 'function' === typeof request[userRequest]) {
    request[userRequest](function (data) {
        console.log('fakeUTM# ' + userRequest + ' response:', data)
        process.exit()
    })
} else {
    console.log('fakeUTM# Error: request "' + userRequest + '" not available')
    process.exit(2)
}
