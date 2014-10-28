
var timerBetweenRounds;



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
        timerBetweenRounds.add(BOOM_TIMER_TICK_INVERVALS * MAX_BOOM_ZOOM_ANIMATIONS, characterDiedHandler, this);
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


function levelComplete()
{
    //TODO: add animation for end of level
    level_currentLevel++;
    level_percentComplete = 0.0;
    level_totalFilledTiles = 0;

    stopBulletTime();
    unfreezeTime();

    nextLevelUpdates();

    drawMap();

    sendCharacterBackToStart();

    spawnBalls();

    createScoreboard();

    createLevelTimer();
}

function isLevelComplete()
{
    if (level_percentComplete >= level_targetPercentComplete)
        return true;
    else
        return false;
}


function nextLevelUpdates()
{
    // Handle reset game
    if (level_currentLevel == 1)
    {
        level_numberOfBalls = START_NUMBER_OF_BALLS;
        level_playerLives = START_PLAYER_LIVES;
        level_targetPercentComplete = START_TARGET_PERCENT_COMPLETE;
        level_percentComplete = 0;
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

    stopBulletTime();
    unfreezeTime();

    level_playerLives = START_PLAYER_LIVES;
    level_percentComplete = 0.0;
    level_totalFilledTiles = 0;

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

    createLevelTimer();
}


function pauseGame()
{
    // Toggle game paused
    isGamePaused = !isGamePaused;
    console.log("isPaused:" + isGamePaused);
    setPlayerMovementDisabled(isGamePaused);
    setBallMovementDisabled(isGamePaused);
    pauseLevelTimer(isGamePaused);
}

function setPlayerMovementDisabled(isDisabled)
{
    isPlayerMovementDisabled = isDisabled;
    //console.log("isPlayerDisabled: " + isPlayerMovementDisabled);

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
    //console.log("isBallMovementDisabled: " + isBallMovementDisabled);

    for (var i = 0; i < balls.length; i++)
    {
        // Store velocities and set them to 0
        if (isBallMovementDisabled)
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


function createLevelTimer()
{
    if (gameOverTimer != null)
        gameOverTimer.destroy(true);

    gameOverTimer = game.time.create(true);
    gameOverTimer.loop(1000, timer_levelTimerTick, this);
    gameOverTimer.start();
}

function timer_levelTimerTick()
{
    updateScoreboard_GameTimer();
}

function pauseLevelTimer(isPause)
{
    if (gameOverTimer != null)
    {
        if (isPause)
        {
            gameOverTimer.pause();
        }
        else
        {
            gameOverTimer.resume();
        }
    }
}