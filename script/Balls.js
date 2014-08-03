const SAFE_ZONE_ID = 1;
const DANGER_ZONE_ID = 2;
const EMPTY_ZONE_ID = 3;
const SCOREBOARD_ZONE_ID = 4;



const TILE_WIDTH = 20;
const TILE_HEIGHT = 20;
const MAP_TILE_WIDTH = 50;
const MAP_TILE_HEIGHT = 40;
const MAP_BORDER_THICKNESS = 2;
const MAX_BOOM_ANIMATIONS = 5;
const BOOM_TIMER_INVERVALS = 350;
const START_NUMBER_OF_BALLS = 4;
const START_TARGET_PERCENT_COMPLETE = 70;
const START_PLAYER_START_LIVES = 2;
//const PLAYER_VELOCITY = 90;

var game = new Phaser.Game(1400, 800, Phaser.CANVAS, 'BALLS', { preload: preload, create: create, update: update });

var isBallMovementDisabled = false;
var isPlayerMovementDisabled = false;
var isGamePaused = false;
var isCharacterDeadAlready = false;
var isCharInDangerZone = false;

var scoreboard_currentLevel;
var scoreboard_targetPercentComplete;
var scoreboard_pauseButton;
var scoreboard_restartButton;
var scoreboard_playerLives;

var map;
var mapLayer;
var balls;
var cursors;
var playerTween = null;

var level_numberOfBalls;
var level_playerLives;
var level_currentLevel;
var level_percentComplete;
var level_targetPercentComplete;
var level_totalFilledTiles;
var level_totalEmptyTiles;
var scoreboard_percentCompleteTextBlock;

var allBallXVelocities = [];
var allBallYVelocities = [];
var endangeredTiles = [];
var fullMapArray;

var boomIsIconBig = false;
var boomIcon;
var boomAnimateCount = 0;
var boomAnimateTimer;
var timerBetweenRounds;




function preload()
{
    game.load.tilemap('map', 'assets/maps/TileMap5.json', null, Phaser.Tilemap.TILED_JSON);
 
    game.load.image('ball', 'assets/star.png');
    game.load.image('character', 'assets/ball1.png');
    game.load.image('tile-danger-zone', 'assets/tile-danger-zone.png', true);
    game.load.image('tile-safe-zone', 'assets/tile-safe-zone.png', true);
    game.load.image('tile-empty', 'assets/tile-empty.png', true);
    game.load.image('tile-scoreboard', 'assets/tile-scoreboard.png', true);
    game.load.image('scoreboard-restart-button', 'assets/RestartButton.png', true);
    game.load.image('scoreboard-pause-button', 'assets/PauseButton.png', true);
    game.load.image('level-complete', 'assets/level_complete.png', true);
    game.load.image('animation-boom', 'assets/boom.png', true);
}


function create()
{
    game.stage.backgroundColor = '#FFFFFF';

    drawMap();

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create the character
    player = game.add.sprite(0, 0, 'character');
    
    //  We need to enable physics on the player            
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    level_currentLevel = 1;
    nextLevelUpdates();

    spawnBalls();
    
    // Load the keyboard controls
    cursors = game.input.keyboard.createCursorKeys();

    createScoreboard();

    
    level_totalEmptyTiles = (MAP_TILE_HEIGHT - (2*MAP_BORDER_THICKNESS)) * (MAP_TILE_WIDTH - (2*MAP_BORDER_THICKNESS));
    level_totalFilledTiles = 0;
}

function drawMap()
{
    if (map != null)
    {
        map.destroy();
    }

    map = game.add.tilemap('map');
    
    // Disable collisions on empty zone spaces, enable collisions with every other tile
    map.setCollisionByExclusion([parseInt(EMPTY_ZONE_ID)], 1);

    // Add all the tile sets being used on the map
    map.addTilesetImage('tile-scoreboard', 'tile-scoreboard', 20, 20, 0, 0, 1);
    map.addTilesetImage('tile-safe-zone', 'tile-safe-zone', 20, 20, 0, 0, 1);
    map.addTilesetImage('tile-danger-zone', 'tile-danger-zone', 20, 20, 0, 0, 2);
    map.addTilesetImage('tile-empty', 'tile-empty', 20, 20, 0, 0, 3);

    // Create the layer from the .json file
    mapLayer = map.createLayer('Tile Layer 1');
    mapLayer.resizeWorld();

    // Used for flood-fill-analysis
    createTileMapArray();
}

