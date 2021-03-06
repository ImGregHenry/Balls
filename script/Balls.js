﻿const SAFE_ZONE_ID = 1;
const DANGER_ZONE_ID = 2;
const EMPTY_ZONE_ID = 3;
const SCOREBOARD_ZONE_ID = 4;

const TILE_WIDTH = 20;
const TILE_HEIGHT = 20;
const MAP_TILE_WIDTH = 50;
const MAP_TILE_HEIGHT = 40;
const MAP_BORDER_THICKNESS = 2;
const START_NUMBER_OF_BALLS = 4;
const START_TARGET_PERCENT_COMPLETE = 65;
const START_PLAYER_LIVES = 2;
const BALL_VELOCITY = 200.0;
//const PLAYER_VELOCITY = 90;

//TODO: rearrange variables into appropriate files
var isBallMovementDisabled = false;
var isPlayerMovementDisabled = false;
var isGamePaused = false;
var isCharacterDeadAlready = false;
var isCharInDangerZone = false;
var isSoundEffectsEnabled = true;

var balls;
var cursors;

var level_numberOfBalls = 0;
var level_playerLives = 0;
var level_currentLevel = 0;
var level_percentComplete = 0.0;
var level_targetPercentComplete = 0.0;
var level_totalFilledTiles = 0;
var level_totalEmptyTiles = 0;
var level_currentScore = 0;
var level_highScore = 0;

var allBallXVelocities = [];
var allBallYVelocities = [];
var fullMapArray;


function spawnBalls()
{
    if (balls != null)
    {
        balls.destroy(true);
        allBallXVelocities = [];
        allBallYVelocities = [];
        freezeTimeBallXVelocities = [];
        freezeTimeBallYVelocities = [];
    }

    isBallMovementDisabled = false;
    
    // Create the group of balls to be used.  Enable them.
    balls = game.add.group();
    balls.enableBody = true;

    // Create all the balls
    for (var i = 0; i < level_numberOfBalls; i++)
    {
        // Create each ball with the preset values
        var minXY = getMapMinPixel();
        var maxX = getMapMaxXCoordinate();
        var maxY = getMapMaxYCoordinate();
        
        var randomXCoordinateSpawn = chooseRandomValueBetweenInterval(minXY, maxX);
        var randomYCoordinateSpawn = chooseRandomValueBetweenInterval(minXY, maxY);

        //TODO: add crazy mode where velocity chosen like this
        //const TOTAL_BALL_VELOCITY = 400;
        //var xVelocity = chooseRandomValueBetweenInterval(0, TOTAL_BALL_VELOCITY);
        //var yVelocity = TOTAL_BALL_VELOCITY - xVelocity;

        //var ball = balls.create(i * 100 + 100, i * 50 + 50, 'ball');
        var ball = balls.create(randomXCoordinateSpawn, randomYCoordinateSpawn, 'ball');
        ball.body.velocity.x = BALL_VELOCITY * randomPositiveNegative();
        ball.body.velocity.y = BALL_VELOCITY * randomPositiveNegative();
        ball.body.collideWorldBounds = true;
        ball.body.bounce.y = 1;
        ball.body.bounce.x = 1;

        balls.add(ball);
    }
}

function randomPositiveNegative()
{
    return Math.random() < 0.5 ? -1.0 : 1.0;
}

function chooseRandomValueBetweenInterval(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Minimum pixel for x and y within map
function getMapMinPixel()
{
    return MAP_BORDER_THICKNESS * TILE_WIDTH;
}

// Maximum pixel for x within map
function getMapMaxXCoordinate()
{
    return (MAP_TILE_WIDTH * TILE_WIDTH) - ((1 + MAP_BORDER_THICKNESS) * TILE_WIDTH);
}

// Maximum pixel for y within map
function getMapMaxYCoordinate()
{
    return (MAP_TILE_HEIGHT * TILE_HEIGHT) - ((1 + MAP_BORDER_THICKNESS) * TILE_HEIGHT);
}
