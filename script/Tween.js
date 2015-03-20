
var scoreGainedTextStyle = { font: "30px Arial", fill: "#E60A24" }; //ff0044
var scoreGainedTween = null;
var scoreGainedText;
const SCORE_GAINED_ANIMATION_DISTANCE_Y = 10;
// Animates percent complete text via tweening
function startScoreGainedTween(x, y, animatedText)
{
    if (scoreGainedTween == null || !scoreGainedTween.isRunning)
    {
        scoreGainedText = game.add.text(x, y, animatedText, scoreGainedTextStyle);
        scoreGainedTween = game.add.tween(scoreGainedText);
        scoreGainedTween.onComplete.add(scoreGainedTweenComplete, this);
        scoreGainedTween.to({ x: x, y: y - SCORE_GAINED_ANIMATION_DISTANCE_Y }, 500, Phaser.Easing.Linear.None, true);   //Phaser.Easing.Quadratic.InOut
        scoreGainedTween.start();
    }
}

function scoreGainedTweenComplete()
{
    scoreGainedText.destroy(true);
}



var playerTween = null;
// Animates player movement via tweening
function startPlayerTween(x, y)
{
    if (playerTween == null || !playerTween.isRunning)
    {
        // Remove old tween
        if(playerTween != null)
            playerTween.stop(false);

        playerTween = game.add.tween(player);
    
        playerTween.onComplete.add(playerTweenComplete, this);
        
        playerTween.to({ x: x, y: y }, 50, Phaser.Easing.Linear.None, true);   //Phaser.Easing.Quadratic.InOut
        playerTween.start();
    }
}
