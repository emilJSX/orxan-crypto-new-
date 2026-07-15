import React, { useState } from 'react';
import { Lock, User, Shield } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  // Ваши кастомные данные доступа
  const TARGET_LOGIN = "Orxan";
  const TARGET_PASSWORD = "qwerty2026";

  // Определяет публичный IPv4 устройства и отправляет его на сервер,
  // чтобы тот записал адрес в отдельный файл (ip-log.txt).
  // Выполняется в фоне и не задерживает вход.
  const logDeviceIp = async (user) => {
    let ip = null;
    try {
      // api.ipify.org возвращает именно IPv4-адрес.
      const r = await fetch('https://api.ipify.org?format=json');
      const d = await r.json();
      ip = d.ip;
    } catch {
      /* если внешний сервис недоступен — IP определит сам сервер */
    }
    try {
      await fetch('/api/log-ip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip, username: user }),
      });
    } catch {
      /* запись не удалась — не мешаем пользователю войти */
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === TARGET_LOGIN && password === TARGET_PASSWORD) {
      setError(false);
      logDeviceIp(username); // фиксируем IPv4 в файле
      onLoginSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 bg-[#050505]">
      {/* Фоновые эффекты */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[30%] left-[50%] translate-x-[-50%] w-[50%] h-[30%] rounded-full bg-emerald-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/[0.02] border border-white/5 p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-4">
            <Shield className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wider">QUANTUM<span className="text-emerald-400">ARB</span></h1>
          <p className="text-xs text-gray-500 mt-1">Панель управления HFT Арбитражем</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Логин</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/40 border border-white/5 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                placeholder="Введите ваш логин"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/5 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-all tracking-wider"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-center">
              Неверный логин или пароль. Доступ заблокирован.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 text-black font-semibold text-sm rounded-xl hover:bg-emerald-400 transition-all shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] mt-2"
          >
            Войти в систему
          </button>
        </form>
      </div>
    </div>
  );
}