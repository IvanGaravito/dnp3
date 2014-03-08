var crc = require('dnp3-crc')

var Datagram = module.exports = function (options) {
    this.len = 0x05
    this.linkControl = 0x00
    this._dlcDir = 0
    this._dlcPrm = 0
    this._dlcFcb = 0
    this._dlcFcvDfc = 0
    this._dlcFc = 0
    this.dstAddr = options.dstAddr || 0x00
    this.srcAddr = options.srcAddr || 0x00
}

Datagram.prototype.setDlcDir = function (dir) {
    this._dlcDir = dir? 1: 0
    return this
}
Datagram.prototype.setDlcPrm = function (prm) {
    this._dlcPrm = prm? 1: 0
    return this
}
Datagram.prototype.setDlcFcb = function (fcb) {
    this._dlcFcb = fcb? 1: 0
    return this
}
Datagram.prototype.setDlcFcvDfc = function (fcvDfc) {
    this._dlcFcvDfc = fcvDfc? 1: 0
    return this
}
Datagram.prototype.setDlcFc = function (fc) {
    this._dlcFc = fc & 0x0F
    return this
}

Datagram.prototype.updateDlc = function () {
    var dlc = 0x00
    dlc  = this._dlcDir << 7 | this._dlcPrm << 6 |
           this._dlcFcb << 5 | this._dlcFcvDfc << 4 |
           this._dlcFc
    this.linkControl = dlc
    return this
}

Datagram.prototype.build = function () {
    var blocks = this._blocks = []
      , _crc

    // BLOCK 0
    var block0 = []
    // start
    block0.push(0x05)
    block0.push(0x64)
    // len
    block0.push(this.len)
    // lc
    this.updateDlc()
    block0.push(this.linkControl)
    // dst
    block0.push(this.dstAddr & 0xFF)
    block0.push((this.dstAddr & 0xFF00) >> 8)
    // src
    block0.push(this.srcAddr & 0xFF)
    block0.push((this.srcAddr & 0xFF00) >> 8)

    // crc
    _crc = crc.calculate(block0)
    block0.push(_crc & 0xFF)
    block0.push((_crc & 0xFF00) >> 8)
    // Add it to the block list
    blocks.push(block0)

    // BLOCK N
    // TODO: Packet UserData

    var bytes = []
    // Merge blocks into a single array
    blocks.forEach(function (block) {
        Array.prototype.push.apply(bytes, block)
    })
    return new Buffer(bytes)
}
