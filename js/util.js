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

function bind(scope, fn) {
    console.log("bing scope " + scope + " to function " + fn);
    return function() {
        return fn.apply(scope, arguments);
    }
};
