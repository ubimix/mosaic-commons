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
module.exports = (function(context, require) {
    "use strict";
    var Mosaic = module.exports = require('./Mosaic');
    var LIB = require('when');
    function array_slice(array, count) {
        return Array.prototype.slice.call(array, count);
    }

    Mosaic.P = P;
    function P() {
        return LIB.apply(this, arguments);
    }
    var array = [ 'promise', 'resolve', 'reject', 'defer', 'join', 'all',
            'spread' ];
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
    P.timeout = LIB.timeout ? LIB.timeout : function(ms, message) {
        var deferred = P.defer();
        var timeoutId = context.setTimeout(function() {
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
    P.delay = LIB.delay || function(timeout, promise) {
        timeout = timeout || 0;
        promise = promise || P.promise();
        return promise.then(function(value) {
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

    return Mosaic;
})(this, require);
