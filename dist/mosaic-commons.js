/*!
 * mosaic-commons v0.0.9 | License: MIT 
 * 
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("underscore"), require("events"), require("when"));
	else if(typeof define === 'function' && define.amd)
		define(["underscore", "events", "when"], factory);
	else if(typeof exports === 'object')
		exports["mosaic-commons"] = factory(require("underscore"), require("events"), require("when"));
	else
		root["mosaic-commons"] = factory(root["underscore"], root["events"], root["when"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Mosaic = module.exports = {};
	Mosaic.Class = __webpack_require__(1);
	Mosaic.Errors = __webpack_require__(2);
	Mosaic.Events = __webpack_require__(3);
	Mosaic.P = __webpack_require__(4);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(5);

	var CLASS_KEY = '__type';
	var META_KEY = '__meta';
	var TYPE_ID_KEY = '__type_id';
	var PARENT_KEY = '__parent';

	function MetaClass(options) {
	    options = options || {};
	    _.extend(this.instanceFields, options.instanceFields);
	    _.extend(this.classFields, options.classFields);
	}
	_.extend(MetaClass.prototype, {
	    instanceFields : {
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
	    },
	    classFields : {
	        /**
	         * Returns <code>true</code> if this type is the same or is a subclass
	         * of the specified type.
	         */
	        isSubtype : function(type, includeThis) {
	            if (!type || !type[TYPE_ID_KEY]) return false;
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
	            if (!type || !type[TYPE_ID_KEY]) return false;
	            return this[TYPE_ID_KEY] == type[TYPE_ID_KEY];
	        },

	        /** Returns true if the specified object is an instance of this class */
	        hasInstance : function(obj) {
	            if (!obj || !obj.instanceOf) return false;
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

	    },

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
	            _.extend(Type.prototype, Parent.prototype);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(5);

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
	        if (value === undefined) return this.status;
	        this.status = value;
	        return this;
	    },
	    messageKey : function(value) {
	        if (value === undefined) return this._messageKey;
	        this._messageKey = value;
	        return this;
	    }
	};

	function newError(o) {
	    var obj;
	    if (o instanceof Error) {
	        obj = o;
	    } else {
	        if (_.isString(o) && o.indexOf('Error: ') === 0) {
	            o = o.substring('Error: '.length);
	        }
	        obj = new Error(o);
	    }
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
	        errObj.status = error.status || 500;
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

	module.exports = Errors;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var events = __webpack_require__(6);
	var _ = __webpack_require__(5);

	var Events = function() {
	    events.EventEmitter.apply(this, arguments);
	};

	_.extend(Events.prototype, events.EventEmitter.prototype, {
	    fire : events.EventEmitter.prototype.emit
	});

	/** Mixin methods */
	_.extend(Events, {

	    /** Listens to events produced by external objects */
	    listenTo : function(obj, event, handler, context) {
	        var listeners = this._listeners = this._listeners || [];
	        context = context || this;
	        obj.on(event, handler, context);
	        listeners.push({
	            obj : obj,
	            event : event,
	            handler : handler,
	            context : context
	        });
	    },

	    /** Removes all event listeners produced by external objects. */
	    stopListening : function(object, event) {
	        if (object) {
	            this._listeners = _.filter(this._listeners, function(listener) {
	                var keep = true;
	                var context = listener.context || this;
	                if (listener.obj == object) {
	                    if (!event || event == listener.event) {
	                        listener.obj.off(listener.event, listener.handler,
	                                context);
	                        keep = false;
	                    }
	                }
	                return keep;
	            }, this);
	        } else {
	            _.each(this._listeners, function(listener) {
	                var context = listener.context || this;
	                listener.obj.off(listener.event, listener.handler, context);
	            }, this);
	            delete this._listeners;
	        }
	    },

	    /**
	     * Trigger an event and/or a corresponding method name. Examples:
	     * 
	     * <ul>
	     * <li> `this.triggerMethod(&quot;foo&quot;)` will trigger the
	     * &quot;foo&quot; event and call the &quot;onFoo&quot; method.</li>
	     * <li> `this.triggerMethod(&quot;foo:bar&quot;) will trigger the
	     * &quot;foo:bar&quot; event and call the &quot;onFooBar&quot; method.</li>
	     * </ul>
	     * 
	     * This method was copied from Marionette.triggerMethod.
	     */
	    triggerMethod : (function() {
	        // split the event name on the :
	        var splitter = /(^|:)(\w)/gi;
	        // take the event section ("section1:section2:section3")
	        // and turn it in to uppercase name
	        function getEventName(match, prefix, eventName) {
	            return eventName.toUpperCase();
	        }
	        // actual triggerMethod name
	        var triggerMethod = function(event) {
	            // get the method name from the event name
	            var methodName = 'on' + event.replace(splitter, getEventName);
	            var method = this[methodName];
	            // trigger the event, if a trigger method exists
	            if (_.isFunction(this.fire)) {
	                this.fire.apply(this, arguments);
	            }
	            // call the onMethodName if it exists
	            if (_.isFunction(method)) {
	                // pass all arguments, except the event name
	                return method.apply(this, _.tail(arguments));
	            }
	        };
	        return triggerMethod;
	    })()
	});

	module.exports = Events;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Static methods: 
	 *    P.promise                 - Create a pending promise
	 *    P.resolve                 - Create a resolved promise
	 *    P.reject                  - Create a rejected promise
	 *    P.defer                   - Create an object with the following fields: 
	 *      - promise
	 *      - reject
	 *      - resolve
	 *    P.join                    - Join 2 or more promises
	 *    P.all                     - Resolve a list of promises
	 *    P.spread                  - Spreads the values of a promised array
	 *                                of arguments into the fulfillment callback.
	 *    P.delay                    
	 *    P.timeout                 
	 *    
	 * Wrappers for Node-style methods returning promises for invocation results: 
	 *    P.ninvoke                 - Invokes a method on an object
	 *    P.nfcall                  - Calls a Node-style static method 
	 *    P.nfapply                 - Applies specified arguments for a method
	 *    P.nresolver               - Creates a Node-style callback that will   
	 *                                resolve or reject the deferred promise.
	 *    
	 * Promise instance methods:
	 *    P.done                    - Terminates a chain of promises,
	 *                                forcing rejections to be thrown as exceptions.
	 *    P.finally                 - Calls a callback regardless of whether
	 *                                the promise is fulfilled or rejected. 

	 *     
	 */
	var LIB = __webpack_require__(7);
	function array_slice(array, count) {
	    return Array.prototype.slice.call(array, count);
	}

	function P() {
	    return LIB.apply(this, arguments);
	}
	var array = [ 'promise', 'resolve', 'reject', 'defer', 'join', 'all', 'spread' ];
	for (var i = 0; i < array.length; i++) {
	    P[array[i]] = LIB[array[i]];
	}
	P.promise = LIB.promise || function() {
	    return new P();
	};
	P.then = LIB.then || function() {
	    var p = new P();
	    return p.then.apply(p, arguments);
	};
	P.fin = function(promise, method) {
	    return promise.then(function(result) {
	        return P.then(function() {
	            return method(null, result);
	        }).then(function() {
	            return result;
	        });
	    }, function(err) {
	        return P.then(function() {
	            return method(err);
	        }).then(function() {
	            throw err;
	        });
	    });
	};
	P.timeout = LIB.timeout ? LIB.timeout : function(ms, message) {
	    var deferred = P.defer();
	    var timeoutId = setTimeout(function() {
	        message = message || //
	        "Timed out after " + ms + " ms";
	        deferred.reject(new Error(message));
	    }, ms);
	    return deferred.promise.then(function(value) {
	        clearTimeout(timeoutId);
	        return value;
	    }, function(exception) {
	        clearTimeout(timeoutId);
	        throw exception;
	    });
	};
	P.delay = LIB.delay || function(timeout) {
	    timeout = timeout || 0;
	    return P.then(function(value) {
	        var deferred = P.defer();
	        var timeoutId = setTimeout(function() {
	            deferred.resolve(value);
	        }, timeout);
	        deferred.promise.cancel = function() {
	            clearTimeout(timeoutId);
	            deferred.resolve(value);
	        };
	        return deferred.promise;
	    });
	};
	P.nresolver = function(deferred) {
	    return function(error, value) {
	        if (error) {
	            deferred.reject(error);
	        } else if (arguments.length > 2) {
	            deferred.resolve(array_slice(arguments, 1));
	        } else {
	            deferred.resolve(value);
	        }
	    };
	};
	P.nwrapper = function(object, methods) {
	    var result = {
	        instance : object
	    };
	    function addResult(name) {
	        result[name] = function() {
	            var deferred = P.defer();
	            try {
	                var args = array_slice(arguments);
	                args.push(P.nresolver(deferred));
	                object[name].apply(object, args);
	            } catch (e) {
	                deferred.reject(e);
	            }
	            return deferred.promise;
	        };
	    }
	    for (var i = 0; i < methods.length; i++) {
	        addResult(methods[i]);
	    }
	    return result;
	};
	P.ninvoke = P.ninvoke || function(object, name /* ...args */) {
	    var nodeArgs = array_slice(arguments, 2);
	    var deferred = P.defer();
	    nodeArgs.push(P.nresolver(deferred));
	    try {
	        object[name].apply(object, nodeArgs);
	    } catch (e) {
	        deferred.reject(e);
	    }
	    return deferred.promise;
	};
	P.nfapply = LIB.nfapply || function(method, args) {
	    var deferred = P.defer();
	    var nodeArgs = array_slice(args);
	    nodeArgs.push(P.nresolver(deferred));
	    try {
	        method.apply(method, nodeArgs);
	    } catch (e) {
	        deferred.reject(e);
	    }
	    return deferred.promise;
	};
	P.nfcall = LIB.nfcall || function(method/* ... args */) {
	    var args = array_slice(arguments, 1);
	    return P.nfapply(method, args);
	};

	module.exports = P;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }
/******/ ])
})
