
'use strict';
var Menu = function () {
  this.radius = 8;
  this.cx = 16;
  this.cy = 16;
  this.angle = 0;
};
var Primative = require('../prefabs/primative');

Menu.prototype = {
  preload: function() {

  },
  create: function() {

    this.score = 0;
    console.log('menu');

    this.titleText = this.game.add.bitmapText(22,1,'minecraftia','duliett',8);
    this.titleText.tint = 0XCCCCCC;
    this.titleText.angle = 90;

    var red = Primative.createPrimative(this.game, 2, 2, '#ff4fa6');
    var blue = Primative.createPrimative(this.game, 2,2, '#00ccff');

    this.sprites = this.game.add.group();

    this.redSprite = this.game.add.sprite(16,16, red);
    this.redSprite.anchor.setTo(0.5, 0.5);
    this.blueSprite = this.game.add.sprite(16,16, blue);
    this.blueSprite.anchor.setTo(0.5, 0.5);

    this.sprites.add(this.redSprite);
    this.sprites.add(this.blueSprite);

    

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.titleTween = this.game.add.tween(this.titleText).to({alpha: 0.25}, this.obstacleRate, Phaser.Easing.Linear.NONE, true, 2571, Infinity, true);
    this.music = this.game.add.audio('music');
    this.music.play('',0,true);

    
    
  },
  update: function() { 
    if(this.cursors.right.isDown) {
      this.angle += 0.065;
    }

    if(this.cursors.left.isDown) {
      this.angle -= 0.065;
    }

    this.blueSprite.x = this.cx + this.radius * Math.cos(this.angle);
    this.blueSprite.y = this.cy + this.radius * Math.sin(this.angle);
    this.redSprite.x = this.cx - this.radius * Math.cos(this.angle);
    this.redSprite.y = this.cy - this.radius * Math.sin(this.angle);


    if((this.cursors.right.isDown || this.cursors.left.isDown) && !this.showCountdown) {
      this.titleTween.onLoop.addOnce(function() {
        this.titleTween.stop();
        if(this.titleText.alpha) {
          this.game.add.tween(this.titleText).to({alpha:0}, this.obstacleRate, Phaser.Easing.Linear.NONE,true).onComplete.add(function(){
            this.game.state.start('play',true,false, this.angle);
          }, this);
        } else {
          this.game.state.start('play',true,false, this.angle);
        }
      }, this);
    }
  }
};

module.exports = Menu;
