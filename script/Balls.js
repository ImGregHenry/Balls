
(function ()
{
    const FPS = 30;

    const KEY_LEFT = 37;
    const KEY_RIGHT = 39;
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    const KEY_SPACE = 32;
    // A = 65
    // S = 83
    // W = 87
    // D = 68

    const CHARACTER_DIRECTION_NONE = 0;
    const CHARACTER_DIRECTION_UP = 1;
    const CHARACTER_DIRECTION_DOWN = 2;
    const CHARACTER_DIRECTION_LEFT = 3;
    const CHARACTER_DIRECTION_RIGHT = 4;

    const X_NUMBER_OF_TILES = 60;
    const Y_NUMBER_OF_TILES = 30;

    const X_SAFEZONE_BORDER_SIZE = 20;
    const Y_SAFEZONE_BORDER_SIZE = 12;
    const NORMAL_ZONE_VALUE = 0;
    const SAFE_ZONE_VALUE = 1;

    const TILE_SIZE = 20;
    const BALL_RADIUS = 10;
    const BALL_SPEED = 10;

    const CHARACTER_MOVEMENT_SPEED = 15;
    const CHARACTER_STARTING_X = 0;
    const CHARACTER_STARTING_Y = 0;

    const BALL_COLOUR = "#0000FF";
    const BACKGROUND_COLOUR = "#000000";
    const SAFE_ZONE_COLOUR = "#FF0000";

    var isGameRunning = true;

    var tileData = [];
    var circleData = [{ x: 455, y: 250, r: BALL_RADIUS, vx: -10, vy: 10 },
                      { x: 475, y: 260, r: BALL_RADIUS, vx: 10, vy: -10 }];
                      //{ x: 495, y: 250, r: BALL_RADIUS, vx: 5, vy: -12 }];

    var isCharMoving = false;
    var charDirection = CHARACTER_DIRECTION_NONE;
    var charXPosition = CHARACTER_STARTING_X;
    var charYPosition = CHARACTER_STARTING_X;

    init();

    function init()
    {
        var test = document.getElementById("test");
        document.getElementById("btnStartStop").onclick = toggle;
        
        var canv = document.getElementById("myCanvas");
        window.addEventListener("keydown", checkKeyDown, true);

        var ctx = canv.getContext("2d");

        var canvWidth = canv.getAttribute("width").valueOf();
        var canvHeight = canv.getAttribute("height").valueOf();

        generateTileArray();
        //debugTileOutput();
        
        intervalID = setInterval(function () {
            if (isGameRunning)
                drawAnimation();
        }, FPS/1000);


        function checkKeyDown(e)
        {
            //var event = window.event ? window.event : e;
            var key = event.keyCode;
            if (key == KEY_DOWN || key == KEY_UP || key == KEY_RIGHT || key == KEY_LEFT || key == KEY_SPACE)
            {
                pendCharacterMovement(key);
            }
        }

        function convertKeyToDirection(key)
        {
            if (key == KEY_UP)
                return CHARACTER_DIRECTION_UP;
            else if (key == KEY_DOWN)
                return CHARACTER_DIRECTION_DOWN;
            else if (key == KEY_LEFT)
                return CHARACTER_DIRECTION_LEFT;
            else if (key == KEY_RIGHT)
                return CHARACTER_DIRECTION_RIGHT;
            else if (key == KEY_SPACE)
                return CHARACTER_DIRECTION_NONE;
        }

        function pendCharacterMovement(key)
        {
            //if(!isCharMoving)
            {
                charDirection = convertKeyToDirection(key);
                if (charDirection != CHARACTER_DIRECTION_NONE)
                    isCharMoving = true;
                else
                    isCharMoving = false;
            }
        }

        function toggle()
        {
            if (isGameRunning)
            {
                document.getElementById("btnStartStop").innerText = "Start";
            }
            else
            {
                document.getElementById("btnStartStop").innerText = "Stop";
            }
            
            isGameRunning = !isGameRunning;
        }


        function drawAnimation()
        {
            
            drawAllTiles();
            drawBall();
            drawCharacter();
            //requestAnimationFrame(drawAnimation);
        }

        function drawCharacter()
        {
            img = document.createElement("img");
            img.src = "/images/ball.png";
            img.width = TILE_SIZE;
            img.height = TILE_SIZE;

            UpdateCharacterPosition();

            ctx.drawImage(img, charXPosition, charYPosition, TILE_SIZE, TILE_SIZE);
        }

        function UpdateCharacterPosition()
        {
            if(isCharMoving && canCharacterMove())
            {
                if(charDirection == CHARACTER_DIRECTION_UP)
                    charYPosition = charYPosition - CHARACTER_MOVEMENT_SPEED;
                else if (charDirection == CHARACTER_DIRECTION_DOWN)
                    charYPosition = charYPosition + CHARACTER_MOVEMENT_SPEED;
                else if (charDirection == CHARACTER_DIRECTION_LEFT)
                    charXPosition = charXPosition - CHARACTER_MOVEMENT_SPEED;
                else if (charDirection == CHARACTER_DIRECTION_RIGHT)
                    charXPosition = charXPosition + CHARACTER_MOVEMENT_SPEED;
            }
        }

        function canCharacterMove()
        {
            var charNextXPosition = charXPosition;
            var charNextYPosition = charYPosition;

            //TODO: reset to edge of border
            if (charDirection == CHARACTER_DIRECTION_UP)
                charNextYPosition -= CHARACTER_MOVEMENT_SPEED;
            else if (charDirection == CHARACTER_DIRECTION_DOWN)
                charNextYPosition += CHARACTER_MOVEMENT_SPEED;
            else if (charDirection == CHARACTER_DIRECTION_LEFT)
                charNextXPosition -= CHARACTER_MOVEMENT_SPEED;
            else if (charDirection == CHARACTER_DIRECTION_RIGHT)
                charNextXPosition += CHARACTER_MOVEMENT_SPEED;

            return characterPositionWithinCanvasBounds(charNextXPosition, charNextYPosition);
        }

        function characterPositionWithinCanvasBounds(x, y)
        {
            // Check if position is within the bounds of canvas
            if (x >= canvWidth - TILE_SIZE || x < 0 
                || y >= canvHeight - TILE_SIZE || y < 0)
                return false;
            else 
                return true;
        }

        function drawBall()
        {
            for (var i = 0; i < circleData.length; i++) {
                // Draw the circle
                ctx.beginPath();
                ctx.arc(circleData[i].x, circleData[i].y, circleData[i].r, 0, 2 * Math.PI, false);

                ctx.fillStyle = BALL_COLOUR;
                ctx.fill();
                ctx.stroke();

                // Update circle position and handle deflections off safe-zones
                handleCircleMovement(i);

                // Update current position
                circleData[i].x += circleData[i].vx;
                circleData[i].y += circleData[i].vy;
            }
        }

        function handleCircleMovement(index)
        {
            var x_coord = circleData[index].x + circleData[index].vx;
            var y_coord = circleData[index].y + circleData[index].vy;

            var isLeft = false;
            var isRight = false;
            var isTop = false;
            var isBot = false;

            var safeZoneDirection = "none";

            // Calculate which edge of the ball to use in calculation
            var leftXCoordinate = x_coord + BALL_RADIUS;
            var leftYCoordinate = y_coord;
            var rightXCoordinate = x_coord - BALL_RADIUS;
            var rightYCoordinate = y_coord;
            var topXCoordinate = x_coord;
            var topYCoordinate = y_coord + BALL_RADIUS;
            var botXCoordinate = x_coord;
            var botYCoordinate = y_coord - BALL_RADIUS;

            // Calculate, using the different ball edges, which sides of the ball fall within the safe-zone
            if (isSafeZoneCoordinate(leftXCoordinate, leftYCoordinate)) { 
                safeZoneDirection = "left";
                isLeft = true;
            }
            if (isSafeZoneCoordinate(rightXCoordinate, rightYCoordinate)){
                safeZoneDirection = "right";
                isRight = true;
            }
            if (isSafeZoneCoordinate(topXCoordinate, topYCoordinate)) {
                safeZoneDirection = "top";
                isTop = true;
            }
            if (isSafeZoneCoordinate(botXCoordinate, botYCoordinate)) {
                safeZoneDirection = "bottom";
                isBot = true;
            }

            //TODO: handle cases with 2+ directions set.
            //TODO: handle back-and-forth deflection case  

            // Handle direction changes
            if ((isTop && isLeft)
                || (isBot && isLeft)
                || (isTop && isRight)
                || (isBot && isRight))
            {
                circleData[index].vy = -circleData[index].vy;
                circleData[index].vx = -circleData[index].vx;

                //test.value += "*Safe: " + safeZoneDirection + ". Left:" + isLeft + ". Right:" + isRight + ". Top:" + isTop + ". Bot:" + isBot + ".\n";
            }
            else
            {
                if (safeZoneDirection == "top" || safeZoneDirection == "bottom")
                {
                    //test.value += "Safe: " + safeZoneDirection + ". Left:" + isLeft + ". Right:" + isRight + ". Top:" + isTop + ". Bot:" + isBot + ".\n";
                    circleData[index].vy = -circleData[index].vy;
                }
                if (safeZoneDirection == "left" || safeZoneDirection == "right") {
                    //test.value += "Safe: " + safeZoneDirection + ". Left:" + isLeft + ". Right:" + isRight + ". Top:" + isTop + ". Bot:" + isBot + ".\n";
                    circleData[index].vx = -circleData[index].vx;
                }
            }
        }

        // Calculate if the an (x,y) coordinate falls into a safe-zone tile
        function isSafeZoneCoordinate(x, y)
        {
            var x_Tileindex = translatePixelToTileIndex(x, X_NUMBER_OF_TILES);
            var y_Tileindex = translatePixelToTileIndex(y, Y_NUMBER_OF_TILES);

            //test.value += "x-index: " + x_Tileindex + ". y-index: " + y_Tileindex + ".\n";
            //TODO: add safeguards for out of array index
            var xTileDataRow = tileData[y_Tileindex];
            
            if (xTileDataRow[x_Tileindex] == SAFE_ZONE_VALUE)
                return true;
            else
                return false;
        }

        // Return the value stored in the tileData array based on (x,y) coordinate
        function getTileValue(x, y)
        {
            var rowArray = tileData[y];
            return rowArray[x];
        }

        // Draw all the background tiles
        function drawAllTiles()
        {
            for (var y = 0; y < tileData.length; y++)
            {
                var currRow = tileData[y];

                for (var x = 0; x < currRow.length; x++)
                {
                    drawTile(x, y, currRow[x]);
                }
            }
        }

        // Draw an individual tile based on whether it is a safe-zone or normal-zone
        function drawTile(x, y, value)
        {

            //TODO: redrawing safezone lags site a lot -- find a way of not doing this every frame
            if (value == SAFE_ZONE_VALUE)
            {
                ctx.fillStyle = SAFE_ZONE_COLOUR;
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                // Add trim to square
                ctx.fillStyle = BACKGROUND_COLOUR;
                ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                ctx.fill();
            }
            else if (value == NORMAL_ZONE_VALUE)
            {
                ctx.fillStyle = BACKGROUND_COLOUR;
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

                ctx.fill();
            }   
        }

        function debugTileOutput()
        {
            var tileText = "";

            for (var y = 0; y < tileData.length; y++) {
                var currArray = tileData[y];

                for (var x = 0; x < currArray.length; x++) {
                    tileText += currArray[x] + " ";
                }
                tileText += "\n";
            }

            test.value = tileText;
        }

        // Generate the initial tile array used for tracking what type of tile each location is
        function generateTileArray()
        {
            tileData = [];

            for (var y = 0; y < Y_NUMBER_OF_TILES; y++)
            {
                var rowTileArray = [];

                for (var x = 0; x < X_NUMBER_OF_TILES; x++)
                {
                    // Determine which area is the safe zone and which is the normal area
                    if ((x < X_SAFEZONE_BORDER_SIZE || x > X_NUMBER_OF_TILES - (X_SAFEZONE_BORDER_SIZE + 1))
                        || (y < Y_SAFEZONE_BORDER_SIZE || y > Y_NUMBER_OF_TILES - (Y_SAFEZONE_BORDER_SIZE + 1)))
                    {
                        rowTileArray.push(SAFE_ZONE_VALUE);
                    }
                    else
                    {
                        rowTileArray.push(NORMAL_ZONE_VALUE);
                    }
                }

                tileData.push(rowTileArray);
            }
        }

        

        function translatePixelToTileIndex(pixel, axisNumTiles)
        {
            var tileIndex = Math.floor(pixel / TILE_SIZE);

            if (tileIndex >= axisNumTiles || tileIndex < 0)
                return -1;
            else
                return tileIndex;
        }


















        /*
        var safeZoneData = [
            { x1: 0, y1: 0, x2: canvWidth, y2: BORDER_WIDTH, 
            width: canvWidth, height: BORDER_WIDTH }, // Top

            { x1: 0, y1: canvHeight - BORDER_WIDTH, x2: canvWidth, y2: canvWidth, 
            width: canvWidth, height: BORDER_WIDTH }, // Bottom

            { x1: canvWidth - BORDER_WIDTH, y1: 0, x2: canvWidth, y2: canvHeight, 
            width: BORDER_WIDTH, height: canvHeight }, // Right

            { x1: 0, y1: 0, x2: BORDER_WIDTH, y2: canvHeight, 
            width: BORDER_WIDTH, height: canvHeight }, // Left

            { x1: BORDER_WIDTH, y1: 275, x2: 700, y2: 325, 
            width: 700-BORDER_WIDTH, height: 325-275 }];

        var text = "X1: " + safeZoneData[4].x1 + ", X2: " + safeZoneData[4].x2;
        text += "\n" + "Y1: " + safeZoneData[4].y1 + ", Y2: " + safeZoneData[4].y2;
        test.value = text;

        drawCircles();



        function drawCircles() {

            drawBackdrop();
            drawSafeZone();
            
            ctx.beginPath();

            for (var i = 0; i < circleData.length; i++)
            {
                // Draw the circle
                ctx.arc(circleData[i].x, circleData[i].y, circleData[i].r, 0, 2 * Math.PI, false);

                // Update current position
                circleData[i].x += circleData[i].vx;
                circleData[i].y += circleData[i].vy;

                // Calculate safe-zone collisions
                var safeZoneHitTestResult = safeZoneHitIndex(i);
                
                // If no collision
                if (safeZoneHitTestResult != -1)
                {
                    
                    //var edge = whichSafeZoneEdgeIsHit(i, safeZoneHitTestResult);
                    
                    if (safeZoneHitTestResult == "top" || safeZoneHitTestResult == "bottom")
                        circleData[i].vy = -circleData[i].vy;
                    else if (safeZoneHitTestResult == "left" || safeZoneHitTestResult == "right")
                        circleData[i].vx = -circleData[i].vx;
                }

                // Fill 
                ctx.fillStyle = BALL_COLOUR;
                ctx.fill();
            }
            requestAnimationFrame(drawCircles);
        }
        
        function safeZoneHitIndex(circIndex) {
            var x_coord = circleData[circIndex].x;
            var y_coord = circleData[circIndex].y;

            //var text = "X: " + x_coord + ", X1: " + safeZoneData[1].x1 + ", X2: " + safeZoneData[1].x2;
            //text += "\n" + "Y: " + y_coord + ", Y1: " + safeZoneData[1].y1 + ", Y2: " + safeZoneData[1].y2;
            //test.value = text;

            // Test each safe zone for collision
            for (var i = 0; i < safeZoneData.length; i++)
            {
                if ((isInBetweenOrEqual((x_coord + BALL_RADIUS), safeZoneData[i].x1, safeZoneData[i].x2)     // LEFT
                    && isInBetweenOrEqual(y_coord, safeZoneData[i].y1, safeZoneData[i].y2)))
                    return "left";

                else if ((isInBetweenOrEqual((x_coord - BALL_RADIUS), safeZoneData[i].x1, safeZoneData[i].x2)  // RIGHT
                    && isInBetweenOrEqual(y_coord, safeZoneData[i].y1, safeZoneData[i].y2)))
                    return "right"; 

                else if ((isInBetweenOrEqual(x_coord, safeZoneData[i].x1, safeZoneData[i].x2)  // TOP
                    && isInBetweenOrEqual((y_coord + BALL_RADIUS), safeZoneData[i].y1, safeZoneData[i].y2)))
                    return "top";

                else if ((isInBetweenOrEqual(x_coord, safeZoneData[i].x1, safeZoneData[i].x2)  // BOTTOM
                    && isInBetweenOrEqual((y_coord - BALL_RADIUS), safeZoneData[i].y1, safeZoneData[i].y2)))
                    return "bottom";
            }

            return -1;
        }


        function drawBackdrop() {
            ctx.fillStyle = BACKGROUND_COLOUR;
            ctx.fillRect(0, 0, canvWidth, canvHeight);
        }

        // DRAW SAFEZONE
        function drawSafeZone() {
            ctx.fillStyle = SAFE_ZONE_COLOUR;
            
            for (var i = 0; i < safeZoneData.length; i++)
            {
                ctx.fillRect(safeZoneData[i].x1, safeZoneData[i].y1, safeZoneData[i].width, safeZoneData[i].height);
            }
        }
        


        function isInBetweenOrEqual(val, range1, range2)
        {
            if (val >= range1 && val <= range2)
                return true;
            else
                return false;
        }*/

    }}());



    //self invoking function