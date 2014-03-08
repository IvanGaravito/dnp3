var util = require('util')
  , events = require('events')
  , net = require('net')
  , Request = require('./Request')

/*
    SLAVE CLASS
*/
var Slave = module.exports = function (options) {
    if (!(this instanceof Slave)) {
        return new Slave(options)
    }
    events.EventEmitter.call(this)

    this.master = options.master
    this.name = options.name

    // TCP options for connection
    this.host = options.host || '127.0.0.1'
    this.port = options.port && options.port >= 0? options.port: 20000

    // DNP options
    this.dir = options.dir && options.dir >= 0? options.dir: 0

    // Request pool
    this._requests = []

    // Connection socket
    this._socket = null
    // Internal state
    this._state = Slave.States.DISCONNECTED
}
util.inherits(Slave, events.EventEmitter)

Slave.States = {
    DISCONNECTED:   0
  , CONNECTING:     1
  , CONNECTED:      2, 
}

Slave.prototype.connect = function() {
    console.log('Slave::connect')
    if (Slave.States.DISCONNECTED === this._state) {
        console.log('Slave::connect# Connecting')
        this._state = Slave.States.CONNECTING
        var self = this
        this._socket = net.connect({
            port: this.port
          , host: this.host
          , localAddress: this.master.localAddress
        }, function () {
            console.log('Slave::_socket>connect')
            self._onConnect()
        })
    } else {
        console.log('Slave::connect# Already connected or connecting')
    }
    return this
}

Slave.prototype._onConnect = function () {
    console.log('Slave::_onConnect')
    this._state = Slave.States.CONNECTED

    this._processRequests()
}

Slave.prototype._processRequests = function () {
    console.log('Slave::_processRequests')
    if (Slave.States.CONNECTED === this._state && this._requests.length > 0) {
        var request = this._requests[0]
        console.log('Slave::_processRequests# Processing ' + request.id)
        request._send(this._onRequestReady)
    }
}

Slave.prototype._onRequestReady = function (request) {
    console.log('Slave::_onRequestReady# Request ' + request.id + ' is ready!')
    this._requests.shift()
    this._processRequests()
}

Slave.prototype.request = function (options) {
    console.log('Slave::request')
    var request

    if (Slave.States.DISCONNECTED === this._state) {
        console.log('Slave::request# Disconnected, trying to connect')
        this.connect()
    }

    options = options || {}
    options.slave = this
    this._requests.push(request = new Request(options))
    console.log('Slave::request# New request ' + request.id)

    return request
}
