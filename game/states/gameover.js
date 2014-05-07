
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
    

    
    this.scoreBMD = this.game.add.bitmapData(this.game.width, this.game.height);
    
    this.scoreText = this.game.add.bitmapText(0,4,'minecraftia','score:\n'+this.score,8);
    this.scoreText.align = 'center';

    this.scoreboard = this.game.add.sprite(0,0, this.scoreBMD);

    this.scoreGroup = this.game.add.group();
    this.scoreGroup.add(this.scoreText);
    this.scoreGroup.add(this.scoreboard);
    this.scoreGroup.alpha = 0;

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
          if(this.scoreGroup.alpha) {
            this.game.add.tween(this.scoreGroup).to({alpha: 0}, this.obstacleRate * 2, Phaser.Easing.Linear.NONE);
            var tween = this.game.add.tween(this.scoreGroup).to({alpha: 0}, this.obstacleRate * 2, Phaser.Easing.Linear.NONE);
            tween.start();
            tween.onComplete.add(function() {
              this.game.state.start('play', true, false, this.angle, false);
            }, this);

          } else {
            this.game.state.start('play', true, false, this.angle, false);
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
    var total = this.score,
        denoms = Object.keys(this.scoreColors),
        blocks = 0,
        color = null,
        width = 2,
        height = 4,
        i,
        cols = 0,
        rows = 0,
        totalBlocks = 0,
        padding = 2,
        maxBlocksPerRow = 8,
        ctx = this.scoreBMD.ctx;
    
    function compare (a,b) {
      if (a < b) {
        return 1;
      } else {
        return -1;
      }
    }
    denoms.forEach(function(denom,index) {
      denoms[index] = parseInt(denom);
    });

    denoms.sort(compare);
    // count total blocks
    
    
    /*
    // add a block for the multiplier
    totalBlocks++;
    var d = totalBlocks > maxBlocksPerRow ? maxBlocksPerRow : totalBlocks;
    width = Math.ceil(32 / d);
    width = width || 32;
    height = Math.ceil(32 / Math.ceil(totalBlocks / maxBlocksPerRow));
    */

    denoms.forEach(function(c) {
      if(total >= c) {
        ctx.fillStyle = this.scoreColors[c];
        for(i = 0; i < Math.floor(total / c); i++) {
          var x = cols + (cols * padding) + padding;
          var y = rows + (rows * padding) + padding;
          ctx.fillRect(x, y, width,width);
          cols++;
          blocks++;
          if(blocks % maxBlocksPerRow === 0) {
            cols = 0;
            rows++;
          }
        }
        total = total % c;
      }
    }, this);
    
    this.scoreBMD.render();
    this.scoreBMD.refreshBuffer();
    
    this.game.add.tween(this.scoreGroup).to({alpha: 1}, this.obstacleRate, Phaser.Easing.Linear.NONE, true).onComplete.add(function() {
      this.fade();
    }, this);
    this.scoreboard.x = 0;
    this.scoreboard.y = this.scoreText.y - (rows * (width + padding) + padding);
    
  },
  fade: function() {
    
    this.scoreTween = this.game.add.tween(this.scoreGroup).to({alpha: 0.25}, this.obstacleRate * 2, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
    this.game.add.tween(this.sprites).to({alpha: 1}, this.obstacleRate * 2).start();
    this.isReady = true;
  }

};
module.exports = GameOver;
