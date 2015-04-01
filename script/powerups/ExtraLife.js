var timer_PowerUp_ExtraLife;

function extraLifePowerUpPickedUp(tileX, tileY)
{
    level_playerLives++;

    startScoreGainedTween(tileX * TILE_WIDTH, tileY * TILE_HEIGHT, "+1 EXTRA LIFE", POWERUPS.EXTRA_LIFE);

    // Update scoreboard
    characterLivesDisplay();
}

function startExtraLifeItemExpirationTimer()
{
    timer_PowerUp_ExtraLife = game.time.events.add(POWER_UP_ITEM_EXPIRATION_TIME_MS, removeExtraLifePowerUpItem, this, null);
}

function stopExtraLifeItemExpirationTimer()
{
    // Stop the event that clears the powerup after it expires
    game.time.events.remove(timer_PowerUp_ExtraLife);
}

function removeExtraLifePowerUpItem()
{
    stopExtraLifeItemExpirationTimer();
    
    clearPowerUpTileLocations(POWERUPS.EXTRA_LIFE);
    removeMapPowerUp(POWERUPS.EXTRA_LIFE);
}