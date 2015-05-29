/*
 *  Basics of Flappy games such as flappy bird, flappy flappy ... using a pure Javascript and canvas
 *  Copyright (C) 2015-2016 by Alaeddine Messadi
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *  
 *  written by Alaeddine Messadi
 *  https://github.com/AlaeddineMessadi/Flappy
 *  email: alaeddine.messadi@icloud.com
 */

var canvas,
ctx,
w = 800,
    h = 450;

function init() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.height = h;
    canvas.width = w;

    var player, pHeight = 20,
        pWidth = 20,
        gravity = 2.5,
        pY = 100,
        pX = 100,
        pipe, pipeY = 10,
        pipeHeight = 430,
        pipeWidth = 64,
        pipeX = 800 - (pipeWidth + 10),
        pv, pvX, pvY = 100,
        pvHeight = 150,
        game_over = false,
        hit = false,
        j = 0;
    game_loop = 20;

    function paintCanvas() {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        ctx.translate(0, 0);
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#00D1FF";
        ctx.fillRect(10, 10, w - 20, h - 20);
    }
    var rotate = function () {
        if (j < 0.9) {
            j = j + 0.1;
        } else {
            clearInterval(rotate);
        }
    };
    if (j === 0) {
        setInterval(rotate, 80);
    }
    var Player = function () {
        this.draw = function () {
            ctx.translate(pX, pY);
            ctx.rotate(Math.PI / 2 * j);
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(-pHeight * 0.5, -pWidth * 0.5, pHeight, pWidth);
            ctx.fillStyle = "#000FFF";
            ctx.fillRect(pWidth * 0.5 - 5, 0, 5, 3);

            ctx.setTransform(1, 0, 0, 1, 0, 0);
        };
    };

    var Pipe = function () {
        this.draw = function () {
            ctx.translate(pipeX, pipeY);
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(0, 0, pipeWidth, pipeHeight);
            ctx.translate(0, pvY);
            ctx.fillStyle = "#00D1FF";
            ctx.fillRect(0, 0, pipeWidth, pvHeight);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        };
    };

    function colliding()  {
        var rec1Top = pY;
        var rec1Bottom = pY + pHeight;
        var rec1Left = pX;
        var rec1Right = pX + pWidth; 
        var rec2Top = pvY + 20;
        var rec2Bottom = pvY + pvHeight + 20;
        var rec2Left = pipeX;
        var rec2Right = pipeX + pWidth; 
        if (pX >= pipeX && pX <= pipeX + pipeWidth) {
            console.log("Enter Testing Collision");
            if (rec1Bottom >= rec2Bottom || rec1Top <= rec2Top) {
                console.log("rec1Bottom " + rec1Bottom + " rec2Bottom " + rec2Bottom);
                console.log("rec1Top " + rec1Top + " rec2Top " + rec2Top);
                game_over = true;
            }
        } 
    }

    function onKeyDown() {
        var i = 0;
        var flap = function () {
            if (i <= 10) {
                i++;
                if (pY > 20) {
                    pY = pY - 10;
                }
                j = 0;
            } else {
                clearInterval(flap);
            }
        };
        if (hit === false) {
            setInterval(flap, 15);
            hit = true;
        }
    }

    function onKeyUp() {
        hit = false;
    }

    $(document).keydown(onKeyDown);
    $(document).keyup(onKeyUp);


    var drawgame = function () {
        if (game_over === false) {
            player = new Player();
            pipe = new Pipe();
            if (pY < 450 - (pHeight)) pY = pY + gravity;
            else {
                pY = pHeight;
                j = 0;
            }
            if (pipeX > 10) pipeX = pipeX - 3;
            else if (pipeWidth > 0) pipeWidth = pipeWidth - 3;
            else {
                pipeWidth = 64;
                pipeX = 800 - (pipeWidth + 10);
                pvY = Math.random() * ((450 - (pvHeight + 10)) - 10) + 10;
            }
            paintCanvas();
            pipe.draw();
            player.draw();
            colliding();
        } else {

            ctx.translate(300, 225);
            ctx.font = "30px Verdana";
            var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
            gradient.addColorStop("0", "magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");
            ctx.fillStyle = gradient;
            ctx.fillText("GameOver!", 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            clearInterval(drawgame);
        }
    };
    setInterval(drawgame, 20);
}