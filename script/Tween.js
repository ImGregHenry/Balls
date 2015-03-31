const SCORE_GAINED_ANIMATION_DISTANCE_Y = 10;
const CHARACTER_SPEED = 50;
const CHARACTER_LIGHTNING_SPEED = 17;
// NOTE: Max speed possible is based on the frame rate (60fps)
// 1000ms/60 = 16.666


const SCORE_GAINED_TEXT_STYLE = { font: "30px Arial", fill: "#E60A24" }; //ff0044
const SCORE_GAINED_TEXT_TWEEN_DURATION = 750;

const POWER_UP_SCORE_MULTIPLIER_TEXT_STYLE = { font: "30px Arial", fill: "#FFFF00" }; //ff0044

const POWER_UP_SCORE_GAINED_TEXT_STYLE = { font: "30px Arial", fill: "#00CC00" }; //ff0044
const POWER_UP_SCORE_TWEEN_DURATION = 1000;

const POWER_UP_EXTRA_LIFE_TEXT_STYLE = { font: "30px Arial", fill: "#009900" }; //ff0044
const POWER_UP_EXTRA_LIFE_TWEEN_DURATION = 1000;

var playerTween = null;

var scoreGainedTweenArray = [];
var scoreGainedTextArray = [];




// Animates percent complete text via tweening
function startScoreGainedTween(x, y, animatedText, powerUpType)
{
    var scoreGainedTween = null;
    var scoreGainedText = null;
    var tweenDuration = 0;

    if(powerUpType == POWERUPS.DIAMOND)
    {
        scoreGainedText = game.add.text(x, y, animatedText, POWER_UP_SCORE_GAINED_TEXT_STYLE);
        tweenDuration = POWER_UP_SCORE_TWEEN_DURATION;
    }
    else if(isScoreMultiplierActive)
    {
        scoreGainedText = game.add.text(x, y, animatedText, POWER_UP_SCORE_MULTIPLIER_TEXT_STYLE);
        tweenDuration = SCORE_GAINED_TEXT_TWEEN_DURATION;
    }
    else if(powerUpType == POWERUPS.EXTRA_LIFE)
    {
        scoreGainedText = game.add.text(x, y, animatedText, POWER_UP_EXTRA_LIFE_TEXT_STYLE);
        tweenDuration = POWER_UP_EXTRA_LIFE_TWEEN_DURATION;
    }
    else
    {
        scoreGainedText = game.add.text(x, y, animatedText, SCORE_GAINED_TEXT_STYLE);
        tweenDuration = SCORE_GAINED_TEXT_TWEEN_DURATION;
    }

    scoreGainedTween = game.add.tween(scoreGainedText);
    
    scoreGainedTween.onComplete.add(scoreGainedTweenComplete, this);
    scoreGainedTween.to({ x: x, y: y - SCORE_GAINED_ANIMATION_DISTANCE_Y }, tweenDuration, Phaser.Easing.Linear.None, true);
    scoreGainedTween.start();

    scoreGainedTweenArray.push(scoreGainedTween);
    scoreGainedTextArray.push(scoreGainedText);
}

function scoreGainedTweenComplete()
{
    if(scoreGainedTextArray && scoreGainedTextArray.length > 0)
        game.world.remove(scoreGainedTextArray.shift());
    
    if(scoreGainedTweenArray != null && scoreGainedTweenArray.length > 0)
        game.world.remove(scoreGainedTweenArray.shift());
}

// Animates player movement via tweening
function startPlayerTween(x, y)
{
    if (playerTween == null || !playerTween.isRunning)
    {
        // Remove old tween
        if(playerTween != null)
            playerTween.stop(false);

        playerTween = game.add.tween(player);
    
        playerTween.onComplete.add(processTileFilling, this);
        
        //Phaser.Easing.Quadratic.InOut
        if(isLightningSpeedActive)
        {
            playerTween.to({ x: x, y: y }, CHARACTER_LIGHTNING_SPEED, Phaser.Easing.Linear.None, true);   
        }
        else
        {
            playerTween.to({ x: x, y: y }, CHARACTER_SPEED, Phaser.Easing.Linear.None, true);   
        }
        
        playerTween.start();
    }
}
