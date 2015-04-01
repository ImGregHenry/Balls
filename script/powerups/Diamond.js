const POWER_UP_DIAMOND_BONUS_AMOUNT = 4000;
var timer_PowerUp_Diamond;

function diamondPowerUpPickedUp(tileX, tileY)
{
    var x = tileX * TILE_WIDTH;
    var y = tileY * TILE_HEIGHT;
    
    // Show a text visual of points gained
    startScoreGainedTween(x, y, "BONUS: " + POWER_UP_DIAMOND_BONUS_AMOUNT, POWERUPS.DIAMOND);

    // Add to current score and update scoreboard
    adjustCurrentScore(POWER_UP_DIAMOND_BONUS_AMOUNT);
}

function startDiamondItemExpirationTimer()
{
    timer_PowerUp_Diamond = game.time.events.add(POWER_UP_ITEM_EXPIRATION_TIME_MS, removeDiamondPowerUpItem, this, null);
}

function stopDiamondItemExpirationTimer()
{
    // Stop the event that clears the powerup after it expires
    game.time.events.remove(timer_PowerUp_Diamond);
}

function removeDiamondPowerUpItem()
{
    stopDiamondItemExpirationTimer();
    
    clearPowerUpTileLocations(POWERUPS.DIAMOND);
    removeMapPowerUp(POWERUPS.DIAMOND);
}