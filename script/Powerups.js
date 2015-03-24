const BULLET_TIME_BALL_VELOCITY = 100;
var isBulletTime = false;
var isFrozenTime = false;

var freezeTimeBallXVelocities = [];
var freezeTimeBallYVelocities = [];

var bulletTime_energy = 1.000;
const BULLET_TIME_ENERGY_BURN_RATE = 0.005;
const BULLET_TIME_ENERGY_REGEN_RATE = 0.002;
const BULLET_TIME_ENERGY_TIME_INTERVAL = 1.0;
const BULLET_TIME_MINIMUM_START_ENERGY = 0.5;

var powerUp_energy = 1.000;
const POWER_UP_FREEZE_ENERGY_BURN_RATE = 0.0045;
const POWER_UP_FREEZE_ENERGY_TIME_INTERVAL = 1.0;

var timer_bulletTime;
var timer_powerUpTime;

var bulletTimeStartSound;
var bulletTimeHeartbeatSound;

var isPowerUpActive = false;


function spawnPowerUp(x, y)
{
    //TODO: handle type of powerup
    addPowerUpSnowFlake(x, y);
    setPowerUpTileLocations(x, y);
}

function powerUpPickedUp()
{
    clearPowerUpTileLocations();
    removePowerUpSnowFlake();

    freezeTime();
}

function bulletTimeTick()
{
    if (!isGamePaused)
    {
        // Drain bullet time energy
        if (isBulletTime)
        {
            // Drain bullet time energy
            if (bulletTime_energy > BULLET_TIME_ENERGY_BURN_RATE)
                bulletTime_energy = bulletTime_energy - BULLET_TIME_ENERGY_BURN_RATE;
            // Out of bullet time energy
            else
                stopBulletTime();
        }
        // Regen bullet time energy
        else
        {
            // Regen bullet time energy
            if ((bulletTime_energy + BULLET_TIME_ENERGY_REGEN_RATE) < 1.0)
                bulletTime_energy = bulletTime_energy + BULLET_TIME_ENERGY_REGEN_RATE;
            // Bullet time energy is full
            else
                bulletTime_energy = 1.0;
        }
    }
}

function startBulletTime()
{
    // Can't enter bullet time if already freeze time
    if (isBulletTime || isFrozenTime)
        return;

    if (bulletTime_energy > BULLET_TIME_MINIMUM_START_ENERGY)
        isBulletTime = true;
    else
        return;
    
    bulletTimeStartSound = GetBulletTimeStartSound();
    bulletTimeHeartbeatSound = GetBulletTimeHeartbeatSound();
    bulletTimeStartSound.play();
    bulletTimeHeartbeatSound.play();

    for (var i = 0; i < balls.length; i++)
    {
        balls.getAt(i).body.velocity.x = BULLET_TIME_BALL_VELOCITY * getVelocityScalingDirection(balls.getAt(i).body.velocity.x);
        balls.getAt(i).body.velocity.y = BULLET_TIME_BALL_VELOCITY * getVelocityScalingDirection(balls.getAt(i).body.velocity.y);;
    }
}

function pauseBulletTime(isPause)
{
    if(bulletTimeStartSound != null 
		&& bulletTimeHeartbeatSound != null)
	{
		if(isPause)
		{
			bulletTimeStartSound.pause();
			bulletTimeHeartbeatSound.pause();
		}
		else
		{
			bulletTimeStartSound.resume();
			bulletTimeHeartbeatSound.resume();
		}
	}
}

function stopBulletTime()
{
    if (!isBulletTime)
        return;
    isBulletTime = false;

    bulletTimeStartSound.stop();
    bulletTimeHeartbeatSound.stop();
    bulletTimeStopSound = GetBulletTimeStopSound();
    bulletTimeStopSound.play();

    for (var i = 0; i < balls.length; i++)
    {
        balls.getAt(i).body.velocity.x = BALL_VELOCITY * getVelocityScalingDirection(balls.getAt(i).body.velocity.x);
        balls.getAt(i).body.velocity.y = BALL_VELOCITY * getVelocityScalingDirection(balls.getAt(i).body.velocity.y);
    }    
}

function resetBulletTimeEnergy()
{
    bulletTime_energy = 1.0;
}

function getVelocityScalingDirection(val)
{
    if (val > 0.0)
        return 1.0;
    else
        return -1.0;
}

function freezeTime()
{
    // Can't enter freeze time if already bullet time
    if (isFrozenTime || isBulletTime)
        return;
    
    isFrozenTime = true;
    isPowerUpActive = true;
    piePowerUpVisible = true;

    // Display text and powerup icon on scoreboard
    showPowerUpScoreboardInfo(true);

    // Store ball velocities and set then set them to 0
    for (var i = 0; i < balls.length; i++)
    {
        freezeTimeBallXVelocities[i] = balls.getAt(i).body.velocity.x;
        freezeTimeBallYVelocities[i] = balls.getAt(i).body.velocity.y;
        balls.getAt(i).body.velocity.x = 0;
        balls.getAt(i).body.velocity.y = 0;
    }
}

function unfreezeTime()
{
    if (!isFrozenTime)
        return;
    
    isFrozenTime = false;
    isPowerUpActive = false;
    piePowerUpVisible = false;

    showPowerUpScoreboardInfo(false);

    // Restore original ball velocities
    for (var i = 0; i < balls.length; i++)
    {
        balls.getAt(i).body.velocity.x = freezeTimeBallXVelocities[i];
        balls.getAt(i).body.velocity.y = freezeTimeBallYVelocities[i];
    }
}

function freezeTimeTick()
{
    if (!isGamePaused)
    {
        // Drain bullet time energy
        if (isPowerUpActive && isFrozenTime)
        {
            // Drain bullet time energy
            if (powerUp_energy > POWER_UP_FREEZE_ENERGY_BURN_RATE)
            {
                powerUp_energy = powerUp_energy - POWER_UP_FREEZE_ENERGY_BURN_RATE;
            }
            // Out of bullet time energy
            else
            {
                unfreezeTime();
            }
        }
    }
}
