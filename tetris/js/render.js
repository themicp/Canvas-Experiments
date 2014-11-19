var color;
var colors = [
   'cyan',
   'orange',
   'yellow',
   'blue',
   'purple',
   'green',
   'red'
];
function drawNext() {
    var x = 2, y = 2, count = 0, i, j;
    ctx_next.clearRect( 0, 0, 300, 300 );
    var color = colors[ nextShapeId ];
    for ( i = 0; i < current.length; ++i ) {
        if ( next[ i ] ) {
            ctx_next.fillStyle = color;
            ctx_next.fillRect( x * RECT, y * RECT, RECT, RECT );
            ctx_next.strokeRect( x * RECT, y * RECT, RECT, RECT );
        }
        ++count;
        ++x;
        if ( count >= 4 ) {
            count = 0;
            ++y;
            x = 2;
        }
    }
}
function drawBoard() {
    var i, j;
    for ( i = 0; i < 20; ++i ) {
        for ( j = 0; j < 10; ++j ) {
            if ( board[ i ][ j ] ) {
                ctx.fillStyle = colors[ paint[ i ][ j ] ];
                ctx.fillRect( j * RECT, i * RECT, RECT, RECT );
                ctx.strokeRect( j * RECT, i * RECT, RECT, RECT );
            }
        }
    }
}
function render() {
    ctx.clearRect( 0, 0, 300, 600 );
    var i, j;
    var count;
    var maxY;
    var hasLines;
    var tempy = y;
    ctx.strokeStyle = "black";
    color = colors[ currentShapeId ];
    drawBoard();
    j = 0;
    count = 0;
    var tempx = x;
    var tempy = y;
    for ( i = 0; i < current.length; ++i ) {
        if ( current[ i ] ) {
            ctx.fillStyle = color;
            ctx.fillRect( tempx * RECT, tempy * RECT, RECT, RECT );
            ctx.strokeRect( tempx * RECT, tempy * RECT, RECT, RECT );
        }
        ++count;
        ++tempx;
        if ( count >= 4 ) {
            count = 0;
            ++tempy;
            tempx = x;
        }
    }
    drawBoard();
    drawNext();
}
registerGameOverEvent( function() {
    finish = true;
    ctx.fillStyle = "red";
    ctx.font = "30pt Arial";
    ctx.fillText( "GAME OVER", 30, 285);  
    clearInterval( loop );
} );
