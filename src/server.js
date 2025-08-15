import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createMemoryStore } from './stores/index.js';
import createMemoryRouter from './routes/memory.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

const store = createMemoryStore();
app.use('/api/memory', createMemoryRouter(store));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use(express.static(path.join(process.cwd(), 'public')));
app.get(/.*/, (req, res) => {
	res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});