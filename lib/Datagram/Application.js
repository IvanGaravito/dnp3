var assert = require('assert')
  , util = require('util')
  , HierarchyObject = require('../HierarchyObject')

/*
    Application Class
*/
var Application = module.exports = function (options) {
    HierarchyObject.call(this, options)
}
util.inherits(Application, HierarchyObject)

Application.prototype.request = function() {
    if (!this._request) {
        this._request = new Request({parent: this})
        // Either request or response, but not both
        delete this._response
    }
    return this._request
}

Application.prototype.response = function() {
    if (!this._response) {
        this._response = new Response({parent: this})
        // Either response or request, but not both
        delete this._request
    }
    return this._response
}


/*
    Request Class
*/
var Request = module.exports = function (options) {
    HierarchyObject.call(this, options)
}
util.inherits(Request, HierarchyObject)

Request.prototype.appControl = function () {
    if (!this._appControl) {
        this._appControl = new AppControl({parent: this})
    }
    return this._appControl
}


/*
    AppControl Class
*/
var AppControl = module.exports = function (options) {
    HierarchyObject.call(this, options)
}
util.inherits(AppControl, HierarchyObject)


/*
    Response Class
*/
var Response = module.exports = function (options) {
    Request.call(this, options)
}
util.inherits(Response, Request)

Response.prototype.iin = function () {
    if (!this._iin) {
        this._iin = new Iin({parent: this})
    }
    return this._iin
}


/*
    Iin Class
*/
var Iin = module.exports = function (options) {
    HierarchyObject.call(this, options)
}
util.inherits(Iin, HierarchyObject)
