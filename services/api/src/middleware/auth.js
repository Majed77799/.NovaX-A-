import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const adminSecret = process.env.ADMIN_JWT_SECRET || 'change_me';

export function userAuth(req, res, next) {
	const auth = req.headers.authorization || '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
	if (!token) return res.status(401).json({ error: 'Unauthorized' });
	try {
		const payload = jwt.verify(token, adminSecret);
		if (!payload?.email) return res.status(401).json({ error: 'Unauthorized' });
		req.user = { email: payload.email, id: payload.id };
		next();
	} catch (e) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
}

export function adminAuth(req, res, next) {
	const auth = req.headers.authorization || '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
	if (!token) return res.status(401).json({ error: 'Unauthorized' });
	try {
		const payload = jwt.verify(token, adminSecret);
		if (!payload?.role || payload.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
		req.admin = { email: payload.email || 'admin' };
		next();
	} catch (e) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
}

export function signAdminToken() {
	return jwt.sign({ role: 'admin', email: 'admin' }, adminSecret, { expiresIn: '7d' });
}

export function signUserToken(email, id) {
	return jwt.sign({ email, id }, adminSecret, { expiresIn: '14d' });
}