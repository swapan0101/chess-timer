This ReadMe file contains a summary of the design. 

## Code Architecture

1. This is a object oriented design with event based communication between objects. 
2. Two main design patterns are used - the MVC and the observables. 
3. For the MVC, the Model is implemented in the `lib.js`, and the View and the Controller logic are implemented in the `main.js`
4. The `EventEmitter` (in `lib.js`) implements the observable pattern. 
5. The Model is made up of three classes - the `GameClock`, the `Timer`, and the `EventEmitter`. 
6. The `EventEmitter` is used by both the `Timer` and the `GameClock` class to consume and emit events. 
7. The `Gameclock` instantiates two instances of `Timer` to represent Player 1 and Player 2. 
8. The `Timer` class implements the countdown behavior using the `setInterval` function. The countdown is controlled by two supporting methods: `activate` and `halt`. 

## Primary Flow

1. main.js creates a `GameClock` object, which in turn creates the two `Timer` objects Player 1 and Player 2. 
2. When the dom is loaded ("DomContentLoaded" event), the dom is setup, and the displays for both players are initialized to the start time value provided by the `GameClock` object.
3. The button click events call the `player_<NUM>_pressed` in the `GameClock`, which halts the current countdown timer and activates the other `Player` countdown. 
4. When a countdown timer reaches 0, a `timeout` event is emitted by the `Timer` object. `GameClock` in turn emits the `winner` event. The winner event is handled in the `main.js`. 

