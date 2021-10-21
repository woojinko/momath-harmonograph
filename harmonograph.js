var s = 1;
var x = 0.0, y = 0.0;
var t = 0.0;
var dt = 0.0005;

var R = 400.0;
var Ax = 0.0, Ay = R, Bx = R, By = 0.0;

var A1x, p1x, A1y, p1y, f1, td1;
var A2x, p2x, A2y, p2y, f2, td2;
var A3x, p3x, A3y, p3y, f3, td3;

var Cx, Cy, Dx, Dy, Px, Py, Ex, Ey;

var harmonographSmall, hgSmall, modelDiagram, md;
var harmonographBig, hgBig;
var style, penColor;
var defaultColor = "#000000";
var intId = window.setInterval(step, 1000 * dt);;
var ns, setns = 100000;
var vis1 = true, vis2 = true;

var hSmallScale = 1.4, hSmallX = 500, hSmallY = 500, hRotation = 0;
var hBigScale = 2, hBigX = 650, hBigY = 650;
// var hRotation = 0.7854;
var dScale = 0.25, dX = 110, dY = 180, dRotation = hRotation;

var rainbowMode = false;



// initialize webpage
function init() {
	harmonSmallInit();
	harmonBigInit();
	// diagramInit();
	// pendInit();
	t = 0.0; ns = setns;
	inputChange();
	swing();
}

// helper function to initialize harmonograph
function harmonSmallInit() {
	harmonographSmall = document.getElementById('harmonographSmall');
	// get 2D drawing context on the canvas
	hgSmall = harmonographSmall.getContext('2d');

	// set transformations
	hgSmall.setTransform(hSmallScale, 0, 0, -1 * hSmallScale, hSmallX, hSmallY);

	// erase existing pixels in drawing area by setting them to transparent black
	hgSmall.clearRect(-1 * hSmallX, -1 * hSmallY, 880, 880);

	hgSmall.rotate(hRotation);

	// set up aesthetics
	style = getComputedStyle(harmonographSmall);
	// penColor = style.getPropertyValue("--pen-color-3");
	penColor = style.getPropertyValue("--current-pen-color");
	// console.log(penColor);
	hgSmall.strokeStyle = penColor;
	hgSmall.lineWidth = 0.5;
	hgSmall.globalAlpha = 0.75;
}

function harmonBigInit() {
	harmonographBig = document.getElementById('harmonographBig');
	// get 2D drawing context on the canvas
	hgBig = harmonographBig.getContext('2d');

	// set transformations
	hgBig.setTransform(hBigScale, 0, 0, -1 * hBigScale, hBigX, hBigY);

	// erase existing pixels in drawing area by setting them to transparent black
	hgBig.clearRect(-1 * hBigX, -1 * hBigY, 1180, 1180);

	hgBig.rotate(hRotation);

	// set up aesthetics
	style = getComputedStyle(harmonographBig);
	// penColor = style.getPropertyValue("--pen-color-3");
	penColor = style.getPropertyValue("--current-pen-color");
	// console.log(penColor);
	hgBig.strokeStyle = penColor;
	hgBig.lineWidth = 0.5;
	hgBig.globalAlpha = 0.75;
}

// function pendInit() {
// 	var canvas = document.getElementById('pendCanvas');
// 	var context = canvas.getContext('2d');
// 	// context.clearRect(0, 0, canvas.width, canvas.height);
// 	// context.beginPath();
// 	var prev = 0;
// 	var sim = PendulumSim(1, 9.80665, Math.PI * 15 / 100, 10, function (angle) {
// 		var rPend = Math.min(canvas.width, canvas.height) * 0.47;
// 		var rBall = Math.min(canvas.width, canvas.height) * 0.02;
// 		var rBar = Math.min(canvas.width, canvas.height) * 0.005;
// 		var ballX = Math.sin(angle) * rPend;
// 		var ballY = Math.cos(angle) * rPend;

// 		context.fillStyle = "rgba(255,255,255,0.51)";
// 		context.globalCompositeOperation = "destination-out";
// 		context.fillRect(0, 0, canvas.width, canvas.height);

// 		context.fillStyle = "yellow";
// 		context.strokeStyle = "rgba(0,0,0," + Math.max(0, 1 - Math.abs(prev - angle) * 10) + ")";
// 		context.globalCompositeOperation = "source-over";

// 		context.save();
// 		context.translate(canvas.width / 2, canvas.height / 2);
// 		context.rotate(angle);

// 		context.beginPath();
// 		context.rect(-rBar, -rBar, rBar * 2, rPend + rBar * 2);
// 		context.fill();
// 		context.stroke();

// 		context.beginPath();
// 		context.arc(0, rPend, rBall, 0, Math.PI * 2, false);
// 		context.fill();
// 		context.stroke();
// 		context.restore();
// 		prev = angle;
// 	});
// }

