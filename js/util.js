// =============================================================================
// Keyboard Controls
// =============================================================================
var key = {};
var keyMap = {32: 'space', 37: 'left', 38: 'up', 39: 'right', 40: 'down'};

document.addEventListener('keydown', function(e) {
    console.log("keydown : " + e.keyCode );
    if(e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 32)
        e.preventDefault();
    key[keyMap[e.keyCode]] = 'down';
    key.ctrl = e.ctrlKey;
    key.shift = e.shiftKey;
}, false);

document.addEventListener('keyup', function(e) {
    console.log("keyup : " + e.keyCode );
    if(e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 32)
        e.preventDefault();
    key[keyMap[e.keyCode]] = 'up';
    key.ctrl = e.ctrlKey;
    key.shift = e.shiftKey;
}, false);

// =============================================================================
// CLASS GENERATOR
// =============================================================================
function Class(methods) {
    var _ = function() {
        this.init.apply(this, arguments);
    };
    for (var property in methods) {
        _.prototype[property] = methods[property];
    }
    if (!_.prototype.init)
        _.prototype.init = function() {};
    return _;
}



function drawLine3(begin, distance, angle) {
    mclCtx.save();

    var id       = mclCtx.createImageData(1, 1);
    var d        = id.data;

    d[0]   = 0;
    d[1]   = 0;
    d[2]   = 255;
    d[3]   = 255;

    for(var i = 0 ; i < distance; i++) {
      var x = begin.x + Math.round(Math.sin(angle * Math.PI / 180) * i);
      var y = begin.y - Math.round(Math.cos(angle * Math.PI / 180) * i);
      mclCtx.putImageData( id, x, y );
    }
    mclCtx.restore();

}

function drawLine(begin, end, color, lineWidth) {
    mclCtx.save();
    mclCtx.beginPath();
    mclCtx.moveTo(begin.x, begin.y);
    mclCtx.lineTo(begin.x, begin.y);
    mclCtx.lineTo(end.x, end.y);
    mclCtx.lineWidth = lineWidth || 3;
    mclCtx.strokeStyle = color || 'rgb(255, 45, 251)';
    mclCtx.stroke();
    mclCtx.closePath();
    mclCtx.restore();
}

function drawLine2(begin, angle, length, color, lineWidth) {
    angle = ((270 + angle) % 360);
    var end = {
        'x': (begin.x + length * Math.cos(angle * Math.PI / 180)),
        'y': (begin.y + length * Math.sin(angle * Math.PI / 180))
    };
    mclCtx.save();
    mclCtx.beginPath();
    mclCtx.moveTo(begin.x, begin.y);
    mclCtx.lineTo(begin.x, begin.y);
    mclCtx.lineTo(end.x, end.y);
    mclCtx.lineWidth = lineWidth || 3;
    mclCtx.strokeStyle = color || 'rgb(255, 45, 251)';
    mclCtx.stroke();
    mclCtx.closePath();
    mclCtx.restore();
}

function drawCircle(center, color, r) {
    mclCtx.save();
    mclCtx.beginPath();
    mclCtx.lineWidth = 0;
    mclCtx.fillStyle = color || 'rgba(255, 55, 55, 1)';
    mclCtx.arc(center.x, center.y, (r || 4), 0, 2 * Math.PI, false);
    mclCtx.fill();
    mclCtx.closePath();
    mclCtx.restore();
}

function drawChart(data1, data2) {
    // console.log("data1: "+data1);
    // console.log("data2: "+data2);
}


// POINT
// =============================================================================
var Point = new Class({
    x: 0,
    y: 0,
    init: function(x, y) {
        this.x = x;
        this.y = y;
    },
    toString: function() {
        return '[' + this.x + ',' + this.y + ']';
    }
});


function bind(scope, fn) {
    console.log("bing scope " + scope + " to function " + fn);
    return function() {
        return fn.apply(scope, arguments);
    }
};


function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function isWhitePixel(p, ctx) {
    var pxl = ctx.getImageData(p.x, p.y, 1, 1).data; 
    var hex = "#" + ("000000" + rgbToHex(pxl[0], pxl[1], pxl[2])).slice(-6);
    if( hex === "#ffffff")
        return true;
    else
        return false;
}

function getDistance(p, angle, distance, ctx) {
    var i, pt, x, y;
    for(i = 0 ; i < distance; i++) {
      x = p.x + Math.round(Math.sin(angle * Math.PI / 180) * i);
      y = p.y - Math.round(Math.cos(angle * Math.PI / 180) * i);
      pt = new Point(x, y);
      if( !isWhitePixel(pt, ctx) )
        break;
    }
    return i;
}