    var _ = require('underscore');

    var CLASS_KEY = '__type';
    var META_KEY = '__meta';
    var TYPE_ID_KEY = '__type_id';
    var PARENT_KEY = '__parent';

    var instanceFields = {
        instanceOf : function(type) {
            var cls = this.__getClass();
            var meta = cls.getMetaClass();
            return meta.classFields.isSubtype.call(cls, type, true);
        },
        setOptions : function(options) {
            this.options = _.extend({}, this.options, options);
        },
        toString : function() {
            var cls = this.__getClass();
            return cls ? (cls[TYPE_ID_KEY]) + '' : 'undefined';
        },
        getClass : function() {
            return this.__getClass();
        },
        __getClass : function() {
            return this[CLASS_KEY];
        },
    };

    var classFields = {
        /**
         * Returns <code>true</code> if this type is the same or is a subclass
         * of the specified type.
         */
        isSubtype : function(type, includeThis) {
            if (!type || !type[TYPE_ID_KEY])
                return false;
            var result = false;
            for (var t = includeThis ? this : this[PARENT_KEY]; //
            !result && !!t && t[TYPE_ID_KEY] !== undefined; t = t[PARENT_KEY]) {
                result = t[TYPE_ID_KEY] == type[TYPE_ID_KEY];
            }
            return result;
        },

        /**
         * Returns <code>true</code> if this type is the same as the specified
         * object.
         */
        isSameType : function(type) {
            if (!type || !type[TYPE_ID_KEY])
                return false;
            return this[TYPE_ID_KEY] == type[TYPE_ID_KEY];
        },

        /**
         * Returns true if the specified object is an instance of this class
         */
        hasInstance : function(obj) {
            if (!obj || !obj.instanceOf)
                return false;
            return obj.instanceOf.call(obj, this);
        },

        /** Returns the metaclass for this class */
        getMetaClass : function() {
            return this[META_KEY];
        },

        /** Returns parent class */
        getParent : function() {
            return this[PARENT_KEY];
        },

        /** Extends this class and creates a new type */
        extend : function() {
            var meta = this.getMetaClass();
            var child = meta.createClass(this, _.toArray(arguments));
            return child;
        }

    };

    function MetaClass(options) {
        options = options || {};
        _.extend(this.instanceFields, options.instanceFields);
        _.extend(this.classFields, options.classFields);
    }
    _.extend(MetaClass.prototype, {
        instanceFields : instanceFields,

        classFields : classFields,

        extendClassFields : function(Parent, Type, args) {
            _.extend(Type, this.classFields);
            _.extend(Type, Parent);
            Type[META_KEY] = this;
            Type[TYPE_ID_KEY] = _.uniqueId('type-');
            Type[PARENT_KEY] = Parent;
        },

        extendInstanceFields : function(Type, args) {
            var Parent = Type[PARENT_KEY];
            _.extend(Type.prototype, this.instanceFields);
            if (Parent) {
                _.each(_.keys(Parent.prototype), function(key) {
                    Type.prototype[key] = Parent.prototype[key];
                });
            }
            _.each(args, function(fields) {
                _.extend(Type.prototype, fields);
            });
            Type.prototype[CLASS_KEY] = Type;
        },

        newType : function(Parent, args) {
            function Constructor() {
                if (this.initialize) {
                    this.initialize.apply(this, arguments);
                }
            }
            return Constructor;
        },

        createClass : function(Parent, args) {
            var Type = this.newType(Parent, args);
            this.extendClassFields(Parent, Type, args);
            this.extendInstanceFields(Type, args);
            return Type;
        }
    });

    var metaClass = new MetaClass();
    var Class = metaClass.createClass();
    Class.MetaClass = MetaClass;
    module.exports = Class;