function spawnBalls()
{
    if (balls != null)
    {
        balls.removeAll(true, true);
        allBallXVelocities = [];
        allBallYVelocities = [];
    }

    isBallMovementDisabled = false;
    
    // Create the group of balls to be used.  Enable them.
    balls = game.add.group();
    balls.enableBody = true;

    // Create all the balls
    for (var i = 0; i < level_numberOfBalls; i++)
    {
        // Create each ball with the preset values
        var minXY = MAP_BORDER_THICKNESS * 20;
        var maxX = (MAP_TILE_WIDTH*20) - ((1+ MAP_BORDER_THICKNESS) * 20);
        var maxY = (MAP_TILE_HEIGHT * 20) - ((1+MAP_BORDER_THICKNESS) * 20);
        
        var randomXCoordinateSpawn = chooseRandomValueBetweenInterval(minXY, maxX);
        var randomYCoordinateSpawn = chooseRandomValueBetweenInterval(minXY, maxY);
        //console.log("ChosenX: " + randomXCoordinateSpawn + ". minX:" + minXY + ". maxX:" + maxX);
        //console.log("ChosenY: " + randomYCoordinateSpawn + ". minY:" + minXY + ". maxY:" + maxY);

        //TODO: add crazy mode where velocity chosen like this
        //const TOTAL_BALL_VELOCITY = 400;
        //var xVelocity = chooseRandomValueBetweenInterval(0, TOTAL_BALL_VELOCITY);
        //var yVelocity = TOTAL_BALL_VELOCITY - xVelocity;

        //var ball = balls.create(i * 100 + 100, i * 50 + 50, 'ball');
        var ball = balls.create(randomXCoordinateSpawn, randomYCoordinateSpawn, 'ball');
        ball.body.velocity.x = 200;
        ball.body.velocity.y = 200;
        ball.body.collideWorldBounds = true;
        ball.body.bounce.y = 1;
        ball.body.bounce.x = 1;

        balls.add(ball);
    }
}

