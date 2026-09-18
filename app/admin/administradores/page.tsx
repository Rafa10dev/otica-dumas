'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, Plus, Shield, Trash2 } from 'lucide-react';
import { AdminSidebar } from '@/components/admin-sidebar';

type User = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  role: string;
};

type AdminRole = 'ADMIN' | 'ADMIN_PRINCIPAL';

type Form = {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
};

const emptyForm: Form = { name: '', email: '', password: '', role: 'ADMIN' };

function roleLabel(role: string) {
  return role === 'ADMIN_PRINCIPAL' ? 'Administrador principal' : 'Administrador';
}

export default function AdministradoresPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState<Form>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<AdminRole | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const canManage = currentRole === 'ADMIN_PRINCIPAL';

  async function load() {
    setLoading(true);
    setError('');

    try {
      const [response, sessionResponse] = await Promise.all([
        fetch('/api/admin/users', { cache: 'no-store' }),
        fetch('/api/auth/me', { cache: 'no-store' }),
      ]);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível carregar os administradores.');
      }

      setUsers(data);
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        setCurrentRole(sessionData.user?.role === 'ADMIN_PRINCIPAL' ? 'ADMIN_PRINCIPAL' : 'ADMIN');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Erro ao carregar administradores.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function clearMessages() {
    setError('');
    setSuccess('');
  }

  async function create(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearMessages();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível cadastrar o administrador.');
      }

      setForm(emptyForm);
      setSuccess('Administrador cadastrado com sucesso.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Erro ao cadastrar administrador.');
    } finally {
      setSaving(false);
    }
  }

  async function toggle(user: User) {
    clearMessages();
    setBusyUserId(user.id);

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, active: !user.active }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Não foi possível atualizar o administrador.');
      }

      setSuccess(`Administrador ${user.active ? 'desativado' : 'ativado'} com sucesso.`);
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Erro ao atualizar administrador.');
    } finally {
      setBusyUserId(null);
    }
  }

  async function remove(user: User) {
    if (!window.confirm(`Excluir ${user.name}?`)) {
      return;
    }

    clearMessages();
    setBusyUserId(user.id);

    try {
      const response = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Não foi possível excluir o administrador.');
      }

      setSuccess('Administrador excluído com sucesso.');
      await load();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Erro ao excluir administrador.');
    } finally {
      setBusyUserId(null);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-shell">
        <AdminSidebar />

        <div className="admin-content">
          <div className="admin-topbar">
            <div>
              <Link href="/admin" className="back-link">
                <ArrowLeft size={16} aria-hidden="true" />
                Dashboard
              </Link>
              <h1>Administradores</h1>
              <p>Gerencie os usuários que possuem acesso ao painel administrativo.</p>
            </div>
          </div>

          {error && <div className="admin-form-error admin-global-error" role="alert">{error}</div>}
          {success && <div className="admin-form-success" role="status">{success}</div>}

          {currentRole === 'ADMIN' && (
            <div className="admin-permission-note" role="note">
              Apenas o administrador principal pode gerenciar administradores.
            </div>
          )}

          {canManage && (
            <div className="admin-panel admin-create-panel">
            <div className="panel-heading">
              <div>
                <h2>Adicionar administrador</h2>
                <p>Crie uma conta para liberar acesso ao painel.</p>
              </div>
              <Shield size={21} aria-hidden="true" />
            </div>

            <form className="admin-create-form" onSubmit={create}>
              <div className="admin-create-fields">
                <label className="admin-field">
                  <span>Nome</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                  />
                </label>

                <label className="admin-field">
                  <span>E-mail</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                  />
                </label>

                <label className="admin-field">
                  <span>Senha</span>
                  <input
                    required
                    minLength={8}
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                  />
                  <small>Use pelo menos 8 caracteres.</small>
                </label>

                <label className="admin-field">
                  <span>Nível de acesso</span>
                  <select
                    value={form.role}
                    onChange={(event) => setForm({ ...form, role: event.target.value as AdminRole })}
                  >
                    <option value="ADMIN">Administrador</option>
                    <option value="ADMIN_PRINCIPAL">Administrador principal</option>
                  </select>
                </label>
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setForm(emptyForm);
                    clearMessages();
                  }}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" className="primary-button" disabled={saving}>
                  {saving ? <Loader2 size={17} className="spin" aria-hidden="true" /> : <Plus size={17} aria-hidden="true" />}
                  {saving ? 'Cadastrando...' : 'Adicionar administrador'}
                </button>
              </div>
            </form>
            </div>
          )}

          <div className="admin-panel admin-users-panel">
            <div className="panel-heading">
              <div>
                <h2>Administradores cadastrados</h2>
                <p>{loading ? 'Carregando contas...' : `${users.length} conta(s) cadastrada(s).`}</p>
              </div>
            </div>

            {loading ? (
              <div className="admin-loading">
                <Loader2 size={22} className="spin" aria-hidden="true" />
                <span>Carregando administradores...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="admin-empty">
                <h3>Nenhum administrador cadastrado</h3>
                <p>Adicione a primeira conta usando o formulário acima.</p>
              </div>
            ) : (
              <div className="admin-table admin-users-list">
                {users.map((user) => {
                  const busy = busyUserId === user.id;

                  return (
                    <div className="admin-row admin-user-row" key={user.id}>
                      <div className="admin-user-info">
                        <strong>{user.name}</strong>
                        <span className="admin-user-email" title={user.email}>{user.email}</span>
                        <span className="admin-user-role">Perfil: {roleLabel(user.role)}</span>
                      </div>

                      <div className="admin-user-status">
                        <span className="admin-meta-label">Status</span>
                        <span className={user.active ? 'status-pill' : 'status-pill inactive'}>
                          {user.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>

                      {canManage ? (
                        <div className="row-actions admin-user-actions">
                          <button
                            type="button"
                            className="mini-action admin-text-action"
                            onClick={() => toggle(user)}
                            disabled={busy}
                          >
                            {busy ? <Loader2 size={15} className="spin" aria-hidden="true" /> : null}
                            {user.active ? 'Desativar' : 'Ativar'}
                          </button>
                          <button
                            type="button"
                            className="mini-action danger-action"
                            onClick={() => remove(user)}
                            disabled={busy}
                            aria-label={`Excluir ${user.name}`}
                            title="Excluir administrador"
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      ) : (
                        <span className="admin-readonly-label">Somente leitura</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
