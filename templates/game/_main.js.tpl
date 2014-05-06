'use strict';

//global variables

var Dualiet;
window.onload = function () {
  var display = document.getElementById('game-display');

  var gameCanvas = document.createElement('canvas');
  gameCanvas.setAttribute('id','game-canvas');
  var targetHeight = Math.floor(window.innerHeight / 32 * 32);
  var targetWidth = Math.floor(window.innerWidth / 32 * 32);
  var targetSize = 0;
  if(targetWidth < targetHeight) {
    targetSize = targetWidth;
  } else {
    targetSize = targetHeight;
  }
  targetSize -= 125;
  gameCanvas.width = targetSize;
  gameCanvas.height = targetSize;
  var margin = (window.innerWidth - targetSize) / 2;
  display.style.marginLeft = margin + 'px';
  
  display.appendChild(gameCanvas);

  var gameContext = gameCanvas.getContext('2d');
  Phaser.Canvas.setSmoothingEnabled(gameContext);   


  var game = new Phaser.Game(32, 32, Phaser.CANVAS, 'duliet-phaser');

  // Game States
  <% _.forEach(gameStates, function(gameState) {  %>game.state.add('<%= gameState.shortName %>', require('./states/<%= gameState.shortName %>'));
  <% }); %>

  for(var s in game.state.states) {
    if(game.state.states.hasOwnProperty(s)) {
      var state = game.state.states[s];
      state.render = function() {
        gameContext.drawImage(game.canvas, 0,0, game.width, game.height, 0, 0, gameCanvas.width, gameCanvas.height);
      }
    }
  }

  game.state.start('boot');
  
};