var assert = require('assert')
  , util = require('util')
  , crc = require('dnp3-crc')
  , HierarchyObject = require('../HierarchyObject')
  , Transport = require('./Transport')
  , Application = require('./Application')

/*
    UserData Class
*/
var UserData = module.exports = function (options) {
    HierarchyObject.call(this, options)
}
util.inherits(UserData, HierarchyObject)

UserData.prototype.transport = function() {
    if (!this._transport) {
        this._transport = new Transport({parent: this})
    }
    return this._transport
}

UserData.prototype.application = function() {
    if (!this._application) {
        this._application = new Application({parent: this})
    }
    return this._application
}
