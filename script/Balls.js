const SAFE_ZONE_ID = 1;
const DANGER_ZONE_ID = 2;
const EMPTY_ZONE_ID = 3;
const SCOREBOARD_ZONE_ID = 4;



const TILE_WIDTH = 20;
const TILE_HEIGHT = 20;
const MAP_TILE_WIDTH = 50;
const MAP_TILE_HEIGHT = 40;
const MAP_BORDER_THICKNESS = 2;
const START_NUMBER_OF_BALLS = 4;
const START_TARGET_PERCENT_COMPLETE = 5;
const START_PLAYER_LIVES = 2;
const BALL_VELOCITY = 200;
//const PLAYER_VELOCITY = 90;

//TODO: rearrange variables into appropriate files
var isBallMovementDisabled = false;
var isPlayerMovementDisabled = false;
var isGamePaused = false;
var isCharacterDeadAlready = false;
var isCharInDangerZone = false;


var map;
var mapLayer;
var balls;
var cursors;


var level_numberOfBalls = 0;
var level_playerLives = 0;
var level_currentLevel = 0;
var level_percentComplete = 0.0;
var level_targetPercentComplete = 0.0;
var level_totalFilledTiles = 0;
var level_totalEmptyTiles = 0;

var scoreboard_percentCompleteTextBlock;

var timerBetweenRounds;

var allBallXVelocities = [];
var allBallYVelocities = [];
var endangeredTiles = [];
var fullMapArray;

var game = new Phaser.Game(1400, 800, Phaser.CANVAS, 'BALLS', { preload: preload, create: create, update: update });

function gameOver()
{
    console.log("GAME OVER!");
    pauseLevelTimer(true);
    // Create the boom animation
    spawnGameOverAnimation();

    // Create a timer that waits for the completion of the game over animation
    //timerBetweenRounds = game.time.create(true);
    //timerBetweenRounds.add(GAME_OVER_TIMER_TICK_INTERVAL * MAX_GAME_OVER_ZOOM_ANIMATIONS, characterDiedHandler, this);
    //timerBetweenRounds.start();
}

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
    game.load.image('game-over', 'assets/GameOver.jpeg', true);
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

    createLevelTimer();
    
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
        var minXY = MAP_BORDER_THICKNESS * TILE_WIDTH;
        var maxX = (MAP_TILE_WIDTH * TILE_WIDTH) - ((1 + MAP_BORDER_THICKNESS) * TILE_WIDTH);
        var maxY = (MAP_TILE_HEIGHT * TILE_HEIGHT) - ((1 + MAP_BORDER_THICKNESS) * TILE_HEIGHT);
        
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
        ball.body.velocity.x = BALL_VELOCITY;
        ball.body.velocity.y = BALL_VELOCITY;
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

// UPDATE: called constantly and handles user's controls
function update()
{
    if (!isGamePaused && !isPlayerMovementDisabled)
    {
        game.physics.arcade.collide(balls, balls);
        game.physics.arcade.collide(balls, mapLayer);

        var playerXTile = getPlayerXTileIndex();
        var playerYTile = getPlayerYTileIndex();

        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            startBulletTime();
        }
        else
        {
            stopBulletTime();
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
        {
            freezeTime();
        }
        else
        {
            unfreezeTime();
        }
        

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

            if (currentTile != null && currentTile.index != SCOREBOARD_ZONE_ID)
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



