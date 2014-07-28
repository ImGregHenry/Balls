var NUMBER_OF_BALLS = 10;
const PLAYER_VELOCITY = 90;
const TILE_WIDTH = 20;
const TILE_HEIGHT = 20;

const SAFE_ZONE_ID = 1;
const DANGER_ZONE_ID = 2;
const EMPTY_ZONE_ID = 3;

var game = new Phaser.Game(1000, 800, Phaser.CANVAS, 'BALLS', { preload: preload, create: create, update: update });
var balls;
var cursors;
var map;
var layer;
var playerTween = null;

function preload()
{
    game.load.tilemap('map', 'assets/maps/TileMap.json', null, Phaser.Tilemap.TILED_JSON);

    game.load.image('ball', 'assets/star.png');
    game.load.image('dude', 'assets/ball1.png');
    game.load.image('tile-danger-zone', 'assets/tile-danger-zone.png', true);
    game.load.image('tile-safe-zone', 'assets/tile-safe-zone.png', true);
    game.load.image('tile-empty', 'assets/tile-empty.png', true);
}

var map_tiles_wide;
var map_tiles_tall;

function create()
{
    game.stage.backgroundColor = '#000000';

    map = game.add.tilemap('map');
    
    map.setCollisionBetween(1, 1);

    map.addTilesetImage('tile-safe-zone', 'tile-safe-zone', 20, 20, 0, 0, 1);
    map.addTilesetImage('tile-danger-zone', 'tile-danger-zone', 20, 20, 0, 0, 2);
    map.addTilesetImage('tile-empty', 'tile-empty', 20, 20, 0, 0, 3);
    
    layer = map.createLayer('Tile Layer 1');
    
    
    map_tiles_wide = map.width;
    map_tiles_tall = map.height;

    console.log("width: " + map.width);
    console.log("height: " + map.height);
    

    layer.resizeWorld();

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);


    player = game.add.sprite(0, 0, 'dude');

    ////  We need to enable physics on the player            
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;


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

var isCharInDangerZone = false;
var endangeredTiles = [];

function fillTiles()
{
    
    var x = getXTileIndex();
    var y = getYTileIndex();

    var currentTile = map.getTile(x, y, layer, false);
    
    if (currentTile == null)
        console.log("ERROR: tile not found.");
    else if(currentTile.index == EMPTY_ZONE_ID)
    {
        isCharInDangerZone = true;
        map.fill(DANGER_ZONE_ID, x, y, 1, 1, layer);
        endangeredTiles.push(x + "," + y);
    }
    else if (currentTile.index == DANGER_ZONE_ID)
    {
        //map.fill(SAFE_ZONE_ID, x, y, 1, 1);
    }
    else if(currentTile.index == SAFE_ZONE_ID)
    {
        if (isCharInDangerZone)
        {
            isCharInDangerZone = false;
            clearEndangeredTiles();
            
        }
    }

    return currentTile;
}


function clearEndangeredTiles()
{
    console.log("clearing endangered tiles: " + endangeredTiles.length);
    // Loop through all the endangered tiles and set them to SAFE_ZONE
    for (var i = 0; i < endangeredTiles.length; i++)
    {
        // stored as ['1,1', '2,2', 3,5']
        var vals = endangeredTiles[i].split(",");
        console.log("Clearing: " + vals[0] + "," + vals[1] + " OF " + endangeredTiles.length);
        
        //map.removeTile(parseInt(vals[0]), parseInt(vals[1]), 1, 1);
        
        map.fill(SAFE_ZONE_ID, parseInt(vals[0]), parseInt(vals[1]), 1, 1, layer);

        var currentTile = map.getTile(parseInt(vals[0]), parseInt(vals[1]), layer, false);
        currentTile.resetCollision();
        
    }
    
    
    endangeredTiles = [];
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
    game.physics.arcade.collide(balls, layer);

    map.fill(DANGER_ZONE_ID, 3, 3, 1, 1);
    map.fill(SAFE_ZONE_ID, 3, 3, 1, 1);

    // TODO: test whether move is valid or not before tweening
    if (cursors.left.isDown)
    {
        startPlayerTween(player.body.x - 20, player.body.y);
    }
    else if (cursors.right.isDown)
    {
        startPlayerTween(player.body.x + 20, player.body.y);
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


//function render()
//{

//}