(function(context, require) {
    var Mosaic = module.exports = require('./Mosaic');
    var _ = require('underscore');

    /** Common superclass for all other types. */
    function copy(to, from) {
        for ( var name in from) {
            if (_.has(from, name) && name !== 'prototype') {
                to[name] = from[name];
            }
        }
    }
    function extend() {
        var that = this;
        return newClass.apply(that, arguments);
    }

    /**
     * Returns <code>true</code> if this type is the same as the specified
     * object.
     */
    function isSameType(type) {
        if (!type || !type._typeId)
            return false;
        return this._typeId == type._typeId;
    }

    /**
     * Returns <code>true</code> if this type is the same or is a subclass of
     * the specified type.
     */
    function isSubtype(type, includeThis) {
        if (!type || !type._typeId)
            return false;
        var result = false;
        for (var t = includeThis ? this : this.parent; // 
        !result && !!t && t._typeId !== undefined; t = t.parent) {
            result = t._typeId == type._typeId;
        }
        return result;
    }

    /** Returns true if this object is an instance of the specified type */
    function instanceOf(type) {
        var cls = this['class'];
        return isSubtype.call(cls, type, true);
    }

    /** Returns true if the specified object is an instance of this class */
    function hasInstance(obj) {
        if (!obj)
            return false;
        return instanceOf.call(obj, this);
    }

    var typeCounter = 0;
    function newClass() {
        function Type() {
            if (this.initialize) {
                this.initialize.apply(this, arguments);
            }
        }
        Type.extend = extend;
        Type.isSameType = isSameType;
        Type.isSubtype = isSubtype;
        Type.hasInstance = hasInstance;
        if (this) {
            copy(Type, this);
            copy(Type.prototype, this.prototype);
            Type.parent = this;
        }
        _.each(arguments, function(fields) {
            copy(Type.prototype, fields);
        });
        Type.prototype.instanceOf = instanceOf;
        Type.prototype['class'] = Type;
        Type.prototype.getClass = function() {
            return Type;
        };
        Type._typeId = typeCounter++;
        Type.toString = function() {
            return 'class-' + (Type._typeId) + '';
        };
        return Type;
    }

    var Class = newClass();
    Mosaic.Class = Class;
})(this, require);