var Datalink = require('./Datalink')
  , UserData = require('./UserData')

/*
    Datagram Class
*/
var Datagram = module.exports = function (options) {
    this._datalink = new Datalink({parent: this})
}

Datagram.prototype.build = function () {
    var block0
      , blocks = []

    if (this._userData) {
        block0 = this._datalink._build(this._userData._length())
        blocks = this._userData._build()
    } else {
        block0 = this._datalink._build()
    }

    // Merge blocks into a single array
    var bytes = block0
    blocks.forEach(function (block) {
        Array.prototype.push.apply(bytes, block)
    })
    return bytes
}

Datagram.prototype.datalink = function() {
    return this._datalink
}

Datagram.prototype.userData = function() {
    if (!this._userData) {
        this._userData = new UserData({parent: this})
    }
    return this._userData
}
