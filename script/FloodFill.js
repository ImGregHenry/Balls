
//RAY CASTING WIKI
//https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm
// MY QUESTION:
//http://stackoverflow.com/questions/25089749/tile-filling-algorithm-for-game/25089932#25090212

//BORDER SOLUTION
//http://gamedev.stackexchange.com/questions/73722/determine-if-a-set-of-tiles-on-a-grid-forms-an-enclosed-shape

/////////////////////////////////////////////
/////////////////////////////////////////////
//////////   DR FILL ALGORITHM     //////////
/////////////////////////////////////////////
/////////////////////////////////////////////

function processFloodFlowFromArray(tilePath)
{
    //console.log("Entered Flood-Fill.");

    var startTiles = [];
    startTiles = ChooseFloodFillStartTiles(tilePath);

    CreateEnemyTileArray();

    //console.log("ENEMY: " + flood_enemyTileArray);

    for (var i = 0; i < startTiles.length; i++)
    {
        var x = parseInt(startTiles[i].split(',')[0]);
        var y = parseInt(startTiles[i].split(',')[1]);
        FloodFillAreaFromStartPoint(x, y);
    }

}

function updateTheseTiles(theseTiles, value)
{
    for (var i = 0; i < theseTiles.length; i++)
    {
        var x = theseTiles[i].split(',')[0];
        var y = theseTiles[i].split(',')[1];

        updateTileMapArray(x, y, value);
        updateMapTile(parseInt(x), parseInt(y), true);
    }
}

var flood_enemyTileArray = [];
function CreateEnemyTileArray()
{
    flood_enemyTileArray = [];

    for (var i = 0; i < level_numberOfBalls; i++)
    {
        var enemy = balls.getAt(i);
        flood_enemyTileArray.push(getEnemyXTileIndex(enemy) + "," + getEnemyYTileIndex(enemy));
    }
}

//TODO: merge this previously used function "getPlayerXTileIndex" and "getPlayerYTileIndex"
// Get tile X-index within the tilemap
function getEnemyXTileIndex(enemy)
{
    var position = enemy.body.x + 10;

    return Math.round(position / TILE_WIDTH);
}

// Get the tile Y-index within the tilemap
function getEnemyYTileIndex(enemy)
{
    var position = enemy.body.y + 10;

    return Math.round(position / TILE_HEIGHT);
}


function ChooseFloodFillStartTiles(tilePath)
{
    //TODO: determine which tiles to test with   
    var x = parseInt(tilePath[0].split(',')[0]);
    var y = parseInt(tilePath[0].split(',')[1]);
    //console.log("Flood Fill start: " + x + "," + y);

    // RIGHT
    var test1X = x + 1;
    var test1Y = y;
    // LEFT
    var test2X = x - 1;
    var test2Y = y;
    // UP
    var test3X = x;
    var test3Y = y - 1;
    // DOWN
    var test4X = x;
    var test4Y = y + 1;


    var flood_startTiles = [];

    var currentTile = map.getTile(test1X, test1Y, mapLayer, false);
    //console.log("TestPoint1: " + test1X + "," + test1Y + ". Index:" + currentTile.index);
    if (currentTile.index == EMPTY_ZONE_ID) flood_startTiles.push(test1X + "," + test1Y);

    currentTile = map.getTile(test2X, test2Y, mapLayer, false);
    //console.log("TestPoint2: " + test2X + "," + test2Y + ". Index:" + currentTile.index);
    if (currentTile.index == EMPTY_ZONE_ID) flood_startTiles.push(test2X + "," + test2Y);

    currentTile = map.getTile(test3X, test3Y, mapLayer, false);
    //console.log("TestPoint3: " + test3X + "," + test3Y + ". Index:" + currentTile.index);
    if (currentTile.index == EMPTY_ZONE_ID) flood_startTiles.push(test3X + "," + test3Y);

    currentTile = map.getTile(test4X, test4Y, mapLayer, false);
    //console.log("TestPoint4: " + test4X + "," + test4Y + ". Index:" + currentTile.index);
    if (currentTile.index == EMPTY_ZONE_ID) flood_startTiles.push(test4X + "," + test4Y);

    //console.log("Total points being tested: " + flood_startTiles.length);
    return flood_startTiles;
}

function FloodFillAreaFromStartPoint(currX, currY)
{
    //console.log("STARTING DR. FILL TEST.  X:" + currX + ". Y:" + currY);
    drFillSafeTest(currX, currY);
}

////http://stackoverflow.com/questions/22645767/flood-fill-for-2d-int-array-optimization-in-java
////http://stackoverflow.com/questions/22053759/multidimensional-array-fill

var fillTheseTiles = [];

function drFillSafeTest(x, y)
{
    fillTheseTiles = [];
    flood_abort = false;

    flow(parseInt(x), parseInt(y));

    //TODO: handle single tile case???
    //Add the original tile to the list
    if (fillTheseTiles.length != 0)
        fillTheseTiles.push(x + "," + y);

    // Update the tiles into the map and the map-array-tracker
    updateTheseTiles(fillTheseTiles, SAFE_ZONE_ID);
}

var flood_abort;
function flow(x, y)
{
    if (flood_abort)
        return;

    // bounds check what we were passed
    if (y >= 0 && y < fullMapArray.length && x >= 0 && x < fullMapArray[y].length)
    {
        //console.log("x: " + x + ". y: " + y + ". a: " + fullMapArray[y][x] + ". b: " + EMPTY_ZONE_ID);

        // Enemy found, do not fill.
        if (flood_enemyTileArray.indexOf(x + "," + y) != -1)
        {
            fillTheseTiles = [];
            //console.log("ABORT FILL: " + x + "," + y);
            flood_abort = true;
            return;
        }

        //TODO: eliminate need for parseInt
        //TODO: instead of using indedof, using a temporary value
        //TODO: compare with star spawn points
        if (parseInt(fullMapArray[y][x]) == parseInt(EMPTY_ZONE_ID) && fillTheseTiles.indexOf(x + "," + y) == -1)
        {
            fillTheseTiles.push(x + "," + y);
            flow(x - 1, y);    // check up
            flow(x + 1, y);    // check down
            flow(x, y - 1);    // check left
            flow(x, y + 1);    // check right
        }
    }
}