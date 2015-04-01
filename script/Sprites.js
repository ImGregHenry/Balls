
var powerup_lightningbolt;
var powerup_snowflake;
var powerup_2xmultiplier;
var powerup_extralife;
var scoreboard_powerup_snowflake;
var scoreboard_powerup_lightningbolt;
var scoreboard_powerup_2xmultiplier;

var pauseIcon;
var soundMuteX_Icon;
var bulletIcon;
var muteButton;


function bringGameSpritesToTop()
{
    player.bringToTop();
    bulletIcon.bringToTop();
    pauseIcon.bringToTop();
    muteButton.bringToTop();
    soundMuteX_Icon.bringToTop();
    powerup_snowflake.bringToTop();
    powerup_lightningbolt.bringToTop();
    powerup_diamond.bringToTop();
    powerup_2xmultiplier.bringToTop();
    powerup_extralife.bringToTop();
    scoreboard_powerup_snowflake.bringToTop();
    scoreboard_powerup_lightningbolt.bringToTop();
    scoreboard_powerup_2xmultiplier.bringToTop();
}

function createGameSprites()
{
    // Create the character
    player = game.add.sprite(0, 0, 'character');

    pauseIcon = game.add.sprite(450, 350, 'icon-paused');
    pauseIcon.visible = false;

    // Create snowflake at start, but hide it
    powerup_snowflake = game.add.sprite(40, 40, 'powerup-snowflake');
    powerup_snowflake.kill();

    scoreboard_powerup_snowflake = game.add.sprite(40, 40, 'powerup-snowflake');
    scoreboard_powerup_snowflake.kill();

    powerup_lightningbolt = game.add.sprite(40, 40, 'powerup-lightningbolt');
    powerup_lightningbolt.kill();

    scoreboard_powerup_lightningbolt = game.add.sprite(40, 40, 'powerup-lightningbolt');
    scoreboard_powerup_lightningbolt.kill();

    powerup_diamond = game.add.sprite(40, 40, 'powerup-diamond');
    powerup_diamond.kill();

    powerup_2xmultiplier = game.add.sprite(40, 40, 'powerup-2xscoremultiplier');
    powerup_2xmultiplier.kill();

    scoreboard_powerup_2xmultiplier = game.add.sprite(40, 40, 'powerup-2xscoremultiplier');
    scoreboard_powerup_2xmultiplier.kill();

    powerup_extralife = game.add.sprite(40, 40, 'powerup-extralife');
    powerup_extralife.kill();

    scoreboard_powerup_2xmultiplier = game.add.sprite(40, 40, 'powerup-2xscoremultiplier');
    scoreboard_powerup_2xmultiplier.kill();

    // DEBUGGING TESTS
    //spawnPowerUp(40, 40, POWERUPS.FREEZE_TIME);
    //spawnPowerUp(60, 40, POWERUPS.DIAMOND);
    //spawnPowerUp(40, 60, POWERUPS.LIGHTNING_SPEED);
    //spawnPowerUp(60, 60, POWERUPS.SCORE_2X_MULTIPLIER);
    //spawnPowerUp(60, 60, POWERUPS.EXTRA_LIFE);

    muteButton = game.add.button(1350, 750, 'mute-icon', MuteSound);

    game.add.button(1350, 750, 'mute-icon', MuteSound);
    soundMuteX_Icon = game.add.button(1350, 750, 'x', MuteSound);
    soundMuteX_Icon.visible = isSoundMuted;
    soundMuteX_Icon.bringToTop();

    bulletIcon = game.add.sprite(1075, 707, 'icon-bullet');
}

