const BULLET_TIME_BALL_VELOCITY = 100;
var isBulletTime = false;
var isFrozenTime = false;

var freezeTimeBallXVelocities = [];
var freezeTimeBallYVelocities = [];

var bulletTime_energy = 1.000;
const BULLET_TIME_ENERGY_BURN_RATE = 0.002;
const BULLET_TIME_ENERGY_REGEN_RATE = 0.001;
const BULLET_TIME_ENERGY_TIME_INTERVAL = 1.0;
const BULLET_TIME_MINIMUM_START_ENERGY = 0.5;

var timer_bulletTime;

function createBulletTimeEnergyTimer()
{
    if (timer_bulletTime == null)
    {
        timer_bulletTime = game.time.events.loop(BULLET_TIME_ENERGY_TIME_INTERVAL, function ()
        {
            if (!isGamePaused)
            {
                // Drain bullet time energy
                if (isBulletTime)
                {
                    // Reduce bullet time energy
                    if (bulletTime_energy > BULLET_TIME_ENERGY_REGEN_RATE)
                    {
                        bulletTime_energy = bulletTime_energy - BULLET_TIME_ENERGY_BURN_RATE;
                    }
                    // Out of bullet time energy
                    else
                    {
                        stopBulletTime();
                    }
                }
                // Regen bullet time energy
                else
                {
                    // Regen bullet time energy
                    if ((bulletTime_energy + BULLET_TIME_ENERGY_REGEN_RATE) < 1.0)
                    {
                        bulletTime_energy = bulletTime_energy + BULLET_TIME_ENERGY_REGEN_RATE;
                    }
                    // Bullet time energy is full
                    else
                    {
                        bulletTime_energy = 1.0;
                    }
                }
                //var text = isBulletTime ? "bulletTime" : "notBulletTime";
                //console.log("progress: " + bulletTime_energy + " " + text);
            }
        }, this);
    }
    else
    {
        bulletTime_energy = 1.0;
    }
}

var bulletTimeStartSound;
var bulletTimeHeartbeatSound;
var gameSoundEffectVolume = 1.0;
function startBulletTime()
{
    console.log("START bullet time: " + isBulletTime);

    // Can't enter bullet time if already freeze time
    if (isBulletTime || isFrozenTime)
        return;

    if (bulletTime_energy > BULLET_TIME_MINIMUM_START_ENERGY)
        isBulletTime = true;
    else
        return;

    
    bulletTimeStartSound = game.add.audio('audio-bullet-time-start', gameSoundEffectVolume/4.0, false);
    bulletTimeHeartbeatSound = game.add.audio('audio-bullet-time-heartbeat', gameSoundEffectVolume, false);
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

function stopBulletTime()
{
    console.log("STOP bullet time: " + isBulletTime);
    if (!isBulletTime)
        return;
    isBulletTime = false;

    bulletTimeStartSound.stop();
    bulletTimeHeartbeatSound.stop();
    bulletTimeStopSound = game.add.audio('audio-bullet-time-stop', gameSoundEffectVolume/4.0, false);
    bulletTimeStopSound.play();

    for (var i = 0; i < balls.length; i++)
    {
        balls.getAt(i).body.velocity.x = BALL_VELOCITY * getVelocityScalingDirection(balls.getAt(i).body.velocity.x);
        balls.getAt(i).body.velocity.y = BALL_VELOCITY * getVelocityScalingDirection(balls.getAt(i).body.velocity.y);
        //BULLET_TIME_BALL_SPEED_RATIO;
    }    
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

    // Restore original ball velocities
    for (var i = 0; i < balls.length; i++)
    {
        balls.getAt(i).body.velocity.x = freezeTimeBallXVelocities[i];
        balls.getAt(i).body.velocity.y = freezeTimeBallYVelocities[i];
    }
}
