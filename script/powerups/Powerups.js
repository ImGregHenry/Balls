const POWER_UP_TICK_TIME_INTERVAL = 1.0;
const POWER_UP_SPAWN_TICK_TIME_INTERVAL = 1000;
const POWER_UP_SPAWN_FREQUENCY_SEC = 20;
const POWER_UP_SPAWN_VALUE = 1;
const POWER_UP_TOTAL_ACTIVE_POWER_UP_TYPES = 4;
const POWER_UP_ITEM_EXPIRATION_TIME_MS = 15000;

const POWERUPS = {
    FREEZE_TIME : 0,
    LIGHTNING_SPEED : 1,
    DIAMOND : 2,
    SCORE_2X_MULTIPLIER : 3,
    EXTRA_LIFE : 4,
    INVISIBLE_BALLS : 5,
    NONE : 6
}

var timer_powerUpTime;
var powerUp_energy = 1.000;
var isPowerUpActive = false;


function createPowerUpTimers()
{
    // Create bullet time and powerup event loopers
    timer_bulletTime = game.time.events.loop(BULLET_TIME_ENERGY_TIME_INTERVAL, bulletTimeTick, this);
    timer_powerUpTime = game.time.events.loop(POWER_UP_TICK_TIME_INTERVAL, powerUpTimeTick, this);
    timer_powerUpSpawner = game.time.events.loop(POWER_UP_SPAWN_TICK_TIME_INTERVAL, powerUpSpawnTicker, this);
}

function spawnPowerUp(pixelX, pixelY, powerUpType)
{
    // Remove pre-existing expiration timers
    startPowerUpItemAvailableTimer(powerUpType, false);

    //TODO: detect conflicting powerup placements
    setPowerUpTileLocations(pixelX, pixelY, powerUpType);
    addPowerUpToMap(pixelX, pixelY, powerUpType);

    // Start expiration timers
    startPowerUpItemAvailableTimer(powerUpType, true);
}

function powerUpPickedUp(tileX, tileY, powerUpType)
{
    stopAllActivePowerUps();

    // Stop expiration timers
    startPowerUpItemAvailableTimer(powerUpType, false);

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
    else if(powerUpType == POWERUPS.SCORE_2X_MULTIPLIER)
        startScoreMultiplier();
    else if(powerUpType == POWERUPS.EXTRA_LIFE)
        extraLifePowerUpPickedUp(tileX, tileY);
    else 
        console.log("invalid powerup activation.")
    //else if(powerUpType == POWERUPS.INVISIBLE_BALLS)
}

function powerUpTimeTick()
{
    // Ticker for active powerups
    if (!isGamePaused && isPowerUpActive)
    {
        if (isFreezeTimeActive)
        {
            // Drain energy
            if (powerUp_energy > POWER_UP_FREEZE_ENERGY_BURN_RATE)
                powerUp_energy = powerUp_energy - POWER_UP_FREEZE_ENERGY_BURN_RATE;
            // Out of energy
            else
                unfreezeTime();
        }
        else if(isLightningSpeedActive)
        {
            if (powerUp_energy > POWER_UP_LIGHTNING_SPEED_ENERGY_BURN_RATE)
                powerUp_energy -= POWER_UP_LIGHTNING_SPEED_ENERGY_BURN_RATE;
            else
                stopLightningSpeed();
        }
        else if(isScoreMultiplierActive)
        {
            if (powerUp_energy > POWER_UP_SCORE_MULTIPLIER_ENERGY_BURN_RATE)
                powerUp_energy -= POWER_UP_SCORE_MULTIPLIER_ENERGY_BURN_RATE;
            else
                stopScoreMultiplier();
        }
    }
}

function startPowerUpItemAvailableTimer(powerUpType, isActivateTimer)
{
    // Start timers
    if(isActivateTimer)
    {
        if(powerUpType == POWERUPS.FREEZE_TIME)
            startFreezeTimeItemExpirationTimer();
        else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
            startLightningSpeedItemExpirationTimer();
        else if(powerUpType == POWERUPS.DIAMOND)
            startDiamondItemExpirationTimer();
        else if(powerUpType == POWERUPS.SCORE_2X_MULTIPLIER)
            startScoreMultiplierItemExpirationTimer();
        else if(powerUpType == POWERUPS.EXTRA_LIFE)
            startExtraLifeItemExpirationTimer();
        else 
            console.log("invalid powerup timer activation.");     
    }
    // Stop timers
    else
    {
        if(powerUpType == POWERUPS.FREEZE_TIME)
            stopFreezeTimeItemExpirationTimer();
        else if(powerUpType == POWERUPS.LIGHTNING_SPEED)
            stopLightningSpeedItemExpirationTimer();
        else if(powerUpType == POWERUPS.DIAMOND)
            stopDiamondItemExpirationTimer();
        else if(powerUpType == POWERUPS.SCORE_2X_MULTIPLIER)
            stopScoreMultiplierItemExpirationTimer();
        else if(powerUpType == POWERUPS.EXTRA_LIFE)
            stopExtraLifeItemExpirationTimer();
        else 
            console.log("invalid powerup timer deactivation.");
    }
}

function powerUpSpawnTicker()
{
    if (!isGamePaused) 
    {
        var val = chooseRandomValueBetweenInterval(0, POWER_UP_SPAWN_FREQUENCY_SEC);
        
        if(val === POWER_UP_SPAWN_VALUE)
        {
            var powerUpType = chooseRandomValueBetweenInterval(0, POWER_UP_TOTAL_ACTIVE_POWER_UP_TYPES);
            
            var randomXPixelSpawn =  Math.floor(chooseRandomValueBetweenInterval(getMapMinPixel(), getMapMaxXCoordinate()) / 20) * TILE_WIDTH;
            var randomYPixelSpawn = Math.floor(chooseRandomValueBetweenInterval(getMapMinPixel(), getMapMaxYCoordinate()) / 20) * TILE_HEIGHT;

            spawnPowerUp(randomXPixelSpawn, randomYPixelSpawn, powerUpType);
        }
    }
}

function stopAllActivePowerUps()
{
    stopScoreMultiplier();
    stopLightningSpeed();
    unfreezeTime();
}

function resetAllPowerUps()
{
    delete powerup_tileLocations;
    powerup_tileLocations = [];

    removeAllPowerUpSprites();
}