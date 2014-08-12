var EventTrigger = new Function ();

EventTrigger.prototype.initEventTrigger = function () {
    this._listeners = {};
};

EventTrigger.prototype.initEventTriggerType = function (type) {
    if (!type) {
        return;
    }
    this._listeners[type] = [];
};

EventTrigger.prototype.hasEventListener = function (type, fn) {
    if (!this.listener) {
        return false;
    }

    if (type && !this.listener[type]) {
        return false;
    }

    return true;
};

EventTrigger.prototype.addListener = function (type, fn) {
    if (!this._listeners) {
        this.initEventTrigger();
    }
    if (!this._listeners[type]) {
        this.initEventTriggerType(type);
    }
    this._listeners[type].push(fn);

    this.emit('newListener', type, fn);
};

EventTrigger.prototype.on = EventTrigger.prototype.addListener;

EventTrigger.prototype.one = function (type, fn) {
    fn._oneTimeListener = true;
    this.addListener(type, fn);
};

EventTrigger.prototype.removeListener = function (type, fn) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (isNaN(this._listeners[type].length)) {
        return;
    }

    if (!type) {
        this.initEventTrigger();
        this.emit('removeListener', type, fn);
        return;
    }
    if (!fn) {
        this.initEventTriggerType(type);
        this.emit('removeListener', type, fn);
        return;
    }

    var self = this;
    for (var i = 0; i < this._listeners[type].length; i++) {
        (function (listener, index) {
            if (listener === fn) {
                self._listeners[type].splice(index, 1);
            }
        })(this._listeners[type][i], i);
    }
    this.emit('removeListener', type, fn);
};

EventTrigger.prototype.emit = function (type) {
    if (!this._listeners) {
        return;
    }
    if (!this._listeners[type]) {
        return;
    }
    if (isNaN(this._listeners[type].length)) {
        return;
    }

    var self = this,
        args = [].slice.call(arguments, 1);

    for (var i = 0; i < this._listeners[type].length; i++) {
        (function (listener) {
            listener.apply(self, args);
            if (listener._oneTimeListener) {
                self.removeListener(type, listener);
            }
        })(this._listeners[type][i]);
    }
};

EventTrigger.prototype.listeners = function (type) {
    if (!type) {
        return undefined;
    }
    return this._listeners[type];
};

// jquery style alias
EventTrigger.prototype.trigger = EventTrigger.prototype.emit;
EventTrigger.prototype.off = EventTrigger.prototype.removeListener;


// class method for inheritance
EventTrigger.extend = function (Klass) {
    for (var i in EventTrigger.prototype) {
        if (Klass.prototype[i]) {
            continue;
        }
        Klass.prototype[i] = EventTrigger.prototype[i];
    }
    return Klass;
};
