'use strict';
var Primative = require('./primative');
var VerticalObstacle = function(game, rate) {
  var bmd = Primative.createPrimative(game,2,8,'#fff');
  Phaser.Sprite.call(this, game, 0, 0, bmd);
  
  this.tween = this.game.add.tween(this).to({x: this.game.width}, rate * 2, Phaser.Easing.Linear.NONE, true);

  this.events.onRevived.add(this.onRevived, this);
};

VerticalObstacle.prototype = Object.create(Phaser.Sprite.prototype);
VerticalObstacle.prototype.constructor = VerticalObstacle;

VerticalObstacle.prototype.update = function() {
  
  
  
};

VerticalObstacle.prototype.onRevived = function() {
  this.alpha = 1;
  this.x = -2;
  this.scale.y = 1;
  if (Phaser.Math.chanceRoll(25)) {
    this.y = 12;
  } else {
    if(Phaser.Math.chanceRoll(50)) {
      this.y = 4;
    } else {
      this.y = 20;
    }
  }
  
  this.game.physics.arcade.enableBody(this);
  this.tween.start();
  this.tween.onComplete.add(function() {
    this.kill();
  }, this);
};

VerticalObstacle.prototype.stop = function() {
  this.tween.stop();
};

module.exports = VerticalObstacle;