// // helper function to initialize diagram
// function diagramInit() {
// 	modelDiagram = document.getElementById('modelDiagram');
// 	// get 2D drawing context on the canvas
// 	sc = modelDiagram.getContext('2d');

// 	// set transformations
// 	sc.setTransform(dScale, 0, 0, -1 * dScale, dX, dY);
// 	sc.rotate(dRotation);

// 	// erase existing pixels in drawing area by setting them to transparent black
// 	sc.clearRect(-560, -560, modelDiagram.width * 4, modelDiagram.height * 4);

// 	// set up aesthetics
// 	sc.fillStyle = "rgba(255, 255, 255, 0.7)";
// 	sc.lineWidth = 4;
// 	sc.globalAlpha = 0.8;
// }

// read and set current inputs
// x(t) = A * sin(tf + p) * e^(-dt)
function inputChange() {
	updateColor();
	A1x = readParam('A1x');
	A2x = readParam('A2x');
	A3x = readParam('A3x');

	A1y = readParam('A1y');
	A2y = readParam('A2y');
	A3y = readParam('A3y');

	p1x = readParam('p1x') / 180.0 * Math.PI;
	p2x = readParam('p2x') / 180.0 * Math.PI;
	p3x = readParam('p3x') / 180.0 * Math.PI;

	p1y = readParam('p1y') / 180.0 * Math.PI;
	p2y = readParam('p2y') / 180.0 * Math.PI;
	p3y = readParam('p3y') / 180.0 * Math.PI;

	td1 = readParam('td1');
	td2 = readParam('td2');
	td3 = readParam('td3');

	f1 = readParam('f1');
	f2 = readParam('f2');
	f3 = readParam('f3');
}

// model harmonograph based on the movement of 3 damped pendulums
// calculate using parametric sine equations with exponential damping
// i.e. x(t) = A * sin(tf + p) * e^(-dt)
function swing() {
	// setup each pendulum equation
	var x1 = A1x * Math.sin(2.0 * Math.PI * f1 * t + p1x) * Math.exp(-t / td1);
	var y1 = A1y * Math.sin(2.0 * Math.PI * f1 * t + p1y) * Math.exp(-t / td1);
	var x2 = A2x * Math.sin(2.0 * Math.PI * f2 * t + p2x) * Math.exp(-t / td2);
	var y2 = A2y * Math.sin(2.0 * Math.PI * f2 * t + p2y) * Math.exp(-t / td2);
	var x3 = A3x * Math.sin(2.0 * Math.PI * f3 * t + p3x) * Math.exp(-t / td3);
	var y3 = A3y * Math.sin(2.0 * Math.PI * f3 * t + p3y) * Math.exp(-t / td3);

	var CD = Math.sqrt(Math.pow(R + x2 - x1, 2) + Math.pow(R + y1 - y2, 2));
	var gamma = Math.acos(CD / (2 * R)) - Math.acos((R + y1 - y2) / CD);

	Px = x1 - (R * Math.sin(gamma));
	Py = R + y1 - (R * Math.cos(gamma));
	x = Px - x3; y = Py - y3;
	Cx = x1; Cy = R + y1;
	Dx = R + x2; Dy = y2;
	Ex = x3; Ey = y3;
}

function step() {
	if (hgSmall != null && hgBig != null) {
		hgSmall.beginPath();
		hgSmall.moveTo(x, y);

		hgBig.beginPath();
		hgBig.moveTo(x, y);
		for (var i = 0; i < s; ++i) {
			t += dt;
			swing();
			style = getComputedStyle(harmonographSmall);
			if (rainbowMode) {
				var rem = t * 0.1 % 6;
				if (rem < 1) {
					penColor = "rgb(255, 0, 0)";
				} else if (rem < 2) {
					penColor = "rgb(255, 100, 0)";
				} else if (rem < 3) {
					penColor = "rgb(255, 255, 0)";
				} else if (rem < 4) {
					penColor = "rgb(100, 255, 0)";
				} else if (rem < 5) {
					penColor = "rgb(0, 255, 255)";
				} else {
					penColor = "rgb(150, 0, 255)";
				}
			} else {
				penColor = style.getPropertyValue("--current-pen-color");
			}
			hgSmall.strokeStyle = penColor;
			hgSmall.lineTo(x, y);
			hgBig.strokeStyle = penColor;
			hgBig.lineTo(x, y);
		}
		hgSmall.stroke();
		hgBig.stroke();

		// sc.clearRect(-680, -680, 1600, 1600);
		// sc.strokeStyle = "#f59e8e";
		// sc.strokeRect(Ax - 80, By - 80, Bx - Ax + 160, Ay - By + 160);
		// sc.beginPath(); sc.arc(Ax, Ay, 10, 0, 6.2832); sc.stroke();
		// sc.beginPath(); sc.arc(Bx, By, 10, 0, 6.2832); sc.stroke();
		// sc.beginPath(); sc.arc(Ax, By, 10, 0, 6.2832); sc.stroke();
		// sc.beginPath(); 
		// sc.rect(Ex-200, Ey-200, 400, 400);
		// // sc.arc(Ex, Ey, 200, 0, 6.2832); 
		// sc.fill(); sc.stroke();
		// sc.beginPath();
		// sc.moveTo(Ax, By);
		// sc.lineTo(Ex, Ey);
		// sc.stroke();

		// sc.strokeStyle = "#f59e8e";
		// sc.beginPath();
		// sc.moveTo(Ax, Ay);
		// sc.lineTo(Cx, Cy);
		// sc.lineTo(Px, Py);
		// sc.lineTo(Dx, Dy);
		// sc.lineTo(Bx, By);
		// sc.stroke();
		ns -= 1;
		if (ns <= 0) { window.clearInterval(intId); }
	}

}

