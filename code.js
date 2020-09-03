var canvas, score, scoreText;
var mlemID = 'mlem';
var scale, arsch_x, arsch_y;
const arsch_offset_x = - 174;
const arsch_offset_y = 763;
const wolpi_size_x = 2148;
const wolpi_size_y = 2847;
const cutoff_radius = 200;
const falloff = 0.01; // indicates how quickly points go down with increased distance


function init() {
	createjs.Sound.registerSound("sound/mlem.mp3", mlemID);

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

	// setting arsch position
	arsch_x = (canvas.width / 2) + scale * arsch_offset_x;
	arsch_y = (canvas.height / 2) + scale * arsch_offset_y;

	// on click event
	canvas.on('mouse:down', function(options) {
		let x = options.pointer.x;
		let y = options.pointer.y;
		let squared_dist_x = Math.pow(arsch_x - x, 2);
		let squared_dist_y = Math.pow(arsch_y - y, 2);
		let dist = Math.sqrt(squared_dist_x + squared_dist_y);
		let tp = Math.exp(- falloff * dist);
		if (tp > Math.exp(- falloff * cutoff_radius)) {
			let points = Math.ceil(tp * 100);
			let text = new fabric.Text(`+${points}`, {
				fontFamily: 'Helvetica, Arial, sans-serif',
				fontSize: points * 2,
				fill: 'darkorange',
				strokeWidth: 3,
				stroke: 'orangered',
				selectable: false,
				evented: false,
				left: x,
				top: y
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
			createjs.Sound.play(mlemID, { volume: tp });
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

	// get scaling of the image
	let diff_x = wolpi_size_x - canvas.width;
	let diff_y = wolpi_size_y - canvas.height;
	if (diff_x >= diff_y) {
		scale = canvas.width / wolpi_size_x
	} else {
		scale = canvas.height / wolpi_size_y
	}
}