(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  targetSize -= 2;
  gameCanvas.width = targetSize;
  gameCanvas.height = targetSize;
  var margin = (window.innerWidth - targetSize) / 2;
  display.style.marginLeft = margin + 'px';
  
  display.appendChild(gameCanvas);

  var gameContext = gameCanvas.getContext('2d');
  Phaser.Canvas.setSmoothingEnabled(gameContext);   


  var game = new Phaser.Game(32, 32, Phaser.CANVAS, 'duliet-phaser');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

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
},{"./states/boot":5,"./states/gameover":6,"./states/menu":7,"./states/play":8,"./states/preload":9}],2:[function(require,module,exports){
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

},{"./primative":3}],3:[function(require,module,exports){
'use strict';

exports.createPrimative = function(game, width, height, color) {
  var bmd = game.make.bitmapData(width,height);
  var ctx = bmd.ctx;
  ctx.imageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.msImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.fillRect(0,0,width,height);
  ctx.closePath();
  return bmd;

};

},{}],4:[function(require,module,exports){
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

},{"./primative":3}],5:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');

  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

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

},{"../prefabs/primative":3}],7:[function(require,module,exports){

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

},{"../prefabs/primative":3}],8:[function(require,module,exports){

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
},{"../prefabs/horizontalObstacle":2,"../prefabs/primative":3,"../prefabs/verticalObstacle":4}],9:[function(require,module,exports){
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia.png', 'assets/fonts/minecraftia.xml');
    this.load.bitmapFont('minecraftia-dark', 'assets/fonts/minecraftia-dark.png', 'assets/fonts/minecraftia-dark.fnt');
    this.load.bitmapFont('pixel', 'assets/fonts/pixel-7.png', 'assets/fonts/pixel-7.fnt');
    this.load.audio('hit', 'assets/hit.wav');
    this.load.audio('music', ['assets/dream-culture.mp3','assets/dream-culture.ogg']);

  },
  create: function() {
  },
  update: function() {
    if(!!this.ready && this.cache.isSoundDecoded('music')) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])