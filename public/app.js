const TELEMETRY_ENDPOINT = '/api/telemetry'
const FEATURE_FLAGS_ENDPOINT = '/api/feature-flags'
const LOCAL_CACHE_KEY = 'featureFlagsCache_v1'
const LOCAL_LABS_OVERRIDE_KEY = 'labsOverride_v1'
const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 minutes

function nowMs() { return Date.now() }

function readLocalJson(key) {
	try { return JSON.parse(localStorage.getItem(key) || 'null') } catch (_) { return null }
}

function writeLocalJson(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}

async function fetchFlagsFresh() {
	const res = await fetch(FEATURE_FLAGS_ENDPOINT, { headers: { 'accept': 'application/json' } })
	if (!res.ok) throw new Error('Failed to fetch flags')
	return await res.json()
}

export async function getFlags({ ttlMs = DEFAULT_TTL_MS, forceRefresh = false } = {}) {
	const cached = readLocalJson(LOCAL_CACHE_KEY)
	if (!forceRefresh && cached && typeof cached === 'object' && cached.expiresAt && cached.flags && cached.expiresAt > nowMs()) {
		return cached.flags
	}
	const fresh = await fetchFlagsFresh()
	const packageToCache = { flags: fresh.flags || {}, expiresAt: nowMs() + ttlMs }
	writeLocalJson(LOCAL_CACHE_KEY, packageToCache)
	return packageToCache.flags
}

function getLabsResolved(flags) {
	const override = readLocalJson(LOCAL_LABS_OVERRIDE_KEY)
	if (typeof override === 'boolean') return override
	return Boolean(flags?.labs)
}

function setLabsOverride(enabled) {
	writeLocalJson(LOCAL_LABS_OVERRIDE_KEY, Boolean(enabled))
}

async function sendTelemetry(event) {
	try {
		await fetch(TELEMETRY_ENDPOINT, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ event })
		})
	} catch (_) { /* ignore */ }
}

function bindToggle(toggleEl, { getState, setState, onChange }) {
	function applyUi(state) {
		toggleEl.classList.toggle('on', state)
		toggleEl.setAttribute('aria-checked', String(Boolean(state)))
	}
	applyUi(getState())
	const handler = () => {
		const next = !getState()
		setState(next)
		applyUi(next)
		onChange?.(next)
	}
	toggleEl.addEventListener('click', handler)
	toggleEl.addEventListener('keydown', (e) => {
		if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler() }
	})
}

async function render() {
	const flags = await getFlags()
	const labsToggle = document.getElementById('labsToggle')
	const flagsOut = document.getElementById('flagsOut')
	const refreshBtn = document.getElementById('refreshFlags')

	bindToggle(labsToggle, {
		getState: () => getLabsResolved(flags),
		setState: (enabled) => setLabsOverride(enabled),
		onChange: (enabled) => sendTelemetry(enabled ? 'labs_toggled_on' : 'labs_toggled_off')
	})

	flagsOut.textContent = JSON.stringify({
		serverFlags: flags,
		labsResolved: getLabsResolved(flags)
	}, null, 2)

	refreshBtn.addEventListener('click', async () => {
		const fresh = await getFlags({ forceRefresh: true })
		flagsOut.textContent = JSON.stringify({
			serverFlags: fresh,
			labsResolved: getLabsResolved(fresh)
		}, null, 2)
		await sendTelemetry('flags_refreshed')
	})
}

render().catch(err => {
	const flagsOut = document.getElementById('flagsOut')
	flagsOut.textContent = String(err)
})