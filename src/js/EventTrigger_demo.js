/* ========================================= *
 *  define Sample CountDown Class
 * ========================================= */

function CountDown () {
    this.count = 10;
    this.startCountDown();
}

CountDown.prototype.startCountDown = function () {
    var self = this;
    this.timer = setInterval(function () {
        self.tick();
    }, 1000);
};

CountDown.prototype.tick = function () {
    this.count--;

    // emit custom event "count" with event object
    this.trigger('count', {
        count: this.count
    });

    if (this.count == 0) {
        clearInterval(this.timer);

        // emit another event "countEnd"
        this.emit('countEnd');
    }
};

// inherit EventTrigger methods
CountDown = EventTrigger.extend(CountDown);


/* ========================================= *
 *  start demo
 * ========================================= */

(function () {
    var countDown = new CountDown();

    // add event listener
    countDown.on('count', function (e) {
        var count = e.count;
        console.log('count: %d', count);
    });

    // add one-time event listener
    countDown.one('countEnd', function () {
        console.log('count end !!');

        // remove event listener
        countDown.off('count');
    });

})();
