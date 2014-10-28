
const MAX_BOOM_ZOOM_ANIMATIONS = 5;
const BOOM_TIMER_TICK_INVERVALS = 350;
const BOOM_LARGE_IMAGE_SCALE = 1.5;
const BOOM_SMALL_IMAGE_SCALE = 0.5;

const MAX_LEVEL_COMPLETE_ZOOM_ANIMATIONS = 50;
const LEVEL_COMPLETE_TIMER_TICK_INTERVAL = 50;
const LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE = 0.1;
var LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE_INTERVAL = 0.05;

const MAX_GAME_OVER_ZOOM_ANIMATIONS = 50;
const GAME_OVER_TIMER_TICK_INTERVAL = 40;
const GAME_OVER_DEFAULT_IMAGE_SCALE = 0.1;
const GAME_OVER_DEFAULT_IMAGE_SCALE_INTERVAL = 0.02;



var boomIsIconBig = false;
var boomIcon;
var boomAnimateTimer;
var boomAnimateCount = 0;

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

//TODO: reuse animation cycles between gameover/levelcomplete/boom
//TODO: use a image centering algorithm for animations


// Create the boom animation timer
function spawnBoomAnimation(x, y)
{
    //TODO: calculate exact location for boom explosion
    boomIcon = game.add.sprite(x - 30, y - 30, 'animation-boom');
    boomAnimateTimer = game.time.create(true);
    boomAnimateTimer.loop(BOOM_TIMER_TICK_INVERVALS, animateBoom, this);
    boomAnimateTimer.start();
}

// Handle the boom animations
function animateBoom()
{
    boomAnimateCount++;
    if (boomAnimateCount == MAX_BOOM_ZOOM_ANIMATIONS)
    {
        boomAnimateCount = 0;
        boomAnimateTimer.stop();

        boomIcon.kill();
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
    setPlayerMovementDisabled(true);
    setBallMovementDisabled(true);

    //TODO: calculate exact location for boom explosion
    levelCompleteIcon = game.add.sprite((MAP_TILE_WIDTH * TILE_WIDTH / 2) - 140, (MAP_TILE_HEIGHT * TILE_HEIGHT / 2) - 140, 'level-complete');
    levelCompleteIcon.scale.setTo(LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE, LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE);
    levelCompleteTimer = game.time.create(true);
    levelCompleteTimer.loop(LEVEL_COMPLETE_TIMER_TICK_INTERVAL, animateLevelCompleteComplete, this);
    levelCompleteTimer.start();
}

// Handle the boom animations
function animateLevelCompleteComplete()
{
    levelCompleteZoomCount++;
    if (levelCompleteZoomCount == MAX_LEVEL_COMPLETE_ZOOM_ANIMATIONS)
    {
        levelCompleteCurrentScale = LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE;
        levelCompleteZoomCount = 0;
        levelCompleteTimer.stop();
        levelCompleteIcon.kill();

        setPlayerMovementDisabled(false);
        setBallMovementDisabled(false);
        levelComplete();
    }
    else
    {
        levelCompleteCurrentScale += LEVEL_COMPLETE_DEFAULT_IMAGE_SCALE_INTERVAL;
        // Have it zoom to a larger icon
        levelCompleteIcon.scale.setTo(levelCompleteCurrentScale, levelCompleteCurrentScale);
    }
}

// Create the boom animation timer
function spawnGameOverAnimation()
{
    setPlayerMovementDisabled(true);
    setBallMovementDisabled(true);

    //TODO: calculate exact location for boom explosion
    gameOverIcon = game.add.sprite((MAP_TILE_WIDTH * TILE_WIDTH / 2) - 140, (MAP_TILE_HEIGHT * TILE_HEIGHT / 2) - 140, 'game-over');
    gameOverIcon.scale.setTo(GAME_OVER_DEFAULT_IMAGE_SCALE, GAME_OVER_DEFAULT_IMAGE_SCALE);
    gameOverTimer = game.time.create(true);
    gameOverTimer.loop(GAME_OVER_TIMER_TICK_INTERVAL, animategameOverComplete, this);
    gameOverTimer.start();
}

// Handle the boom animations
function animategameOverComplete()
{
    gameOverZoomCount++;
    if (gameOverZoomCount == MAX_GAME_OVER_ZOOM_ANIMATIONS)
    {
        gameOverCurrentScale = GAME_OVER_DEFAULT_IMAGE_SCALE;
        gameOverZoomCount = 0;
        gameOverTimer.stop();
        gameOverIcon.kill();

        //TODO: do something at end of game over animation?
    }
    else
    {
        gameOverCurrentScale += GAME_OVER_DEFAULT_IMAGE_SCALE_INTERVAL;
        // Have it zoom to a larger icon
        
        //TODO: adjust image center position
        //gameOverIcon.x = calculateMapCenterRelativeToImageX(gameOverIcon.body.width);
        //gameOverIcon.y = calculateMapCenterRelativeToImageY(gameOverIcon.body.height);
        gameOverIcon.scale.setTo(gameOverCurrentScale, gameOverCurrentScale);
    }
}

//TODO: use this to fix the image center problem
function calculateMapCenterRelativeToImageX(imageSizeX)
{
    var map_center_x = 0;

    map_center_x = MAP_TILE_WIDTH * TILE_WIDTH / 2;
    
    var x_starting_point = map_center_x - imageSizeX;
    return x_starting_point;
}

function calculateMapCenterRelativeToImageY(imageSizeY)
{
    var map_center_y = 0;

    map_center_y = MAP_TILE_HEIGHT * TILE_HEIGHT / 2;

    var y_starting_point = map_center_y - imageSizeY;
    return y_starting_point;
}
