export interface UserSession {
  id_usuario: number;
  nombre: string;
  correo: string;
  rol?: string;
}

const SESSION_KEY = 'mindexa_session';
const TOKEN_KEY = 'mindexa_token';

export const saveSession = (user: UserSession): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const getSession = (): UserSession | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as UserSession; } catch { return null; }
};

export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export const isLoggedIn = (): boolean => getSession() !== null;

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};
