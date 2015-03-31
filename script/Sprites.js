
var powerup_lightningbolt;
var powerup_snowflake;
var scoreboard_powerup_snowflake;
var scoreboard_powerup_lightningbolt;

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
    scoreboard_powerup_snowflake.bringToTop();
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

    scoreboard_powerup_snowflake = game.add.sprite(80, 80, 'powerup-snowflake');
    scoreboard_powerup_snowflake.kill();

    powerup_lightningbolt = game.add.sprite(80, 80, 'powerup-lightningbolt');
    powerup_lightningbolt.kill();

    scoreboard_powerup_lightningbolt = game.add.sprite(80, 80, 'powerup-lightningbolt');
    scoreboard_powerup_lightningbolt.kill();

    powerup_diamond = game.add.sprite(40, 40, 'powerup-diamond');
    powerup_diamond.kill();

    //spawnPowerUp(60, 60, POWERUPS.FREEZE_TIME);
    //spawnPowerUp(40, 40, POWERUPS.DIAMOND);
    //spawnPowerUp(900, 700, POWERUPS.LIGHTNING_SPEED);
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
        //else if(powerUpType == POWERUPS.DIAMOND)
        //else if(powerUpType == POWERUPS.INVISIBLE_BALLS)
    }
    else
    {
        if(powerUpType == POWERUPS.FREEZE_TIME)
            scoreboard_powerup_snowflake.kill();
        else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
            scoreboard_powerup_lightningbolt.kill();
        //else if(powerUpType == POWERUPS.DIAMOND)
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
    else if(powerUpType == POWERUPS.INVISIBLE_BALLS)
    {
        
    }
    else
    {
        console.log("Invalid powerup tried to be added to the map.")
    }
}

function removeMapPowerUp(powerUpType)
{
     if(powerUpType == POWERUPS.FREEZE_TIME)
    {
        //TODO: add collisions to powerups
        powerup_snowflake.kill();
    }
    else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
    {
        powerup_lightningbolt.kill();
    }
    else if(powerUpType == POWERUPS.DIAMOND)
    {
        powerup_diamond.kill();
    }
    else if(powerUpType == POWERUPS.INVISIBLE_BALLS)
    {
        
    }
}

function showPauseIcon(isSetVisible)
{
    pauseIcon.visible = isSetVisible;
}

function showMuteXIcon(isSetVisible)
{
    soundMuteX_Icon.visible = isSetVisible;
}
