const POWER_UP_SCORE_MULTIPLIER_ENERGY_BURN_RATE = 0.0020;
const POWER_UP_SCORE_MULTIPLIER_VALUE = 2;
var isScoreMultiplierActive = false;
var timer_PowerUp_ScoreMultiplier;

function startScoreMultiplier()
{
    // Can't enter freeze time if already bullet time
    if (isScoreMultiplierActive)
        return;

    isScoreMultiplierActive  = true;
    isPowerUpActive = true;
    piePowerUpVisible = true;

    // Display text and powerup icon on scoreboard
    showPowerUpScoreboardInfo(true, POWERUPS.SCORE_2X_MULTIPLIER);
}

function stopScoreMultiplier()
{
    if (!isScoreMultiplierActive)
        return;
    
    isScoreMultiplierActive  = false;
    isPowerUpActive = false;
    piePowerUpVisible = false;

    showPowerUpScoreboardInfo(false, POWERUPS.SCORE_2X_MULTIPLIER);
}

function startScoreMultiplierItemExpirationTimer()
{
    timer_PowerUp_ScoreMultiplier = game.time.events.add(POWER_UP_ITEM_EXPIRATION_TIME_MS, removeScoreMultiplierPowerUpItem, this, null);
}

function stopScoreMultiplierItemExpirationTimer()
{
    // Stop the event that clears the powerup after it expires
    game.time.events.remove(timer_PowerUp_ScoreMultiplier);
}

function removeScoreMultiplierPowerUpItem()
{
    stopScoreMultiplierItemExpirationTimer();
    
    clearPowerUpTileLocations(POWERUPS.SCORE_2X_MULTIPLIER);
    removeMapPowerUp(POWERUPS.SCORE_2X_MULTIPLIER);
}