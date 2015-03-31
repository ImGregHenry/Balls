var map;
var map_scoreboard;
var layer_map;
var layer_dangerZone;

var powerup_tileLocations = [];
var endangeredTiles = [];

function drawMap()
{
    if (map != null)
    {
        map.destroy();
    }

    map = game.add.tilemap('map-gamearea');
    
    // Disable collisions on empty zone spaces, enable collisions with every other tile
    map.setCollisionByExclusion([parseInt(EMPTY_ZONE_ID)], true);
    
    // Add all the tile sets being used on the map
    map.addTilesetImage('tile-safe-zone', 'tile-safe-zone', 20, 20, 0, 0, 1);
    map.addTilesetImage('tile-danger-zone', 'tile-danger-zone', 20, 20, 0, 0, 2);
    map.addTilesetImage('tile-empty', 'tile-empty', 20, 20, 0, 0, 3);

    if(layer_map != null)
        layer_map.destroy(true);
    if(layer_dangerZone != null)
        layer_dangerZone.destroy(true);

    // Create the layer from the .json file
    layer_map = map.createLayer('Tile Layer 1');
    layer_map.resizeWorld();

    layer_dangerZone = map.createBlankLayer('layer-danger-zone', MAP_TILE_WIDTH, MAP_TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
    
    // Used for flood-fill-analysis
    createTileMapArray();
}

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

// Get tile index within the tilemap
function getTileIndex(pixel)
{
    var position = pixel;

    return Math.round(position / TILE_WIDTH);
}

function isPowerUpTileLocation(x, y)
{
    for(var i = 0; i < powerup_tileLocations.length; i++)
    {
        // End with ',' as format is 'x,y,powerUpType'
        var str = x + "," + y + ",";
        // if starts with
        if(powerup_tileLocations[i].indexOf(str) === 0)
        {
            return true
        }
    }

    return false;
}

function setPowerUpTileLocations(pixel_x, pixel_y, powerUpType)
{
    // Remove previously existing powerups of that type on the map
    clearPowerUpTileLocations(powerUpType);

    var x = getTileIndex(pixel_x);
    var y = getTileIndex(pixel_y);

    powerup_tileLocations.push(x + "," + y + "," + powerUpType);
    powerup_tileLocations.push((x+1) + "," + y + "," + powerUpType);
    powerup_tileLocations.push(x + "," + (y+1) + "," + powerUpType);
    powerup_tileLocations.push((x+1) + "," + (y+1) + "," + powerUpType);
}

function getPowerUpTypeAtTile(x, y)
{
    for(var i = 0; i < powerup_tileLocations.length; i++)
    {
        var str = x + "," + y;
        // if starts with
        if(powerup_tileLocations[i].indexOf(str) === 0)
        { 
            return powerup_tileLocations[i].split(',')[2];
        }
    }
}

function clearPowerUpTileLocations(powerUpType)
{
    var arrayIndex = powerup_tileLocations.length;
    for(var i = 0; i < powerup_tileLocations.length; i++)
    {
        // if starts with
        if(powerup_tileLocations[i].split(',')[2] == powerUpType)
        {
            powerup_tileLocations.splice(i, 1);
            i--;
        }
    }
}

function processTileFilling()
{
    var x = getPlayerXTileIndex();
    var y = getPlayerYTileIndex();

    if(isPowerUpTileLocation(x, y))
    {
        var powerUpType = getPowerUpTypeAtTile(x, y);

        // player picked up a powerup
        powerUpPickedUp(x, y, powerUpType);
    }

    var currentTile = map.getTile(x, y, layer_map, false);

    if (currentTile == null)
        console.log("ERROR: tile not found.");
    else if (currentTile.index == EMPTY_ZONE_ID)
    {
        var dangerTile = map.getTile(x, y, layer_dangerZone, false);

        // Only do things if the tile was not already in danger zone
        if (dangerTile == null)
        {
            // Place an endangered tile and get the resulting tile
            dangerTile = map.putTile(DANGER_ZONE_ID, x, y, layer_dangerZone);

            dangerTile.setCollisionCallback(playerDiedStartRoundStartTimers, this);
            
            // Set danger zone flag
            isCharInDangerZone = true;
            
            // Track tiles in our array for flood-fill usage
            updateTileMapArray(x, y, DANGER_ZONE_ID);

            endangeredTiles.push(x + "," + y);
        }
    }
    else if (currentTile.index == SAFE_ZONE_ID)
    {
        if (isCharInDangerZone)
        {
            //TODO: cleanup percent cleared animation
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
    }

    // Reset the endangered tiles array
    endangeredTiles = [];
}

function updateMapTile(x, y, isSafeTile)
{
    // Remove the danger zone tile, either way
    map.removeTile(x, y, layer_dangerZone);

    // Redraw the tile to the appropriate tile type 
    // Successful clear --> convert to safe tiles
    if (isSafeTile)
    {
        map.putTile(SAFE_ZONE_ID, x, y, layer_map);

        var currentTile = map.getTile(x, y, layer_map, false);

        // Enable collision since it is now a safe-zone tile
        currentTile.setCollision(true, true, true, true);

        // Increment the tile counter
        level_totalFilledTiles++;

        // Keep the tile-map-array up-to-date
        updateTileMapArray(x, y, SAFE_ZONE_ID);
    }
    // Failed clear --> keep empty zone tile
    else
    {
        // Update the tile map array with new value
        updateTileMapArray(x, y, EMPTY_ZONE_ID);
    }
}


// Creates a tilemap array for tracking tile values (used for flood-filling)
function createTileMapArray()
{
    delete fullMapArray;

    fullMapArray = [];
    for (var y = 0; y < MAP_TILE_HEIGHT; y++)
    {
        var rowArray = [];
        for (var x = 0; x < MAP_TILE_WIDTH; x++)
        {
            var tile = map.getTile(x, y, layer_map);
            
            if(tile != null)
            {
                var index = tile.index;
                rowArray.push(index);
            }
        }
        fullMapArray.push(rowArray);
        delete rowArray;
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
}
