import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // A SENHA ESTÁ FIXA AQUI COMO '123'
    if (password === '123') {
      onLogin('admin-token-123');
    } else {
      setError('Senha incorreta!');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm border-2 border-pink-200">
        <h2 className="text-2xl font-bold mb-4 text-center text-pink-600">Acesso Restrito</h2>
        {error && <p className="text-red-500 mb-4 text-center font-semibold">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a senha (123)"
          className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          type="submit"
          className="w-full bg-pink-600 text-white font-bold py-3 px-4 rounded hover:bg-pink-700 transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}