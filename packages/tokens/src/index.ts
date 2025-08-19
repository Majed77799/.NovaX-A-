export type Template = {
  id: string;
  title: string;
  description: string;
  tag: { label: string; from: string; to: string };
  price: 'free' | `$${number}`;
};

export const templates: Template[] = [
  {
    id: 'crm-starter',
    title: 'CRM Starter',
    description: 'Contacts, pipelines, and follow‑ups made simple.',
    tag: { label: 'Business', from: '#A78BFA', to: '#60A5FA' },
    price: 'free'
  },
  {
    id: 'analytics-kit',
    title: 'Analytics Kit',
    description: 'Plug‑and‑play dashboards with retention cohorts.',
    tag: { label: 'Insights', from: '#34D399', to: '#22D3EE' },
    price: '$19'
  },
  {
    id: 'support-desk',
    title: 'Support Desk',
    description: 'Inbox, macros, and SLAs for lean teams.',
    tag: { label: 'Ops', from: '#F472B6', to: '#F59E0B' },
    price: 'free'
  },
  {
    id: 'billing-lite',
    title: 'Billing Lite',
    description: 'Subscriptions and invoices without the headache.',
    tag: { label: 'Finance', from: '#F59E0B', to: '#84CC16' },
    price: '$9'
  },
  {
    id: 'cms-pages',
    title: 'CMS Pages',
    description: 'SEO‑friendly pages with media library.',
    tag: { label: 'Content', from: '#60A5FA', to: '#34D399' },
    price: 'free'
  },
  {
    id: 'jobs-board',
    title: 'Jobs Board',
    description: 'Postings, applications, and candidate CRM.',
    tag: { label: 'HR', from: '#22D3EE', to: '#A78BFA' },
    price: '$12'
  },
  {
    id: 'messaging',
    title: 'Messaging',
    description: 'Real‑time chat with typing indicators.',
    tag: { label: 'Comms', from: '#84CC16', to: '#34D399' },
    price: 'free'
  },
  {
    id: 'email-drips',
    title: 'Email Drips',
    description: 'Templates and sequences to grow engagement.',
    tag: { label: 'Growth', from: '#EF4444', to: '#F59E0B' },
    price: '$7'
  },
  {
    id: 'monitoring',
    title: 'Monitoring',
    description: 'Health checks and alerts that just work.',
    tag: { label: 'SRE', from: '#60A5FA', to: '#EF4444' },
    price: 'free'
  },
  {
    id: 'docs-portal',
    title: 'Docs Portal',
    description: 'Beautiful docs with search and versions.',
    tag: { label: 'Docs', from: '#A78BFA', to: '#F472B6' },
    price: '$5'
  }
];

export const gradients = {
  hero: ['#F6E7FF', '#E9F0FF', '#D7F7FF'] as const,
  surface: ['rgba(255,255,255,0.75)', 'rgba(255,255,255,0.35)'] as const
};

