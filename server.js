const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const CACHE_DIR = path.join(__dirname, 'cache');
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static index and assets
app.use(express.static(path.join(__dirname, 'public')));

// Simple health
app.get('/api/health', (req, res) => res.json({ ok: true }));

// /api/image - generate an image given a prompt
// For now, this is a stub that creates a placeholder image. Replace with your provider call.
app.post('/api/image', async (req, res) => {
	try {
		const { prompt, width = 512, height = 512 } = req.body || {};
		if (!prompt || typeof prompt !== 'string') {
			return res.status(400).json({ error: 'Missing prompt' });
		}

		// Create a simple PNG placeholder in memory (data URL) to simulate generation
		// In production, integrate with an image gen API and return base64/png buffer
		const svg = `<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"${width}\" height=\"${height}\"><rect width=\"100%\" height=\"100%\" fill=\"#111827\"/><text x=\"50%\" y=\"50%\" dominant-baseline=\"middle\" text-anchor=\"middle\" fill=\"#9CA3AF\" font-family=\"Arial\" font-size=\"16\">${prompt.replace(/</g, '&lt;').slice(0,80)}</text></svg>`;
		const dataUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

		return res.json({ imageDataUrl: dataUrl });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Failed to generate image' });
	}
});

// /api/upload - save base64 image to local cache; optional Supabase storage
app.post('/api/upload', async (req, res) => {
	try {
		const { imageDataUrl, filename } = req.body || {};
		if (!imageDataUrl || !imageDataUrl.startsWith('data:image/')) {
			return res.status(400).json({ error: 'Invalid imageDataUrl' });
		}
		const safeName = (filename && filename.replace(/[^a-zA-Z0-9._-]/g, '_')) || `img_${Date.now()}.png`;

		const [, meta, base64] = imageDataUrl.match(/^data:(.*?);base64,(.*)$/) || [];
		if (!base64) return res.status(400).json({ error: 'Invalid data URL' });
		const ext = meta.includes('svg') ? 'svg' : (meta.includes('jpeg') ? 'jpg' : (meta.includes('png') ? 'png' : 'png'));
		const localPath = path.join(CACHE_DIR, `${safeName}.${ext}`);
		fs.writeFileSync(localPath, Buffer.from(base64, 'base64'));

		let supabaseUrl = process.env.SUPABASE_URL;
		let supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
		let publicUrl = null;

		if (supabaseUrl && supabaseKey) {
			try {
				const { createClient } = require('@supabase/supabase-js');
				const supabase = createClient(supabaseUrl, supabaseKey);
				const bucket = process.env.SUPABASE_BUCKET || 'images';
				// Ensure bucket exists (no-op if it does)
				try { await supabase.storage.createBucket(bucket, { public: true }); } catch (_) {}
				const filePath = `${Date.now()}_${path.basename(localPath)}`;
				const uploadRes = await supabase.storage.from(bucket).upload(filePath, fs.createReadStream(localPath), { contentType: meta.split(';')[0], upsert: true });
				if (uploadRes.error) {
					console.warn('Supabase upload error:', uploadRes.error.message);
				} else {
					const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
					publicUrl = data?.publicUrl || null;
				}
			} catch (e) {
				console.warn('Supabase unavailable:', e?.message || e);
			}
		}

		return res.json({ ok: true, localPath, publicUrl });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: 'Failed to upload image' });
	}
});

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});