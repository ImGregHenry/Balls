
(function () {

    init();

    function init() {
        const X_NUMBER_OF_TILES = 60;
        const Y_NUMBER_OF_TILES = 30;

        const X_SAFEZONE_BORDER_SIZE = 20;
        const Y_SAFEZONE_BORDER_SIZE = 12;
        const NORMAL_ZONE_VALUE = 0;
        const SAFE_ZONE_VALUE = 1;

        var isGameRunning = true;

        var tileData = [];

        
        var tileSize = 20;
        var borderWidth = 50;
        var ballRadius = 10;
        var ballSpeed = 10;

        var ballColour = "#0000FF";
        var backdropColour = "#000000";
        var safeZoneColour = "#FF0000";

        var test = document.getElementById("test");
        document.getElementById("btnStartStop").onclick = toggle;


        var canv = document.getElementById("myCanvas");
        var ctx = canv.getContext("2d");

        var canvWidth = canv.getAttribute("width").valueOf();
        var canvHeight = canv.getAttribute("height").valueOf();

        
        var circleData = [{ x: 455, y: 250, r: ballRadius, vx: -10, vy: 10 },
                          { x: 475, y: 260, r: ballRadius, vx: 10, vy: -10 }];
                          //{ x: 495, y: 250, r: ballRadius, vx: 5, vy: -12 }];
        
        generateTileArray();
        //debugTileOutput();
        //drawAnimation();
        intervalID = setInterval(function () {
            if (isGameRunning)
                drawAnimation();
        }, 10);



        function toggle() {
            if (isGameRunning)
            {
                document.getElementById("btnStartStop").innerText = "Start";
            }
            else
                document.getElementById("btnStartStop").innerText = "Stop";
            
            isGameRunning = !isGameRunning;
        }


        function drawAnimation()
        {
            
            drawAllTiles();
            drawBall();

            //requestAnimationFrame(drawAnimation);
        }

        function drawBall()
        {
            for (var i = 0; i < circleData.length; i++) {
                // Draw the circle
                ctx.beginPath();
                ctx.arc(circleData[i].x, circleData[i].y, circleData[i].r, 0, 2 * Math.PI, false);

                ctx.fillStyle = ballColour;
                ctx.fill();
                ctx.stroke();

                //debugOutputCurrentTileLocation(i);

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

            var leftXCoordinate = x_coord + ballRadius;
            var leftYCoordinate = y_coord;
            var rightXCoordinate = x_coord - ballRadius;
            var rightYCoordinate = y_coord;
            var topXCoordinate = x_coord;
            var topYCoordinate = y_coord + ballRadius;
            var botXCoordinate = x_coord;
            var botYCoordinate = y_coord - ballRadius;


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

            
            // Handle resetting the direction
            if ((isTop && isLeft)
                || (isBot && isLeft)
                || (isTop && isRight)
                || (isBot && isRight))
            {
                circleData[index].vy = -circleData[index].vy;
                circleData[index].vx = -circleData[index].vx;

                test.value += "*Safe: " + safeZoneDirection + ". Left:" + isLeft + ". Right:" + isRight + ". Top:" + isTop + ". Bot:" + isBot + ".\n";
            }
            else
            {
                if (safeZoneDirection == "top" || safeZoneDirection == "bottom")
                {
                    test.value += "Safe: " + safeZoneDirection + ". Left:" + isLeft + ". Right:" + isRight + ". Top:" + isTop + ". Bot:" + isBot + ".\n";
                    circleData[index].vy = -circleData[index].vy;
                }
                if (safeZoneDirection == "left" || safeZoneDirection == "right") {
                    test.value += "Safe: " + safeZoneDirection + ". Left:" + isLeft + ". Right:" + isRight + ". Top:" + isTop + ". Bot:" + isBot + ".\n";
                    circleData[index].vx = -circleData[index].vx;
                }
            }
        }

        // Calculate if the an (x,y) coordinate falls into a safezone
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

        function getTileValue(x, y)
        {
            var rowArray = tileData[y];
            return rowArray[x];
        }


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

        function drawTile(x, y, value) {

            //TODO: redrawing safezone lags site a lot -- find a way of not doing this every frame
            if (value == SAFE_ZONE_VALUE)
            {
                ctx.fillStyle = safeZoneColour;
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                // Add trim to square
                ctx.fillStyle = backdropColour;
                ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
                ctx.fill();
            }
            else if (value == NORMAL_ZONE_VALUE)
            {
                ctx.fillStyle = backdropColour;
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);

                ctx.fill();
            }
            
        }

        function debugTileOutput() {
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

        function generateTileArray() {
            tileData = [];

            for (var y = 0; y < Y_NUMBER_OF_TILES; y++) {
                var rowTileArray = [];

                for (var x = 0; x < X_NUMBER_OF_TILES; x++) {
                    // Determine which area is the safe zone and which is the normal area
                    if ((x < X_SAFEZONE_BORDER_SIZE || x > X_NUMBER_OF_TILES - (X_SAFEZONE_BORDER_SIZE + 1))
                        || (y < Y_SAFEZONE_BORDER_SIZE || y > Y_NUMBER_OF_TILES - (Y_SAFEZONE_BORDER_SIZE+1))) {
                        rowTileArray.push(SAFE_ZONE_VALUE);
                    }
                    else {
                        rowTileArray.push(NORMAL_ZONE_VALUE);
                    }
                }

                tileData.push(rowTileArray);
            }
        }

        

        function translatePixelToTileIndex(pixel, axisNumTiles)
        {
            var tileIndex = Math.floor(pixel / tileSize);

            if (tileIndex >= axisNumTiles || tileIndex < 0)
                return -1;
            else
                return tileIndex;
        }


















        /*
        var safeZoneData = [
            { x1: 0, y1: 0, x2: canvWidth, y2: borderWidth, 
            width: canvWidth, height: borderWidth }, // Top

            { x1: 0, y1: canvHeight - borderWidth, x2: canvWidth, y2: canvWidth, 
            width: canvWidth, height: borderWidth }, // Bottom

            { x1: canvWidth - borderWidth, y1: 0, x2: canvWidth, y2: canvHeight, 
            width: borderWidth, height: canvHeight }, // Right

            { x1: 0, y1: 0, x2: borderWidth, y2: canvHeight, 
            width: borderWidth, height: canvHeight }, // Left

            { x1: borderWidth, y1: 275, x2: 700, y2: 325, 
            width: 700-borderWidth, height: 325-275 }];

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
                ctx.fillStyle = ballColour;
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
                if ((isInBetweenOrEqual((x_coord + ballRadius), safeZoneData[i].x1, safeZoneData[i].x2)     // LEFT
                    && isInBetweenOrEqual(y_coord, safeZoneData[i].y1, safeZoneData[i].y2)))
                    return "left";

                else if ((isInBetweenOrEqual((x_coord - ballRadius), safeZoneData[i].x1, safeZoneData[i].x2)  // RIGHT
                    && isInBetweenOrEqual(y_coord, safeZoneData[i].y1, safeZoneData[i].y2)))
                    return "right"; 

                else if ((isInBetweenOrEqual(x_coord, safeZoneData[i].x1, safeZoneData[i].x2)  // TOP
                    && isInBetweenOrEqual((y_coord + ballRadius), safeZoneData[i].y1, safeZoneData[i].y2)))
                    return "top";

                else if ((isInBetweenOrEqual(x_coord, safeZoneData[i].x1, safeZoneData[i].x2)  // BOTTOM
                    && isInBetweenOrEqual((y_coord - ballRadius), safeZoneData[i].y1, safeZoneData[i].y2)))
                    return "bottom";
            }

            return -1;
        }


        function drawBackdrop() {
            ctx.fillStyle = backdropColour;
            ctx.fillRect(0, 0, canvWidth, canvHeight);
        }

        // DRAW SAFEZONE
        function drawSafeZone() {
            ctx.fillStyle = safeZoneColour;
            
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