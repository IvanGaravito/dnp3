var util = require('util')
  , events = require('events')
  , Slave = require('./Slave')

/*
    MASTER CLASS
*/
var Master = module.exports = function (options) {
    if (!(this instanceof Master)) {
        return new Master(options)
    }
    events.EventEmitter.call(this)

    // IP options
    this.localAddress = options.localAddress || '0.0.0.0'

    // DNP options
    this.dir = options.dir && options.dir >= 0? options.dir: 0

    // Slave pool
    this._slaves = {}
}
util.inherits(Master, events.EventEmitter)

Master.prototype.slave = function (name, options) {
    console.log('Master::slave')
    if (this._slaves[name]) {
        console.log('Master::slave# Already exists')
        return this._slaves[name]
    }

    console.log('Master::slave# Creating new slave')
    options.master = this
    options.name = name
    this._slaves[name] = new Slave(options)

    return this._slaves[name]
}
