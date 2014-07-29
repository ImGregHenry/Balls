var NUMBER_OF_BALLS = 10;
const PLAYER_VELOCITY = 90;
const TILE_WIDTH = 20;
const TILE_HEIGHT = 20;

const SAFE_ZONE_ID = 1;
const DANGER_ZONE_ID = 2;
const EMPTY_ZONE_ID = 3;

var game = new Phaser.Game(1400, 800, Phaser.CANVAS, 'BALLS', { preload: preload, create: create, update: update });
var balls;
var cursors;
var map;
var mapLayer;
var scoreLayer;
var playerTween = null;

var map_tiles_wide;
var map_tiles_tall;
var scoreboard;

function preload()
{
    game.load.tilemap('map', 'assets/maps/TileMap5.json', null, Phaser.Tilemap.TILED_JSON);
 
    game.load.image('ball', 'assets/star.png');
    game.load.image('character', 'assets/ball1.png');
    game.load.image('tile-danger-zone', 'assets/tile-danger-zone.png', true);
    game.load.image('tile-safe-zone', 'assets/tile-safe-zone.png', true);
    game.load.image('tile-empty', 'assets/tile-empty.png', true);
    game.load.image('tile-scoreboard', 'assets/tile-scoreboard.png', true);
}

var playerGroup;
function create()
{
    game.stage.backgroundColor = '#FFFFFF';

    map = game.add.tilemap('map');
    
    //map.setCollisionBetween(a, 1);
    map.setCollisionByExclusion([3], 1);
    
    map.addTilesetImage('tile-scoreboard', 'tile-scoreboard', 20, 20, 0, 0, 1);
    map.addTilesetImage('tile-safe-zone', 'tile-safe-zone', 20, 20, 0, 0, 1);
    map.addTilesetImage('tile-danger-zone', 'tile-danger-zone', 20, 20, 0, 0, 2);
    map.addTilesetImage('tile-empty', 'tile-empty', 20, 20, 0, 0, 3);
    
    mapLayer = map.createLayer('Tile Layer 1');
    
    mapLayer.resizeWorld();
    
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Create the character
    //playerGroup = game.add.group();
    player = game.add.sprite(0, 0, 'character');
    

    //  We need to enable physics on the player            
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    //playerGroup.add(player);

    // Create the group of balls to be used.  Enable them.
    balls = game.add.group();
    balls.enableBody = true;

    // Create all the balls
    for (var i = 0; i < NUMBER_OF_BALLS; i++)
    {
        // Create each ball with the preset values
        var ball = balls.create(i * 100, i * 100, 'ball');
        ball.body.velocity.x = 200;
        ball.body.velocity.y = 200;
        ball.body.collideWorldBounds = true;
        ball.body.bounce.y = 1;
        ball.body.bounce.x = 1;
        
        balls.add(ball);
    }
    

    // Load the keyboard controls
    cursors = game.input.keyboard.createCursorKeys();
}

    


function createScoreboard()
{
    var text = "- phaser -\n with a sprinkle of \n pixi dust.";
    var style = { font: "65px Arial", fill: "#ff0044", align: "center" };

    var t = game.add.text(game.world.centerX - 300, 0, text, style);
}

var isCharInDangerZone = false;
var endangeredTiles = [];

function fillTiles()
{
    
    var x = getXTileIndex();
    var y = getYTileIndex();

    var currentTile = map.getTile(x, y,mapLayer, false);
    
    if (currentTile == null)
        console.log("ERROR: tile not found.");
    else if(currentTile.index == EMPTY_ZONE_ID)
    {
        isCharInDangerZone = true;
        map.fill(DANGER_ZONE_ID, x, y, 1, 1, mapLayer);

        currentTile.setCollisionCallback(characterDied, this);
        //currentTile.setCollision(true, true, true, true);
        //TODO: END GAME!

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

            // Safely cleared tiles.  Reset them to 'safe-zone' tiles
            clearEndangeredTiles(true);
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
        var vals = endangeredTiles[i].split(",");

        // Get the current tile that was just converted to a safe zone
        var currentTile = map.getTile(parseInt(vals[0]), parseInt(vals[1]),mapLayer, false);

        // Clear the death method from the tile
        currentTile.setCollisionCallback(null, this);

        // Redraw the tile to the appropriate tile type
        if (isSafeTile)
        {
            map.fill(SAFE_ZONE_ID, parseInt(vals[0]), parseInt(vals[1]), 1, 1,mapLayer);
            
            currentTile.setCollision(true, true, true, true);
        }
        else
        {
            // Redraw the tile
            map.fill(EMPTY_ZONE_ID, parseInt(vals[0]), parseInt(vals[1]), 1, 1,mapLayer);

            currentTile.setCollision(false, false, false, false);
        }
        
        //console.log("Clearing: " + vals[0] + "," + vals[1] + " OF " + endangeredTiles.length);
    }
    
    // Reset the endangered tiles array
    endangeredTiles = [];
}

function characterDied()
{
    console.log("BOOM");
    sendCharacterBackToStart();
    clearEndangeredTiles(false);
}

function sendCharacterBackToStart()
{
    // Reset the character tween if it is in progress
    if (playerTween.isRunning)
    {
        playerTween.stop();
    }
        
    player.body.position.x = 0;
    player.body.position.y = 0;
}

function getXTileIndex()
{
    var position = player.body.x;

    return Math.round(position / TILE_WIDTH);
}

function getYTileIndex()
{
    var position = player.body.y;

    return Math.round(position / TILE_HEIGHT);
}


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



function update()
{
    game.physics.arcade.collide(balls, balls);
    game.physics.arcade.collide(balls, mapLayer);
    
    
    // TODO: test whether move is valid or not before tweening
    if (cursors.left.isDown)
    {
        startPlayerTween(player.body.x - 20, player.body.y);
    }
    else if (cursors.right.isDown)
    {
        var currentTile = map.getTile(getXTileIndex()+1, getYTileIndex(), mapLayer, false);
        
        //TODO: fix this scoreboard issue.
        // Prevent character from entering scoreboard area
        if (currentTile.index != 4)
        {
            startPlayerTween(player.body.x + 20, player.body.y);
        }
    }
    else if (cursors.up.isDown)
    {
        startPlayerTween(player.body.x, player.body.y - 20);
    }
    else if (cursors.down.isDown)
    {
        startPlayerTween(player.body.x, player.body.y + 20);
    }
}

function playerTweenComplete()
{
    fillTiles();
}
