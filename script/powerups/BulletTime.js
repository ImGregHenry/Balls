const BULLET_TIME_ENERGY_BURN_RATE = 0.0055;
const BULLET_TIME_ENERGY_REGEN_RATE = 0.0015;
const BULLET_TIME_ENERGY_TIME_INTERVAL = 1.0;
const BULLET_TIME_MINIMUM_START_ENERGY = 0.5;

const BULLET_TIME_BALL_VELOCITY = 100;

var bulletTime_energy = 1.000;
var isBulletTime = false;
var timer_bulletTime;

var bulletTimeStartSound;
var bulletTimeHeartbeatSound;


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
    // am i blind
    if (isBulletTime || isFreezeTimeActive)
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