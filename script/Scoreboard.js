const SCORE_TILE_VALUE = 10;
const SCORE_TILE_TIER_BONUS = 100;
const SCORE_TILE_TIER_VALUE = 10;

const SCOREBOARD_CHARACTER_LIFE_DISPLAY_STARTING_X_COORDINATE = 1220;
const SCOREBOARD_CHARACTER_LIFE_DISPLAY_STARTING_Y_COORDINATE = 5;
const SCOREBOARD_CHARACTER_MAX_LIVES_PER_ROW = 7;
const SCOREBOARD_CHARACTER_LIFE_SPACING = 25;
const CHARACTER_PIXEL_SIZE = 20;

var array_characterLifeSprites = [];

var scoreboard_targetPercentCompleteText;
var scoreboard_currentLevelText;
var scoreboard_playerLivesText;
var scoreboard_currentEnemyCountText;
var scoreboard_gameTimerText;
var scoreboard_pauseButton;
var scoreboard_restartButton;
var scoreboard_viewHighScoreButton;
var scoreboard_menuButton;
var scoreboard_bulletTimeText;
var scoreboard_percentCompleteText;
var scoreboard_highScoreText;
var scoreboard_scoreText;

var scoreboardXStartingPoint;
var scoreboardTextStyle = { font: "bold 30px Arial", fill: "#FFFFFF" }; //E60A24

var gameTimer;

function updateScoreboard_gameTimer()
{
    var min = Math.round(gameOverTimer.seconds / 60);
    var sec = Math.round(gameOverTimer.seconds % 60);
    if (parseInt(sec) < 10)
        sec = "0" + sec;
    var text = "Timer: " + min + ":" + sec;

    scoreboard_gameTimerText.setText(text);
}

// Create/recreate the scoreboard when needed
function createScoreboard()
{
    var text;
    var yCoordinate = 10;
    scoreboardXStartingPoint = TILE_WIDTH * (MAP_TILE_WIDTH + 1) - 10;

    // Player Lives
    if (scoreboard_playerLivesText != null)
        scoreboard_playerLivesText.destroy(true);
    text = "Player Lives: ";
    scoreboard_playerLivesText = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    //scoreboard_playerLivesText.fontWeight = "bold";
    yCoordinate += 50;

    // Current Level
    if (scoreboard_currentLevelText != null)
        scoreboard_currentLevelText.destroy(true);
    text = "Level: " + level_currentLevel;
    scoreboard_currentLevelText = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 50;

    // Current Enemy Count
    if (scoreboard_currentEnemyCountText != null)
        scoreboard_currentEnemyCountText.destroy(true);
    text = "Enemies: " + level_numberOfBalls;
    scoreboard_currentEnemyCountText = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 75;

    // Target Percent Complete
    if (scoreboard_targetPercentCompleteText != null)
        scoreboard_targetPercentCompleteText.destroy(true);
    text = "Target Percentage: " + level_targetPercentComplete + ".0%"
    scoreboard_targetPercentCompleteText = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 50;

    // Percent Complete
    if (scoreboard_percentCompleteText != null)
        scoreboard_percentCompleteText.destroy(true);
    text = "Percent Complete: 0.0%"
    scoreboard_percentCompleteText = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 75;

    // Game Timer
    if (scoreboard_gameTimerText != null)
        scoreboard_gameTimerText.destroy(true);
    text = "Timer: 0:00";
    scoreboard_gameTimerText = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 50;

    // Score
    if (scoreboard_scoreText != null)
        scoreboard_scoreText.destroy(true);
    text = "Score: " + level_currentScore;
    scoreboard_scoreText = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 50;

    // High Score
    if (scoreboard_highScoreText != null)
        scoreboard_highScoreText.destroy(true);
    text = "High Score: " + level_highScore;
    scoreboard_highScoreText = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);
    yCoordinate += 75;

    // Restart Button
    if (scoreboard_restartButton != null)
        scoreboard_restartButton.destroy(true);
    scoreboard_restartButton = game.add.button(scoreboardXStartingPoint, yCoordinate, 'scoreboard-restart-button', restartGame, this, 2, 1, 0);
    
    // Pause Button
    if (scoreboard_pauseButton != null)
        scoreboard_pauseButton.destroy(true);
    scoreboard_pauseButton = game.add.button(scoreboardXStartingPoint + scoreboard_restartButton.width + 10, yCoordinate, 'scoreboard-pause-button', pauseGame, this, 2, 1, 0);
    yCoordinate += 80;
	
	// View High Scores Button
	if (scoreboard_viewHighScoreButton != null)
		scoreboard_viewHighScoreButton.destroy(true);
	scoreboard_viewHighScoreButton = game.add.button(scoreboardXStartingPoint, yCoordinate, 'view-highscores-button', viewHighScorePopup);
	
	// View High Scores Button
	if (scoreboard_menuButton != null)
		scoreboard_menuButton.destroy(true);
	scoreboard_menuButton = game.add.button(scoreboardXStartingPoint + scoreboard_restartButton.width + 10, yCoordinate, 'menu-button', goBackToMenu);
	yCoordinate += 95;
	
    // Bullet Time Text
    if (scoreboard_bulletTimeText != null)
        scoreboard_bulletTimeText.destroy(true);
    text = "Bullet Time:";
    scoreboard_bulletTimeText = game.add.text(scoreboardXStartingPoint, yCoordinate, text, scoreboardTextStyle);

    characterLivesDisplay();
}

