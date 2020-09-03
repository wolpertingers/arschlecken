var canvas, score, scoreText;
const abs_arsch_X = (1.0 / 2.14) * canvas.width;  // this is now absolute
const abs_arsch_Y = (1.0 / 1.3) * canvas.height;  // this is now absolute
const falloff = 7.5;   // indicates how quickly points go down with increased distance
const cutoff = 0.05;   // indicates at what value to cut off giving out points

function init() {
	score = loadScore();

	canvas = new fabric.Canvas('canvas', { selection: false, defaultCursor: new Image('img/tongue.png') });
	scoreText = new fabric.Text(`Punkte: ${score}`, {
		fontFamily: 'Helvetica, Arial, sans-serif',
		fontSize: 50,
		selectable: false,
		evented: false,
		left: 10,
		top: 10
	});
	canvas.add(scoreText);

	// resize canvas to window size
	window.addEventListener('resize', resizeCanvas, false);
	resizeCanvas();

	// on click event
	canvas.on('mouse:down', function(options) {
		let x = options.pointer.x;
		let y = options.pointer.y;
		let squared_dist_X = Math.pow(rel_arsch_X - x, 2);
		let squared_dist_Y = Math.pow(rel_arsch_Y - y, 2);
		let dist = Math.sqrt(squared_dist_X + squared_dist_Y);
		let tp = Math.exp(- falloff * dist);
		if (tp > cutoff) {
			let points = Math.ceil(tp * 100);
			let text = new fabric.Text(`+${points}`, {
				fontFamily: 'Helvetica, Arial, sans-serif',
				fontSize: 100,
				fill: 'darkorange',
				strokeWidth: 3,
				stroke: 'orangered',
				selectable: false,
				evented: false,
				left: options.pointer.x,
				top: options.pointer.y
			});
			text.animate('opacity', '0', {
				duration: 1000,
				onChange: canvas.renderAll.bind(canvas),
				onComplete: function() {
					canvas.remove(text);
				}
			});
			canvas.add(text);
			score += points;
			scoreText.text = `Punkte: ${score}`;
			Cookies.set('score', score);
		}
	});
}

function loadScore() {
	let cookieScore = Cookies.get('score');
	return isNaN(cookieScore) ? 0 : parseInt(cookieScore);
}

function resizeCanvas() {
	canvas.setHeight(window.innerHeight * 0.9);
	canvas.setWidth(window.innerWidth);
	canvas.renderAll();
}