$(document).ready(() => {
    function loadjs(file) {
        var reader = new FileReader();
        var str;
        reader.onload = function (theFile) {
            str = theFile.target.result;
            debugger;
            (function () { eval.apply(this, arguments); }(str));
            rebuild();
        }
        reader.onerror = function () { alert("error reading file") };
        reader.readAsText(file.target.files[0]);
    }
    document.getElementById('loadjs').addEventListener('change', loadjs, false);

    var canvasInput = document.getElementById('compare');
    var cc = canvasInput.getContext('2d');
    //cc.fillStyle = "rgb(255, 0, 0)";

    // check how many parameters
    var pnums = pModel.shapeModel.eigenValues.length;
    var parameterHolder = function () {
        for (var i = 0; i < pnums; i++) {
            this['face ' + (i + 1)] = 0;
        }
    };
    var ph = new parameterHolder();
    var gui = new dat.GUI();
    var control = {};
    var eig = 0;
    for (var i = 0; i < pnums; i++) {
        eig = Math.sqrt(pModel.shapeModel.eigenValues[i]) * 3
        control['c' + (i + 1)] = gui.add(ph, 'face ' + (i + 1), -eig, eig);
    }
    var params;
    var drawNew = function (value) {
        cc.clearRect(0, 0, 600, 600);
        params = [];
        for (var i = 0; i < pnums; i++) {
            params.push(ph['face ' + (i + 1)]);
        }
        draw(document.getElementById('compare'), similarityTransforms.concat(params));
    }

    for (var i = 0; i < pnums; i++) {
        control['c' + (i + 1)].onChange(drawNew);
    }

    params = [];
    for (var i = 0; i < pnums; i++) {
        params.push(ph['face ' + (i + 1)]);
    }

    var similarityTransforms = [4, 0, 0, 0];
    //var similarityTransforms = [1, 0, -250, -450];
    //var similarityTransforms = [1, 0, 200, 200];
    var paramslength = params.length;
    var num_points = pModel.shapeModel.numPtsPerSample;
    var x, y;
    var i, path;
    var pixelColor = [
        [0,51,48,44,42,42,49,54,66,67,64,63,63,68,77,81,80,76,62,47,44,59,74,83,90,91,89,87,87,91,91,89,92,93,93,94,95,95,96,96,91,91,92,93,94,95,96,97,102,101,100,99,99,100,101,102,101,101,101,101,101,101,101,101,100,102,105,106,104,103,102,102,104,104,104,104,105,105,105,106,110,110,112,112,113,113,115,115,116,118,121,120,121,120,122,123,119,117,114,112,114,114,106,99,88,80,68,65,69,73,76,75,74,63,55,56,0,51,60,72,79,82,85,86,83,80,80,80,80,84,87,86,84,79,73,70,63,64,56,36,21,17,17,13,7,29,33,19,18,25,27,24,21,19,15,15,24,41,57,59,63,65,62,56,55,52,47,47,49,53,59,64,64,66,68,70,66,67,70,73,76,79,81,84,86,86,84,85,86,87,88,88,90,90,91,93,95,96,95,94,95,94,95,96,98,98,96,94,96,95,94,94,93,92,92,92,87,86,85,83,81,78,77,76,74,73,72,70,69,67,66,66,65,64,62,61,59,57,56,55,58,58,61,63,66,64,61,59,60,61,63,68,74,76,76,75,75,75,76],
        [0,38,42,43,44,42,43,46,48,50,56,60,63,66,71,73,73,79,77,70,68,75,82,86,88,90,89,87,87,89,88,86,89,89,90,92,93,95,96,97,93,93,94,95,96,98,98,99,101,100,99,99,99,99,100,101,101,101,101,101,101,101,101,101,99,102,105,107,105,103,102,101,103,103,103,104,104,104,105,105,109,109,111,111,112,112,114,114,118,118,119,120,122,122,123,122,117,115,113,111,111,110,101,93,89,74,58,60,70,74,74,71,63,55,0,51,53,58,71,82,86,89,92,91,85,81,83,85,80,84,87,86,83,78,72,69,65,66,57,37,22,18,19,15,23,26,23,23,34,38,35,33,28,24,21,22,32,48,60,58,64,67,64,58,57,54,49,49,51,55,61,65,66,68,70,72,68,68,70,72,75,79,82,86,87,86,83,83,84,86,88,89,90,90,91,93,96,97,96,95,97,97,96,98,99,99,97,95,95,94,92,91,91,91,92,93,90,89,88,86,84,82,80,79,77,76,75,74,72,71,71,70,66,66,68,67,66,62,59,54,52,53,58,61,64,65,67,67,61,56,53,52,56,61]
    ];
    for (var row = 0; row < pixelColor.length; row++){
        var rpx = pixelColor[row];
        for (var col = 0; col < rpx.length; col++) {
            cc.fillStyle = "rgb(" + rpx[60] + ", "+ rpx[60] +", "+ rpx[60] +")";
        };
    }

    var drawPath = function (canvasContext, path, dp) {
        canvasContext.beginPath();
        var i, x, y;

        for (var p = 0; p < path.length; p++) {
            i = path[p] * 2;
            x = pModel.shapeModel.meanShape[i / 2][0]; //x begin
            y = pModel.shapeModel.meanShape[i / 2][1];

            for (var j = 0; j < pModel.shapeModel.numEvalues; j++) {
                x += pModel.shapeModel.eigenVectors[i][j] * dp[j + 4];
                y += pModel.shapeModel.eigenVectors[i + 1][j] * dp[j + 4];
            }

            a = dp[0] * x - dp[1] * y + dp[2];
            b = dp[0] * y + dp[1] * x + dp[3];
            x += a;
            y += b;
            canvasContext.lineTo(x, y);
            canvasContext.fill();
        }
        // var img = new Image();
        // img.src = '/static/images/face-test.jpg';
        // img.onload = () => {
        //     //canvasContext.drawImage(img, 125, y, 448, 448);
        //     var pattern = canvasContext.drawImage(img, 121.90783633727946, 125.8649016642687, 429.60341299938705, 412.8092865177072);
        //     canvasContext.fillStyle = pattern;
        //     // canvasContext.fill();
        // };
        canvasContext.moveTo(0,0);
        canvasContext.closePath();
        canvasContext.stroke();
    }

    function drawPoint(canvasContext, point, dp) {
        var i, x, y;
        i = point * 2;
        x = pModel.shapeModel.meanShape[i / 2][0];
        y = pModel.shapeModel.meanShape[i / 2][1];
        for (var j = 0; j < pModel.shapeModel.numEvalues; j++) {
            x += pModel.shapeModel.eigenVectors[i][j] * dp[j + 4];
            y += pModel.shapeModel.eigenVectors[i + 1][j] * dp[j + 4];
        }
        a = dp[0] * x - dp[1] * y + dp[2];
        b = dp[0] * y + dp[1] * x + dp[3];
        x += a;
        y += b;

        canvasContext.beginPath();
        canvasContext.arc(x, y, 5, 0, Math.PI * 2, true);
        canvasContext.closePath();
        canvasContext.fill();
    }

    var draw = function (canvas, pv) {
        // if no previous points, just draw in the middle of canvas
        var params;
        if (pv === undefined) {
            params = currentParameters.slice(0);
        } else {
            params = pv.slice(0);
        }
        var cc = canvas.getContext('2d');
        cc.strokeStyle = "#ffff00";
        cc.save();
        var paths = pModel.path.vertices;
        for (var i = 0; i < paths.length; i++) {
            if (typeof (paths[i]) == 'number') {
                drawPoint(cc, paths[i], params);
            } else {
                drawPath(cc, paths[i], params);
            }
        }
        cc.restore();
    }
    draw(document.getElementById('compare'), similarityTransforms.concat(params));
    /*
    var eigenVectors = new goog.math.Matrix(num_points*2, 7);
      for (var i = 0;i < num_points*2;i++) {
        for (var j = 0;j < 7;j++) {
            eigenVectors.setValueAt(i, j, pModel.shapeModel.eVectors[(i*num_points*2)+j]);
        }
      }*/
});