var isLightningSpeedActive;

const POWER_UP_LIGHTNING_SPEED_ENERGY_BURN_RATE = 0.0040;


function startLightningSpeed()
{
    // Can't enter freeze time if already bullet time
    if (isFreezeTimeActive)
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
