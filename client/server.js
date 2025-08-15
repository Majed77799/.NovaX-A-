import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(__dirname));

const port = parseInt(process.env.CLIENT_PORT || '3000', 10);
app.listen(port, () => {
	console.log(`Client server on http://localhost:${port}`);
});