
const MAX_BOOM_ZOOM_ANIMATIONS = 5;
const BOOM_TIMER_TICK_INVERVALS = 350;
const BOOM_LARGE_IMAGE_SCALE = 1.5;
const BOOM_SMALL_IMAGE_SCALE = 0.5;

const MAX_LEVEL_COMPLETE_ZOOM_ANIMATIONS = 50;
const LEVEL_COMPLETE_TIMER_TICK_INTERVAL = 50;
const LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE = 0.1;
var LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE_INTERVAL = 0.05;

const MAX_GAME_OVER_TICKS = 130;
const MAX_GAME_OVER_ZOOM_ANIMATIONS = 90;
const GAME_OVER_TIMER_TICK_INTERVAL = 30;
const GAME_OVER_DEFAULT_IMAGE_SCALE = 0.08;
const GAME_OVER_DEFAULT_IMAGE_SCALE_INTERVAL = 0.06;

const BULLET_TIME_PROGRESS_BAR_X = 1100;
const BULLET_TIME_PROGRESS_BAR_Y = 735;

const POWER_UP_PROGRESS_BAR_X = 1275;
const POWER_UP_PROGRESS_BAR_Y = 735;

const POWER_UP_SCOREBOARD_SNOWFLAKE_X = 1256;
const POWER_UP_SCOREBOARD_SNOWFLAKE_Y = 715;

var player;

var boomIsIconBig = false;
var boomIcon;
var boomAnimateTimer;
var boomAnimateCount = 0;
var boomSound;

var levelCompleteCounter;
var levelCompleteIcon;
var levelCompleteTimer;
var levelCompleteZoomCount = 0;

var gameOverCounter;
var gameOverIcon;
var gameOverTimer;
var gameOverZoomCount = 0;

var levelCompleteCurrentScale = LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE;
var gameOverCurrentScale = 0;



function createPowerUpPieProgressBar(isFirstCreate)
{
    if(isFirstCreate)
    {
        bmp_powerUpPie = game.add.bitmapData((piePowerUpRadius * 2) + (piePowerUpWeight * (piePowerUpRadius * 0.6)), 
            (piePowerUpRadius * 2) + (piePowerUpWeight * (piePowerUpRadius * 0.6)));
    }

    if(piePowerUp == null)
    {
        piePowerUp = new PiePowerUpProgress(game, POWER_UP_PROGRESS_BAR_X, POWER_UP_PROGRESS_BAR_Y, 50);
        piePowerUp.setVisible(false);
        game.world.add(piePowerUp);
    }

    if (piePowerUpTween != null)
    {
        game.world.remove(piePowerUpTween, true);
    }
    
    piePowerUpTween = game.add.tween(piePowerUp);
    piePowerUpTween.to({ progress: bulletTime_energy }, Infinity, Phaser.Easing.Linear.None, true);
    piePowerUpTween.start();
}

function setPowerUpPieProgressBarVisible(isSetVisible)
{
    if(piePowerUp != null)
        piePowerUp.setVisible(isSetVisible);
}

function createBulletTimePieProgressBar(isFirstCreate)
{
    if(isFirstCreate)
    {
        bmp_bulletTimePie = game.add.bitmapData((pieBulletTimeRadius * 2) + (pieBulletTimeWeight * (pieBulletTimeRadius * 0.6)), 
            (pieBulletTimeRadius * 2) + (pieBulletTimeWeight * (pieBulletTimeRadius * 0.6)));
    }

    if (pietween != null)
    {
        game.world.remove(pietween, true);
        delete pietween;
    }

    if(pie != null)
    {
        game.world.remove(pie, true);
        delete pie; 
    }
    
    pie = new PieProgress(game, BULLET_TIME_PROGRESS_BAR_X, BULLET_TIME_PROGRESS_BAR_Y, 50);
    game.world.add(pie);
    
    pietween = game.add.tween(pie);
    pietween.to({ progress: bulletTime_energy }, Infinity, Phaser.Easing.Linear.None, true); //Phaser.Easing.Quadratic.Out, true, 0, 0, true);   //Infinity
    pietween.start();
}


//TODO: reuse animation cycles between gameover/levelcomplete/boom
// Create the boom animation timer
function spawnBoomAnimation(x, y)
{
    boomSound = GetExplosionSound();
    boomSound.play();

    boomIcon = game.add.sprite(x - 30, y - 30, 'animation-boom');
    boomAnimateTimer = game.time.create(true);
    boomAnimateTimer.loop(BOOM_TIMER_TICK_INVERVALS, animateBoom, this);
    boomAnimateTimer.start();
}

// Handle the boom animations
function animateBoom()
{
    boomAnimateCount++;
    if (boomAnimateCount >= MAX_BOOM_ZOOM_ANIMATIONS)
    {
        boomAnimateCount = 0;
        boomAnimateTimer.stop();

        boomIcon.destroy();
    }
    else
    {
        if (boomIsIconBig)
            boomIcon.scale.setTo(BOOM_LARGE_IMAGE_SCALE, BOOM_LARGE_IMAGE_SCALE);
        else
            boomIcon.scale.setTo(BOOM_SMALL_IMAGE_SCALE, BOOM_SMALL_IMAGE_SCALE);

        boomIsIconBig = !boomIsIconBig;
    }
}

