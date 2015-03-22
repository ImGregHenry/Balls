
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
        game.load.image('play-button', 'assets/images/menu/PlayButton.png');
		game.load.image('view-highscores-button', 'assets/images/menu/ViewHighScoresButton.png');
    },

    create: function ()
    {
        game.stage.backgroundColor = '#000000';
		
		var playBtn = game.cache.getImage('play-button');
        game.add.button(game.world.centerX - (playBtn.width/2), game.world.centerY - (playBtn.height/2), 'play-button', this.startGame);
		
		var viewHighScoreBtn = game.cache.getImage('view-highscores-button');
        //TODO: image location hard coding
		game.add.button(game.world.centerX - (viewHighScoreBtn.width/2), (game.world.centerY - (viewHighScoreBtn.height/2) + 200), 'view-highscores-button', viewHighScorePopup);
    },

    update: function ()
    {
		
    },

    startGame: function ()
    {
        game.state.start('Game');
    }
}

// Resets all in game settings when

function resestAllGameSettings()
{
    // Reset game stats
    level_currentLevel = 1;
    level_currentScore = 0;
    level_highScore = 0;
    level_totalFilledTiles = 0;
    level_totalEmptyTiles = (MAP_TILE_HEIGHT - (2 * MAP_BORDER_THICKNESS)) * (MAP_TILE_WIDTH - (2 * MAP_BORDER_THICKNESS));
    isGamePaused = false;
    isPlayerMovementDisabled = false;
    isCharacterDeadAlready = false;

    isBallMovementDisabled = false;
    isPlayerMovementDisabled = false;
    isGamePaused = false;
    isCharacterDeadAlready = false;
    isCharInDangerZone = false;
    isSoundEffectsEnabled = true;

    level_numberOfBalls = 0;
    level_playerLives = 0;
    level_currentLevel = 0;
    level_percentComplete = 0.0;
    level_targetPercentComplete = 0.0;
    level_totalFilledTiles = 0;
    level_totalEmptyTiles = 0;
    level_currentScore = 0;
    level_highScore = 0;
    
    showMuteXIcon(isSoundMuted);

    // Reset the character tween if it is in progress
    if (playerTween != null && playerTween.isRunning)
    {
        playerTween.stop();
    }

    allBallXVelocities = [];
    allBallYVelocities = [];
    endangeredTiles = [];
}

function goBackToMenu()
{
    stopBulletTime();
    resestAllGameSettings();
    game.state.start('MainMenu');
}

BasicGame.Game.prototype = {
    preload: function ()
    {
        game.load.tilemap('map-gamearea', 'assets/maps/TileMap5.json', null, Phaser.Tilemap.TILED_JSON);
        
        game.load.image('ball', 'assets/images/game/star.png');
        game.load.image('character', 'assets/images/game/ball1.png');
        game.load.image('tile-danger-zone', 'assets/images/tiles/tile-danger-zone.png', true);
        game.load.image('tile-safe-zone', 'assets/images/tiles/tile-safe-zone.png', true);
        game.load.image('tile-empty', 'assets/images/tiles/tile-empty.png', true);
        game.load.image('tile-scoreboard', 'assets/images/tiles/tile-scoreboard.png', true);
        game.load.image('scoreboard-restart-button', 'assets/images/game/RestartButton.png', true);
        game.load.image('scoreboard-pause-button', 'assets/images/game/PauseButton.png', true);
		game.load.image('view-highscores-button', 'assets/images/game/HighScoresButton.png');
		game.load.image('menu-button', 'assets/images/game/MenuButton.png');
        game.load.image('level-complete', 'assets/images/game/level_complete.png', true);
        game.load.image('animation-boom', 'assets/images/game/boom.png', true);
        game.load.image('game-over', 'assets/images/game/GameOver.png', true);
        game.load.image('mute-icon', 'assets/images/game/MuteIcon.png', true);
        game.load.image('x', 'assets/images/game/x.png', true);
        game.load.image('icon-paused', 'assets/images/game/Paused.png', true);
        game.load.image('icon-bullet', 'assets/images/game/Bullet.png', true);
        game.load.image('powerup-snowflake', 'assets/images/game/snowflake.png', true);

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
        game.stage.backgroundColor = '#000000';

        drawMap();

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        createGameSprites();

        //  We need to enable physics on the player            
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;

        // Reset game stats
        level_currentLevel = 1;
        level_currentScore = 0;
        level_highScore = 0;
        level_totalFilledTiles = 0;
        level_totalEmptyTiles = (MAP_TILE_HEIGHT - (2 * MAP_BORDER_THICKNESS)) * (MAP_TILE_WIDTH - (2 * MAP_BORDER_THICKNESS));

        // Create bullet time and powerup event looper
        timer_bulletTime = game.time.events.loop(BULLET_TIME_ENERGY_TIME_INTERVAL, bulletTimeTick, this);
        timer_powerUpTime = game.time.events.loop(POWER_UP_FREEZE_ENERGY_TIME_INTERVAL, freezeTimeTick, this);

        nextLevelUpdates();

        spawnBalls();

        setupGameControls();

        createScoreboard();
        createLevelTimer();
        resetBulletTimeEnergy();
        createBulletTimePieProgressBar(true);
        createPowerUpPieProgressBar(true);
    },


    // UPDATE: called constantly and handles all user's controls
    update: function ()
    {
        game.physics.arcade.collide(balls, balls);
        game.physics.arcade.collide(balls, layer_map);
        game.physics.arcade.collide(balls, layer_dangerZone);

        //game.physics.arcade.collide(powerup_snowflake);

        if (!isGamePaused && !isPlayerMovementDisabled)
        {
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
                
				//TODO: manage this freeze time functionality
                /*if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
                {
                    freezeTime();
                }
                else
                {
                    unfreezeTime();
                }*/
            }
            if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A))
            {
                var currentTile = map.getTile(playerXTile - 1, playerYTile, layer_map, false);

                if (currentTile != null)
                {
                    startPlayerTween(player.body.x - 20, player.body.y);
                }
            }
            else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D))
            {
                var currentTile = map.getTile(playerXTile + 1, playerYTile, layer_map, false);

                if (currentTile != null && currentTile.index != SCOREBOARD_ZONE_ID)
                {
                    startPlayerTween(player.body.x + 20, player.body.y);
                }
            }
            else if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W))
            {
                var currentTile = map.getTile(playerXTile, playerYTile - 1, layer_map, false);

                if (currentTile != null)
                {
                    startPlayerTween(player.body.x, player.body.y - 20);
                }
            }
            else if (cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S))
            {
                var currentTile = map.getTile(playerXTile, playerYTile + 1, layer_map, false);

                if (currentTile != null)
                {
                    startPlayerTween(player.body.x, player.body.y + 20);
                }
            }
        }
    }
}

