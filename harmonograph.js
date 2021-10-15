var s = 1;
var x = 0.0, y = 0.0;
var t = 0.0;
var dt = 0.001;

var R = 400.0;
var Ax = 0.0, Ay = R, Bx = R, By = 0.0;

var A1x, p1x, A1y, p1y, f1, td1;
var A2x, p2x, A2y, p2y, f2, td2;
var A3x, p3x, A3y, p3y, f3, td3;

var Cx, Cy, Dx, Dy, Px, Py, Ex, Ey;

var harmonograph, hg, modelDiagram, md;
var style, penColor;
var intId = window.setInterval(step, 1000 * dt);;
var ns, setns = 100000;
var vis1 = true, vis2 = true;


var hScale = 1.5, hX = 500, hY = 500, hRotation = 0.7854;
var dScale = 0.25, dWidth = 180, dHeight = 180, dRotation = hRotation;



// initialize webpage
function init() {
	harmonInit();
	diagramInit();
	t = 0.0; ns = setns;
	inputChange();
	swing();
}

// helper function to initialize harmonograph
function harmonInit() {
	harmonograph = document.getElementById('harmonograph');
	// get 2D drawing context on the canvas
	hg = harmonograph.getContext('2d');

	// set transformations
	hg.setTransform(hScale, 0, 0, -1 * hScale, hX, hY);

	// erase existing pixels in drawing area by setting them to transparent black
	hg.clearRect(-1 * hX, -1 * hY, 880, 880);
	
	hg.rotate(hRotation);



	// set up aesthetics
	style = getComputedStyle(harmonograph);
	penColor = style.getPropertyValue("--pen-color");

	hg.strokeStyle = penColor;
	hg.lineWidth = 0.5;
	hg.globalAlpha = 0.75;
}

// helper function to initialize diagram
function diagramInit() {
	modelDiagram = document.getElementById('modelDiagram');
	// get 2D drawing context on the canvas
	sc = modelDiagram.getContext('2d');

	// set transformations
	sc.setTransform(dScale, 0, 0, -1 * dScale, dWidth, dHeight);
	sc.rotate(dRotation);

	// erase existing pixels in drawing area by setting them to transparent black
	sc.clearRect(-560, -560, modelDiagram.width * 4, modelDiagram.height * 4);

	// set up aesthetics
	sc.fillStyle = "rgba(255, 255, 255, 0.7)";
	sc.lineWidth = 4;
	sc.globalAlpha = 0.8;
}

// read and set current inputs
// x(t) = A * sin(tf + p) * e^(-dt)
function inputChange() {
	updateColor();
	A1x = read('A1x');
	p1x = read('p1x') / 180.0 * Math.PI;
	A1y = read('A1y');
	p1y = read('p1y') / 180.0 * Math.PI;
	td1 = read('td1');
	f1 = read('f1');

	A2x = read('A2x');
	p2x = read('p2x') / 180.0 * Math.PI;
	A2y = read('A2y');
	p2y = read('p2y') / 180.0 * Math.PI;
	f2 = read('f2');
	td2 = read('td2');

	A3x = read('A3x');
	p3x = read('p3x') / 180.0 * Math.PI;
	A3y = read('A3y');
	p3y = read('p3y') / 180.0 * Math.PI;
	f3 = read('f3');
	td3 = read('td3');
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
	if (hg != null) {
		hg.beginPath();
		hg.moveTo(x, y);
		for (var i = 0; i < s; ++i) {
			t += dt;
			swing();
			style = getComputedStyle(harmonograph);
			if (t % 3 < 1) {
				penColor = style.getPropertyValue("--pen-color-3");
			} else if (t % 3 < 2) {
				penColor = style.getPropertyValue("--pen-color-4");
			} else {
				penColor = style.getPropertyValue("--pen-color-5");
			}
			hg.strokeStyle = penColor;
			hg.lineTo(x, y);
		}
		hg.stroke();
		sc.clearRect(-680, -680, 1600, 1600);

		sc.strokeStyle = "#f59e8e";
		sc.strokeRect(Ax - 80, By - 80, Bx - Ax + 160, Ay - By + 160);
		sc.beginPath(); sc.arc(Ax, Ay, 10, 0, 6.2832); sc.stroke();
		sc.beginPath(); sc.arc(Bx, By, 10, 0, 6.2832); sc.stroke();
		sc.beginPath(); sc.arc(Ax, By, 10, 0, 6.2832); sc.stroke();
		sc.beginPath(); sc.arc(Ex, Ey, 200, 0, 6.2832); sc.fill(); sc.stroke();
		sc.beginPath();
		sc.moveTo(Ax, By);
		sc.lineTo(Ex, Ey);
		sc.stroke();

		sc.strokeStyle = "#f59e8e";
		sc.beginPath();
		sc.moveTo(Ax, Ay);
		sc.lineTo(Cx, Cy);
		sc.lineTo(Px, Py);
		sc.lineTo(Dx, Dy);
		sc.lineTo(Bx, By);
		sc.stroke();
		ns -= 1;
		if (ns <= 0) { window.clearInterval(intId); }
	}

}