function chooseRandomValueBetweenInterval(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function pauseGame()
{
    // Toggle game paused
    isGamePaused = !isGamePaused;
    console.log("isPaused:" + isGamePaused);
    setPlayerMovementDisabled(isGamePaused);
    setBallMovementDisabled(isGamePaused);
}

function setPlayerMovementDisabled(isDisabled)
{
    isPlayerMovementDisabled = isDisabled;
    console.log("isPlayerDisabled: " + isPlayerMovementDisabled);

    // Prevent tweening of character
    if (playerTween != null)
    {
        if (isPlayerMovementDisabled)
            playerTween.pause();
        else
            playerTween.resume();
    }
}

function setBallMovementDisabled(isDisabled)
{
    isBallMovementDisabled = isDisabled;
    console.log("isBallMovementDisabled: " + isBallMovementDisabled);
    for(var i = 0; i < balls.length; i++)
    {
        // Store velocities and set them to 0
        if(isBallMovementDisabled)
        {
            allBallXVelocities[i] = balls.getAt(i).body.velocity.x;
            allBallYVelocities[i] = balls.getAt(i).body.velocity.y;
            balls.getAt(i).body.velocity.x = 0;
            balls.getAt(i).body.velocity.y = 0;
        }
        // Restore velocities and reset array
        else
        {
            balls.getAt(i).body.velocity.x = allBallXVelocities[i];
            balls.getAt(i).body.velocity.y = allBallYVelocities[i];
        }    
    }
}

function nextLevelUpdates()
{
    // Handle reset game
    if (level_currentLevel == 1)
    {
        level_numberOfBalls = START_NUMBER_OF_BALLS;
        level_playerLives = START_PLAYER_START_LIVES;
        level_targetPercentComplete = START_TARGET_PERCENT_COMPLETE;
    }
    // Increment level difficulty
    else
    {
        level_numberOfBalls++;
        level_playerLives++;

        // Max difficult is 90%
        if (level_targetPercentComplete != 90)
            level_targetPercentComplete++;
    }
}

function restartGame()
{
    isGamePaused = false;
    
    level_playerLives = PLAYER_START_LIVES;

    // Reset the list of endangered tiles
    endangeredTiles = [];

    // Stop all player tweens
    if (playerTween != null)
        playerTween.stop();
    playerTween = null;

    // Go through process of restarting the game
    drawMap();

    sendCharacterBackToStart();
    if (isPlayerMovementDisabled) setPlayerMovementDisabled(false);

    spawnBalls();
    
    createScoreboard();
}

// Create/recreate the scoreboard when needed
function createScoreboard()
{
    var scoreboardXStartingPoint = TILE_WIDTH * MAP_TILE_WIDTH + 20;

    var text;
    var style = { font: "30px Arial", fill: "#ff0044" };
    var yCoordinate = 0;

    // Percent complete
    // The null test handles updating this scoreboard - destroy the old component
    if (scoreboard_percentCompleteTextBlock != null)
        scoreboard_percentCompleteTextBlock.destroy(true);
    text = "Percent Complete: 0%."
    scoreboard_percentCompleteTextBlock = game.add.text(scoreboardXStartingPoint, yCoordinate, text, style);
    yCoordinate += 50;
    
    // Target Percent Complete
    if (scoreboard_targetPercentComplete != null)
        scoreboard_targetPercentComplete.destroy(true);
    text = "Target Percentage: " + level_targetPercentComplete + "%."
    scoreboard_targetPercentComplete = game.add.text(scoreboardXStartingPoint, yCoordinate, text, style);
    yCoordinate += 50;

    // Percent complete
    // The null test handles updating this scoreboard - destroy the old component
    if (scoreboard_currentLevel != null)
        scoreboard_currentLevel.destroy(true);
    text = "Level: " + level_currentLevel + ".";
    scoreboard_currentLevel = game.add.text(scoreboardXStartingPoint, yCoordinate, text, style);
    yCoordinate += 50;


    // Player Lives    
    if (scoreboard_playerLives != null)
        scoreboard_playerLives.destroy(true);
    text = "Character Lives: " + level_playerLives + ".";

    scoreboard_playerLives = game.add.text(scoreboardXStartingPoint, yCoordinate, text, style);
    yCoordinate += 100;

    // Restart button
    if (scoreboard_restartButton != null)
        scoreboard_restartButton.destroy(true);

    scoreboard_restartButton = game.add.button(scoreboardXStartingPoint, yCoordinate, 'scoreboard-restart-button', restartGame, this, 2, 1, 0);
    yCoordinate += 100;

    // Pause button
    if (scoreboard_pauseButton != null)
        scoreboard_pauseButton.destroy(true);

    scoreboard_pauseButton = game.add.button(scoreboardXStartingPoint, yCoordinate, 'scoreboard-pause-button', pauseGame, this, 2, 1, 0);
}

function updateScoreboard()
{
    // update percent
    level_percentComplete = Math.round(100 * level_totalFilledTiles / level_totalEmptyTiles);
    scoreboard_percentCompleteTextBlock.setText("Percent Complete: " + level_percentComplete + "%.");
    
    scoreboard_playerLives.setText("Character Lives: " + level_playerLives + ".");
}

function levelComplete()
{
    //TODO: add animation for end of level
    level_currentLevel++;
    level_percentComplete = 0;
    level_totalFilledTiles = 0;

    nextLevelUpdates();

    drawMap();
    
    sendCharacterBackToStart();

    spawnBalls();

    createScoreboard();
}

function isLevelComplete()
{
    if (level_percentComplete >= level_targetPercentComplete)
        return true;
    else
        return false;
}

//TODO: rename this function to something more descriptive
function fillTiles()
{   
    var x = getPlayerXTileIndex();
    var y = getPlayerYTileIndex();

    var currentTile = map.getTile(x, y,mapLayer, false);
    
    if (currentTile == null)
        console.log("ERROR: tile not found.");
    else if(currentTile.index == EMPTY_ZONE_ID)
    {
        isCharInDangerZone = true;
        map.fill(DANGER_ZONE_ID, x, y, 1, 1, mapLayer);

        currentTile.setCollisionCallback(characterDiedStartRoundStartTimers, this);
        
        // Track tiles in our array for flood-fill usage
        updateTileMapArray(x, y, DANGER_ZONE_ID);

        endangeredTiles.push(x + "," + y);
    }
    else if (currentTile.index == DANGER_ZONE_ID)
    {
        // TODO: character cannot re-enter a danger-zone tile
    }
    else if(currentTile.index == SAFE_ZONE_ID)
    {
        if (isCharInDangerZone)
        {
            // Reset danger flag
            isCharInDangerZone = false;

            // Start flood-fill algorithm
            processFloodFlowFromArray(endangeredTiles);

            // Safely cleared tiles.  Reset them to 'safe-zone' tiles
            clearEndangeredTiles(true);

            if(isLevelComplete())
            {
                levelComplete();
            }
        }
    }

    return currentTile;
}

// Convert 'danger-zone' tiles to 'safe-zone' or empty tiles
function clearEndangeredTiles(isSafeTile)
{
    // Loop through all the endangered tiles and set them to SAFE_ZONE
    for (var i = 0; i < endangeredTiles.length; i++)
    {
        // stored as ['1,1', '2,2', 3,5']
        var x = parseInt(endangeredTiles[i].split(",")[0]);
        var y = parseInt(endangeredTiles[i].split(",")[1]);

        updateMapTile(x, y, isSafeTile);
        //console.log("Clearing: " + vals[0] + "," + vals[1] + " OF " + endangeredTiles.length + ". isSafe: " + isSafeTile);
    }
    
    // Reset the endangered tiles array
    endangeredTiles = [];
}

function updateMapTile(x, y, isSafeTile)
{
    // Get the current tile that was just converted to a safe zone
    var currentTile = map.getTile(x, y, mapLayer, false);

    // Clear the death method from the tile
    currentTile.setCollisionCallback(null, this);

    // Redraw the tile to the appropriate tile type --> based on whether clearing was successful (player didn't die)
    if (isSafeTile)
    {
        map.fill(SAFE_ZONE_ID, x, y, 1, 1, mapLayer);

        // Enable collision since it is now a safe-zone tile
        currentTile.setCollision(true, true, true, true);

        // Increment the tile counter
        level_totalFilledTiles++;

        // Keep the tile-map-array up-to-date
        updateTileMapArray(x, y, SAFE_ZONE_ID);

        // Update score of percent filled
        updateScoreboard();
    }
    else
    {
        // Redraw the tile
        map.fill(EMPTY_ZONE_ID, x, y, 1, 1, mapLayer);

        updateTileMapArray(x, y, EMPTY_ZONE_ID);

        // Disable collisions on this tile since it is now an empty-zone
        currentTile.setCollision(false, false, false, false);
    }
}

// Add the timers that handles the boom animation and the beginning of the next round
function characterDiedStartRoundStartTimers(tileContext)
{
    if (!isCharacterDeadAlready)
    {
        // Avoid duplicating timers
        isCharacterDeadAlready = true;

        // Disable all movement
        setBallMovementDisabled(true);
        setPlayerMovementDisabled(true);

        // Create the boom animation
        spawnBoomAnimation(tileContext.x, tileContext.y);

        // Create a timer that waits for the completion of the boom animation
        timerBetweenRounds = game.time.create(true);
        timerBetweenRounds.add(BOOM_TIMER_INVERVALS*MAX_BOOM_ANIMATIONS, characterDiedHandler, this);
        timerBetweenRounds.start();
    }
}

// Handlers resetting character after death.  
function characterDiedHandler()
{
    // Launches gameover if out of lives.
    if (level_playerLives == 0)
    {
        endangeredTiles = [];
        setBallMovementDisabled(true);
        setPlayerMovementDisabled(true);
        gameOver();
    }
    else
    {
        level_playerLives--;

        setBallMovementDisabled(false);
        setPlayerMovementDisabled(false);

        updateScoreboard();
        sendCharacterBackToStart();
        clearEndangeredTiles(false);
    }
}

function gameOver()
{
    //TODO: add game over animation
}

// Create the boom animation timer
function spawnBoomAnimation(x, y)
{
    //TODO: calculate exact location for boom explosion
    boomIcon = game.add.sprite(x-30, y-30, 'animation-boom');
    boomAnimateTimer = game.time.create(true);
    boomAnimateTimer.loop(BOOM_TIMER_INVERVALS, animateBoom, this);
    boomAnimateTimer.start();
}

// Handle the boom animations
function animateBoom()
{
    boomAnimateCount++;
    if (boomAnimateCount == MAX_BOOM_ANIMATIONS)
    {
        boomAnimateCount = 0;
        boomAnimateTimer.stop();
        
        boomIcon.kill();
    }
    else
    {
        if (boomIsIconBig)
            boomIcon.scale.setTo(1.5, 1.5);
        else
            boomIcon.scale.setTo(0.5, 0.5);

        boomIsIconBig = !boomIsIconBig;
    }
    
}

// Reset character back to start 
function sendCharacterBackToStart()
{
    clearDangerTilesInTileMapArray();

    isCharInDangerZone = false;
    isCharacterDeadAlready = false;

    // Reset the character tween if it is in progress
    if (playerTween != null && playerTween.isRunning)
    {
        playerTween.stop();
    }
    player.destroy(true);
    player = game.add.sprite(0, 0, 'character');
    
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    player.body.position.x = 0;
    player.body.position.y = 0;
}

// Get tile X-index within the tilemap
function getPlayerXTileIndex()
{
    var position = player.body.x;

    return Math.round(position / TILE_WIDTH);
}

// Get the tile Y-index within the tilemap
function getPlayerYTileIndex()
{
    var position = player.body.y;

    return Math.round(position / TILE_HEIGHT);
}

// Animates player movement via tweening
function startPlayerTween(x, y)
{
    if (playerTween == null || !playerTween.isRunning)
    {
        playerTween = game.add.tween(player);
        //playerTween = new Phaser.Tween(player, game, playerTweenManager);
        playerTween.onComplete.add(playerTweenComplete, this);
        playerTween.to({ x: x, y: y }, 50, Phaser.Easing.Linear.None, true);   //Phaser.Easing.Quadratic.InOut
        playerTween.start();
    }
}

// UPDATE: called constantly and handles user's controls
function update()
{
    if (!isGamePaused && !isPlayerMovementDisabled)
    {
        game.physics.arcade.collide(balls, balls);
        game.physics.arcade.collide(balls, mapLayer);

        var playerXTile = getPlayerXTileIndex();
        var playerYTile = getPlayerYTileIndex();

        // TODO: test whether move is valid or not before tweening
        if (cursors.left.isDown)
        {
            var currentTile = map.getTile(playerXTile - 1, playerYTile, mapLayer, false);

            if (currentTile != null)
            {
                startPlayerTween(player.body.x - 20, player.body.y);
            }
        }
        else if (cursors.right.isDown)
        {
            var currentTile = map.getTile(playerXTile + 1, playerYTile, mapLayer, false);

            //TODO: fix this scoreboard issue.
            // Prevent character from entering scoreboard area
            if (currentTile.index != SCOREBOARD_ZONE_ID)
            {
                startPlayerTween(player.body.x + 20, player.body.y);
            }
        }
        else if (cursors.up.isDown)
        {
            var currentTile = map.getTile(playerXTile, playerYTile - 1, mapLayer, false);

            if (currentTile != null)
            {
                startPlayerTween(player.body.x, player.body.y - 20);
            }
        }
        else if (cursors.down.isDown)
        {
            var currentTile = map.getTile(playerXTile, playerYTile + 1, mapLayer, false);

            if (currentTile != null)
            {
                startPlayerTween(player.body.x, player.body.y + 20);
            }
        }
    }
}

// Handles post-tweening events for player movement
function playerTweenComplete()
{
    fillTiles();
}

// Creates a tilemap array for tracking tile values (used for flood-filling)
function createTileMapArray()
{
    fullMapArray = [];
    for (var y = 0; y < MAP_TILE_HEIGHT; y++)
    {
        var rowArray = [];
        for (var x = 0; x < MAP_TILE_WIDTH; x++)
        {
            var index = map.getTile(x, y).index;
            rowArray.push(index);
        }
        fullMapArray.push(rowArray);
    }
}

function clearDangerTilesInTileMapArray(value)
{
    for (var y = 0; y < MAP_TILE_HEIGHT; y++)
    {
        for (var x = 0; x < MAP_TILE_WIDTH; x++)
        {
            if (fullMapArray[y][x] == DANGER_ZONE_ID)
                fullMapArray[y][x] = value;
            
        }
    }
}


function updateTileMapArray(x, y, value)
{
    fullMapArray[y][x] = value;
    //var currentTile = map.getTile(parseInt(x), parseInt(y), mapLayer, false);
    //TODO: fix this tile map update????
}




//RAY CASTING WIKI
//https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm
// MY QUESTION:
//http://stackoverflow.com/questions/25089749/tile-filling-algorithm-for-game/25089932#25090212

//BORDER SOLUTION
//http://gamedev.stackexchange.com/questions/73722/determine-if-a-set-of-tiles-on-a-grid-forms-an-enclosed-shape

/////////////////////////////////////////////
/////////////////////////////////////////////
//////////   DR FILL ALGORITHM     //////////
/////////////////////////////////////////////
/////////////////////////////////////////////

function processFloodFlowFromArray(tilePath)
{
    //console.log("Entered Flood-Fill.");

    var startTiles = [];
    startTiles = ChooseFloodFillStartTiles(tilePath);
    
    CreateEnemyTileArray();
    
    //console.log("ENEMY: " + flood_enemyTileArray);

    for (var i = 0; i < startTiles.length; i++)
    {
        var x = parseInt(startTiles[i].split(',')[0]);
        var y = parseInt(startTiles[i].split(',')[1]);
        FloodFillAreaFromStartPoint(x, y);
    }
    
}

function updateTheseTiles(theseTiles, value)
{
    for(var i = 0; i < theseTiles.length; i++)
    {
        var x = theseTiles[i].split(',')[0];
        var y = theseTiles[i].split(',')[1];
        
        updateTileMapArray(x, y, value);
        updateMapTile(parseInt(x), parseInt(y), true);
    }
}

var flood_enemyTileArray = [];
function CreateEnemyTileArray()
{
    flood_enemyTileArray = [];

    for(var i = 0; i < level_numberOfBalls; i++)
    {
        var enemy = balls.getAt(i);
        flood_enemyTileArray.push(getEnemyXTileIndex(enemy) + "," + getEnemyYTileIndex(enemy));
    }
}

//TODO: merge this previously used function "getPlayerXTileIndex" and "getPlayerYTileIndex"
// Get tile X-index within the tilemap
function getEnemyXTileIndex(enemy)
{
    var position = enemy.body.x + 10;

    return Math.round(position / TILE_WIDTH);
}

// Get the tile Y-index within the tilemap
function getEnemyYTileIndex(enemy)
{
    var position = enemy.body.y + 10;

    return Math.round(position / TILE_HEIGHT);
}


function ChooseFloodFillStartTiles(tilePath)
{
    //TODO: determine which tiles to test with   
    var x = parseInt(tilePath[0].split(',')[0]);
    var y = parseInt(tilePath[0].split(',')[1]);
    //console.log("Flood Fill start: " + x + "," + y);

    // RIGHT
    var test1X = x + 1;
    var test1Y = y;
    // LEFT
    var test2X = x - 1;
    var test2Y = y;
    // UP
    var test3X = x;
    var test3Y = y - 1 ;
    // DOWN
    var test4X = x;
    var test4Y = y + 1;


    var flood_startTiles = [];
    
    var currentTile = map.getTile(test1X, test1Y, mapLayer, false);
    //console.log("TestPoint1: " + test1X + "," + test1Y + ". Index:" + currentTile.index);
    if (currentTile.index == EMPTY_ZONE_ID) flood_startTiles.push(test1X + "," + test1Y);

    currentTile = map.getTile(test2X, test2Y, mapLayer, false);
    //console.log("TestPoint2: " + test2X + "," + test2Y + ". Index:" + currentTile.index);
    if (currentTile.index == EMPTY_ZONE_ID) flood_startTiles.push(test2X + "," + test2Y);

    currentTile = map.getTile(test3X, test3Y, mapLayer, false);
    //console.log("TestPoint3: " + test3X + "," + test3Y + ". Index:" + currentTile.index);
    if (currentTile.index == EMPTY_ZONE_ID) flood_startTiles.push(test3X + "," + test3Y);

    currentTile = map.getTile(test4X, test4Y, mapLayer, false);
    //console.log("TestPoint4: " + test4X + "," + test4Y + ". Index:" + currentTile.index);
    if (currentTile.index == EMPTY_ZONE_ID) flood_startTiles.push(test4X + "," + test4Y);

    //console.log("Total points being tested: " + flood_startTiles.length);
    return flood_startTiles;
}

function FloodFillAreaFromStartPoint(currX, currY)
{
    //console.log("STARTING DR. FILL TEST.  X:" + currX + ". Y:" + currY);
    drFillSafeTest(currX, currY);
}

////http://stackoverflow.com/questions/22645767/flood-fill-for-2d-int-array-optimization-in-java
////http://stackoverflow.com/questions/22053759/multidimensional-array-fill

var fillTheseTiles = [];

function drFillSafeTest(x, y)
{
    fillTheseTiles = [];
    flood_abort = false;

    flow(parseInt(x), parseInt(y));

    //TODO: handle single tile case???
    //Add the original tile to the list
    if(fillTheseTiles.length != 0)
        fillTheseTiles.push(x + "," + y);
    
    // Update the tiles into the map and the map-array-tracker
    updateTheseTiles(fillTheseTiles, SAFE_ZONE_ID);
}

var flood_abort;
function flow(x, y)
{
    if (flood_abort)
        return;

    // bounds check what we were passed
    if (y >= 0 && y < fullMapArray.length && x >= 0 && x < fullMapArray[y].length)
    {
        //console.log("x: " + x + ". y: " + y + ". a: " + fullMapArray[y][x] + ". b: " + EMPTY_ZONE_ID);

        // Enemy found, do not fill.
        if (flood_enemyTileArray.indexOf(x + "," + y) != -1)
        {
            fillTheseTiles = [];
            console.log("ABORT FILL: " + x + "," + y);
            flood_abort = true;
            return;
        }

        //TODO: eliminate need for parseInt
        //TODO: instead of using indedof, using a temporary value
        //TODO: compare with star spawn points
        if (parseInt(fullMapArray[y][x]) == parseInt(EMPTY_ZONE_ID) && fillTheseTiles.indexOf(x + "," + y) == -1)
        {
            fillTheseTiles.push(x + "," + y);
            flow(x - 1, y);    // check up
            flow(x + 1, y);    // check down
            flow(x, y - 1);    // check left
            flow(x, y + 1);    // check right
        }
    }
}
