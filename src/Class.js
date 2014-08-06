var _ = require('underscore');

var CLASS_KEY = 'class';

var ClassMixin = {
    /**
     * Returns <code>true</code> if this type is the same or is a subclass of
     * the specified type.
     */
    isSubtype : function(type, includeThis) {
        if (!type || !type._typeId) return false;
        var result = false;
        for (var t = includeThis ? this : this.parent; // 
        !result && !!t && t._typeId !== undefined; t = t.parent) {
            result = t._typeId == type._typeId;
        }
        return result;
    },

    /**
     * Returns <code>true</code> if this type is the same as the specified
     * object.
     */
    isSameType : function(type) {
        if (!type || !type._typeId) return false;
        return this._typeId == type._typeId;
    },

    /** Returns true if the specified object is an instance of this class */
    hasInstance : function(obj) {
        if (!obj) return false;
        return InstanceMixin.instanceOf.call(obj, this);
    },

    createClass : function(Factory, Parent, args) {
        var Type = Factory(Parent, args);
        _.extend(Type, ClassMixin);
        Type.extend = function() {
            return ClassMixin.createClass(Factory, this, _.toArray(arguments));
        };
        if (Parent) {
            _.extend(Type.prototype, Parent.prototype);
            _.extend(Type, Parent);
            Type.parent = Parent;
        }
        _.each(args, function(fields) {
            _.extend(Type.prototype, fields);
        });
        _.extend(Type.prototype, InstanceMixin);

        Type.prototype[CLASS_KEY] = Type;
        Type._typeId = _.uniqueId('type-');
        return Type;
    }

};

var InstanceMixin = {
    instanceOf : function(type) {
        var cls = this[CLASS_KEY];
        return ClassMixin.isSubtype.call(cls, type, true);
    },
    setOptions : function(options) {
        this.options = _.extend({}, this.options, options);
    },
    getClass : function() {
        return this[CLASS_KEY];
    },
    toString : function() {
        var cls = this[CLASS_KEY];
        return cls ? (cls._typeId) + '' : 'undefined';
    }
};

var Class = ClassMixin.createClass(function(Parent, args) {
    function Constructor() {
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }
    }
    return Constructor;
});
module.exports = Class;
