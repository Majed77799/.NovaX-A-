"use client";
import { useEffect, useMemo, useState } from 'react';
import { templates, type Template } from '@repo/tokens';

type InstalledMap = Record<string, boolean>;

export default function MarketplacePage() {
  const [installed, setInstalled] = useState<InstalledMap>({});
  const [active, setActive] = useState<Template | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('novax.installed');
      if (raw) setInstalled(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('novax.installed', JSON.stringify(installed)); } catch {}
  }, [installed]);

  function install(t: Template) {
    setInstalled(prev => ({ ...prev, [t.id]: true }));
    setActive(null);
    alert(`Installed ${t.title}`);
  }

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <h2>Marketplace</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginTop: 16 }}>
        {templates.map(t => (
          <button key={t.id} className="card" onClick={() => setActive(t)}>
            <div style={{ height: 96, borderRadius: 12, background: `linear-gradient(135deg, ${t.tag.from}, ${t.tag.to})` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
              <div style={{ fontWeight: 600 }}>{t.title}</div>
              <span className="badge">{t.price === 'free' ? 'Free' : t.price}</span>
            </div>
            <div style={{ opacity: 0.8, marginTop: 6 }}>{t.description}</div>
            <div style={{ marginTop: 8 }}>
              <span className="badge" style={{ background: `linear-gradient(135deg, ${t.tag.from}, ${t.tag.to})`, color: '#0F1223' }}>{t.tag.label}</span>
            </div>
            {installed[t.id] && <div className="badge" style={{ marginTop: 8 }}>Installed</div>}
          </button>
        ))}
      </div>

      {active && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <h3>{active.title}</h3>
            <p style={{ marginTop: 8 }}>{active.description}</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button className="btn" onClick={() => install(active)}>Install</button>
              <button className="btn" onClick={() => setActive(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

