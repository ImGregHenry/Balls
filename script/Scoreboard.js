var scoreboard_currentLevel;
var scoreboard_targetPercentComplete;
var scoreboard_pauseButton;
var scoreboard_restartButton;
var scoreboard_playerLives;
var scoreboard_gameTimer;


var scoreboardXStartingPoint = TILE_WIDTH * (MAP_TILE_WIDTH + 1);
var scoreboardTextStyle = { font: "30px Arial", fill: "#ff0044" };
var gameTimer;

function updateScoreboard_GameTimer()
{
    var min = Math.round(gameOverTimer.seconds / 60);
    var sec = Math.round(gameOverTimer.seconds % 60);
    if (parseInt(sec) < 10)
        sec = "0" + sec;
    var text = "Timer: " + min + ":" + sec;

    if (scoreboard_gameTimer != null)
        scoreboard_gameTimer.destroy(true);
    //TODO: remove magic number for starting point on scoreboard
    scoreboard_gameTimer = game.add.text(scoreboardXStartingPoint, 200, text, scoreboardTextStyle);
}


// Create/recreate the scoreboard when needed
function createScoreboard()
{
    // Add one buffer tile to split map and scoreboard.
    
    var text;
    var yCoordinate = 0;

    // Percent complete
    // The null test handles updating this scoreboard - destroy the old component
    if (scoreboard_percentCompleteTextBlock != null)
        scoreboard_percentCompleteTextBlock.destroy(true);
    text = "Percent Complete: 0.0%"
    scoreboard_percentCompleteTextBlock = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 50;

    // Target Percent Complete
    if (scoreboard_targetPercentComplete != null)
        scoreboard_targetPercentComplete.destroy(true);
    text = "Target Percentage: " + level_targetPercentComplete + ".0%"
    scoreboard_targetPercentComplete = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 50;

    // Percent complete
    // The null test handles updating this scoreboard - destroy the old component
    if (scoreboard_currentLevel != null)
        scoreboard_currentLevel.destroy(true);
    text = "Level: " + level_currentLevel;
    scoreboard_currentLevel = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 50;

    if (scoreboard_gameTimer != null)
        scoreboard_gameTimer.destroy(true);
    //TODO: remove magic number for starting point on scoreboard
    text = "Timer: 0:00";
    scoreboard_gameTimer = game.add.text(scoreboardXStartingPoint, 200, text, scoreboardTextStyle);

    // Player Lives    
    if (scoreboard_playerLives != null)
        scoreboard_playerLives.destroy(true);
    text = "Character Lives: " + level_playerLives;
    scoreboard_playerLives = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 150;

    // Restart button
    if (scoreboard_restartButton != null)
        scoreboard_restartButton.destroy(true);
    scoreboard_restartButton = game.add.button(scoreboardXStartingPoint, yCoordinate, 'scoreboard-restart-button', restartGame, this, 2, 1, 0);
    yCoordinate += 100;

    // Pause button
    if (scoreboard_pauseButton != null)
        scoreboard_pauseButton.destroy(true);

    scoreboard_pauseButton = game.add.button(scoreboardXStartingPoint, yCoordinate, 'scoreboard-pause-button', pauseGame, this, 2, 1, 0);
}

function updateScoreboard()
{
    // update percent
    level_percentComplete = Math.round(100 * level_totalFilledTiles / level_totalEmptyTiles * 10) / 10;
    scoreboard_percentCompleteTextBlock.setText("Percent Complete: " + level_percentComplete + "%");

    // update character lives
    scoreboard_playerLives.setText("Character Lives: " + level_playerLives);
}
