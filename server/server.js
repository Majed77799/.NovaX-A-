import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 3000

// Security and CORS
app.use(helmet({
	contentSecurityPolicy: false
}))
app.use(cors({
	origin: true,
	credentials: false
}))

// Body parser with tiny limit to avoid abuse
app.use(express.json({ limit: '1kb' }))

// Rate limiting for telemetry endpoint
const telemetryLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 300,
	standardHeaders: true,
	legacyHeaders: false
})

// In-memory telemetry counters (counts only; no PII)
const counters = Object.create(null)

function incrementCounter(eventName) {
	if (!counters[eventName]) counters[eventName] = 0
	counters[eventName] += 1
}

function isDoNotTrack(req) {
	const dntHeader = req.get('DNT')
	return dntHeader === '1'
}

function sanitizeEventName(eventName) {
	if (typeof eventName !== 'string') return null
	const trimmed = eventName.trim().toLowerCase()
	if (trimmed.length === 0 || trimmed.length > 64) return null
	// allow a-z, 0-9, underscore, dash, dot
	if (!/^[a-z0-9_.-]+$/.test(trimmed)) return null
	return trimmed
}

// Telemetry endpoint: counts only
app.post('/api/telemetry', telemetryLimiter, (req, res) => {
	if (isDoNotTrack(req)) {
		return res.status(204).end()
	}
	const { event } = req.body || {}
	const sanitized = sanitizeEventName(event)
	if (!sanitized) {
		return res.status(400).json({ error: 'invalid_event' })
	}
	incrementCounter(sanitized)
	return res.status(202).json({ ok: true })
})

// Optional: expose aggregated counters for admins/observability
// Protect with a simple env flag; if not set, 404
app.get('/api/telemetry/stats', (req, res) => {
	if (process.env.EXPOSE_TELEMETRY_STATS !== '1') {
		return res.status(404).json({ error: 'not_found' })
	}
	return res.json({ counters })
})

// Feature flags served by backend
// Source of truth; can be customized via env var FEATURE_FLAGS_JSON
function loadInitialFlags() {
	try {
		if (process.env.FEATURE_FLAGS_JSON) {
			const parsed = JSON.parse(process.env.FEATURE_FLAGS_JSON)
			if (parsed && typeof parsed === 'object') return parsed
		}
	} catch (_) {}
	return {
		labs: false
	}
}

let featureFlags = loadInitialFlags()

app.get('/api/feature-flags', (req, res) => {
	const response = {
		flags: featureFlags,
		updatedAt: new Date().toISOString(),
		version: 1
	}
	return res.json(response)
})

// Static frontend for demo/testing
const publicDir = path.join(__dirname, '..', 'public')
app.use(express.static(publicDir))

app.get('*', (req, res, next) => {
	// Only serve index.html for root and non-API routes
	if (req.path.startsWith('/api/')) return next()
	res.sendFile(path.join(publicDir, 'index.html'))
})

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`Server running on http://localhost:${port}`)
})