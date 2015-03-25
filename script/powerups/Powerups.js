const POWER_UP_TICK_TIME_INTERVAL = 1.0;
const POWER_UP_SPAWN_TICK_TIME_INTERVAL = 1000;
const POWERUPS = {
    FREEZE_TIME : 0,
    LIGHTNING_SPEED : 1,
    DIAMOND : 2,
    INVISIBLE_BALLS : 3
}

var timer_powerUpTime;
var powerUp_energy = 1.000;
var isPowerUpActive = false;


function spawnPowerUp(pixelX, pixelY, powerUpType)
{
    //TODO: detect conflicting powerup placements
    setPowerUpTileLocations(pixelX, pixelY, powerUpType);

    addPowerUpToMap(pixelX, pixelY, powerUpType);
}

function powerUpPickedUp(tileX, tileY, powerUpType)
{
    stopAllPowerUps();

    powerUp_energy = 1.000;

    activatePowerUp(tileX, tileY, powerUpType);

    clearPowerUpTileLocations(powerUpType);
    removeMapPowerUp(powerUpType);
}

function activatePowerUp(tileX, tileY, powerUpType)
{
    //TODO: deactivate other powerups
    if(powerUpType == POWERUPS.FREEZE_TIME)
    {
        stopBulletTime();
        freezeTime();
    }
    else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
        startLightningSpeed();
    else if(powerUpType == POWERUPS.DIAMOND)
        diamondPowerUpPickedUp(tileX, tileY);
    else 
        console.log("invalid powerup activation.")
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

var tick = 0;
function powerUpSpawnTicker()
{
    //console.log("tick: " + tick++ + ". Rand: " + val);
    if(val === 1)
    {
        var powerUpType = chooseRandomValueBetweenInterval(0, 2);        

        var randomXPixelSpawn =  Math.floor(chooseRandomValueBetweenInterval(getMapMinPixel(), getMapMaxXCoordinate()) / 20) * TILE_WIDTH;
        var randomYPixelSpawn = Math.floor(chooseRandomValueBetweenInterval(getMapMinPixel(), getMapMaxYCoordinate()) / 20) * TILE_HEIGHT;

        //console.log("Spawning Randomly at: " + randomXPixelSpawn + "," + randomYPixelSpawn + ". Type:" + powerUpType);
        spawnPowerUp(randomXPixelSpawn, randomYPixelSpawn, powerUpType);
    }
}

function stopAllPowerUps()
{
    stopLightningSpeed();
    unfreezeTime();
}