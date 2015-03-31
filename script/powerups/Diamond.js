
const POWER_UP_DIAMOND_BONUS_AMOUNT = 4000;
function diamondPowerUpPickedUp(tileX, tileY)
{
    var x = tileX * TILE_WIDTH;
    var y = tileY * TILE_HEIGHT;
    
    // Show a text visual of points gained
    startScoreGainedTween(x, y, "BONUS: " + POWER_UP_DIAMOND_BONUS_AMOUNT, POWERUPS.DIAMOND);

    // Add to current score and update scoreboard
    adjustCurrentScore(POWER_UP_DIAMOND_BONUS_AMOUNT);
}
