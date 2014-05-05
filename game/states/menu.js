
'use strict';
function Menu() {}
var Primative = require('../prefabs/primative');
var HorizontalObstacle = require('../prefabs/horizontalObstacle');
var VerticalObstacle = require('../prefabs/verticalObstacle');
Menu.prototype = {
  preload: function() {

  },
  create: function() {
    this.score = 0;
    console.log('menu');

    this.titleText = this.game.add.bitmapText(23,0,'minecraftia','dualiet', 8);
    this.titleText.tint = 0XCCCCCC;
    this.titleText.angle = 90;

    this.scoreText = this.game.add.bitmapText(0,4,'minecraftia','score:\n' + this.score,8);
    this.scoreText.align = 'center';
    this.scoreText.alpha = 0;

    this.countdownText = this.game.add.bitmapText(12,12,'minecraftia','',8);
    this.countdownText.alpha = 0;
    
    this.game.stage.smoothed = false;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    var red = Primative.createPrimative(this.game, 2, 2, '#ff4fa6');
    var blue = Primative.createPrimative(this.game, 2,2, '#00ccff');
    var top = Primative.createPrimative(this.game, 32,1, '#cccccc');
    var bottom = Primative.createPrimative(this.game, 32,1, '#cccccc');
    var left = Primative.createPrimative(this.game, 1,32, '#cccccc');
    var right = Primative.createPrimative(this.game, 1,32, '#cccccc');

    this.sprites = this.game.add.group();
    this.sprites.enableBody = true;
    this.sprites.physicsBodyType = Phaser.Physics.ARCADE;

    this.obstacles = this.game.add.group();
    this.obstacles.enableBody = true;
    this.obstacles.physicsBodyType = Phaser.Physics.ARCADE;

    this.redSprite = this.game.add.sprite(16,16, red);
    this.redSprite.anchor.setTo(0.5, 0.5);
    this.blueSprite = this.game.add.sprite(16,16, blue);
    this.blueSprite.anchor.setTo(0.5, 0.5);

    this.sprites.add(this.redSprite);
    this.sprites.add(this.blueSprite);

    this.leftSprite = this.game.add.sprite(0,0, left);
    this.rightSprite = this.game.add.sprite(31,0, right);
    this.topSprite = this.game.add.sprite(0,0, top);
    this.bottomSprite = this.game.add.sprite(0,31, bottom);

    this.leftSprite.visible = false;
    this.rightSprite.visible = false;
    this.topSprite.visible = false;
    this.bottomSprite.visible = false;

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.obstacleRate = 857;
    this.obstacleTimer = 0;
    this.radius = 8;
    this.cx = 16;
    this.cy = 16;
    this.angle = 0;
    this.started = false;
    this.showCountdown = false;
    
    this.hitsound = this.game.add.audio('hit');

    this.countdown = 3;
    this.countdowTimer = 0;

    this.gameover = false;

    this.titleTween = this.game.add.tween(this.titleText).to({alpha: 0.25}, this.obstacleRate, Phaser.Easing.Linear.NONE, true, 2571, Infinity, true);
    this.music = this.game.add.audio('music');
    this.music.play('',0,true);

    
    
  },
  update: function() { 
    if(!this.gameover) {
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


      if(this.started) {
        if(this.obstacleTimer < this.game.time.now) {
          this.generateObstacle();
          this.obstacleTimer = this.game.time.now + this.obstacleRate;
        }
        this.game.physics.arcade.overlap(this.sprites, this.obstacles, this.obstacleHit, null, this);
      } else if((this.cursors.right.isDown || this.cursors.left.isDown) && !this.showCountdown) {
          this.titleTween.onLoop.add(function() {
            this.titleTween.stop();
            if(this.titleText.alpha || this.scoreText.alpha) {
              var text = this.titleText.alpha ? this.titleText : this.scoreText
              this.game.add.tween(text).to({alpha:0}, this.obstacleRate, Phaser.Easing.Linear.NONE,true).onComplete.add(function(){
                this.showCountdown = true;
              }, this);
            } else {
              this.showCountdown = true;
            }
        }, this);
      } else if (this.showCountdown && this.countdowTimer < this.game.time.now) {
        if(this.countdown <= 0) {
          this.started = true;
          this.score = 0;
          this.countdownText.alpha = 0;
        } else {
          this.countdownTimer = this.game.time.now + this.obstacleRate * 2;  
          this.countdownText.text = this.countdown;
          this.game.add.tween(this.countdownText).to({alpha: 1}, this.obstacleRate, Phaser.Easing.Linear.NONE, true, 0, 0, true);
          this.countdown--;
        }
     }
    }
  },
  generateObstacle: function() {

    var obstacleConstructor;
    if(Phaser.Math.chanceRoll(0)) {
      obstacleConstructor = VerticalObstacle;
    } else {
      obstacleConstructor = HorizontalObstacle;
    }
    var obstacle;
    this.obstacles.forEach(function(obs) {
      if(!obs.exists && obs.constructor === obstacleConstructor) {
        obstacle = obs;
      }
    });
    
    if(!obstacle) {
      obstacle = new obstacleConstructor(this.game, this.obstacleRate);
      this.obstacles.add(obstacle);
    }
    obstacle.revive();
    obstacle.events.onKilled.addOnce(function() {
        console.log('scored');
        this.score++; 
    }, this);
  },
  obstacleHit: function() {
    this.obstacles.callAll('stop');
    this.obstacleTimer = Number.MAX_VALUE;
    this.gameover = true;
    this.scoreText.text = 'score:\n' + this.score;
    this.game.add.tween(this.obstacles).to({alpha:0}, this.obstacleRate, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(this.sprites).to({alpha:0}, this.obstacleRate, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(this.scoreText).to({alpha:1}, this.obstacleRate*2, Phaser.Easing.Linear.NONE, true, this.obstacleRate*2).onComplete.addOnce(function() {
      this.started = false;
      this.showCountdown = false;
      this.gameover = false;
      this.countodwn = 3;
      this.game.add.tween(this.sprites).to({alpha:1}, this.obstacleRate, Phaser.Easing.Linear.NONE, true);
      this.titleTween = this.game.add.tween(this.scoreText).to({alpha: 0.25}, this.obstacleRate*2, Phaser.Easing.Linear.NONE, true, this.obstacleRate*2, Infinity, true);
      this.redSprite.angle = 0;
      this.blueSprite.angle = 0;

    }, this);
  },
  render: function() {
    
    
  }
};

module.exports = Menu;
