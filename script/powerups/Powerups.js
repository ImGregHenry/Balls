var POWERUPS = {
    FREEZE_TIME : 0,
    LIGHTNING_SPEED : 1,
    INVISIBLE_BALLS : 2,
    DIAMOND : 3
}

var timer_powerUpTime;
var powerUp_energy = 1.000;
var isPowerUpActive = false;


function spawnPowerUp(x, y, powerUpType)
{
    setPowerUpTileLocations(x, y, powerUpType);
    addPowerUpToMap(x, y, powerUpType);
}

function powerUpPickedUp(powerUpType)
{
    powerUp_energy = 1.000;

    //TODO: handle power up pickup while another power up is active
    clearPowerUpTileLocations(powerUpType);
    removeMapPowerUp(powerUpType);
    activatePowerUp(powerUpType);
}

function activatePowerUp(powerUpType)
{
    //TODO: deactivate other powerups
    if(powerUpType == POWERUPS.FREEZE_TIME)
        freezeTime();
    else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
        startLightningSpeed();
    else 
        console.log("invalid powerup activation.")
    //else if(powerUpType == POWERUPS.DIAMOND)
    //else if(powerUpType == POWERUPS.INVISIBLE_BALLS)
}


function powerUpTimeTick()
{
    if (!isGamePaused && isPowerUpActive)
    {
        if (isFreezeTimeActive)
        {
            // Drain energy
            if (powerUp_energy > POWER_UP_FREEZE_ENERGY_BURN_RATE)
            {
                powerUp_energy = powerUp_energy - POWER_UP_FREEZE_ENERGY_BURN_RATE;
            }
            // Out of energy
            else
            {
                unfreezeTime();
            }
        }
        else if(isLightningSpeedActive)
        {
            // Drain energy
            if (powerUp_energy > POWER_UP_LIGHTNING_SPEED_ENERGY_BURN_RATE)
            {
                powerUp_energy -= POWER_UP_LIGHTNING_SPEED_ENERGY_BURN_RATE;
            }
            // Out of energy
            else
            {
                stopLightningSpeed();
            }
        }
    }
}