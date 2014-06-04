
var AlienFlock = function AlienFlock() {
  this.invulnrable = true;
  this.dx = 10; this.dy = 0;
  this.hit = 1; this.lastHit = 0;               //Controls the movment of the alien flock
  this.speed = 10;

  this.draw = function() {};

//if all aliens are dead, player wins
  this.die = function() {
    if(Game.board.nextLevel()) {
      Game.loadBoard(new GameBoard(Game.board.nextLevel()));    //Detects when you've won the game
    } else {
      Game.callbacks['win']();
    }
  }

//increases speed of flock as they move down/less aliens
  this.step = function(dt) { 
    if(this.hit && this.hit != this.lastHit) {
      this.lastHit = this.hit;
      this.dy = this.speed;
    } else {
      this.dy=0;
    }
    this.dx = this.speed * this.hit;
//blocks aliens moving off board
    var max = {}, cnt = 0;
    this.board.iterate(function() {
      if(this instanceof Alien)  {
        if(!max[this.x] || this.y > max[this.x]) {
          max[this.x] = this.y; 
        }
        cnt++;
      } 
    });

    if(cnt == 0) { this.die(); } 

    this.max_y = max;
    return true;
  };

}



var Alien = function Alien(opts) {
  this.flock = opts['flock'];
  this.frame = 0;
  this.mx = 0;
}

//uses sprite data to draw alien
Alien.prototype.draw = function(canvas) {
  Sprites.draw(canvas,this.name,this.x,this.y,this.frame);
}

//tells game what to do when an alien dies
Alien.prototype.die = function() {
  GameAudio.play('die');
  this.flock.speed += 1;
  this.board.remove(this);
  this.board.score++;
}


//flock mobility 
Alien.prototype.step = function(dt) {
  //movement on x axis 
  this.mx += dt * this.flock.dx;
  //movement on y axis
  this.y += this.flock.dy;
  //speed of flock
  if(Math.abs(this.mx) > 10) {
  //how often flock shoots
  if(this.y == this.flock.max_y[this.x]) {
      this.fireSometimes();
    }
    this.x += this.mx;
    this.mx = 0;
    //tells game how many sprite frames to count
    this.frame = (this.frame+1) % 2;
    if(this.x > Game.width - Sprites.map.alien1.w * 2) this.flock.hit = -1;
    if(this.x < Sprites.map.alien1.w) this.flock.hit = 1;
  }
  return true;
}

Alien.prototype.fireSometimes = function() {
      if(Math.random()*100 < 10) {
        this.board.addSprite('missile',this.x + this.w/2 - Sprites.map.missile.w/2,         //Controls the firing on alien weapons
                                      this.y + this.h, 
                                     { dy: 100 });
      }
}

var Player = function Player(opts) { 
  this.reloading = 0;
}

//draws player 
Player.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'player',this.x,this.y);
}

//die when player is hit
Player.prototype.die = function() {
  GameAudio.play('die');
  Game.callbacks['die']();
}
//key speed and function
Player.prototype.step = function(dt) {
  if(Game.keys['left']) { this.x -= 100 * dt; }
  if(Game.keys['right']) { this.x += 100 * dt; }
  
  if(Game.keys['up']) { this.y -= 100 * dt; }
  if(Game.keys['down']) { this.y += 100 * dt; }    

  if(this.x < 0) this.x = 0;
  if(this.x > Game.width-this.w) this.x = Game.width-this.w;

  this.reloading--;
//fire and spacebar function
  if(Game.keys['fire'] && this.reloading <= 0 && this.board.missiles < 5) {         //How many missiles you can fire in a row
    GameAudio.play('fire');                                                         
    //makes missile appear when player shoots
    this.board.addSprite('missile',                                                 //Adds the missile sprite
                          this.x + this.w/2 - Sprites.map.missile.w/2,
                          this.y-this.h,
                          { dy: -100, player: true });
    this.board.missiles++;
    this.reloading = 10;                                                            //Amount of time it takes to reload
  }
  return true;
}


var Missile = function Missile(opts) {
   this.dy = opts.dy;
   this.player = opts.player;
}
//draws missile
Missile.prototype.draw = function(canvas) {
   Sprites.draw(canvas,'missile',this.x,this.y);
}

Missile.prototype.step = function(dt) {
   this.y += this.dy * dt;
//alien disappears when hit by missile
   var enemy = this.board.collide(this);
   if(enemy) { 
     enemy.die();
     return false;
   }
   return (this.y < 0 || this.y > Game.height) ? false : true;
}

Missile.prototype.die = function() {
  if(this.player) this.board.missiles--;
  if(this.board.missiles < 0) this.board.missiles=0;
   this.board.remove(this);
}
