console.log('Starting fakeUTR system...')
var net = require('net')
  , argv = process.argv

if (argv.length < 3) {
    console.log(
        'Usage: ' + argv[0] + ' ' + argv[1] + ' <port> <response>\n' +
        '\n' +
        'Options:\n' +
        '  port\t\tTCP port to listen to\n' +
        '  response\tDatagram to respond in hexa (e.g. 0564050B01000000F891)\n' +
        '\n' +
        'Documentation can be found at https://github.com/IvanGaravito/dnp3'
    )
    process.exit(1)
}

var port = argv[2]
  , response = new Buffer(argv[3], 'hex')

var server = net.createServer(function (socket) {
    var id = socket.remoteAddress + ':' + socket.remotePort
    console.log('fakeUTR#' + id + ' connected')
    socket.on('data', function (data) {
        console.log('@' + id + ' > ', data)
        socket.write(response)
        console.log('@' + id + ' < ', response)
    })
})
server.on('error', function (error) {
  if ('EADDRINUSE' == error.code) {
    console.log('fakeUTR# Error: Address in use');
  } else {
    console.log('fakeUTR# Error: ' + error.message)
    process.exit(2)
  }
})
server.listen(port, function () {
    console.log('fakeUTR# Started!')
})