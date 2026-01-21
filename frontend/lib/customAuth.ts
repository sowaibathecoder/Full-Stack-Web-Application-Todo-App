/**
 * Custom authentication implementation to work with backend's auth system
 */

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
}

interface LoginCredentials {
  username: string; // email
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

class CustomAuth {
  private API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  // Better Auth compatible interface methods
  signIn = {
    email: async (credentials: { email: string; password: string; redirectTo?: string }): Promise<{ error?: { message: string } }> => {
      return this.login({ username: credentials.email, password: credentials.password });
    }
  };

  signUp = {
    email: async (userData: { email: string; password: string; name: string; redirectTo?: string }): Promise<{ error?: { message: string } }> => {
      return this.register({ email: userData.email, password: userData.password, name: userData.name });
    }
  };

  async login(credentials: LoginCredentials): Promise<{ error?: { message: string } }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }).toString(),
      });

      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
        } catch (parseError) {
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        console.error('Login error response:', response.status, errorMessage);
        return { error: { message: errorMessage } };
      }

      const data: AuthResponse = await response.json();

      // Store token in localStorage (or use httpOnly cookies in production)
      localStorage.setItem('access_token', data.access_token);

      return {};
    } catch (error) {
      console.error('Login network error:', error);
      return { error: { message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` } };
    }
  }

  async register(userData: RegisterData): Promise<{ error?: { message: string } }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || `HTTP error! status: ${response.status}`;
        } catch (parseError) {
          errorMessage = `HTTP error! status: ${response.status}`;
        }

        console.error('Registration error response:', response.status, errorMessage);
        return { error: { message: errorMessage } };
      }

      const data: AuthResponse = await response.json();

      // Store token in localStorage (or use httpOnly cookies in production)
      localStorage.setItem('access_token', data.access_token);

      return {};
    } catch (error) {
      console.error('Registration network error:', error);
      return { error: { message: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` } };
    }
  }

  async getSession(): Promise<{ data?: { user?: User; session?: { token: string } }; error?: any }> {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        return { data: { user: undefined, session: undefined } };
      }

      // Verify token by fetching user profile
      const response = await fetch(`${this.API_BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Token might be invalid/expired, remove it
        localStorage.removeItem('access_token');
        return { data: { user: undefined, session: undefined } };
      }

      const user: User = await response.json();

      return {
        data: {
          user,
          session: { token }
        }
      };
    } catch (error) {
      console.error('Session error:', error);
      return { error };
    }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem('access_token');
  }
}

export const customAuth = new CustomAuth();