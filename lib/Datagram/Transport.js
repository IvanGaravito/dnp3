var util = require('util')
  , HierarchyObject = require('../HierarchyObject')

/*
    Transport Class
*/
var Transport = module.exports = function (options) {
    HierarchyObject.call(this, options)
}
util.inherits(Transport, HierarchyObject)
