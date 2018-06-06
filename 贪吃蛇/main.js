var bg = document.querySelector('#main-canvas');
var ctx = bg.getContext('2d');
function renderBG(width, height) {

	ctx.fillStyle = '#989898';
	ctx.fillRect(0, 0, width, height);
	var xNum = width / 20,
		yNum = height / 20;
	var startX = 0, startY = 0;

	ctx.strokeStyle = '#fff';
	for(var i = 0; i < xNum; i++) {
		startY = 0;
		for (var j = 0; j < yNum; j++) {
			ctx.strokeRect(startX, startY, 20, 20);
			startY += 20;
		}
		startX += 20;
	}

}
var Snake = function (width, height) {
	this.long = 3;
	this.xNum = width / 20;
	this.yNum = height / 20;
	this.position = d2Arr(this.xNum, this.yNum);
	//默认为向上移动
	this.cx = 0; 
	this.cy = -1;
	this.bodyArr = [];
	this.isAte = true;
	this.isDetect = false;
	this.dir = [];
}
Snake.prototype.initPos = function () {
	var x = Math.floor(Math.random() * 19 + 1),
		y = Math.floor(Math.random() * 15 + 1);

	for (var i = 0; i < 3; i++) {
		this.bodyArr.push({x: x, y: y});
		this.position[x][y] = 1;
		y++;
	}
}
Snake.prototype.init = function () {
	this.initPos();
	this.renderS();
	this.run();
	this.listener();
	this.initFood();
}
Snake.prototype.renderS = function() {
	this.bodyArr.forEach(function (obj) {
		render(obj.x, obj.y, 'pink');
	})
}
Snake.prototype.initFood = function () {
	if (!this.isAte) {
		render(this.foodx, this.foody, 'orange');
		return ;
	} 

	var x = Math.round(Math.random() * this.xNum);
	var y = Math.round(Math.random() * this.yNum);

	if (this.position[x][y] === 0) {
		this.position[x][y] = 2;
		this.foodx = x;
		this.foody = y;
		render(x, y, 'orange');
		this.isAte = false;
	} else {
		this.initFood(isAte);
	}

}
Snake.prototype.resetBody = function () {

	var newX = this.bodyArr[0].x + this.cx;
	var newY = this.bodyArr[0].y + this.cy;

	if (this.isAte) {
		newX = this.foodx;
		newY = this.foody;
		console.log(newX, newY);
	} else {
		var temp = this.bodyArr.pop();
		this.position[temp.x][temp.y] = 0;
	}


	this.bodyArr.unshift({x: newX, y: newY});
	this.position[newX][newY] = 1;

}
Snake.prototype.begin = function () {


	ctx.clearRect(0, 0, 400, 400);
	renderBG(400, 400);
	this.resetBody();
	this.renderS();
	this.initFood();
	this.setDir();
	this.collisionDetection();
	if (this.isDetect) {
		console.log('game over');
		return ;
	}
	this.run();
	console.log(this.bodyArr);

}

Snake.prototype.run = function () {
	setTimeout(this.begin.bind(this), 150);
}

Snake.prototype.collisionDetection = function() {
	var headX = this.bodyArr[0].x + this.cx;
	var headY = this.bodyArr[0].y + this.cy;

	//撞墙了
	if (headX < 0 || headX === this.xNum || headY < 0 || headY === this.yNum) {
		this.isDetect = true;
		console.log('zhuanqiang');
		return true;
	}

	//吃到自己
	var len = this.bodyArr.length;
	for (var i = 0; i < len; i++) {
		if (headX === this.bodyArr[i].x && headY === this.bodyArr[i].y) {
			this.isDetect = true;
			console.log('chidaoziji');
			return true;
		}
	}

	//吃到食物
	if (headX === this.foodx && headY === this.foody) {
		this.isAte = true;
	}
	return false;
}
Snake.prototype.listener = function () {

	var t = this;

	document.onkeydown = function(e) {
		e = e || window.event;
		var k = e.keyCode;
		pushpop(t.dir, k);
	}

}
function pushpop(dirarr, k) {
	if (dirarr.length > 3) {
		dirarr.pop();
	}
	dirarr.push(k);
}
Snake.prototype.setDir = function() {
	if (this.dir.length === 0) {
		return ;
	}

	var temp;
	while (this.dir.length) {
		temp = this.dir.shift();
		if (this.ischangeDir(temp)) {
			switch (temp) {
				case 37:
					this.cx = -1;
					this.cy = 0;
					break;
				case 38:
					this.cx = 0;
					this.cy = -1;
					break;
				case 39:
					this.cx = 1;
					this.cy = 0;
					break;
				case 40:
					this.cx = 0;
					this.cy = 1;
					break;
				default:
					break;
			}
		}

	}
}
Snake.prototype.ischangeDir = function (temp) {

	var a = this.bodyArr[0];
	var b = this.bodyArr[1];
	if (temp === 37 || temp === 39) {
		if (a.y === b.y) {
			return false;
		}
	} else if (temp === 38 || temp === 40) {
		if (a.x === b.x) {
			return false;
		}
	}
	return true;

}
function d2Arr(x, y) {
	var arr = new Array(x);
	for (var i = 0; i < x; i++) {
		arr[i] = new Array(y);
		for (var j = 0; j < y; j++) {
			arr[i][j] = 0;
		}
	}
	return arr;
}
function render(x, y, color) {
	x = x * 20;
	y = y * 20;
	ctx.strokeStyle = '#fff';
	ctx.strokeRect(x, y, 20, 20);
	ctx.fillStyle = color;
	ctx.fillRect(x, y, 20, 20);
}

renderBG(400, 400);

var snake = new Snake(400, 400);
snake.init();