function startStop() {
	var stab = document.getElementById('startButton');
	if (intId == null) {
		intId = window.setInterval(step, 1000 * dt);
		stab.innerHTML = 'stop';
	}
	else {
		window.clearInterval(intId);
		intId = null;
		stab.innerHTML = 'start';
	}
}

function speed() {
	s = s * 2;
	if (s > 128) { s = 1; };
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

function read(id) {
	var input = document.getElementById(id);
	var value = input.value;
	var f = parseFloat(value);
	if (isNaN(f)) {
		input.className = 'error';
	} else {
		input.className = '';
	}
	return f;
}

function updateColor() {
	updateElementColor('c1', 'body', '--b-color');
	// updateElementColor('c2', '#harmonograph', '--current-pen-color');
	updateElementColor('c3', '#harmonograph', '--pen-color-3');
	updateElementColor('c4', '#harmonograph', '--pen-color-4');
	updateElementColor('c5', '#harmonograph', '--pen-color-5');

}

function updateElementColor(inputID, element, property) {
	var elemInput = document.getElementById(inputID);
	elemInput.addEventListener('change', function () {
		var elemColor = elemInput.value;
		var elemName = document.querySelector(element);
		elemName.style.setProperty(property, elemColor);
	})
}

function savePng() {
	var res = read('res');
	// var png = document.createElement('canvas');
	// png.width = res;
	// png.height = res;
	// var renderer = new CanvasRenderer(png, false);
	// renderer.draw(xs, ys);
	// renderer.save();
	save(harmonograph);
}

function submitPng() {
	var res = read('res');
	save(harmonograph);
	var options = {
		files: [
			// You can specify up to 100 files.
			{'url': '...', 'filename': '...'},
			{'url': '...', 'filename': '...'},
			// ...
		],
	
		// Success is called once all files have been successfully added to the user's
		// Dropbox, although they may not have synced to the user's devices yet.
		success: function () {
			// Indicate to the user that the files have been saved.
			alert("Success! Files saved to your Dropbox.");
		},
	
		// Progress is called periodically to update the application on the progress
		// of the user's downloads. The value passed to this callback is a float
		// between 0 and 1. The progress callback is guaranteed to be called at least
		// once with the value 1.
		progress: function (progress) {},
	
		// Cancel is called if the user presses the Cancel button or closes the Saver.
		cancel: function () {},
	
		// Error is called in the event of an unexpected response from the server
		// hosting the files, such as not being able to find a file. This callback is
		// also called if there is an error on Dropbox or if the user is over quota.
		error: function (errorMessage) {}
	};
	var dropboxButton = Dropbox.createSaveButton(options);
	document.getElementById("draw").appendChild(dropboxButton);
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
	// save(harmonograph);
}
*/

function save(hCanvas) {
	hCanvas.toBlob(function (blob) {
		saveAs(blob, 'harmonograph.png');
	}, 'image/png');
}


