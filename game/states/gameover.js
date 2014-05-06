
'use strict';
function GameOver(score) {
  this.score = score;
  this.obstacleRate = 857;
  this.isReady = false;
  this.radius = 8;
  this.cx = 16;
  this.cy = 16;
  this.scoreDisplay = 0;
  this.restarting = false;

  this.scoreColors = {
      128: '#a530ff',
      64: '#e789ff',
      32: '#ffc389',
      16: '#89ff91',
      8: '#00ccff',
      4: '#ff4fa6',
      2: '#feff89',
      1: 'white'
    };
  this.multiplierColors = [
      '#380078',
      '#470096',
      '#5500b4',
      '#6300d2',
      '#7000ee'
    ];
}
var Primative = require('../prefabs/primative');

GameOver.prototype = {
  preload: function () {

  },
  init: function(score, multiplier) {
    console.log('passed score:', score);
    multiplier += 1;
    
    this.score = score;
    this.scoreDisplay = 0;
    this.multiplier = multiplier;
    this.angle = 0;
    this.isReady = false;
    this.restarting = false;
    
  },
  create: function () {
    this.game.stage.backgroundColor = '#999';

    var red = Primative.createPrimative(this.game, 2, 2, '#ff4fa6');
    var blue = Primative.createPrimative(this.game, 2,2, '#00ccff');
    

    
    this.scoreSprites = this.game.add.group();
    
    
    
    this.scoreDisplayText = this.game.add.bitmapText(2,2,'minecraftia-dark','' + this.scoreDisplay,8);
    this.scoreDisplayText.align = 'center';
    this.scoreDisplayText.alpha = 0;
    this.multiplierDisplayText = this.game.add.bitmapText(2,12,'minecraftia-dark','',8);
    this.multiplierDisplayText.align = 'center';
    this.scoreText = this.game.add.bitmapText(2,22,'minecraftia-dark','',8);
    this.scoreText.align = 'center';
    this.scoreText.alpha = 0;

    this.scoreFinalText = this.game.add.bitmapText(0,4,'minecraftia','' + this.scoreDisplay,8);
    this.scoreFinalText.align = 'center';
    this.scoreFinalText.alpha = 0;

    this.sprites = this.game.add.group();
    this.redSprite = this.game.add.sprite(16,16, red);
    this.redSprite.anchor.setTo(0.5, 0.5);
    this.blueSprite = this.game.add.sprite(16,16, blue);
    this.blueSprite.anchor.setTo(0.5, 0.5);

    this.sprites.add(this.redSprite);
    this.sprites.add(this.blueSprite);
    this.sprites.alpha = 0;


    this.cursors = this.game.input.keyboard.createCursorKeys();
    

    


   
   this.showScore();
    
  },
  update: function () {
    if(this.isReady) {
      if((this.cursors.right.isDown || this.cursors.left.isDown) && !this.restarting) {
        this.restarting = true;
        this.scoreTween.onLoop.addOnce(function() {
          this.scoreTween.stop();
          if(this.scoreFinalText.alpha) {
            console.log('creating new tween');
            var tween = this.game.add.tween(this.scoreFinalText).to({alpha: 0}, this.obstacleRate * 2, Phaser.Easing.Linear.NONE);
            tween.start();
            tween.onComplete.add(function() {
              this.game.state.start('play', true, false, this.angle);
            }, this);

          } else {
            console.log('skipping tween creation');
            this.game.state.start('play', true, false, this.angle);
          }
        }, this);
      }
      if(this.cursors.right.isDown) {
        this.angle += 0.065;
      } else if(this.cursors.left.isDown) {
        this.angle -= 0.065;
      }

      this.blueSprite.x = this.cx + this.radius * Math.cos(this.angle);
      this.blueSprite.y = this.cy + this.radius * Math.sin(this.angle);

      this.redSprite.x = this.cx - this.radius * Math.cos(this.angle);
      this.redSprite.y = this.cy - this.radius * Math.sin(this.angle);

      
    }

  },
  shutdown: function() {
    this.sprites.destroy();
  },

  showScore: function() {
    var total = this.score;
    var denoms = Object.keys(this.scoreColors);
    var blocks = 0;
    var color = null;
    var width = 4;
    var height = 4;
    var i;
    var cols = 0;
    var rows = 0;
    var totalBlocks = 0;
    var maxBlocksPerRow = 4;
    denoms.sort(function(a,b) {
      return a + b;
    });

    // count total blocks
    denoms.forEach(function(c) {
      if(total >= c) {
        color = this.scoreColors[c];
        for(i = 0; i < Math.floor(total / c); i++) {
          totalBlocks++;
        }
        total = total % c;
      }
    }, this);
    // add a block for the multiplier
    totalBlocks++;
    console.log('total blocks:', totalBlocks);
    var d = totalBlocks > maxBlocksPerRow ? maxBlocksPerRow : totalBlocks;
    console.log('d:',d);
    width = Math.ceil(32 / d);
    width = width || 32;
    height = Math.ceil(32 / Math.ceil(totalBlocks / maxBlocksPerRow));

    // reset total
    total = this.score;

    denoms.forEach(function(c) {
      if(total >= c) {
        color = this.scoreColors[c];
        for(i = 0; i < Math.floor(total / c); i++) {
          var x = cols * width;
          var y = rows * height;
          var scoreSprite = this.game.make.sprite(-width,y,new Primative.createPrimative(this.game, width, height, color));
          this.game.add.tween(scoreSprite).to({x: x}, this.obstacleRate, Phaser.Easing.Bounce.Out, true, blocks * this.obstacleRate).onComplete.add(function() {
            this.scoreDisplay += parseInt(c);
            this.scoreDisplayText.text = this.scoreDisplay;
            this.scoreDisplayText.alpha = 1;
          }, this);
          this.scoreSprites.add(scoreSprite);
          cols++;
          blocks++;
          if(blocks % 4 === 0) {
            cols = 0;
            rows++;
          }
        }
        total = total % c;
      }
    }, this);
    
    var localMult = this.multiplier > 4 ? 4 : this.multiplier;
    var x = cols * width;
    var y = rows * height;
    var scoreSprite = this.game.make.sprite(- 32 - (width * cols),y,new Primative.createPrimative(this.game, 32 - (width * cols), height, this.multiplierColors[localMult]));
    this.game.add.tween(scoreSprite).to({x: x}, this.obstacleRate, Phaser.Easing.Bounce.Out, true, blocks * this.obstacleRate).onComplete.add(function() {
      console.log('multiplier done');
      this.multiplierDisplayText.text = 'x' + this.multiplier;
      this.scoreText.text = this.scoreDisplay * this.multiplier;
      this.scoreFinalText.text = 'score:\n' + this.scoreDisplay * this.multiplier;
      
    }, this);

    blocks++;
    blocks++;
    this.game.add.tween(this.scoreText).to({alpha: 1}, this.obstacleRate, Phaser.Easing.Linear.NONE, true, blocks * this.obstacleRate).onComplete.add(function() {
      this.fade();
    }, this);
    this.scoreSprites.add(scoreSprite);
    
  },
  fade: function() {
    this.game.add.tween(this.scoreSprites).to({alpha: 0}, this.obstacleRate * 2, Phaser.Easing.Linear.NONE, true, this.obstacleRate);
    this.game.add.tween(this.scoreText).to({alpha: 0}, this.obstacleRate * 2,Phaser.Easing.Linear.NONE, true, this.obstacleRate);
    this.scoreTween = this.game.add.tween(this.scoreFinalText).to({alpha:1}, this.obstacleRate * 2, Phaser.Easing.Linear.NONE, false, this.obstacleRate, Infinity, true);
    this.scoreTween.start();
    this.scoreTween.onLoop.addOnce(function() {
      this.isReady = true;
      this.game.add.tween(this.sprites).to({alpha: 1}, this.obstacleRate).start();
    }, this);
  }

};
module.exports = GameOver;
