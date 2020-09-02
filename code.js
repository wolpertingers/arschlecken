var canvas, scoreText;
var score = 0;

function init() {
	canvas = new fabric.Canvas('canvas', { selection: false, defaultCursor: new Image('img/tongue.png') });
	scoreText = new fabric.Text('Punkte: 0', {
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
		let x = canvas.width / options.pointer.x;
		let y = canvas.height / options.pointer.y;
		let distX = Math.pow(2.14 - x, 2);
		let distY = Math.pow(1.3 - y, 2);
		let dist = distX + distY;
		let c = Math.sqrt(dist);
		let tp = 1 - c;
		if (tp > 0) {
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
		}
	});
}

function resizeCanvas() {
	canvas.setHeight(window.innerHeight * 0.9);
	canvas.setWidth(window.innerWidth);
	canvas.renderAll();
}