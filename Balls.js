
(function () {

    init();

    function init() {

        var borderWidth = 50;
        var ballRadius = 10;
        var ballSpeed = 10;

        var ballColour = "#0000FF";
        var backdropColour = "#000000";
        var safeZoneColour = "#FF0000";

        var test = document.getElementById("test");
        

        var canv = document.getElementById("myCanvas");
        var ctx = canv.getContext("2d");

        var canvWidth = canv.getAttribute("width").valueOf();
        var canvHeight = canv.getAttribute("height").valueOf();

        var circleData = [{ x: 900, y: canvHeight - 150, r: ballRadius, vx: ballSpeed, vy: ballSpeed },
                        {x: 1000, y: 150, r: ballRadius, vx: ballSpeed, vy: ballSpeed }
                        //{ x: 1050, y: 150, r: ballRadius, vx: ballSpeed, vy: -ballSpeed }
                        //{ x: 875, y: canvHeight - 150, r: ballRadius, vx: -ballSpeed, vy: ballSpeed }

        ];
        
        
        
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
            
            //ctx.fillRect(safeZoneData[4].x1, safeZoneData[4].y1, safeZoneData[4].x2, safeZoneData[4].y2);
            //ctx.fillRect(100, 150, 101, 151);

            

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
        }

    }}());



    //self invoking function