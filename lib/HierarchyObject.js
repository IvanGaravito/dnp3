var _dontBind = '__hoDontBind'
var HierarchyObject = module.exports = function (options) {
    var parent = this.parent = options.parent

    for (var fn in parent) {
        // Only adds the method if not private, is a function and don't exists here
        if ('_' !== fn[0] && 'function' === typeof parent[fn] && !(fn in this)) {
            if (_dontBind in parent[fn]) {
                // Already binded, so just add it
                this[fn] = parent[fn]
            } else {
                // Add a new bind function
                this[fn] = this._bind(parent, fn)
            }
        }
    }
}

HierarchyObject.prototype._bind = function (ctx, fn) {
    var hoFn = function () {
        var args = Array.prototype.slice.call(arguments, 0)
        return ctx[fn].apply(ctx, args)
    }
    // Function mark to prevent binding it again
    hoFn[_dontBind] = true
    return hoFn
}