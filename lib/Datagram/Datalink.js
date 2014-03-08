var util = require('util')
  , crc = require('dnp3-crc')
  , HierarchyObject = require('../HierarchyObject')

/*
    Datalink Class
*/
var Datalink = module.exports = function (options) {
    HierarchyObject.call(this, options)

    // Internals
    this._dstAddr = 0
    this._srcAddr = 0
}
util.inherits(Datalink, HierarchyObject)

Datalink.prototype._build = function (userDataLength) {
    var block = []
      , blockCrc
      , len = userDataLength && userDataLength > 0? 5 + userDataLength: 0x05

    // start
    block.push(0x05)
    block.push(0x64)
    // length
    block.push(len)
    // link control
    block.push(this._linkcontrol._build())
    // destination address
    block.push(this._dstAddr & 0xFF)
    block.push((this._dstAddr & 0xFF00) >> 8)
    // source address
    block.push(this._srcAddr & 0xFF)
    block.push((this._srcAddr & 0xFF00) >> 8)

    // crc
    blockCrc = crc.calculate(block)
    block.push(blockCrc & 0xFF)
    block.push((blockCrc & 0xFF00) >> 8)

    return block
}

Datalink.prototype.linkControl = function () {
    if (!this._linkcontrol) {
        this._linkcontrol = new LinkControl({parent: this})
    }
    return this._linkcontrol
}

Datalink.prototype.dstAddr = function (dstAddr) {
    this._dstAddr = dstAddr
    return this
}

Datalink.prototype.srcAddr = function (srcAddr) {
    this._srcAddr = srcAddr
    return this
}


/*
    LinkControl Class
*/
var LinkControl = function (options) {
    HierarchyObject.call(this, options)

    // Internals
    this._dir = 0
    this._prm = 0
    this._fcb = 0
    this._fcvDfc = 0
    this._fc = 0
}
util.inherits(LinkControl, HierarchyObject)

LinkControl.prototype._build = function () {
    return this._dir << 7 | this._prm << 6 | this._fcb << 5 | this._fcvDfc << 4 | this._fc
}

LinkControl.prototype.dir = function (dir) {
    this._dir = dir? 1: 0
    return this
}
LinkControl.prototype.prm = function (prm) {
    this._prm = prm? 1: 0
    return this
}
LinkControl.prototype.fcb = function (fcb) {
    this._fcb = fcb? 1: 0
    return this
}
LinkControl.prototype.fcvDfc = function (fcvDfc) {
    this._fcvDfc = fcvDfc? 1: 0
    return this
}
LinkControl.prototype.fc = function (fc) {
    this._fc = fc & 0x0F
    return this
}
