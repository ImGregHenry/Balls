
function extraLifePowerUpPickedUp(tileX, tileY)
{
    level_playerLives++;

    startScoreGainedTween(tileX * TILE_WIDTH, tileY * TILE_HEIGHT, "+1 EXTRA LIFE", POWERUPS.EXTRA_LIFE);

    // Update scoreboard
    characterLivesDisplay();
}
