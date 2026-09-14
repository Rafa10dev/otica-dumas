'use client';

import Image from 'next/image';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import {
  FormEvent,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError('');

    if (
      !email.trim() ||
      !password
    ) {
      setError(
        'Preencha seu e-mail e sua senha.',
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          '/api/auth/login',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
            },
            credentials: 'same-origin',
            cache: 'no-store',
            body: JSON.stringify({
              email,
              password,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Não foi possível realizar o login.',
        );
      }

      /*
       * Recarregamos a página para garantir
       * que o servidor e o proxy recebam
       * o cookie recém-criado.
       */
      window.location.href = '/admin';
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao realizar login.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-orb login-orb-blue" />
      <div className="login-orb login-orb-red" />

      <section className="login-card">
        <div className="login-brand">
          <div className="login-logo">
            <Image
              src="/images/otica-dumas-logo.jpg"
              alt="Ótica Dumas"
              width={82}
              height={82}
              priority
            />
          </div>

          <div>
            <strong>ÓTICA DUMAS</strong>
            <span>
              Pederneiras • SP
            </span>
          </div>
        </div>

        <div className="login-heading">
          <div className="login-kicker">
            <ShieldCheck size={15} />
            Área administrativa
          </div>

          <h1>
            Acesso
            <br />
            restrito.
          </h1>

          <p>
            Entre para administrar o
            catálogo da Ótica Dumas.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >
          {error && (
            <div className="login-error">
              <strong>
                Não foi possível entrar.
              </strong>

              <span>{error}</span>
            </div>
          )}

          <label>
            <span>E-mail</span>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              placeholder="seu@email.com"
              autoComplete="username"
              disabled={loading}
            />
          </label>

          <label>
            <span>Senha</span>

            <div className="password-field">
              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Digite sua senha"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) =>
                      !value,
                  )
                }
                aria-label={
                  showPassword
                    ? 'Ocultar senha'
                    : 'Mostrar senha'
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </label>

          <button
            type="submit"
            className="primary-button login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="spin"
                />
                Verificando...
              </>
            ) : (
              <>
                Entrar no painel
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="login-footer-note">
          Acesso exclusivo para a
          administração da Ótica Dumas.
        </p>
      </section>
    </main>
  );
}
