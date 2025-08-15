import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';

import billingRouter from './routes/billing.js';
import templatesRouter from './routes/templates.js';
import adminRouter from './routes/admin.js';

import './lib/db.js';

dotenv.config();

const app = express();

app.use(morgan('dev'));
app.use((req, res, next) => {
	if (req.originalUrl === '/api/billing/webhook') return next();
	express.json({ limit: '2mb' })(req, res, next);
});
app.use(cors());

app.get('/api/healthz', (req, res) => res.json({ ok: true }));

app.use('/api/billing', billingRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/admin', adminRouter);

// Static frontend
const webDir = path.resolve(process.cwd(), '../../web');
if (fs.existsSync(webDir)) {
	app.use(express.static(webDir));
	app.get('*', (req, res, next) => {
		if (req.path.startsWith('/api/')) return next();
		const indexPath = path.join(webDir, 'index.html');
		if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
		return next();
	});
}

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
	console.log(`API listening on http://localhost:${port}`);
});