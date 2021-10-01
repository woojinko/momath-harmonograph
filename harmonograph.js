var s = 1;                                         
var x = 0.0,  y = 0.0;
var t = 0.0, dt = 0.001;
var a1x, a1y, p1x, p1y, f1, td1;
var a2x, a2y, p2x, p2y, f2, td2;
var a3x, a3y, p3x, p3y, f3, td3;
var c1, c2, c3;
var R = 400.0; 
var Ax = 0.0, Ay = R, Bx = R, By = 0.0;
var Cx, Cy, Dx, Dy, Px, Py, Ex, Ey;
var graph, gr, scene, sc;
var intId = window.setInterval(step, 1000 * dt);
var ns, setns = 100000;
var vis1 = true, vis2 = true;

function init() {
	graph = document.getElementById('graph');
	gr = graph.getContext('2d');
	gr.setTransform(2, 0, 0, -2, 490, 390);
	gr.rotate(0.7854);
	gr.clearRect(-490, -390, graph.width, graph.height);
	gr.strokeStyle = "#F0F2BC";
	gr.lineWidth = 0.4;
	gr.globalAlpha = 0.8;
	scene = document.getElementById('scene');
	sc = scene.getContext('2d');
	sc.setTransform(0.25, 0, 0, -0.25, 150, 180);
	sc.rotate(0.7854);
	sc.clearRect(-560, -560, scene.width*4, scene.height*4);
	sc.fillStyle = "rgba(44,22,11,0.8)"
	sc.lineWidth = 4;
	sc.globalAlpha = 0.8;
	t = 0.0; ns = setns;
	inputChange();
	swing();
}

function step() {
	gr.beginPath();
	gr.moveTo(x, y);
	for (var i = 0; i < s; ++i) {
		t += dt;
		swing();
		gr.lineTo(x, y);
	}
	gr.stroke();
	sc.clearRect(-680, -680, 1600, 1600);
	sc.strokeStyle = "#999966";
	sc.strokeRect(Ax-80,By-80,Bx-Ax+160,Ay-By+160);
	sc.beginPath(); sc.arc(Ax,Ay,10,0,6.2832); sc.stroke();
    sc.beginPath(); sc.arc(Bx,By,10,0,6.2832); sc.stroke();
    sc.beginPath(); sc.arc(Ax,By,10,0,6.2832); sc.stroke();
	sc.beginPath(); sc.arc(Ex,Ey,200,0,6.2832); sc.fill(); sc.stroke();
	sc.beginPath(); 
	sc.moveTo(Ax, By);
	sc.lineTo(Ex, Ey);
	sc.stroke();
	sc.strokeStyle = "#F0F2BC";
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

function swing() {
	var x1 = a1x * Math.exp(-t / td1) * Math.sin(2.0 * Math.PI * f1 * t + p1x);
	var y1 = a1y * Math.exp(-t / td1) * Math.sin(2.0 * Math.PI * f1 * t + p1y);
	var x2 = a2x * Math.exp(-t / td2) * Math.sin(2.0 * Math.PI * f2 * t + p2x);
	var y2 = a2y * Math.exp(-t / td2) * Math.sin(2.0 * Math.PI * f2 * t + p2y);
	var x3 = a3x * Math.exp(-t / td3) * Math.sin(2.0 * Math.PI * f3 * t + p3x);
	var y3 = a3y * Math.exp(-t / td3) * Math.sin(2.0 * Math.PI * f3 * t + p3y);
	var CD = Math.sqrt( Math.pow(R + x2 - x1, 2) + Math.pow(R + y1 - y2, 2) );
	var gamma = Math.acos( CD / (2 * R) ) - Math.acos( (R + y1 - y2) / CD );
	Px = x1 - ( R * Math.sin(gamma) );
	Py = R + y1 - ( R * Math.cos(gamma) );
	x = Px - x3;  y = Py -y3;
	Cx = x1;  Cy = R + y1;  
	Dx = R + x2;  Dy = y2;
	Ex = x3; Ey = y3;
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
	s = s*2;
	if (s > 128) { s = 1; };
	document.getElementById('spf').innerHTML = "&nbsp; " + s + "x"
 }

function showSettings() {
	if (vis1) { document.getElementById('settings').style.visibility = "hidden"; vis1 = false;}
	else { document.getElementById('settings').style.visibility = "visible"; vis1 = true;}
}
function showScene() {
	if (vis2) { document.getElementById('topview').style.visibility = "hidden"; vis2 = false;}
	else { document.getElementById('topview').style.visibility = "visible"; vis2 = true;}
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

function inputChange() {
    c1 = document.getElementById('c1').value;
    c2 = document.getElementById('c2').value;
    c3 = document.getElementById('c3').value;
	a1x = read('a1x');
	a1y = read('a1y');
	p1x = read('p1x') / 180.0 * Math.PI;
	p1y = read('p1y') / 180.0 * Math.PI;
	f1 = read('f1');
	td1 = read('td1');
	a2x = read('a2x');
	a2y = read('a2y');
	p2x = read('p2x') / 180.0 * Math.PI;
	p2y = read('p2y') / 180.0 * Math.PI;
	f2 = read('f2');
	td2 = read('td2');
	a3x = read('a3x');
	a3y = read('a3y');
	p3x = read('p3x') / 180.0 * Math.PI;
	p3y = read('p3y') / 180.0 * Math.PI;
	f3 = read('f3');
	td3 = read('td3');
}

function updateColor() {
	updateElementColor('c1', 'body', '--bdrop-color');
	updateElementColor('c2', '.output.overview', '--dgram-color');
	updateElementColor('c3', '.output.main', '--paper-color');
	strokeColor = document.getElementById('c4').value;
}

function updateElementColor(inputID, element, property) {
	var elemInput = document.getElementById(inputID).value;
	var elemName = document.querySelector(element);

	input.addEventListener('change', function(){ 
		elemName.style.setProperty(property, elemInput);
	})
}
