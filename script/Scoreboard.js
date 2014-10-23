
// Create/recreate the scoreboard when needed
function createScoreboard()
{
    // Add one buffer tile to split map and scoreboard.
    var scoreboardXStartingPoint = TILE_WIDTH * (MAP_TILE_WIDTH + 1);

    var text;
    var style = { font: "30px Arial", fill: "#ff0044" };
    var yCoordinate = 0;

    // Percent complete
    // The null test handles updating this scoreboard - destroy the old component
    if (scoreboard_percentCompleteTextBlock != null)
        scoreboard_percentCompleteTextBlock.destroy(true);
    text = "Percent Complete: 0%."
    scoreboard_percentCompleteTextBlock = game.add.text(scoreboardXStartingPoint, yCoordinate, text, style);
    yCoordinate += 50;

    // Target Percent Complete
    if (scoreboard_targetPercentComplete != null)
        scoreboard_targetPercentComplete.destroy(true);
    text = "Target Percentage: " + level_targetPercentComplete + "%."
    scoreboard_targetPercentComplete = game.add.text(scoreboardXStartingPoint, yCoordinate, text, style);
    yCoordinate += 50;

    // Percent complete
    // The null test handles updating this scoreboard - destroy the old component
    if (scoreboard_currentLevel != null)
        scoreboard_currentLevel.destroy(true);
    text = "Level: " + level_currentLevel + ".";
    scoreboard_currentLevel = game.add.text(scoreboardXStartingPoint, yCoordinate, text, style);
    yCoordinate += 50;


    // Player Lives    
    if (scoreboard_playerLives != null)
        scoreboard_playerLives.destroy(true);
    text = "Character Lives: " + level_playerLives + ".";

    scoreboard_playerLives = game.add.text(scoreboardXStartingPoint, yCoordinate, text, style);
    yCoordinate += 100;

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
    level_percentComplete = Math.round(100 * level_totalFilledTiles / level_totalEmptyTiles);
    scoreboard_percentCompleteTextBlock.setText("Percent Complete: " + level_percentComplete + "%.");

    scoreboard_playerLives.setText("Character Lives: " + level_playerLives + ".");
}
