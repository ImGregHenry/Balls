const POWER_UP_FREEZE_ENERGY_BURN_RATE = 0.0055;
const POWER_UP_TICK_TIME_INTERVAL = 1.0;
var isFreezeTimeActive = false;

var freezeTimeBallXVelocities = [];
var freezeTimeBallYVelocities = [];

function freezeTime()
{
    if (isFreezeTimeActive)
        return;

    isFreezeTimeActive = true;
    isPowerUpActive = true;
    piePowerUpVisible = true;

    // Display text and powerup icon on scoreboard
    showPowerUpScoreboardInfo(true, POWERUPS.FREEZE_TIME);

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
    if (!isFreezeTimeActive)
        return;
    
    isFreezeTimeActive = false;
    isPowerUpActive = false;
    piePowerUpVisible = false;

    showPowerUpScoreboardInfo(false, POWERUPS.FREEZE_TIME);

    // Restore original ball velocities
    for (var i = 0; i < balls.length; i++)
    {
        balls.getAt(i).body.velocity.x = freezeTimeBallXVelocities[i];
        balls.getAt(i).body.velocity.y = freezeTimeBallYVelocities[i];
    }
}
