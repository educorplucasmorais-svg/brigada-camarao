const API_BASE = '/api';

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('bc_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('bc_token', token);
    } else {
      localStorage.removeItem('bc_token');
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(error.error || `HTTP ${res.status}`);
    }

    return res.json();
  }

  // Auth
  async login(email: string, password: string) {
    const data = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.token);
    return data;
  }

  async register(data: { name: string; email: string; password: string; phone?: string; cpf?: string; pixKey?: string }) {
    const result = await this.request<{ user: any; token: string; verified: boolean; verificationHash: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    this.setToken(result.token);
    return result;
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Events
  async getEvents(status?: string) {
    const params = status ? `?status=${status}` : '';
    return this.request<any[]>(`/events${params}`);
  }

  async getEvent(id: string) {
    return this.request<any>(`/events/${id}`);
  }

  // Registrations
  async createRegistration(eventId: string, contractAccepted: boolean) {
    return this.request<{ registration: any; verified: boolean; verificationHash: string; message: string }>('/registrations', {
      method: 'POST',
      body: JSON.stringify({ eventId, contractAccepted }),
    });
  }

  async verifyRegistration(id: string) {
    return this.request<{ registration: any; integrity: string; currentHash: string; storedHash: string }>(`/registrations/${id}/verify`);
  }

  async getMyRegistrations() {
    return this.request<any[]>('/registrations');
  }

  // Stats
  async getStats() {
    return this.request<any>('/stats');
  }

  // Vacancies
  async getVacancies(eventId?: string) {
    const params = eventId ? `?eventId=${eventId}` : '';
    return this.request<any[]>(`/vacancies${params}`);
  }

  // Quotes
  async getQuotes() {
    return this.request<any[]>('/quotes');
  }

  // Team
  async getTeam() {
    return this.request<any[]>('/team');
  }

  // Health
  async health() {
    return this.request<{ status: string }>('/health');
  }

  logout() {
    this.setToken(null);
  }
}

export const api = new ApiClient();
