var canvas, score, scoreText;
const rel_arsch_X = 1.0 / 2.14;
const rel_arsch_Y = 1.0 / 1.3;
const falloff = 10.0  // indicates how quickly points go down with increased distance
const cutoff = 0.5    // at what value do you want to cut off giving out points?

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
		let x = options.pointer.x / canvas.width;   // now they're always < 1
		let y = options.pointer.y / canvas.height;  // now they're always < 1
		let squared_dist_X = Math.pow(rel_arsch_X - x, 2);
		let squared_dist_Y = Math.pow(rel_arsch_Y - y, 2);
		let dist = Math.sqrt(squared_dist_X + squared_dist_Y);        // consequentyl, this too is < 1
		let tp = Math.exp( - falloff * dist)
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
