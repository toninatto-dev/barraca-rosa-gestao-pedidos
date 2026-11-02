import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL_DOMAIN = 'barracarosa.com.br';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const login = email.trim().toLowerCase();
    const { error: err } = await supabase.auth.signInWithPassword({
      email: login.includes('@') ? login : `${login}@${ADMIN_EMAIL_DOMAIN}`,
      password,
    });
    if (err) {
      if (err.status === 429) {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
      } else if (err.status && err.status >= 500) {
        setError('Erro inesperado. Tente novamente mais tarde.');
      } else {
        setError('Usuário ou senha inválidos.');
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-sm px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-2xl border-2 border-[#FBCFE8] bg-white p-6 shadow-md"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0F5] text-[#D10068]">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h1 className="text-lg font-bold text-[#D10068]">Área do Administrador</h1>
          <p className="text-sm text-[#9D174D]/70">Entre com seu usuário e senha</p>
        </div>

        <label className="flex flex-col gap-1 text-sm font-semibold text-[#9D174D]">
          Usuário
          <input
            type="text"
            autoCapitalize="none"
            spellCheck={false}
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border-2 border-[#FBCFE8] px-3 py-2 font-normal text-gray-800 outline-none focus:border-[#D10068]"
          />
        </label>

        <div className="flex flex-col gap-1">
          <label htmlFor="admin-password" className="text-sm font-semibold text-[#9D174D]">
            Senha
          </label>
          <div className="relative">
            <input
              id="admin-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border-2 border-[#FBCFE8] py-2 pl-3 pr-11 font-normal text-gray-800 outline-none focus:border-[#D10068]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-[#9D174D]/70 hover:text-[#D10068]"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#D10068] px-4 py-2.5 font-bold text-white transition-colors hover:bg-[#E63970] disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Entrar
        </button>
      </form>
    </div>
  );
}
