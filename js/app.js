var gemList = ['images/Gem Blue.png', 'images/Gem Green.png'];
var locationX1 = [0, 101, 202, 303, 404];
var locationY1 = [68, 151, 234];
var score = 300;
var count = 0;
var s = document.querySelector('.score');
var gemsNumber = document.querySelector('.gem');

function reLoad() {
    window.location.reload();
}

function randomGems() {
    let rndmgem = gemList[Math.floor(Math.random() * gemList.length)];
    return rndmgem;
}

function randomX() {
    let randm = Math.floor(Math.random() * locationX1.length);
    return locationX1[randm];
}

function randomY() {
    let random = Math.floor(Math.random() * locationY1.length);
    return locationY1[random];
}

//this class represents the Enemy object
// Enemies our player must avoid.
var Enemy = function (x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for our enemies.
    this.sprite = 'images/enemy-bug.png';
}

//Update a random speed for enemies.
var enemySpeed = function () {
    return (100 + Math.floor(Math.random() * 250));
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > 500) {
        // re-assing the location of enemy
        this.x = -80;
        this.speed = enemySpeed();
    }

    //General idea of collision check from (https://github.com/aberdean/google-scholarship-fend-projects/blob/master/classic-arcade-game-clone/js/app.js)
    //This condition checks if the distance between an enemy and the player
    //on the x-axis is less than 80 pixels and on the y-axis is less than 50 pixels.   
    if ((Math.abs(player.x - this.x) <= 80) && (Math.abs(player.y - this.y) <= 50)) {
        player.x = 202;
        player.y = 400;
        if (score <= 0)
            return score = 0;
        else {
            score -= 50;
            s.innerHTML = "Score: " + score + "/300";
        }
    }
}

// Draw the enemy on the screen, required method for game.
Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

//own player class
var Player = function (x, y) {
    this.x = x;
    this.y = y;
    this.player = 'images/char-pink-girl.png';
}

// This class requires an update(), render() and
// a handleInput() method.
Player.prototype.update = function (dt) {
    //when the user accesses the water, reset it to the starting position
    // and then appear the alert(Congratulations).
    if (this.y <= 0) {
        setTimeout(() => {
            this.x = 202;
            this.y = 400;
        }, 200);
        //sweetAlert from https://sweetalert2.github.io/ 
        Swal.fire({
            type: 'success',
            title: 'Gongratulations! You Won!',
            text: "You've collected " + count + " gems with score: " + score + "/300",
            showConfirmButton: true,
            confirmButtonText: 'Play again!',
        }).then((result) => {
            if (result.value) {
                reLoad();
            }
        })
    }
}

//Draw the player on the screen.
Player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.player), this.x, this.y);
}

//Allows the user to use the arrow key.
Player.prototype.handleInput = function (key) {

    if (key == 'left' && this.x != 0) {
        this.x -= 101;
    }

    if (key == 'right' && this.x != 404) {
        this.x += 101;
    }

    if (key == 'up' && this.y != 0) {
        this.y -= 83;
    }

    if (key == 'down' && this.y != 400) {
        this.y += 83;
    }
}

//this class represents the Gem object
//A player try to collect gems that appear randomly.
var Gem = function () {
    this.gems = randomGems();
    this.locationX = randomX();
    this.locationY = randomY();
}

//The position of the gems will be updated when the player touches it.
Gem.prototype.update = function () {
    if ((this.locationX === player.x) && (this.locationY === player.y)) {
        count += 1; //the gems field increment by 1.
        gemsNumber.innerHTML = "Gems: " + count;
        this.gems = randomGems();
        this.locationX = randomX();
        this.locationY = randomY();
    }
}

//Renders the gem on the screen.
Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.gems), this.locationX, this.locationY, 90, 150);

}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = [];
var enemyLocation = [50, 140, 220];
enemyLocation.forEach(function (y) {
    allEnemies.push(new Enemy(0, y, enemySpeed()));
});
allEnemies.push(new Enemy(0, 50, enemySpeed()));
allEnemies.push(new Enemy(0, 220, enemySpeed()));

// Place the player object in a variable called player.
var player = new Player(202, 400);

//Instantiate the gem's object.
var gem = new Gem();

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
