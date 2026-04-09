const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const endpoint = typeof BACKEND_URL === 'string' ? BACKEND_URL : '';
