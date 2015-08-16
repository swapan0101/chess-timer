(function () {

    //Making use of a observable pattern to implement event management function used to communicate change between objects
    var EventEmitter = function () {
        this.callbacks = {};
    };

    //calls the registered event handler for an event type
    EventEmitter.prototype.emit = function (event, source) {
        var cbs = this.callbacks[event];
        for (var cbi in cbs) {
            var cb = cbs[cbi];
            cb(source);
        }
    };

    //registers an event handler for a event type
    EventEmitter.prototype.on = function (event, cb) {
        if (this.callbacks[event] === undefined) {
            this.callbacks[event] = [];
        }

        this.callbacks[event].push(cb);
    };

    EventEmitter.prototype.clearAll = function () {
        this.callbacks = {};
    };


    /**
     *
     * Construct a timer that counts down form the provided time
     *
     * @param countDownFrom - Number of milliseconds to count down from
     * @return {undefined}
     */
    var Timer = function (countDownFrom) {
        this.countDownFrom = countDownFrom;
        this.active = false;
        this.currentTime = countDownFrom;
        this.intervalId = null;
        this.intervalLength = 1000;
        this.eventEmitter = new EventEmitter();
    };

    Timer.prototype.getEventEmitter = function () {
        return this.eventEmitter;
    };

    //returns currenttime in mm:ss
    Timer.prototype.getTime = function () {
        //return this.currentTime;
        var date = new Date(this.currentTime);
        var mm = date.getUTCMinutes();
        var ss = date.getSeconds();
        if (mm < 10) { mm = "0" + mm; }
        if (ss < 10) { ss = "0" + ss; }
        return (mm + ":" + ss);
    };

    Timer.prototype.activate = function () {
        this.active = true;
        this.currentTime = this.countDownFrom;
        //will call decrementTimer() every intervalLength (1 second)
        this.intervalId = setInterval(this.decrementTimer.bind(this), this.intervalLength);
        this.eventEmitter.emit("activate", this);
    };

    Timer.prototype.halt = function () {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        if (this.active === true) {
            this.eventEmitter.emit("halt", this);
            this.active = false;
        }
    };

    Timer.prototype.decrementTimer = function () {
        var currentTime = this.currentTime - this.intervalLength;
        this.currentTime = currentTime > 0 ? currentTime : 0;
        this.eventEmitter.emit("tick", this);
        if (this.currentTime === 0) {
            this.eventEmitter.emit("timeout", this);
        }
        return this.currentTime;
    };


    var GameClock = function (gameTimeMs) {
        this.gameTimeMs = gameTimeMs;
        this.populate();
        this.currentPlayer = null;

        this.eventEmitter = new EventEmitter();
    };

    GameClock.prototype.getEventEmitter = function () {
        return this.eventEmitter;
    };

    GameClock.prototype.player1Press = function () {
        this.switchPlayers(this.p2, this.p1);
    };

    GameClock.prototype.player2Press = function () {
        this.switchPlayers(this.p1, this.p2);
    };

    GameClock.prototype.switchPlayers = function (newPlayer, old) {
        newPlayer.activate();
        old.halt();
        this.currentPlayer = newPlayer;
        this.eventEmitter.emit("player-change", this);
    };

    GameClock.prototype.reset = function () {
        this.p1.eventEmitter.clearAll();
        this.p2.eventEmitter.clearAll();
        this.populate();
        this.eventEmitter.emit("reset", this);
    };

    // called directly from the constructor, instantiate two seperate timers for player1 player 2. 
    GameClock.prototype.populate = function () {
        this.p1 = new Timer(this.gameTimeMs);
        this.p2 = new Timer(this.gameTimeMs);

        this.p1.name = "Player 1";
        this.p2.name = "Player 2";

        this.attachListeners();

    };

    GameClock.prototype.attachListeners = function () {
        this.p1.eventEmitter.on("timeout", this.handleTimeout.bind(this));
        this.p2.eventEmitter.on("timeout", this.handleTimeout.bind(this));

    };
    //handler () when there is timeout - i.e. currenttime reached 0 while decrementing
    GameClock.prototype.handleTimeout = function (winner) {
        if (winner === this.p1) {
            this.winner = this.p2;
        } else if (winner === this.p2) {
            this.winner = this.p1;
        }
        this.eventEmitter.emit("winner", this);
    };

    window.ChessGameClock = window.ChessGameClock || GameClock;
})(); 

