var _arrowhead = {
    iteration: 1, 
    max_iterations: 7,
    delay: 500,
    elementName: 'arrowhead',
    startState: 'A',
    handle: 0
}

var _chaos = {
    batch_size: 100,
    iteration: 0,
    max_iterations: 50,
    delay: 100,
    elementName: 'chaos',
    handle: 0,
    points: [
        {x: 0, y: 0},
        {x: 0, y: 0},
        {x: 0, y: 0}
    ], 
    px: 0,
    py: 0
};

var _recursive = {
    iteration: 1,
    max_iterations: 7,
    delay: 500,
    elementName: 'recursive',
    handle: 0
};

var _lSystem = {
    iteration: 1, 
    max_iterations: 7,
    delay: 500,
    elementName: 'l_system',
    startState: 'F-G-G',
    handle: 0
}

var _tree = {
    angle: (2.0 * Math.PI) / 3.0, // 120 degrees
    min_angle: (Math.PI / 9.0), // 20 degrees
    max_angle: (2.0 * Math.PI) / 3.0, // 120 degrees
    step: (Math.PI / 90), // 3 degrees
    iterations: 7,
    delay: 100,
    elementName: 'tree',
    handle: 0
}

function triangleArrowhead() {
    var canvas = document.getElementById(_arrowhead.elementName);
    var ctx = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    var width = (window.innerWidth || document.documentElement.clientWidth);
    var height = (window.innerHeight || document.documentElement.clientHeight);

    // Do nothing if the canvas is not on screen.
    if (_arrowhead.handle != 0) {
        clearInterval(_arrowhead.handle);
    }
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= height && rect.right <= width) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
        ctx.strokeStyle = "white";

        var size = Math.min(canvas.width, canvas.height);
        size = Math.floor(7.0 * size  / 8.0);
        var stepSize = Math.max(1, size / Math.pow(2, _arrowhead.iteration));

        var current = _arrowhead.startState;
        for(var i = 0; i < _arrowhead.iteration; i++) {
            var nextState = '';
            for (var j = 0, ch=''; ch = current.charAt(j); j++) {
                if (ch == 'A') {
                    nextState = nextState + 'B-A-B';
                } else if (ch == 'B') {
                    nextState = nextState + 'A+B+A';
                } else {
                    nextState = nextState + ch;
                }
            }
            current = nextState;
        }

        var center_x = Math.floor(canvas.width / 2);
        var center_y = Math.floor(canvas.height / 2);

        arrowhead(ctx, center_x - Math.floor(size / 2), center_y + Math.floor(size / 2), stepSize, current, _arrowhead.iteration);
        _arrowhead.iteration++;
        if (_arrowhead.iteration > _arrowhead.max_iterations) {
            _arrowhead.iteration = 1;
        }
        
    }
    _arrowhead.handle = setInterval(triangleArrowhead, _arrowhead.delay);        
}

function arrowhead(ctx, x, y, stepSize, state, iteration) {
    var angle = (Math.PI / 3.0); // 60 degrees.
    var heading = 0.0; // 0 degrees
    if (iteration % 2 == 0) {
        heading = 0;
    } else {
        heading = -angle;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);    
    for(var i = 0, ch = ''; ch = state.charAt(i); i++) {
        if ((ch == 'A') || (ch == 'B')) {
            x += (Math.cos(heading) * stepSize);
            y += (Math.sin(heading) * stepSize);
            ctx.lineTo(x, y);
        } else if (ch == '+') {
            heading -= angle;
        } else if (ch == '-') {
            heading += angle;
        }
    }
    ctx.stroke();
}

function triangleChaos() {
    var canvas = document.getElementById(_chaos.elementName);
    var ctx = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    var width = (window.innerWidth || document.documentElement.clientWidth);
    var height = (window.innerHeight || document.documentElement.clientHeight);

    // Do nothing if the canvas is not on screen.
    if (_chaos.handle != 0) {
        clearInterval(_chaos.handle);
    }
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= height && rect.right <= width) {
        if (_chaos.iteration == 0) {
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width - 1, canvas.height - 1);            

            var size = Math.min(canvas.width, canvas.height);
            size = Math.floor(7.0 * size  / 8.0);

            const center_x = Math.floor(canvas.width / 2);
            const center_y = Math.floor(canvas.height / 2);

            const x = center_x - Math.floor(size / 2);
            const y = center_y + Math.floor(size / 2);

            const angle = Math.PI / 3.0; // 60 degrees
            _chaos.points[0] = {x: x, y: y};
            _chaos.points[1] = {x: x + (size * Math.cos(angle)), y: y - (size * Math.sin(angle))};
            _chaos.points[2] = {x: x + size, y: y};

            // Cook the first point so we don't leave a stray mark.
            _chaos.px = x + (size / 2);
            _chaos.py = y;
        }
        ctx.fillStyle = "white";
        chaos(ctx, _chaos.batch_size);
        _chaos.iteration++;
        if (_chaos.iteration > _chaos.max_iterations) {
            _chaos.iteration = 0;
        }        
    }
    _chaos.handle = setInterval(triangleChaos, _chaos.delay);        
}

function chaos(ctx, batch_size) {
    var idx;
    for(var i = 0; i < batch_size; i++) {
        ctx.beginPath();
        ctx.arc(_chaos.px, _chaos.py, 1, 0, 2.0 * Math.PI, true);
        ctx.fill();

        idx = Math.floor(Math.random() * _chaos.points.length);
        _chaos.px = _chaos.px + ((_chaos.points[idx].x - _chaos.px) / 2);
        _chaos.py = _chaos.py + ((_chaos.points[idx].y - _chaos.py) / 2);
    }
}

