// auth.js
class AuthClient {
    constructor(options = {}) {
        this.refreshPromise = null;
        this.baseUrl = options.baseUrl || '';
        this.onAuthError = options.onAuthError || (() => {});
        this.onRefreshError = options.onRefreshError || (() => {});
    }

    // Handles the fetch with retry logic
    async fetchWithAuth(url, options = {}) {
        try {
            // First attempt with current token
            const response = await this._fetchWithToken(url, options);
            
            // If not 401, return the response
            if (response.status !== 401) {
                return response;
            }

            // Get fresh token and retry
            const token = await this._handleRefreshToken();
            if (!token) {
                throw new Error('Failed to refresh token');
            }

            // Retry the original request with new token
            return await this._fetchWithToken(url, options);

        } catch (error) {
            if (error.message === 'Failed to refresh token') {
                this.onAuthError();
            }
            throw error;
        }
    }

    // Internal method to add auth headers and make the request
    async _fetchWithToken(url, options = {}) {
        const token = this.getAccessToken();
        
        const headers = new Headers(options.headers || {});
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return fetch(this.baseUrl + url, {
            ...options,
            headers
        });
    }

    // Handles token refresh with race condition prevention
    async _handleRefreshToken() {
        // If there's already a refresh in progress, wait for it
        if (this.refreshPromise) {
            return this.refreshPromise;
        }

        try {
            this.refreshPromise = this._refreshToken();
            const result = await this.refreshPromise;
            return result;
        } finally {
            this.refreshPromise = null;
        }
    }

    // Performs the actual token refresh
    async _refreshToken() {
        const refreshToken = this.getRefreshToken();
        
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await fetch(this.baseUrl + '/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                throw new Error('Refresh failed');
            }

            const data = await response.json();
            this.setTokens(data.accessToken, data.refreshToken);
            return data.accessToken;

        } catch (error) {
            this.clearTokens();
            this.onRefreshError();
            throw error;
        }
    }

    // Token management methods
    getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken() {
        return localStorage.getItem('refreshToken');
    }

    setTokens(accessToken, refreshToken) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    // Login method
    async login(credentials) {
        const response = await fetch(this.baseUrl + '/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        this.setTokens(data.accessToken, data.refreshToken);
        return data;
    }

    logout() {
        this.clearTokens();
    }
}

// Create and export a singleton instance
export const auth = new AuthClient({
    baseUrl: 'https://api.example.com',
    onAuthError: () => {
        // Handle authentication errors (e.g., redirect to login)
        window.location.href = '/login';
    },
    onRefreshError: () => {
        // Handle refresh token errors
        console.error('Failed to refresh authentication token');
    }
});