//determines the location of sprite on the game board in specific game levels. 
  var levelData = { 
     1:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,3,3,3,0,0,0,0],
          [0,0,0,0,2,2,2,0,0,0,0],
          [0,0,0,0,1,1,1,0,0,0,0]], //dete  
     2:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,2,2,2,2,2,2,2,0,0],
          [0,0,2,2,2,2,2,2,2,0,0],
          [0,0,1,1,1,1,1,1,1,0,0],
          [0,0,1,1,1,1,1,1,1,0,0],
          [0,0,3,3,3,3,3,3,3,0,0],
          [0,0,3,3,3,3,3,3,3,0,0]],
     3:  [[0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0],
          [0,2,2,2,2,2,2,2,2,2,0],
          [0,2,2,2,2,2,2,2,2,2,0],
          [0,1,1,1,1,1,1,1,1,1,0],
          [0,1,1,1,1,1,1,1,1,1,0],
          [0,3,3,3,3,3,3,3,3,3,0],
          [0,3,3,3,3,3,3,3,3,3,0]] };

//individual sprites defined from sheet
  var spriteData = {
    'alien1': { sx: 0,  sy: 0,  w: 22, h: 22, cls: Alien, frames: 2 },
    'alien2': { sx: 0,  sy: 22, w: 22, h: 22, cls: Alien, frames: 2 },
    'alien3': { sx: 0,  sy: 45, w: 22, h: 22, cls: Alien, frames: 2 },                                                                       
    'player': { sx: 0,  sy: 68, w: 30, h: 30, cls: Player },
    'missile': { sx: 0, sy: 99, w: 9,  h: 9, cls: Missile }
  }

  function startGame() {
    var screen = new GameScreen("Pokevaders: Shoot 'em all","press space to start",
                                 function() {                                         //Displays text to starts the game.
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
    Game.loop();
  }

  function endGame() {
    var screen = new GameScreen("Game Over","(press space to restart)",
                                 function() {                                   //Displays text for game over and to restart game once you have died.
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }


  function winGame() {
    var screen = new GameScreen("You Win!","(press space to restart)",
                                 function() {                                   //Displays text for when you've won and to restart game.
                                     Game.loadBoard(new GameBoard(1));
                                 });
    Game.loadBoard(screen);
  }

  $(function() {
    GameAudio.load({ 'fire' : 'media/pika.ogg', 'die' : 'media/die.ogg' }, 
                   function() { 
                       Game.initialize("#gameboard", levelData, spriteData,                 //This puts the audio for lasers and explosions??
                                      { "start": startGame,
                                        "die"  : endGame,
                                        "win"  : winGame });
                   });
   });