function showScoreboardPowerUpIcon(isSetVisible, powerUpType)
{
    if(isSetVisible)
    {
        if(powerUpType == POWERUPS.FREEZE_TIME)
            scoreboard_powerup_snowflake.reset(POWER_UP_SCOREBOARD_SNOWFLAKE_X, POWER_UP_SCOREBOARD_SNOWFLAKE_Y);
        else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
            scoreboard_powerup_lightningbolt.reset(POWER_UP_SCOREBOARD_SNOWFLAKE_X, POWER_UP_SCOREBOARD_SNOWFLAKE_Y);
        else if(powerUpType == POWERUPS.DIAMOND)
            return;
        else if(powerUpType == POWERUPS.SCORE_2X_MULTIPLIER)
            scoreboard_powerup_2xmultiplier.reset(POWER_UP_SCOREBOARD_SNOWFLAKE_X, POWER_UP_SCOREBOARD_SNOWFLAKE_Y);
        else if(powerUpType == POWERUPS.EXTRA_LIFE)
            return;
        //else if(powerUpType == POWERUPS.INVISIBLE_BALLS)
    }
    else
    {
        if(powerUpType == POWERUPS.FREEZE_TIME)
            scoreboard_powerup_snowflake.kill();
        else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
            scoreboard_powerup_lightningbolt.kill();
        else if(powerUpType == POWERUPS.DIAMOND)
            return;
        else if(powerUpType == POWERUPS.SCORE_2X_MULTIPLIER)
            scoreboard_powerup_2xmultiplier.kill();
        else if(powerUpType == POWERUPS.EXTRA_LIFE)
            return;
        //else if(powerUpType == POWERUPS.INVISIBLE_BALLS)
    }
}

function addPowerUpToMap(pixelX, pixelY, powerUpType)
{
    if(powerUpType == POWERUPS.FREEZE_TIME)
    {
        //TODO: add collisions to powerups
        //powerup_snowflake.enableBody = true;
        //game.physics.arcade.enable(powerup_snowflake);
        powerup_snowflake.reset(pixelX, pixelY);
        powerup_snowflake.bringToTop();
    }
    else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
    {
        powerup_lightningbolt.reset(pixelX, pixelY);
        powerup_lightningbolt.bringToTop();
    }
    else if(powerUpType == POWERUPS.DIAMOND)
    {
        powerup_diamond.reset(pixelX, pixelY);
        powerup_diamond.bringToTop();
    }
    else if(powerUpType == POWERUPS.SCORE_2X_MULTIPLIER)
    {
        powerup_2xmultiplier.reset(pixelX, pixelY);
        powerup_2xmultiplier.bringToTop();   
    }
    else if(powerUpType == POWERUPS.EXTRA_LIFE)
    {
        powerup_extralife.reset(pixelX, pixelY);
        powerup_extralife.bringToTop();
    }
    else if(powerUpType == POWERUPS.INVISIBLE_BALLS)
        return;
    else
    {
        console.log("Invalid powerup tried to be added to the map.")
    }
}

function removeMapPowerUp(powerUpType)
{
    if(powerUpType == POWERUPS.FREEZE_TIME)
        powerup_snowflake.kill();
    else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
        powerup_lightningbolt.kill();
    else if(powerUpType == POWERUPS.DIAMOND)
        powerup_diamond.kill();
    else if(powerUpType == POWERUPS.SCORE_2X_MULTIPLIER)
        powerup_2xmultiplier.kill();
    else if(powerUpType == POWERUPS.EXTRA_LIFE)
        powerup_extralife.kill();
    else if(powerUpType == POWERUPS.INVISIBLE_BALLS)
        return;
}

function showPauseIcon(isSetVisible)
{
    pauseIcon.visible = isSetVisible;
}

function showMuteXIcon(isSetVisible)
{
    soundMuteX_Icon.visible = isSetVisible;
}

function removeAllPowerUpSprites()
{
    removeMapPowerUp(POWERUPS.FREEZE_TIME);
    removeMapPowerUp(POWERUPS.LIGHTNING_SPEED);
    removeMapPowerUp(POWERUPS.DIAMOND);
    removeMapPowerUp(POWERUPS.SCORE_2X_MULTIPLIER);
    removeMapPowerUp(POWERUPS.EXTRA_LIFE);
    removeMapPowerUp(POWERUPS.INVISIBLE_BALLS);

    showPowerUpScoreboardInfo(false, POWERUPS.NONE);

    showScoreboardPowerUpIcon(false, POWERUPS.FREEZE_TIME);
    showScoreboardPowerUpIcon(false, POWERUPS.LIGHTNING_SPEED);
    showScoreboardPowerUpIcon(false, POWERUPS.DIAMOND);
    showScoreboardPowerUpIcon(false, POWERUPS.SCORE_2X_MULTIPLIER);
    showScoreboardPowerUpIcon(false, POWERUPS.EXTRA_LIFE);
    showScoreboardPowerUpIcon(false, POWERUPS.INVISIBLE_BALLS);
}
