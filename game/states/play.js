
  'use strict';
  function Play() {
    this.obstacleRate = 857;
    this.obstacleTimer = Number.MAX_VALUE;
    this.radius = 8;
    this.cx = 16;
    this.cy = 16;
    this.angle = 0;
    this.multiplier = 0;
    this.angleMultiplier = 0;
    this.angleStart = 0;
    this.started = false;
    this.showCountdown = false;

    this.countdown = 3;
    this.countdownTimer = 0;

    this.scoreBMD = null;

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
  var HorizontalObstacle = require('../prefabs/horizontalObstacle');
  var VerticalObstacle = require('../prefabs/verticalObstacle');

  Play.prototype = {
    init: function(angle) {
      this.angle = angle || 0;
      this.started = false;
      this.showCountdown = true;

      this.countdown = 3;
      this.countdownTimer = 0;

      this.gameover = false;
      this.score = 0;
      this.angleMultiplier = 0;
      this.multiplier = 0;
      if(!this.game.sound._sounds[0].isPlaying) {
        this.game.sound._sounds[0].play();
      }
    },
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);

      var red = Primative.createPrimative(this.game, 2, 2, '#ff4fa6');
      var blue = Primative.createPrimative(this.game, 2,2, '#00ccff');
      var top = Primative.createPrimative(this.game, 32,1, '#cccccc');
      var bottom = Primative.createPrimative(this.game, 32,1, '#cccccc');
      var left = Primative.createPrimative(this.game, 1,32, '#cccccc');
      var right = Primative.createPrimative(this.game, 1,32, '#cccccc');
      
      
      this.multiplierBMD = this.game.make.bitmapData(32,32);
      this.multiplierboard = this.game.add.sprite(0,0,this.multiplierBMD);
      this.multiplierboard.alpha = 0.5;

      this.scoreBMD = this.game.make.bitmapData(8,8);
      this.scoreboard = this.game.add.sprite(16,19, this.scoreBMD);
      this.scoreboard.anchor.setTo(0.5);
      this.scoreboard.alpha = 1.0;

      

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

      this.countdownText = this.game.add.bitmapText(13,10,'minecraftia','',8);
      this.countdownText.alpha = 0;
      this.showCountdown = true;
    },
    update: function() {
      if (!this.gameover) {
        if(!this.showCountdown && (this.cursors.right.isDown || this.cursors.left.isDown)) {
          this.angleMultiplier = Math.floor(Math.abs((Math.abs(this.angleStart) - Math.abs(this.angle) ) / (Math.PI)));
          if(this.angleMultiplier > this.multiplier) {
            this.multiplier = this.angleMultiplier;
          }
          
        } else {
            this.angleMultiplier = 0;
            this.angleStart = this.angle;
        }
        
        if(this.cursors.right.isDown) {
          this.angle += 0.065;
        } else if(this.cursors.left.isDown) {
          this.angle -= 0.065;
        }
        
      }
      this.updateMultiplierDisplay();


      this.blueSprite.x = this.cx + this.radius * Math.cos(this.angle);
      this.blueSprite.y = this.cy + this.radius * Math.sin(this.angle);

      this.redSprite.x = this.cx - this.radius * Math.cos(this.angle);
      this.redSprite.y = this.cy - this.radius * Math.sin(this.angle);

      if(this.showCountdown && this.countdownTimer < this.game.time.now) {
        this.countdownText.text = this.countdown;
        this.countdownTimer = this.game.time.now + this.obstacleRate * 2;
        this.game.add.tween(this.countdownText).to({alpha:1}, this.obstacleRate)
        .to({alpha:0}, this.obstacleRate)
        .start();
        this.countdown--;
        if (this.countdown <= 0) {
          this.showCountdown = false;
          this.obstacleTimer = this.game.time.now + this.obstacleRate * 2;
          this.angleStart = this.angle;
        }
      } else if(this.obstacleTimer < this.game.time.now) {
        this.generateObstacle();
        this.obstacleTimer = this.game.time.now + this.obstacleRate;
      }

      this.game.physics.arcade.overlap(this.sprites, this.obstacles, this.obstacleHit, null, this);

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
        this.score++; 
        this.updateScoreDisplay();
    }, this);
  },
  obstacleHit: function() {
    this.obstacles.callAll('stop');
    this.obstacleTimer = Number.MAX_VALUE;
    this.gameover = true;
    
    this.game.add.tween(this.obstacles).to({alpha:0}, this.obstacleRate, Phaser.Easing.Linear.NONE, true);
    this.game.add.tween(this.sprites).to({alpha:0}, this.obstacleRate, Phaser.Easing.Linear.NONE, true).onComplete.addOnce(function() {
      this.game.state.start('gameover', true,false, this.score, this.multiplier);
    }, this);
    
  },
  shutdown: function() {
    this.showCountdown = false;
    this.countodwn = 3;
    this.sprites.destroy();
    this.obstacles.destroy();
  },
  updateScoreDisplay: function() {
    this.scoreBMD.clear();
    var ctx = this.scoreBMD.ctx;
    var padding = 1;
    var i;
    var cols = 0;
    var rows = 0;
    ctx.fillStyle = '#ccc';
    var total = this.score;
    var denoms = Object.keys(this.scoreColors);
    var blocks = 0;
    denoms.sort(function(a,b) {
      return a + b;
    });
    denoms.forEach(function(c) {
      if(total >= c) {
        ctx.fillStyle = this.scoreColors[c];
        for(i = 0; i < Math.floor(total / c); i++) {
          var x = cols + (cols * padding);
          var y = rows + (rows * padding);
          ctx.fillRect(x, y, 1,1);
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

    this.scoreBMD.render();
    this.scoreBMD.refreshBuffer();

  },

  updateMultiplierDisplay: function() {
    var radiusMultiplier = 4;
    var localMult = 0;
    var localAngleMult = 0;

    localMult = this.multiplier;


    if(localMult > 5) {
      localMult = 5;
    }
    localAngleMult = this.angleMultiplier;
    if(localAngleMult > 5) {
      localAngleMult = 5;
    }
    var ctx = this.multiplierBMD.ctx;
    this.multiplierBMD.clear();
    

    ctx.fillStyle = this.multiplierColors[localAngleMult];
    ctx.beginPath();
    ctx.arc(16,16,this.angleMultiplier * radiusMultiplier, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.strokeStyle = this.multiplierColors[localMult];
    ctx.beginPath();
    ctx.arc(16,16,this.multiplier * radiusMultiplier, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
  }

};
  
  module.exports = Play;