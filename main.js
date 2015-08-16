(function () {
    var GameClock = window.ChessGameClock;
    var gc = new GameClock(4 * 60 * 1000);

    var writeTime = function (playerNum) {
        var playerId = "player-" + playerNum + "-time";
        var player = "p" + playerNum;
        document.getElementById(playerId).innerHTML = gc[player].getTime();
    };

    var enableButton = function (playerNum, enable) {
        var playerId = "player-" + playerNum + "-button";
        if (enable === true) {
            document.getElementById(playerId).disabled = false;
            document.getElementById(playerId).style.background = "#B8B8B8";
        }
        else {
            document.getElementById(playerId).disabled = true;
            document.getElementById(playerId).style.background = "#F8F8F8";
        }
    }

    var writeWinner = function (msg) {
        document.getElementById("winner").innerHTML = msg;
    };

    var handleGameStart = function () {

        writeTime("1");
        writeTime("2");
        enableButton("1", true);
        enableButton("2", true);
        gc.p1.eventEmitter.on("tick", function () {
            writeTime("1");
        });
        gc.p2.eventEmitter.on("tick", function () {
            writeTime("2");
        });
    };

    gc.eventEmitter.on("reset", handleGameStart);
    document.addEventListener("DOMContentLoaded", function () {
        handleGameStart();

        gc.eventEmitter.on("winner", function (game) {
            console.log("Winner", game.winner.name);
            writeWinner("The winner is <bold>" + game.winner.name + "</bold>.");
            gc.reset();
        });

        gc.eventEmitter.on("player-change", function (game) {
            console.log("Player Change:", game.currentPlayer.name);

        });

        document.getElementById("player-1-button").onclick = function () {
            enableButton("1", false);
            enableButton("2", true);
            gc.player1Press();
            writeWinner("");
            writeTime("2");
        };

        document.getElementById("player-2-button").onclick = function () {
            enableButton("2", false);
            enableButton("1", true);
            gc.player2Press();
            writeWinner("");
            writeTime("1");
        };

        document.getElementById("reset").onclick = function () {
            gc.reset();
            writeWinner("Game has been reset. Press a player button to start the game.");
        };

    });

})();
