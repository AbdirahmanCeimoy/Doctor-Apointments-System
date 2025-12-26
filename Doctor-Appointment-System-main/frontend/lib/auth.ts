import { User } from './api';

const USER_STORAGE_KEY = 'app_user';
const USER_ROLE_KEY = 'app_user_role';

export function setUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    localStorage.setItem(USER_ROLE_KEY, user.role);
  }
}

export function getUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  if (!userStr) {
    return null;
  }
  
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function getUserRole(): User['role'] | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem(USER_ROLE_KEY) as User['role'] | null;
}

export function clearUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}

