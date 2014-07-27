var NUMBER_OF_BALLS = 10;
var PLAYER_VELOCITY = 90;


var game = new Phaser.Game(1000, 800, Phaser.CANVAS, 'BALLS', { preload: preload, create: create, update: update, render: render });
var balls;
var cursors;
var map;
var layer;

var playerTween = null;
var playerNextTween;
var playerTweenManager;

function preload()
{
    //var TileMap = new TileMap(game, null, 5, 5, 50, 50);
    game.load.image('ball', 'assets/star.png');
    game.load.image('dude', 'assets/ball1.png');
    game.load.image('tile-danger-zone', 'assets/tile-danger-zone.png');
    game.load.image('tile-safe-zone', 'assets/tile-safe-zone.png');

    game.load.tilemap('map', 'assets/maps/TileMap.json', null, Phaser.Tilemap.TILED_JSON);

}

function create()
{
    game.stage.backgroundColor = '#000000';

    map = game.add.tilemap('map');
    map.addTilesetImage('tile-danger-zone');
    map.addTilesetImage('tile-safe-zone');
    map.setTileIndexCallback(255, this.awesomeEvent, this);
    map.setCollisionBetween(1, 1);
    
    layer = map.createLayer('Tile Layer 1');
    
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
    //game.input.keyboard.onDownCallback = fillTiles;

    playerTweenManager = new Phaser.TweenManager(game);
}

//function fillTiles()
//{
//    var tile = getCurrentTile();

//    if (currentTile == null)
//    {
//        console.log("ERROR: Current tile is not found on the map.  ");
//    }


//}

//function getCurrentTile()
//{
//    var currentTile = map.getTile(player.body.x, player.body.y, layer, false);

//    return currentTile;
//}

function startPlayerTween(x, y)
{
    if (playerTween == null || !playerTween.isRunning)
    {
        console.log("NewTween");
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
    console.log("tween complete");
}


function render()
{

}