function triangleRecursive() {
    var canvas = document.getElementById(_recursive.elementName);
    var ctx = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    var width = (window.innerWidth || document.documentElement.clientWidth);
    var height = (window.innerHeight || document.documentElement.clientHeight);

    // Do nothing if the canvas is not on screen.
    if (_recursive.handle != 0) {
        clearInterval(_recursive.handle);
    }
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= height && rect.right <= width) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
        ctx.fillStyle = "white";

        var size = Math.min(canvas.width, canvas.height);
        size = Math.floor(7.0 * size  / 8.0);

        var center_x = Math.floor(canvas.width / 2);
        var center_y = Math.floor(canvas.height / 2);

        recursive(ctx, center_x - Math.floor(size / 2), center_y + Math.floor(size / 2), size, _recursive.iteration);
        _recursive.iteration++;
        if (_recursive.iteration > _recursive.max_iterations) {
            _recursive.iteration = 1;
        }
        
    }
    _recursive.handle = setInterval(triangleRecursive, _recursive.delay);        
}

function recursive(ctx, x, y, w, iterations) {
    var angle = Math.PI / 3.0; // 60 degrees.

    if (w <= 3 || iterations <= 1) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + (w * Math.cos(angle)), y - (w * Math.sin(angle)));
        ctx.lineTo(x + w, y);
        ctx.fill();
    } else {
        recursive(ctx, x, y, w / 2, iterations - 1);
        recursive(ctx, x + (w / 2), y, (w / 2), iterations - 1);
        recursive(ctx, x + ((w / 2) * Math.cos(angle)), y - ((w / 2) * Math.sin(angle)), (w / 2), iterations - 1);
    }
}

function triangleLSystem() {
    var canvas = document.getElementById(_lSystem.elementName);
    var ctx = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    var width = (window.innerWidth || document.documentElement.clientWidth);
    var height = (window.innerHeight || document.documentElement.clientHeight);

    // Do nothing if the canvas is not on screen.
    if (_lSystem.handle != 0) {
        clearInterval(_lSystem.handle);
    }
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= height && rect.right <= width) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
        ctx.strokeStyle = "white";

        var size = Math.min(canvas.width, canvas.height);
        size = Math.floor(7.0 * size  / 8.0);
        var stepSize = Math.max(1, size / Math.pow(2, _lSystem.iteration));

        var current = _lSystem.startState;
        for(var i = 0; i < _lSystem.iteration; i++) {
            var nextState = '';
            for (var j = 0, ch=''; ch = current.charAt(j); j++) {
                if (ch == 'F') {
                    nextState = nextState + 'F-G+F+G-F';
                } else if (ch == 'G') {
                    nextState = nextState + 'GG';
                } else {
                    nextState = nextState + ch;
                }
            }
            current = nextState;
        }

        var center_x = Math.floor(canvas.width / 2);
        var center_y = Math.floor(canvas.height / 2);

        lSystem(ctx, center_x - Math.floor(size / 2), center_y + Math.floor(size / 2), stepSize, current);
        _lSystem.iteration++;
        if (_lSystem.iteration > _lSystem.max_iterations) {
            _lSystem.iteration = 1;
        }
        
    }
    _lSystem.handle = setInterval(triangleLSystem, _lSystem.delay);        
}

function lSystem(ctx, x, y, stepSize, state) {
    var angle = (2.0 * Math.PI) / 3.0; // 120 degrees.
    var heading = 0.0; // 0 degrees
    ctx.beginPath();
    ctx.moveTo(x, y);    
    for(var i = 0, ch = ''; ch = state.charAt(i); i++) {
        if ((ch == 'F') || (ch == 'G')) {
            x += (Math.cos(heading) * stepSize);
            y -= (Math.sin(heading) * stepSize);
            ctx.lineTo(x, y);
        } else if (ch == '+') {
            heading -= angle;
        } else if (ch == '-') {
            heading += angle;
        }
    }
    ctx.stroke();
}

function triangleTree() {
    var canvas = document.getElementById(_tree.elementName);
    var ctx = canvas.getContext("2d");
    var rect = canvas.getBoundingClientRect();
    var width = (window.innerWidth || document.documentElement.clientWidth);
    var height = (window.innerHeight || document.documentElement.clientHeight);

    if (_tree.handle != 0) {
        clearInterval(_tree.handle);
    }
    // Do nothing if the canvas is not on screen.
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= height && rect.right <= width) {
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width - 1, canvas.height - 1);
        ctx.strokeStyle = "white";

        var size = Math.min(canvas.width, canvas.height) / 2.0;

        var center_x = Math.floor(canvas.width / 2);
        var center_y = Math.floor(canvas.height / 2);

        tree(ctx, center_x, center_y, (Math.PI / 2), _tree.angle, size, _tree.iterations);
        _tree.angle -= _tree.step;
        if (_tree.angle < _tree.min_angle) {
            _tree.angle = _tree.max_angle;
        }
        
    }
    _tree.handle = setInterval(triangleTree, _tree.delay);        
}

function tree(ctx, x, y, heading, angle, size, iterations) {    
    var x1, y1;    
    if ((size > 1) && (iterations > 0)) {
        var current_heading = heading - angle;
        for (var i = 0; i < 3; i++) {
            x1 = x + ((size * Math.cos(current_heading)) / 2.0);
            y1 = y - ((size * Math.sin(current_heading)) / 2.0);            

            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x1, y1);
            ctx.stroke();
            tree(ctx, x1, y1, current_heading, angle, size / 2, iterations - 1);

            current_heading += angle;
        }
    }
}

triangleArrowhead();
triangleChaos();
triangleLSystem();
triangleRecursive();
triangleTree();
