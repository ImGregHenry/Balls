
// Get tile X-index within the tilemap
function getPlayerXTileIndex()
{
    var position = player.body.x;

    return Math.round(position / TILE_WIDTH);
}

// Get the tile Y-index within the tilemap
function getPlayerYTileIndex()
{
    var position = player.body.y;

    return Math.round(position / TILE_HEIGHT);
}

//TODO: rename this function to something more descriptive
function fillTiles()
{
    var x = getPlayerXTileIndex();
    var y = getPlayerYTileIndex();

    var currentTile = map.getTile(x, y, mapLayer, false);

    if (currentTile == null)
        console.log("ERROR: tile not found.");
    else if (currentTile.index == EMPTY_ZONE_ID)
    {
        isCharInDangerZone = true;
        map.fill(DANGER_ZONE_ID, x, y, 1, 1, mapLayer);

        currentTile.setCollisionCallback(playerDiedStartRoundStartTimers, this);

        // Track tiles in our array for flood-fill usage
        updateTileMapArray(x, y, DANGER_ZONE_ID);

        endangeredTiles.push(x + "," + y);
    }
    else if (currentTile.index == DANGER_ZONE_ID)
    {
        // TODO: character cannot re-enter a danger-zone tile
    }
    else if (currentTile.index == SAFE_ZONE_ID)
    {
        if (isCharInDangerZone)
        {
            //TODO: cleanup percent cleared animation
            //var percentClearedBefore = level_percentComplete;
            var percentClearedAnmiation_X = endangeredTiles[endangeredTiles.length - 1].split(",")[0];
            var percentClearedAnmiation_Y = endangeredTiles[endangeredTiles.length - 1].split(",")[1];
            var tilesCleared = level_totalFilledTiles;

            // Reset danger flag
            isCharInDangerZone = false;

            // Start flood-fill algorithm
            processFloodFlowFromArray(endangeredTiles);

            // Safely cleared tiles.  Reset them to 'safe-zone' tiles
            clearEndangeredTiles(true);

            //startPercentCompleteAnimation(percentClearedBefore, percentClearedAnmiation_X, percentClearedAnmiation_Y);
            processScoreChanges(level_totalFilledTiles - tilesCleared, percentClearedAnmiation_X, percentClearedAnmiation_Y);

            // Update the scoreboard with new values
            updateScoreboard();

            if (isLevelComplete())
            {
                pauseLevelTimer();
                GetLevelCompleteSound().play();
                spawnLevelCompleteAnimation();
            }
        }
    }

    return currentTile;
}

// Convert 'danger-zone' tiles to 'safe-zone' or empty tiles
function clearEndangeredTiles(isSafeTile)
{
    // Loop through all the endangered tiles and set them to SAFE_ZONE
    for (var i = 0; i < endangeredTiles.length; i++)
    {
        // stored as ['1,1', '2,2', 3,5']
        var x = parseInt(endangeredTiles[i].split(",")[0]);
        var y = parseInt(endangeredTiles[i].split(",")[1]);

        updateMapTile(x, y, isSafeTile);
        //console.log("Clearing: " + vals[0] + "," + vals[1] + " OF " + endangeredTiles.length + ". isSafe: " + isSafeTile);
    }

    // Reset the endangered tiles array
    endangeredTiles = [];
}

function updateMapTile(x, y, isSafeTile)
{
    // Get the current tile that was just converted to a safe zone
    var currentTile = map.getTile(x, y, mapLayer, false);

    // Clear the death method from the tile
    currentTile.setCollisionCallback(null, this);

    // Redraw the tile to the appropriate tile type --> based on whether clearing was successful (player didn't die)
    if (isSafeTile)
    {
        // Enable collision since it is now a safe-zone tile
        currentTile.setCollision(true, true, true, true);

        map.fill(SAFE_ZONE_ID, x, y, 1, 1, mapLayer);

        // Increment the tile counter
        level_totalFilledTiles++;

        // Keep the tile-map-array up-to-date
        updateTileMapArray(x, y, SAFE_ZONE_ID);
    }
    else
    {
        // Disable collisions on this tile since it is now an empty-zone
        currentTile.setCollision(false, false, false, false);

        // Redraw the tile
        map.fill(EMPTY_ZONE_ID, x, y, 1, 1, mapLayer);

        updateTileMapArray(x, y, EMPTY_ZONE_ID);
    }
}


// Creates a tilemap array for tracking tile values (used for flood-filling)
function createTileMapArray()
{
    fullMapArray = [];
    for (var y = 0; y < MAP_TILE_HEIGHT; y++)
    {
        var rowArray = [];
        for (var x = 0; x < MAP_TILE_WIDTH; x++)
        {
            var index = map.getTile(x, y).index;
            rowArray.push(index);
        }
        fullMapArray.push(rowArray);
    }
}

function clearDangerTilesInTileMapArray(value)
{
    for (var y = 0; y < MAP_TILE_HEIGHT; y++)
    {
        for (var x = 0; x < MAP_TILE_WIDTH; x++)
        {
            if (fullMapArray[y][x] == DANGER_ZONE_ID)
                fullMapArray[y][x] = value;

        }
    }
}


function updateTileMapArray(x, y, value)
{
    fullMapArray[y][x] = value;
    //var currentTile = map.getTile(parseInt(x), parseInt(y), mapLayer, false);
    //TODO: fix this tile map update????
}


function getMapLevelCenterPixelX()
{

}

function getMapLevelCenterPixelY()
{

}