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
