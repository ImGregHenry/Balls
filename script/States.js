
var BasicGame = {};
BasicGame.MainMenu = function () { };
BasicGame.Game = function () { };

var game = new Phaser.Game(1400, 800, Phaser.CANVAS, '', { create: applicationEntry });
//var game = new Phaser.Game(1400, 800, Phaser.CANVAS, '', { preload: BasicGame.preload, create: create, update: update });



function applicationEntry()
{
    
    game.state.add('MainMenu', BasicGame.MainMenu);
    game.state.add('Game', BasicGame.Game);
    game.state.start('MainMenu');
}


BasicGame.MainMenu.prototype = {
    preload: function ()
    {
        // load basic assets for this state 

        this.load.image('name', 'assets/images/menu/PlayButton.png');
        console.log("Main Menu: preload.");
    },

    create: function ()
    {
        console.log("Main Menu: create.");
        // place the assets and elements in their initial positions, create the state 

        this.titleName = this.add.button(game.world.centerX - (135/2), game.world.centerY - (68/2), 'name', this.startGame);
        
    },

    update: function ()
    {
        //console.log("Main Menu: update.");
        // your game loop goes here 

        //this.titleName.x++;
    },

    startGame: function ()
    {
        console.log("transition from menu.");
        game.state.start('Game');
    }
}



BasicGame.Game.prototype = {
    preload: function ()
    {
        game.load.tilemap('map', 'assets/maps/TileMap5.json', null, Phaser.Tilemap.TILED_JSON);

        game.load.image('ball', 'assets/images/game/star.png');
        game.load.image('character', 'assets/images/game/ball1.png');
        game.load.image('tile-danger-zone', 'assets/images/tiles/tile-danger-zone.png', true);
        game.load.image('tile-safe-zone', 'assets/images/tiles/tile-safe-zone.png', true);
        game.load.image('tile-empty', 'assets/images/tiles/tile-empty.png', true);
        game.load.image('tile-scoreboard', 'assets/images/tiles/tile-scoreboard.png', true);
        game.load.image('scoreboard-restart-button', 'assets/images/game/RestartButton.png', true);
        game.load.image('scoreboard-pause-button', 'assets/images/game/PauseButton.png', true);
        game.load.image('level-complete', 'assets/images/game/level_complete.png', true);
        game.load.image('animation-boom', 'assets/images/game/boom.png', true);
        game.load.image('game-over', 'assets/images/game/GameOver.png', true);
        game.load.image('mute-icon', 'assets/images/game/MuteIcon.png', true);
        game.load.image('x', 'assets/images/game/x.png', true);

        game.load.audio('audio-bullet-time-heartbeat', 'assets/sounds/bullet-time-heartbeat.mp3', true);
        game.load.audio('audio-bullet-time-stop', 'assets/sounds/bullet-time-stop.mp3', true);
        game.load.audio('audio-bullet-time-start', 'assets/sounds/bullet-time-start.mp3', true);
        game.load.audio('audio-player-explodes', 'assets/sounds/player-explodes.mp3', true);
        game.load.audio('audio-game-over', 'assets/sounds/game-over.wav', true);
        game.load.audio('audio-level-complete', 'assets/sounds/level-completed.ogg', true);

        game.time.advancedTiming = true;
    },

    create: function ()
    {
        game.stage.backgroundColor = '#FFFFFF';

        drawMap();

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create the character
        player = game.add.sprite(0, 0, 'character');
        game.add.button(1350, 750, 'mute-icon', MuteSound, true, 2, 1, 0);

        //  We need to enable physics on the player            
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        level_currentLevel = 1;
        level_currentScore = 0;
        level_highScore = 0;
        level_totalFilledTiles = 0;
        level_totalEmptyTiles = (MAP_TILE_HEIGHT - (2 * MAP_BORDER_THICKNESS)) * (MAP_TILE_WIDTH - (2 * MAP_BORDER_THICKNESS));

        nextLevelUpdates();

        spawnBalls();

        // Load the keyboard controls
        cursors = game.input.keyboard.createCursorKeys();

        createScoreboard();

        createLevelTimer();
        createBulletTimeEnergyTimer();
        createBulletTimePieProgressBar();
    },


    // UPDATE: called constantly and handles all user's controls
    update: function ()
    {
        //TODO: add fps text to game
        //game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");

        if (!isGamePaused && !isPlayerMovementDisabled)
        {
            game.physics.arcade.collide(balls, balls);
            game.physics.arcade.collide(balls, mapLayer);

            var playerXTile = getPlayerXTileIndex();
            var playerYTile = getPlayerYTileIndex();

            if (!isCharacterDeadAlready)
            {
                if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
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
}

