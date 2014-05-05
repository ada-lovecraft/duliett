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
