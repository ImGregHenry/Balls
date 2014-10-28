
var percentClearedTextStyle = { font: "30px Arial", fill: "#E60A24" }; //ff0044
var percentClearedTween = null;
var percentClearedText;
const PERCENT_CLEARED_ANIMATION_DISTANCE_Y = 10;
// Animates percent complete text via tweening
function startpercentClearedTween(x, y, animatedText)
{
    if (percentClearedTween == null || !percentClearedTween.isRunning)
    {
        percentClearedText = game.add.text(x, y, animatedText, percentClearedTextStyle);
        percentClearedTween = game.add.tween(percentClearedText);
        percentClearedTween.onComplete.add(percentClearedTweenComplete, this);
        percentClearedTween.to({ x: x, y: y-PERCENT_CLEARED_ANIMATION_DISTANCE_Y }, 500, Phaser.Easing.Linear.None, true);   //Phaser.Easing.Quadratic.InOut
        percentClearedTween.start();
    }
}

function percentClearedTweenComplete()
{
    percentClearedText.destroy(true);
}



var playerTween = null;
// Animates player movement via tweening
function startPlayerTween(x, y)
{
    if (playerTween == null || !playerTween.isRunning)
    {
        playerTween = game.add.tween(player);
        playerTween.onComplete.add(playerTweenComplete, this);
        playerTween.to({ x: x, y: y }, 50, Phaser.Easing.Linear.None, true);   //Phaser.Easing.Quadratic.InOut
        playerTween.start();
    }
}
