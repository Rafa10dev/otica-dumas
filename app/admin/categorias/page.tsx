'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin-sidebar';
type Category = { id: string; name: string; slug: string; _count?: { products: number } };
export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]); const [name, setName] = useState(''); const [error, setError] = useState('');
  async function load() { const r = await fetch('/api/categories'); const d = await r.json(); if (r.ok) setItems(d); else setError(d.error || 'Não foi possível carregar categorias.'); }
  useEffect(() => { load(); }, []);
  async function create(e: React.FormEvent) { e.preventDefault(); const r = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name }) }); const d = await r.json(); if (!r.ok) return setError(d.error); setName(''); load(); }
  async function remove(item: Category) { if (!window.confirm(`Remover ${item.name}?`)) return; const r = await fetch(`/api/categories/${item.id}`, { method: 'DELETE' }); if (!r.ok) setError((await r.json()).error); else load(); }
  return <section className="admin-page"><div className="admin-shell"><AdminSidebar /><div className="admin-content"><div className="admin-topbar"><div><Link href="/admin" className="back-link"><ArrowLeft size={16}/> Dashboard</Link><h1>Categorias</h1><p>Organize os produtos do catálogo.</p></div></div>{error && <div className="admin-form-error">{error}</div>}<div className="admin-panel"><form className="admin-toolbar" onSubmit={create}><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Nome da categoria" aria-label="Nome da categoria"/><button className="primary-button"><Plus size={16}/> Adicionar</button></form></div><div className="admin-panel"><div className="admin-table">{items.map(item=><div className="admin-row" key={item.id}><div><strong>{item.name}</strong><span>{item._count?.products || 0} produto(s) · {item.slug}</span></div><button type="button" className="mini-action danger-action" onClick={()=>remove(item)} aria-label={`Remover ${item.name}`}><Trash2 size={16}/></button></div>)}</div></div></div></div></section>;
}
