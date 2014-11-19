var board = []; // 20 x 10 array
var paint = [];
var current = [], next = [];
var RECT = WIDTH / 10;
var i;
var gameOverCallback;
var currentShapeId;
var count;
var bag = [];
var shapes = [
   [ 1, 1, 1, 1 ],
   [ 1, 1, 1, 0, 1 ],
   [ 1, 1, 0, 0, 1, 1 ],
   [ 1, 0, 0, 0, 1, 1, 1 ],
   [ 0, 1, 0, 0, 1, 1, 1 ],
   [ 0, 1, 1, 0, 1, 1 ],
   [ 1, 1, 0, 0, 0, 1, 1 ]
];

for ( i = 0; i < 20; ++i ) {
    board[ i ] = [];
    paint[ i ] = [];
    for ( j = 0; j < 10; ++j ) {
        board[ i ][ j ] = 0;
    }
}

function valid( currentx, currenty, current, board ) {
    var tempx = currentx;
    var maxX = 0;
    var i, j = currenty, count = 0;
    tempx = 0;
    for ( i = 0; i < current.length; ++i ) {
        if ( current[ i ] ) {
            maxX = Math.max( maxX, tempx );
        }
        ++count;
        ++tempx;
        if ( count >= 4 ) {
            count = 0;
            j += 1;
            tempx = 0;
        }
    }
    tempx = currentx;
    j = currenty;
    count = 0;
    for ( i = 0; i < current.length; ++i ) {
        if ( ( currentx + maxX >= 10 || tempx < 0 ) || ( j >= 20 ) || ( board[ j ][ tempx ] && current[ i ] ) ) {
            return false;
        }
        ++count;
        ++tempx;
        if ( count >= 4 ) {
            count = 0;
            j += 1;
            tempx = currentx;
        }
    }
    return true;
}

function rotate( current ) {
    var i, j = 0, k;
    var newCurrent = [];
    var temp = [];
    var count, x = 0;
    for ( i = 0; i < 4; ++i ) {
        temp[ i ] = [];
        newCurrent[ i ] = [];
        for ( j = 0; j < 4; ++j ) {
            temp[ i ][ j ] = 0;
        }
    }
    x = 0, j = 0, count = 0;
    for ( i = 0; i < current.length; ++i ) {
        if ( current[ i ] ) {
            temp[ j ][ count ] = 1;
        }
        ++count;
        ++x;
        if ( count >= 4 ) {
            count = 0;
            j += 1;
            x = 0;
        }
    }
    for ( i = 0; i < 4; ++i ) {
        for ( j = 0; j < 4; ++j ) {
            newCurrent[ j ][ 3 - i ] = temp[ i ][ j ];
        }
    }
    done = false;
    for ( i = 0; i < 4; ++i ) {
        if ( newCurrent[ i ][ 0 ] == 1 ) {
            done = true;
        }
    }
    while ( !done ) {
        for ( i = 0; i < 4; ++i ) {
            for ( j = 1; j < 4; ++j ) {
                newCurrent[ i ][ j - 1 ] = newCurrent[ i ][ j ];
                newCurrent[ i ][ j ] = 0;
            }
        }
        for ( i = 0; i < 4; ++i ) {
            if ( newCurrent[ i ][ 0 ] == 1 ) {
                done = true;
            }
        }
    }
    k = 0;
    count = 0;
    temp = [];
    for ( i = 0; i < 4; ++i ) {
        for ( j = 0; j < 4; ++j ) {
            if ( count < 4 ) {
                temp[ k ] = newCurrent[ i ][ j ];
                ++k;
                count += newCurrent[ i ][ j ];
            }
        }
    }
    count = 0;
    return temp;
}
function drop( board, a, b ) {
    var j;
    if ( a >= 0 ) {
        for ( j = 0; j < 10; ++j ) {
            board[ b ][ j ] = board[ a ][ j ];
        }
        drop( board, a - 1, a );
    }
}
function checkLines() {
    var flag = true;
    var i, j;
    for ( i = 19; i >= 0; --i ) {
        flag = true;
        for ( j = 0; j < 10; ++j ) {
            if ( board[ i ][ j ] == 0 ) {
                flag = false;
            }
        }
        if ( flag ) {
            drop( board, i - 1, i );
            checkLines( board );
            return;
        }
    }
}
function randomShapes( bag ) {
    var i, j;
    var exists, rand;
    for ( i = 0; i < 7; ++i ) {
        bag[ i ] = -1;
    }
    for ( i = 0; i < 7; ++i ) {
        do {
            rand = Math.floor( Math.random() * 7 );
            exists = false;
            console.log( rand );
            for ( j = 0; j < i; ++j ) {
                if ( bag[ j ] == rand ) {
                    exists = true;
                }
            }
        } while ( exists );
        bag[ i ] = rand;
    }
}
function newShape() {
    y = 0;
    x = 4;
    if ( bag.length == 0 ) {
        randomShapes( bag );
    }
    currentShapeId = bag.shift();
    current = shapes[ currentShapeId ];
    if ( bag.length == 0 ) {
        randomShapes( bag );
        nextShapeId = bag[ 0 ];
    }
    else {
        nextShapeId = bag[ 0 ];
    }
    next = shapes[ bag[ 0 ] ];
}
function freeze() {
    var j = y - 1;
    var i;
    var count = 0;
    var tempx = x;
    for ( i = 0; i < current.length; ++i ) {
        if ( current[ i ]  ) {
            console.log( j );
            board[ j ][ tempx ] = 1; 
            paint[ j ][ tempx ] = currentShapeId;
        }
        ++count;
        ++tempx;
        if ( count >= 4 ) {
            count = 0;
            ++j;
            tempx = x;
        }
    }
}
function tick() {
    ++y;
    if ( !valid( x, y, current, board ) ) {
        freeze( x, y, current, board );
        checkLines();
        newShape();
        drawNext();
        if ( !valid( x, y, current, board ) ) {
            gameOverCallback();
            clearInterval( tickInterval );
        }
    }
}
function registerGameOverEvent( callback ) {
    gameOverCallback = callback;
}
newShape();
var tickInterval = setInterval( tick, 500 );
