const BULLET_TIME_BALL_SPEED_RATIO = 0.5;
var isBulletTime = false;
var isFrozenTime = false;

var freezeTimeBallXVelocities = [];
var freezeTimeBallYVelocities = [];


function startBulletTime()
{
    // Can't enter bullet time if already freeze time
    if (isBulletTime || isFrozenTime)
        return;
    isBulletTime = true;

    for (var i = 0; i < balls.length; i++)
    {
        balls.getAt(i).body.velocity.x *= BULLET_TIME_BALL_SPEED_RATIO;
        balls.getAt(i).body.velocity.y *= BULLET_TIME_BALL_SPEED_RATIO;
    }
}

function stopBulletTime()
{
    if (!isBulletTime)
        return;
    isBulletTime = false;

    for (var i = 0; i < balls.length; i++)
    {
        balls.getAt(i).body.velocity.x /= BULLET_TIME_BALL_SPEED_RATIO;
        balls.getAt(i).body.velocity.y /= BULLET_TIME_BALL_SPEED_RATIO;
    }    
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
