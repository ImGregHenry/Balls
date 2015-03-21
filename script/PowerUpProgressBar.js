﻿
var piePowerUp;
var piePowerUpTween;
var piePowerUpProgress;
var piePowerUpVisible;
var bmp_powerUpPie;

var piePowerUpRadius = 50;
var piePowerUpWeight = 0.25;


var PiePowerUpProgress = function (game, x, y, radius, angle, weight)
{   
    Phaser.Sprite.call(this, game, x, y, bmp_powerUpPie);

    this.anchor.set(0.5);
    this.angle = angle || -90;
    this.color = this.chooseColour();
    this.updateProgress();
}

PiePowerUpProgress.prototype = Object.create(Phaser.Sprite.prototype);
PiePowerUpProgress.prototype.constructor = PiePowerUpProgress;

PiePowerUpProgress.prototype.setVisible = function (isSetVisible)
{
    piePowerUpVisible = isSetVisible;
}

PiePowerUpProgress.prototype.chooseColour = function ()
{
    //console.log(bulletTime_energy);
    if (bulletTime_energy > 0.5)
        return "#FFFFFF";
    else if (bulletTime_energy < 0.5)
        return "#E60A24";
}
PiePowerUpProgress.prototype.setFront = function ()
{
    game.world.bringToTop(bmp_powerUpPie);    
}
    
PiePowerUpProgress.prototype.updateProgress = function ()
{
    if(piePowerUpVisible)
    {
         var progress = bulletTime_energy;

        progress = Phaser.Math.clamp(progress, 0.00001, 0.99999);
        
        bmp_powerUpPie.clear();
        bmp_powerUpPie.ctx.strokeStyle = this.chooseColour();
        bmp_powerUpPie.ctx.lineWidth = piePowerUpWeight * piePowerUpRadius;
        bmp_powerUpPie.ctx.beginPath();
        bmp_powerUpPie.ctx.arc(bmp_powerUpPie.width * 0.5, bmp_powerUpPie.height * 0.5, piePowerUpRadius - 15, 0, (Math.PI * 2) * progress, false);
        bmp_powerUpPie.ctx.stroke();
        bmp_powerUpPie.dirty = true;
    }
    else
    {
        bmp_powerUpPie.clear();
    }
};

PiePowerUpProgress.prototype.updateBmdSize = function ()
{
    bmp_powerUpPie.resize((piePowerUpRadius * 2) + (piePowerUpWeight * (piePowerUpRadius * 0.6)), 
        (piePowerUpRadius * 2) + (piePowerUpWeight * (piePowerUpRadius * 0.6)));
};

Object.defineProperty(PiePowerUpProgress.prototype, 'radius', {
    get: function ()
    {
        return piePowerUpRadius;
    },
    set: function (val)
    {
        piePowerUpRadius = (val > 0 ? val : 0);
        this.updateBmdSize();
        this.updateProgress();
    }
});

Object.defineProperty(PiePowerUpProgress.prototype, 'progress', {
    get: function ()
    {
        return this._progress;
    },
    set: function (val)
    {
        this._progress = Phaser.Math.clamp(val, 0, 1);
        this.updateProgress();
    }
});

Object.defineProperty(PiePowerUpProgress.prototype, 'weight', {
    get: function ()
    {
        return piePowerUpWeight;
    },
    set: function (val)
    {
        piePowerUpWeight = Phaser.Math.clamp(val, 0.001, 0.999);
        this.updateBmdSize();
        this.updateProgress();
    }
});
