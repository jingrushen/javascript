var canvas = document.querySelector('#canvas');
var ballcanvas = document.querySelector('#nodecanvas');
var ctx = canvas.getContext('2d');
var ctx2 = ballcanvas.getContext('2d');

var pointArr = [
    {
        x: 87, y: 534
    },
    {
        x: 221, y: 323
    },
    {
        x: 286, y: 392
    },
    {
        x: 388, y: 156
    }    
];

canvas.onclick = function (e) {
    console.log(e.offsetX, e.offsetY);
}

function factorial(n) {
    if (n <= 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}

function Bezier(arr, t) {
    var x = 0, y = 0, n = arr.length - 1;
    arr.forEach(function (p, index) {
        if (!index) {
            x += p.x * Math.pow(1 - t, n - index) * Math.pow(t, index);
            y += p.y * Math.pow(1 - t, n - index) * Math.pow(t, index);
        } else {
            x += factorial(n) / factorial(index) / factorial(n - index) * p.x * Math.pow(1 - t, n - index) * Math.pow(t, index);
            y += factorial(n) / factorial(index) / factorial(n - index) * p.y * Math.pow(1 - t, n - index) * Math.pow(t, index);
        }
    })
    return {
        x: x,
        y: y
    }
}

function initBezierNode() {
    var BezierNode = [];
    pointArr.forEach(function (p, index) {
        var len = pointArr.length;
        if (index === len - 1) {
            return ;
        }
        var arr = [];
        var x = (p.x + pointArr[index + 1].x) / 2;
        var sP = {  
            x: x,
            y: p.y
        }
        var tP = {
            x: x,
            y: pointArr[index + 1].y
        }
        arr.push(p, sP, tP, pointArr[index + 1]);
        for (var t = 0; t < 1; t += 0.01) {
            BezierNode.push(Bezier(arr, t));
        }
    })
    return BezierNode;
}
function initBezierLine(BN) {
    BN.forEach(function (p, index) {
        if (index) {
            var startX = BN[index - 1].x, startY = BN[index - 1].y;
            ctx.strokeStyle = '#af0000';
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(p.x, p.y);
            ctx.closePath();
            ctx.stroke();
        }
    })
}
function initBezierBall(p) {
    ctx2.clearRect(0, 0, 1200, 600);
    ctx2.fillStyle = '#121212';
    ctx2.beginPath();
    ctx2.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx2.closePath();
    ctx2.fill();
}
function run() {
    if (index >= BezierNode.length) {
        return ;
    }
    p = BezierNode[index++];
    initBezierBall(p);
    window.requestAnimationFrame(run);
}
var BezierNode = initBezierNode();
var index = 0;
initBezierLine(BezierNode);
run();
