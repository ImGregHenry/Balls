const POWER_UP_FREEZE_ENERGY_BURN_RATE = 0.0055;

var isFreezeTimeActive = false;
var freezeTimeBallXVelocities = [];
var freezeTimeBallYVelocities = [];
var timer_PowerUp_FreezeTime;


function freezeTime()
{
    if (isFreezeTimeActive)
        return;

    isFreezeTimeActive = true;
    isPowerUpActive = true;
    piePowerUpVisible = true;

    // Display text and powerup icon on scoreboard
    showPowerUpScoreboardInfo(true, POWERUPS.FREEZE_TIME);

    // Store ball velocities and set then set them to 0
    for (var i = 0; i < balls.length; i++)
    {
        freezeTimeBallXVelocities[i] = balls.getAt(i).body.velocity.x;
        freezeTimeBallYVelocities[i] = balls.getAt(i).body.velocity.y;
        balls.getAt(i).body.velocity.x = 0;
        balls.getAt(i).body.velocity.y = 0;
    }
}

function unfreezeTime()
{
    if (!isFreezeTimeActive)
        return;
    
    isFreezeTimeActive = false;
    isPowerUpActive = false;
    piePowerUpVisible = false;

    showPowerUpScoreboardInfo(false, POWERUPS.FREEZE_TIME);

    // Restore original ball velocities
    for (var i = 0; i < balls.length; i++)
    {
        balls.getAt(i).body.velocity.x = freezeTimeBallXVelocities[i];
        balls.getAt(i).body.velocity.y = freezeTimeBallYVelocities[i];
    }
}

function startFreezeTimeItemExpirationTimer()
{
    timer_PowerUp_FreezeTime = game.time.events.add(POWER_UP_ITEM_EXPIRATION_TIME_MS, removeFreezeTimePowerUpItem, this, null);
}

function stopFreezeTimeItemExpirationTimer()
{
    // Stop the event that clears the powerup after it expires
    game.time.events.remove(timer_PowerUp_FreezeTime);
}

function removeFreezeTimePowerUpItem()
{
    stopFreezeTimeItemExpirationTimer();
    
    clearPowerUpTileLocations(POWERUPS.FREEZE_TIME);
    removeMapPowerUp(POWERUPS.FREEZE_TIME);
}