function startStop() {
	var stab = document.getElementById('startButton');
	if (intId == null) {
		intId = window.setInterval(step, 1000 * dt);
		stab.innerHTML = 'Stop';
	}
	else {
		window.clearInterval(intId);
		intId = null;
		stab.innerHTML = 'Start';
	}
}

function speed() {
	s = s * 2;
	if (s > 1024) { s = 1; };
	document.getElementById('spf').innerHTML = "&nbsp; " + s + "x"
}

function showSettings() {
	if (vis1) { document.getElementById('settings').style.visibility = "hidden"; vis1 = false; }
	else { document.getElementById('settings').style.visibility = "visible"; vis1 = true; }
}
function showModelDiagram() {
	if (vis2) { document.getElementById('topview').style.visibility = "hidden"; vis2 = false; }
	else { document.getElementById('topview').style.visibility = "visible"; vis2 = true; }
}

function readParam(id) {
	var input = document.getElementById(id);
	var value = input.value;
	var f = parseFloat(value);
	if (isNaN(f)) {
		input.className = 'error';
	} else {
		input.className = 'slider';
	}
	var output = document.getElementById(id + "val");
	output.innerHTML = f;

	return f;
}

function read(id) {
	var input = document.getElementById(id);
	var value = input.value;
	return parseFloat(value);
}

function updateColor() {
	// updateElementColor('c1', 'body', '--b-color');
	updateElementColor('c2', '#harmonographSmall', '--current-pen-color');
	// updateElementColor('c3', '#harmonographSmall', '--pen-color-3');
	// updateElementColor('c4', '#harmonographSmall', '--pen-color-4');
	// updateElementColor('c5', '#harmonographSmall', '--pen-color-5');

}

function updateElementColor(inputID, element, property) {
	var elemInput = document.getElementById(inputID);
	// console.log(elemInput);

	elemInput.addEventListener('change', function () {
		var elemColor = elemInput.value;
		var elemName = document.querySelector(element);
		elemName.style.setProperty(property, elemColor);
	})
}

function savePng() {
	// var png = document.createElement('canvas');
	// png.width = res;
	// png.height = res;
	// var renderer = new CanvasRenderer(png, false);
	// renderer.draw(xs, ys);
	// renderer.save();
	save(harmonographSmall);
}

function submitPng() {
	save(harmonographSmall);
}


// try to implement later if I have time!
/*
function saveSvg() {
	var res = read('res');
	var ns = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(ns, 'svg');
	svg.setAttribute('xmlns', ns);
	svg.setAttribute('width', res);
	svg.setAttribute('height', res);
	svg.setAttribute('version', '1.1');
	var bezier = document.getElementById('bezier').checked;
	var renderer = new SvgRenderer(svg, !bezier, bezier, read('bezier-step'));
	renderer.draw(xs, ys);
	renderer.save();
	// save(harmonographSmall);
}
*/

function save(hCanvas) {
	hCanvas.toBlob(function (blob) {
		saveAs(blob, 'harmonograph.png');
	}, 'image/png');
}

function rainbowToggle(){
	rainbowMode = !rainbowMode;
	console.log(rainbowMode);
	if (rainbowMode) {
		// document.getElementById("rainbowmode").style.background = "rgb(255,255,255)";
	} else {
		// document.getElementById("rainbowmode").style.background = "rgb(0, 0, 0)";
	}
}

function resetParams() {
	document.getElementById("resetParam").reset();
}



// function PendulumSim(length_m, gravity_mps2, initialAngle_rad, timestep_ms, callback) {
// 	var velocity = 0;
// 	var angle = initialAngle_rad;
// 	var k = -gravity_mps2 / length_m;
// 	var timestep_s = timestep_ms / 1000;
// 	return setInterval(function () {
// 		var acceleration = k * Math.sin(angle);
// 		velocity += acceleration * timestep_s;
// 		angle += velocity * timestep_s;
// 		callback(angle);
// 	}, timestep_ms);
// }
