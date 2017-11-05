let util = require('util')
let events = require('events')
let Datagram = require('../Datagram')

let _nextRequestNumber = 0

/*
    REQUEST CLASS
*/
let Request = module.exports = function (options) {
  if (!(this instanceof Request)) {
    return new Request(options)
  }
  events.EventEmitter.call(this)

  this.slave = options.slave

  // Request ID
  this.id = 'req_' + _nextRequestNumber++
  // Internal state
  this._state = Request.States.UNSET
}
util.inherits(Request, events.EventEmitter)

Request.States = {
  UNSET: 0,
  CONFIG: 1,
  REQUESTING: 2,
  PROCESSING: 3,
  READY: 4
}

Request.prototype._send = function (cb) {
  console.log('Request@' + this.id + '::_send')
  if (Request.States.CONFIG !== this._state) {
    console.log('Request@' + this.id + '::_send# Need state CONFIG')
    return
  }

  let self = this
  let socket = this.slave._socket

  console.log('Request@' + this.id + '::_send# Sending datagram ', this.datagram.toString('hex'))
  this._state = Request.States.REQUESTING
  this.slaveCb = cb || function () {}
  this._reqCb = function (data) {
    console.log('Request@' + self.id + '::slave::socket>data# Response received', data.toString('hex'))
    self._onData(self, data)
  }
  socket.on('data', this._reqCb)
  socket.write(this.datagram)
}

Request.prototype._onData = function (data) {
  console.log('Request@' + this.id + '::_onData')
  // Processing arrived data
  this._state = Request.States.PROCESSING
  // TODO: Process data
  console.log('Request@' + this.id + '::_onData# Processing data')

  // Data is validated and ready
  this._state = Request.States.READY
  console.log('Request@' + this.id + '::_onData# Request ready')
  // Removing network listener
  console.log('Request@' + this.id + '::_onData# Removing network listener')
  this.slave._socket.removeListener('data', this._reqCb)
  // Inform slave request is ready
  console.log('Request@' + this.id + '::_onData# Calling slave callback')
  this.slaveCb.call(this.slave, this)
  // Process user callback
  console.log('Request@' + this.id + '::_onData# Calling user callback')

  this.cb(this, data)
}

Request.prototype.resetLink = function (cb) {
  console.log('Request@' + this.id + '::resetLink')
  let datagram = new Datagram({
    dstAddr: this.slave.dir,
    srcAddr: this.slave.master.dir
  })
  this.datagram = datagram.setDlcDir(1)
    .setDlcPrm(1)
    .build()
  this.cb = cb || function () {}

  this._state = Request.States.CONFIG

  return this
}

Request.prototype.linkStatus = function (cb) {
  console.log('Request@' + this.id + '::linkStatus')
  let datagram = new Datagram({
    dstAddr: this.slave.dir,
    srcAddr: this.slave.master.dir
  })
  this.datagram = datagram.setDlcDir(1)
    .setDlcPrm(1)
    .setDlcFc(9)
    .build()
  this.cb = cb || function () {}

  this._state = Request.States.CONFIG

  return this
}

Request.prototype.testLink = function (cb) {
  console.log('Request@' + this.id + '::testLink')
  let datagram = new Datagram({
    dstAddr: this.slave.dir,
    srcAddr: this.slave.master.dir
  })
  this.datagram = datagram.setDlcDir(1)
    .setDlcPrm(1)
    .setDlcFcb(1)
    .setDlcFcvDfc(1)
    .setDlcFc(2)
    .build()
  this.cb = cb || function () {}

  this._state = Request.States.CONFIG

  return this
}
