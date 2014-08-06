var events = require('events');
var _ = require('underscore');

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