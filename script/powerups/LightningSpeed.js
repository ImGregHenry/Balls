var isLightningSpeedActive;
var timer_PowerUp_LightningSpeed;

const POWER_UP_LIGHTNING_SPEED_ENERGY_BURN_RATE = 0.0040;


function startLightningSpeed()
{
    if (isLightningSpeedActive)
        return;

    isLightningSpeedActive = true;
    isPowerUpActive = true;
    piePowerUpVisible = true;

    lightningStrikeSound = GetPowerUpLightningStrikeSound();
    lightningStrikeSound.play();

    // Display text and powerup icon on scoreboard
    showPowerUpScoreboardInfo(true, POWERUPS.LIGHTNING_SPEED);
}

function stopLightningSpeed()
{
    if (!isLightningSpeedActive)
        return;
    
    isLightningSpeedActive = false;
    isPowerUpActive = false;
    piePowerUpVisible = false;

    showPowerUpScoreboardInfo(false, POWERUPS.LIGHTNING_SPEED);
}

function startLightningSpeedItemExpirationTimer()
{
    timer_PowerUp_LightningSpeed = game.time.events.add(POWER_UP_ITEM_EXPIRATION_TIME_MS, removeLightningSpeedPowerUpItem, this, null);
}

function stopLightningSpeedItemExpirationTimer()
{
    // Stop the event that clears the powerup after it expires
    game.time.events.remove(timer_PowerUp_LightningSpeed);
}

function removeLightningSpeedPowerUpItem()
{
    stopLightningSpeedItemExpirationTimer();
    
    clearPowerUpTileLocations(POWERUPS.LIGHTNING_SPEED);
    removeMapPowerUp(POWERUPS.LIGHTNING_SPEED);
}