function updateScoreboard()
{
    // update percent
    level_percentComplete = (100 * level_totalFilledTiles / level_totalEmptyTiles);
    scoreboard_percentCompleteText.setText("Percent Complete: " + (Math.round(level_percentComplete * 10) / 10) + "%");

    // update score
    scoreboard_scoreText.setText("Score: " + level_currentScore);
    scoreboard_highScoreText.setText("High Score: " + level_highScore);
}

function scoreboardRemovePlayerLife()
{
    // Remove a sprite from the player lives
    if (array_characterLifeSprites.length > 0)
    {
        var deadCharSprite = array_characterLifeSprites.pop();
        deadCharSprite.destroy();
    }
}

//TODO: handle maximum number of lives.
function characterLivesDisplay()
{
    var x = SCOREBOARD_CHARACTER_LIFE_DISPLAY_STARTING_X_COORDINATE;
    var y = SCOREBOARD_CHARACTER_LIFE_DISPLAY_STARTING_Y_COORDINATE;
    var currentLivesInRow = 0;

    // Display a sprite for each life the character has.
    for (var i = 0; i < level_playerLives; i++)
    {
        array_characterLifeSprites.push(game.add.sprite(x, y, 'character'));
        
        currentLivesInRow++;

        // Start new row of icons
        if(currentLivesInRow >= SCOREBOARD_CHARACTER_MAX_LIVES_PER_ROW)
        {
            currentLivesInRow = 0;
            x = SCOREBOARD_CHARACTER_LIFE_DISPLAY_STARTING_X_COORDINATE
            y += SCOREBOARD_CHARACTER_LIFE_SPACING;
        }
        // Continue row
        else
        {
            x += SCOREBOARD_CHARACTER_LIFE_SPACING;
        }
    }
}


//TODO: clean up the percent complete animation
//function startPercentCompleteAnimation(percentCompleteBefore, percentClearedAnmiation_X, percentClearedAnmiation_Y)
function processScoreChanges(tilesCleared, animationTile_X, animationTile_Y)
{
    //var diff = level_percentComplete - percentCompleteBefore;
    //var percentCleared = Math.round(diff * 10) / 10 + "%";
    //console.log("Level_PercentComplete: " + level_percentComplete + " Before: " + percentCompleteBefore + " Diff: " + diff + " PercentCleared: " + percentCleared);
    var scoreGained = calculateScoreGained(tilesCleared);
    level_currentScore += scoreGained;

    if (level_highScore < level_currentScore)
        level_highScore = level_currentScore;
    
    // Animation for the amount of points gained at location where clear was done
    startScoreGainedTween(animationTile_X * TILE_WIDTH, animationTile_Y * TILE_WIDTH, scoreGained);
}

function calculateScoreGained(tilesCleared)
{
    // Calculate base score gained
    var baseScore = tilesCleared * SCORE_TILE_VALUE;

    // Calculate bonus score (for more tiles cleared)
    var tier = Math.floor(tilesCleared / SCORE_TILE_TIER_VALUE);

    // Calculate full score gained
    var score = baseScore + tier * SCORE_TILE_TIER_VALUE;

    //console.log("SCORE.  Base: " + baseScore + " Tier: " + tier + " Total: " + score + " Overall: " + level_currentScore);

    return score;
}