// Create the boom animation timer
function spawnLevelCompleteAnimation()
{
    disableAllMovementAndTimers(true);
    pauseLevelTimer(true);

    levelCompleteIcon = game.add.sprite(0, 0, 'level-complete');
        console.log("DEFAULT SIZE: " + levelCompleteIcon.width + ", " + levelCompleteIcon.height);

    levelCompleteIcon.scale.setTo(LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE, LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE);
    levelCompleteIcon.reset(calculateMapCenterRelativeToImageX(levelCompleteIcon.width),
        calculateMapCenterRelativeToImageY(levelCompleteIcon.height));
    
    console.log("DEFAULT SIZE: " + levelCompleteIcon.width + ", " + levelCompleteIcon.height);
    levelCompleteTimer = game.time.create(true);
    levelCompleteTimer.loop(LEVEL_COMPLETE_TIMER_TICK_INTERVAL, animateLevelCompleteComplete, this);
    levelCompleteTimer.start();
}

// Handle the boom animations
function animateLevelCompleteComplete()
{
    levelCompleteZoomCount++;
    if (levelCompleteZoomCount >= MAX_LEVEL_COMPLETE_ZOOM_ANIMATIONS)
    {
        levelCompleteCurrentScale = LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE;
        levelCompleteZoomCount = 0;
        levelCompleteTimer.stop();
        levelCompleteIcon.destroy();

        disableAllMovementAndTimers(false);
        levelComplete();
    }
    else
    {
        levelCompleteCurrentScale += LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE_INTERVAL;
        // Have it zoom to a larger icon
        levelCompleteIcon.scale.setTo(levelCompleteCurrentScale, levelCompleteCurrentScale);
        
        levelCompleteIcon.position = new Phaser.Point(
            calculateMapCenterRelativeToImageX(levelCompleteIcon.width),
            calculateMapCenterRelativeToImageY(levelCompleteIcon.height));
    }
}

// Create the boom animation timer
function spawnGameOverAnimation()
{
    disableAllMovementAndTimers(true);

    //TODO: calculate exact location for boom explosion
    //gameOverIcon = game.add.sprite((MAP_TILE_WIDTH * TILE_WIDTH / 2) - 140, (MAP_TILE_HEIGHT * TILE_HEIGHT / 2) - 140, 'game-over');
    gameOverIcon = game.add.sprite(calculateFullMapCenterRelativeToImageX(0), calculateMapCenterRelativeToImageY(0), 'game-over');

    gameOverIcon.scale.setTo(GAME_OVER_DEFAULT_IMAGE_SCALE, GAME_OVER_DEFAULT_IMAGE_SCALE);
    gameOverTimer = game.time.create(true);
    gameOverTimer.loop(GAME_OVER_TIMER_TICK_INTERVAL, animategameOverComplete, this);
    gameOverTimer.start();
}

// Handle the boom animations
function animategameOverComplete()
{
    gameOverZoomCount++;
    if (gameOverZoomCount >= MAX_GAME_OVER_TICKS)
    {
        gameOverCurrentScale = GAME_OVER_DEFAULT_IMAGE_SCALE;
        gameOverZoomCount = 0;
        gameOverTimer.stop();
        gameOverIcon.kill();

		submitHighScorePopup();
        //TODO: do something at end of game over animation?
    }
    else if (gameOverZoomCount <= MAX_GAME_OVER_ZOOM_ANIMATIONS)
    {
        gameOverCurrentScale += GAME_OVER_DEFAULT_IMAGE_SCALE_INTERVAL;

        // Have it zoom to a larger image
        gameOverIcon.scale.setTo(gameOverCurrentScale, gameOverCurrentScale);

        gameOverIcon.position = new Phaser.Point(
            calculateFullMapCenterRelativeToImageX(gameOverIcon.width),
            calculateMapCenterRelativeToImageY(gameOverIcon.height));
    }
}

// Game map (excludes scoreboard)
function calculateMapCenterRelativeToImageX(imageSizeX)
{
    var map_center_x = (MAP_TILE_WIDTH * TILE_WIDTH / 2);

    var x_starting_point = map_center_x - (imageSizeX / 2);
    return x_starting_point;
}

function calculateMapCenterRelativeToImageY(imageSizeY)
{
    var map_center_y = MAP_TILE_HEIGHT * TILE_HEIGHT / 2;
    
    var y_starting_point = map_center_y - (imageSizeY / 2);
    return y_starting_point;
}

// Full map (includes scoreboard)
function calculateFullMapCenterRelativeToImageX(imageSizeX)
{
    var map_center_x = (MAP_TILE_WIDTH + TILE_WIDTH) * TILE_WIDTH / 2;
    
    var x_starting_point = map_center_x - (imageSizeX / 2);
    return x_starting_point;
}