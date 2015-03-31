const POWER_UP_SCORE_MULTIPLIER_ENERGY_BURN_RATE = 0.0020;
const POWER_UP_SCORE_MULTIPLIER_VALUE = 2;
var isScoreMultiplierActive = false;


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
