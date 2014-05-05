
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
