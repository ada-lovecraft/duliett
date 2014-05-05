'use strict';
var Primative = require('./primative');
var HorizontalObstacle = function(game, rate) {
  var bmd = Primative.createPrimative(game,8,2,'#fff');
  Phaser.Sprite.call(this, game, 0, 0, bmd);
  
  this.game.physics.arcade.enableBody(this);

  this.events.onRevived.add(this.onRevived, this);
  this.tween = this.game.add.tween(this).to({y: this.game.height}, rate * 2, Phaser.Easing.Linear.NONE);
};

HorizontalObstacle.prototype = Object.create(Phaser.Sprite.prototype);
HorizontalObstacle.prototype.constructor = HorizontalObstacle;

HorizontalObstacle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

HorizontalObstacle.prototype.onRevived = function() {
  this.y = -2;
  this.scale.x = 1;
  if (Phaser.Math.chanceRoll(25)) {
    this.x = 12;
  } else {
    if(Phaser.Math.chanceRoll(50)) {
      this.x = 4;
    } else {
      this.x = 20;
    }
  }
  
  this.tween.start();

  this.tween.onComplete.add(function() {
    this.kill();
  }, this);
};

HorizontalObstacle.prototype.stop = function() {
  this.tween.stop();
};

module.exports = HorizontalObstacle;
