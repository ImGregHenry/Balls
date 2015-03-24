// Pie Chart Prototype Found Here:
//http://jsfiddle.net/lewster32/f6tf8ue9/

// Phaser current version test environment
// Configurable 'pie' progress indicator ('ring' style)

//var game = new Phaser.Game(600, 400, Phaser.AUTO, 'test');

//var BasicGame = function (game) { };

//BasicGame.Boot = function (game) { };

//BasicGame.Boot.prototype =
//{
//    preload: function ()
//    {
//        game.time.advancedTiming = true;
//    },
//    create: function ()
//    {
//        pie = new PieProgress(game, game.world.centerX, game.world.centerY, 32);
//        pie.color = "#f00";
//        game.world.add(pie);
//        pieprogress = 1.0;

//        pietween = game.add.tween(pie);
//        pietween.to({ progress: pieprogress }, 5000, Phaser.Easing.Linear.None, true); //Phaser.Easing.Quadratic.Out, true, 0, 0, true);   //Infinity
//        //pietween.onComplete.add(pietweencomplete, this);
//        pietween.start();

//        //game.add.tween(pie).to({ radius: 64 }, 1000, Phaser.Easing.Back.InOut, true, 1000, Infinity, true);

//        pie.weight = 0.75;
//        //game.add.tween(pie).to({ weight: 0.1 }, 1000, Phaser.Easing.Back.InOut, true, 500, Infinity, true);
//    }
//};

//game.state.add('Boot', BasicGame.Boot);
//game.state.start('Boot');


var pie;
var pietween;
var pieprogress;
var bmp_bulletTimePie;
var pieBulletTimeRadius = 50;
var pieBulletTimeWeight = 0.25;

var PieProgress = function (game, x, y, radius, angle, weight)
{
    Phaser.Sprite.call(this, game, x, y, bmp_bulletTimePie);
    
    this.anchor.set(0.5);
    this.angle = angle || -90;
    this.color = this.chooseColour();
    this.updateProgress();
}

PieProgress.prototype = Object.create(Phaser.Sprite.prototype);
PieProgress.prototype.constructor = PieProgress;

PieProgress.prototype.chooseColour = function ()
{
    if (bulletTime_energy > 0.5)
        return "#FFFFFF";
    else if (bulletTime_energy < 0.5)
        return "#E60A24";
}

PieProgress.prototype.updateProgress = function ()
{
    var progress = bulletTime_energy;

    progress = Phaser.Math.clamp(progress, 0.00001, 0.99999);
    
    bmp_bulletTimePie.clear();
    
    bmp_bulletTimePie.ctx.strokeStyle = this.chooseColour();
    bmp_bulletTimePie.ctx.lineWidth = pieBulletTimeWeight * pieBulletTimeRadius;
    bmp_bulletTimePie.ctx.beginPath();

    bmp_bulletTimePie.ctx.arc(bmp_bulletTimePie.width * 0.5, 
        bmp_bulletTimePie.height * 0.5, 
        pieBulletTimeRadius - 15, 0, 
        (Math.PI * 2) * progress, false);

    bmp_bulletTimePie.ctx.stroke();
    bmp_bulletTimePie.dirty = true;
};

PieProgress.prototype.updateBmdSize = function ()
{
    bmp_bulletTimePie.resize((pieBulletTimeRadius * 2) + (pieBulletTimeWeight * (pieBulletTimeRadius * 0.6)), 
        (pieBulletTimeRadius * 2) + (pieBulletTimeWeight * (pieBulletTimeRadius * 0.6)));
};

Object.defineProperty(PieProgress.prototype, 'radius', {
    get: function ()
    {
        return pieBulletTimeRadius;
    },
    set: function (val)
    {
        pieBulletTimeRadius = (val > 0 ? val : 0);
        this.updateBmdSize();
        this.updateProgress();
    }
});

Object.defineProperty(PieProgress.prototype, 'progress', {
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

Object.defineProperty(PieProgress.prototype, 'weight', {
    get: function ()
    {
        return pieBulletTimeWeight;
    },
    set: function (val)
    {
        pieBulletTimeWeight = Phaser.Math.clamp(val, 0.001, 0.999);
        this.updateBmdSize();
        this.updateProgress();
    }
});
