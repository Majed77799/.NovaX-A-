const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT ? Number(process.env.PORT) : 5174;

function send(res, status, body, headers = {}) {
	res.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', ...headers });
	res.end(body);
}

function sendJson(res, status, data) {
	res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
	res.end(JSON.stringify(data));
}

function readBody(req) {
	return new Promise((resolve) => {
		let data = '';
		req.on('data', (chunk) => (data += chunk));
		req.on('end', () => resolve(data));
	});
}

const server = http.createServer(async (req, res) => {
	const url = new URL(req.url || '/', `http://localhost:${PORT}`);
	if (req.method === 'POST' && url.pathname === '/api/chat') {
		const body = await readBody(req);
		const { text } = JSON.parse(body || '{}');
		return sendJson(res, 200, { reply: `Echo: ${text}` });
	}
	if (req.method === 'POST' && url.pathname === '/api/purchase') {
		const body = await readBody(req);
		const { templateId } = JSON.parse(body || '{}');
		return sendJson(res, 200, { ok: true, templateId });
	}

	if (req.method === 'GET' && url.pathname === '/') {
		const htmlPath = path.join(process.cwd(), 'index.html', 'metin.txt');
		try {
			const html = fs.readFileSync(htmlPath, 'utf8');
			res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
			return res.end(html);
		} catch (e) {
			return send(res, 404, 'index not found');
		}
	}

	return send(res, 404, 'not found');
});

server.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`server on http://localhost:${PORT}`);
});