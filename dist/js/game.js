(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(32, 32, Phaser.CANVAS, 'lowrez-jam');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

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
    this.load.image('preloader', 'assets/preloader.gif');
    
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');

    this.game.stage.smoothed = false;
    this.game.scale.maxWidth = 640;
    this.game.scale.maxHeight = 640;

    //  Then we tell Phaser that we want it to scale up to whatever the browser can handle, but to do it proportionally
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.setScreenSize(true);
  }
};

module.exports = Boot;

},{}],6:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {

    this.titleText = this.game.add.bitmapText(200, 100, 'minecraftia','Game Over\n',64);
    
    this.congratsText = this.game.add.bitmapText(320, 200, 'minecraftia','You win!',32);

    this.instructionText = this.game.add.bitmapText(330, 300, 'minecraftia','Tap to play again!',12);
    
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],7:[function(require,module,exports){

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

},{"../prefabs/horizontalObstacle":2,"../prefabs/primative":3,"../prefabs/verticalObstacle":4}],8:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      this.sprite.inputEnabled = true;
      
      this.game.physics.arcade.enable(this.sprite);
      this.sprite.body.collideWorldBounds = true;
      this.sprite.body.bounce.setTo(1,1);
      this.sprite.body.velocity.x = this.game.rnd.integerInRange(-500,500);
      this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      this.sprite.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

    },
    clickListener: function() {
      this.game.state.start('gameover');
    }
  };
  
  module.exports = Play;
},{}],9:[function(require,module,exports){
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia.png', 'assets/fonts/minecraftia.xml');
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