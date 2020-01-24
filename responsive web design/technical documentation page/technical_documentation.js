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

triangleRecursive();
triangleChaos();