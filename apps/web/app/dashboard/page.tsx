"use client";
import { useEffect, useState } from 'react';
import { templates } from '@repo/tokens';

export default function Dashboard() {
  const [installedIds, setInstalledIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('novax.installed');
      const map = raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
      setInstalledIds(Object.keys(map).filter(k => map[k]));
    } catch {}
  }, []);

  const installed = templates.filter(t => installedIds.includes(t.id));

  return (
    <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
      <h2>Dashboard</h2>
      <p style={{ marginTop: 8 }}>You have {installed.length} installed template{installed.length === 1 ? '' : 's'}.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 16, marginTop: 16 }}>
        {installed.map(t => (
          <div key={t.id} className="card">
            <div style={{ height: 96, borderRadius: 12, background: `linear-gradient(135deg, ${t.tag.from}, ${t.tag.to})` }} />
            <div style={{ fontWeight: 600, marginTop: 10 }}>{t.title}</div>
            <div style={{ opacity: 0.8, marginTop: 6 }}>{t.description}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 600 }}>Progress</div>
          <div className="badge">Level 3</div>
        </div>
        <div style={{ height: 10, borderRadius: 6, background: 'rgba(15,18,35,0.1)', marginTop: 10 }}>
          <div style={{ width: '72%', height: '100%', borderRadius: 6, background: 'linear-gradient(90deg, #A78BFA, #34D399)' }} />
        </div>
      </div>
    </div>
  );
}

