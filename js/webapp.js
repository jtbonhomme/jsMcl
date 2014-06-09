(function(global) {
  'use strict';

  var FPS = 3;
  var canvasWidth   = 500;
  var canvasHeight  = 558;
  var mapCanvas     = document.getElementById("mapCanvas");
  var mclCanvas     = document.getElementById("mclCanvas");
  var mapCtx        = mapCanvas.getContext("2d");
  var mclCtx        = mclCanvas.getContext("2d");
  var graph, start, end;
  var grid = [];

  // temp ---
  var orig = {
    "x": 50,
    "y": 50 
  };
  var angle = 0;
  // -- temp

  var update = new Event("Update");
  var draw =  new Event("Draw");


  document.addEventListener("Update", bind(this, move), false);
  document.addEventListener("Draw", bind(this, render), false);

  window.addEventListener('load', eventWindowLoaded, false);

  function eventWindowLoaded() {
    console.log("start");
    init();
  }

  function move() {
    angle = angle + Math.PI / 90;
  }

  function render() {
    mclCtx.clearRect(0, 0, canvasWidth, canvasHeight);  
//    mclCtx.save();

    var id = mclCtx.createImageData(1,1);
    var d  = id.data;

    d[0]   = 255;
    d[1]   = 0;
    d[2]   = 0;
    d[3]   = 255;

    for(var i = 0 ; i < 50; i++) {
      var x = Math.round(Math.cos(angle) * i) + orig.x;
      var y = Math.round(Math.sin(angle) * i) + orig.y;
      mclCtx.putImageData( id, x, y );
    }
//    mclCtx.restore();
  }

  function init() {
    var map = new Image();
    // map shall be a 500x500 picture
    // walkable colors shall be coded as white (color="#ffffff")
    // any other color than white is considered as not walkable
    map.src = "map.png";
    map.addEventListener('load', eventSheetLoaded , false);
    function eventSheetLoaded() {
      console.log("image loaded");
      drawScreen(map);
      startMcl();
      mclCanvas.addEventListener('mousedown', mouseClick, false);
      generate();
    }
  }

  function startMcl() {
    setInterval(function() {  
      document.dispatchEvent(update); 
      document.dispatchEvent(draw);
    }, 1000 / FPS);
  }

  function drawScreen(map) {
    console.log("render picture")
    // render picture to a 500x500 picture
    // todo: provide a ratio to convert a known conversion
    // rate between pixel and real measure.
    mapCtx.drawImage(map, 0, 0, canvasWidth, canvasHeight);

    // create a 500xcanvasHeight grid from png picture
    console.log("calculate grid from picture");
    // The ImageData.data attribute is a single-dimensional array containing four bytes for every pixel in the ImageData object.
    var imageData = mapCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    // A separate byte is used to store each of the red, green, blue, and alpha values for each pixel.
    // Here, a 500x500 pixmap means 500x500x4=1M bytes array.
    var pix = imageData.data;
    // walkable cells are coded as 1
    // walls and obstacles are coded as 0
    for( var row = 0; row < canvasHeight; row++) {
      var aRow = [];
      for (var col = 0 ; col < canvasWidth; col++) {
        var pos = ((row*(imageData.width*4)) + (col*4));
        if( pix[(row*canvasWidth + col)*4]      === 0xff &&
            pix[(row*canvasWidth + col)*4 + 1 ] === 0xff &&
            pix[(row*canvasWidth + col)*4 + 2 ] === 0xff &&
            pix[(row*canvasWidth + col)*4 + 3 ] === 0xff) {
          aRow[col] = 1;
        }
        else{
          aRow[col] = 0;
        }
      }
      grid.push(aRow);
    }
    graph = new Graph(grid);
  }


  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function mouseClick(evt) {
    var mousePos = getMousePos(mapCanvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
    console.log(message);
    if( grid[mousePos.y][mousePos.x] !== 1 ) {
      alert("you shall pick a walkable point");
    }
    else if( typeof start === "undefined" || start === null) {
      start = graph.nodes[mousePos.y][mousePos.x];
    } else if( typeof end === "undefined"  || end === null) {
      end = graph.nodes[mousePos.y][mousePos.x];
      searchPath();
    }
  }


  function showResult(visible, result) {

    // show path in red
    var id = mapCtx.createImageData(1,1);
    var d  = id.data;

    d[0]   = 255;
    d[1]   = visible ? 0 : 255;
    d[2]   = visible ? 0 : 255;
    d[3]   = 255;

    for(var i = 0 ; i < result.length; i++) {
      mapCtx.putImageData( id, result[i].y, result[i].x );
    }

  }

  function searchPath() {
    console.log("calculate path, please wait ...");
    var before = Date.now();
    
    var result = astar.search(graph.nodes, start, end, false);
    // n.b.:
    // result.x = row
    // result.y = col
    var after = Date.now();
    console.log("done in " + (after - before) + " ms");
    showResult(1, result);
    setTimeout(function() {
      showResult(0, result);
      start = end;
      end   = null;
    }, 1000);
    console.log("end");
  }

  global.mclCtx = mclCtx;
  global.mapCtx = mapCtx;
  global.canvasWidth = canvasWidth;
  global.canvasHeight = canvasHeight;

})(this);
