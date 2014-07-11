(function(context, require) {
    'use strict';
    var Mosaic = module.exports = require('./Mosaic');
    var _ = require('underscore');
    Mosaic.Errors = Errors;

    function Errors() {
        var m = Errors.newError;
        return m.apply(m, arguments);
    }
    _.extend(Errors, {
        newError : newError,
        toJSON : toJSON,
        fromJSON : fromJSON
    });

    var ErrorMethods = {
        code : function(value) {
            if (value === undefined)
                return this._code;
            this._code = value;
            return this;
        },
        messageKey : function(value) {
            if (value === undefined)
                return this._messageKey;
            this._messageKey = value;
            return this;
        }
    };

    function newError(o) {
        var obj = o instanceof Error ? o : new Error(o);
        _.extend(obj, ErrorMethods);
        return obj;
    }

    function fromJSON(obj) {
        var error = newError(obj.message);
        if (_.isArray(obj.trace)) {
            error.stack = obj.trace.join('\n');
        }
        if (obj.code) {
            error.code(obj.code);
        }
        if (obj.messageKey) {
            error.messageKey(obj.messageKey);
        }
        return error;
    }

    function toJSON(error) {
        var errObj = {
            message : 'ERROR'
        };
        if (error) {
            errObj.message = error + '';
            errObj.messageKey = error._messageKey;
            errObj.code = error._code || 500;
            if (_.isArray(error.stack)) {
                errObj.trace = clone(error.stack);
            } else if (_.isString(error.stack)) {
                errObj.trace = error.stack.split(/[\r\n]+/gim);
            } else if (_.isObject(error)) {
                _.each(_.keys(error), function(key) {
                    errObj[key] = error[key];
                });
            } else {
                errObj.trace = [ JSON.stringify(error) ];
            }
        }
        return errObj;
    }

    function clone(obj) {
        return obj ? JSON.parse(JSON.stringify(obj)) : null;
    }
    return Mosaic;
})(this, require);