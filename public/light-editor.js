export function createEditor(canvas) {
	const ctx = canvas.getContext('2d');
	const state = {
		image: null,
		brightness: 0,
		cropMode: false,
		cropStart: null,
		cropEnd: null,
		texts: [] // { text, x, y }
	};

	function clear() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function draw() {
		clear();
		if (!state.image) return;
		ctx.save();
		// Apply brightness via global composite over a filled rect after drawing image
		ctx.drawImage(state.image, 0, 0, canvas.width, canvas.height);
		if (state.brightness !== 0) {
			const delta = state.brightness; // -100..100
			ctx.fillStyle = `rgba(${delta>0?255:0}, ${delta>0?255:0}, ${delta>0?255:0}, ${Math.abs(delta)/200})`;
			ctx.globalCompositeOperation = delta > 0 ? 'lighter' : 'multiply';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.globalCompositeOperation = 'source-over';
		}
		// Draw texts
		ctx.fillStyle = 'white';
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 3;
		ctx.font = '24px system-ui, Arial';
		for (const t of state.texts) {
			ctx.strokeText(t.text, t.x, t.y);
			ctx.fillText(t.text, t.x, t.y);
		}
		ctx.restore();

		// Crop guide
		if (state.cropMode && state.cropStart && state.cropEnd) {
			const x = Math.min(state.cropStart.x, state.cropEnd.x);
			const y = Math.min(state.cropStart.y, state.cropEnd.y);
			const w = Math.abs(state.cropEnd.x - state.cropStart.x);
			const h = Math.abs(state.cropEnd.y - state.cropStart.y);
			ctx.save();
			ctx.strokeStyle = '#38bdf8';
			ctx.setLineDash([6, 4]);
			ctx.strokeRect(x, y, w, h);
			ctx.restore();
		}
	}

	function loadImage(img) {
		state.image = img;
		draw();
	}

	function setBrightness(val) {
		state.brightness = Math.max(-100, Math.min(100, val|0));
		draw();
	}

	function addText(text) {
		if (!text) return;
		state.texts.push({ text, x: 20, y: 40 + state.texts.length * 30 });
		draw();
	}

	function toggleCropMode() {
		state.cropMode = !state.cropMode;
		state.cropStart = null; state.cropEnd = null;
		draw();
	}

	function performCrop() {
		if (!state.cropStart || !state.cropEnd) return;
		const x = Math.min(state.cropStart.x, state.cropEnd.x);
		const y = Math.min(state.cropStart.y, state.cropEnd.y);
		const w = Math.abs(state.cropEnd.x - state.cropStart.x);
		const h = Math.abs(state.cropEnd.y - state.cropStart.y);
		if (w < 10 || h < 10) return;
		const tmp = document.createElement('canvas');
		tmp.width = w; tmp.height = h;
		tmp.getContext('2d').drawImage(canvas, x, y, w, h, 0, 0, w, h);
		canvas.width = w; canvas.height = h;
		state.cropMode = false;
		state.cropStart = state.cropEnd = null;
		state.image = tmp;
		draw();
	}

	function exportImage(type = 'image/png', quality) {
		return canvas.toDataURL(type, quality);
	}

	canvas.addEventListener('mousedown', (e) => {
		if (!state.cropMode) return;
		const rect = canvas.getBoundingClientRect();
		state.cropStart = { x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) };
		state.cropEnd = { ...state.cropStart };
		draw();
	});
	canvas.addEventListener('mousemove', (e) => {
		if (!state.cropMode || !state.cropStart) return;
		const rect = canvas.getBoundingClientRect();
		state.cropEnd = { x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) };
		draw();
	});
	canvas.addEventListener('mouseup', (e) => {
		if (!state.cropMode || !state.cropStart) return;
		const rect = canvas.getBoundingClientRect();
		state.cropEnd = { x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) };
		performCrop();
	});

	return {
		loadImage,
		setBrightness,
		addText,
		toggleCropMode,
		export: exportImage
	};
}