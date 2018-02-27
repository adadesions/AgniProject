$(document).ready(() => {
    function loadjs(file) {
        var reader = new FileReader();
        var str;
        reader.onload = function(theFile) {
            str = theFile.target.result;
            debugger;
            (function() { eval.apply(this, arguments); }(str));
            rebuild();
        }
        reader.onerror = function() {alert("error reading file")};
        reader.readAsText(file.target.files[0]);
    }
    document.getElementById('loadjs').addEventListener('change', loadjs, false);
    
    // function rebuild() {
    //     // check how many parameters
    //     pnums = pModel.shapeModel.eigenValues.length;
    //     ph = new parameterHolder();
    //     gui.destroy();
    //     gui = new dat.GUI();
    //     control = {};
    //     eig = 0;
    //     for (var i = 0;i < pnums;i++) {
    //         eig = Math.sqrt(pModel.shapeModel.eigenValues[i])*3
    //         control['c'+(i+1)] = gui.add(ph, 'component '+(i+1), -eig, eig);
    //     }
    //     for (var i = 0;i < pnums;i++) {
    //         control['c'+(i+1)].onChange(drawNew);
    //     }
    //     params = [];
    //     for (var i = 0;i < pnums;i++) {
    //         params.push(ph['component '+(i+1)]);
    //     }
    //     drawNew();
    // }

    var canvasInput = document.getElementById('compare');
    var cc = canvasInput.getContext('2d');
    cc.fillStyle = "rgb(200, 0, 0)";
    // check how many parameters
    var pnums = pModel.shapeModel.eigenValues.length;
    var parameterHolder = function() {
        for (var i = 0; i < pnums; i++) {
            this['face '+(i+1)] = 0;
        }
    };
    var ph = new parameterHolder();
    var gui = new dat.GUI();
    var control = {};
    var eig = 0;
    for (var i = 0;i < pnums;i++) {
        eig = Math.sqrt(pModel.shapeModel.eigenValues[i])*3
        control['c'+(i+1)] = gui.add(ph, 'face '+(i+1), -eig, eig);
    }
    var params;
    var drawNew = function(value) {
        cc.clearRect(0, 0, 600, 600);
        params = [];
        for (var i = 0;i < pnums;i++) {
            params.push(ph['face '+(i+1)]);
        }
        draw(document.getElementById('compare'), similarityTransforms.concat(params));
    }

    for (var i = 0;i < pnums;i++) {
        control['c'+(i+1)].onChange(drawNew);
    }

    params = [];
    for (var i = 0;i < pnums;i++) {
        params.push(ph['face '+(i+1)]);
    }

    var similarityTransforms = [4, 0, 0, 0];    
    //var similarityTransforms = [1, 0, -250, -450];
    //var similarityTransforms = [1, 0, 200, 200];
    var paramslength = params.length;
    var num_points = pModel.shapeModel.numPtsPerSample;
    var x,y;
    var i, path;

    var drawPath = function(canvasContext, path, dp) {
        canvasContext.beginPath();
        var i, x, y, plg;
        for (var p = 0; p < path.length; p++) {
            i = path[p]*2;
            plg = pModel.path.vertices[p];
            x = pModel.shapeModel.meanShape[i/2][0]; //x begin
            y = pModel.shapeModel.meanShape[i/2][1];

            for (let v = 0; v < 5; v++) {
                var v0, v1, v2, v3;
                v0 = pModel.path.vertices[v][0];
                v1 = pModel.path.vertices[v][1];                
                v2 = pModel.path.vertices[v][2];                
                v3 = pModel.path.vertices[v][3];
            }

            for (var j = 0; j < pModel.shapeModel.numEvalues; j++) {
                x += pModel.shapeModel.eigenVectors[i][j]*dp[j+4];
                y += pModel.shapeModel.eigenVectors[i+1][j]*dp[j+4];
            }

            a = dp[0]*x - dp[1]*y + dp[2];
            b = dp[0]*y + dp[1]*x + dp[3];
            x += a;
            y += b;
            
            if (i == 0) {
                canvasContext.moveTo(x, y);
            } else {
                canvasContext.lineTo(x, y);                
            }
        }
        canvasContext.moveTo(0, 0);
        canvasContext.closePath();
        canvasContext.stroke();
    }
    
    function drawPoint(canvasContext, point, dp) {
        var i, x, y;
        i = point*2;
        x = pModel.shapeModel.meanShape[i/2][0];
        y = pModel.shapeModel.meanShape[i/2][1];
        for (var j = 0;j < pModel.shapeModel.numEvalues;j++) {
            x += pModel.shapeModel.eigenVectors[i][j]*dp[j+4];
            y += pModel.shapeModel.eigenVectors[i+1][j]*dp[j+4];            
        }
        a = dp[0]*x - dp[1]*y + dp[2];
        b = dp[0]*y + dp[1]*x + dp[3];
        x += a;
        y += b;

        canvasContext.beginPath();
        canvasContext.arc(x, y, 5, 0, Math.PI*2, true);
        canvasContext.closePath();
        canvasContext.fill();
    }
    
    var draw = function(canvas, pv) {
        // if no previous points, just draw in the middle of canvas
        var params;
        if (pv === undefined) {
            params = currentParameters.slice(0);
        } else {
            params = pv.slice(0);
        }
        var cc = canvas.getContext('2d');
        cc.fillStyle = "rgb(0, 255, 0)";
        cc.strokeStyle = "rgb(255, 255, 0)";
        //cc.lineWidth = 1;
        cc.save();
        var paths = pModel.path.normal;
        for (var i = 0;i < paths.length;i++) {
            if (typeof(paths[i]) == 'number') {
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