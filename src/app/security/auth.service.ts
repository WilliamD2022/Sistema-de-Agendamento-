import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

type LoginRequest = { email: string; password: string; };
type AuthResponse = { accessToken: string; tokenType: string; expiresInMinutes: number; };

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly tokenKey = 'agenda_token';
    isAuthenticated = signal<boolean>(!!this.getToken());

    constructor(private http: HttpClient) {}

    login(body: LoginRequest) {
        return this.http.post<AuthResponse>('/api/auth/login', body).pipe(
            tap((res) => {
                localStorage.setItem(this.tokenKey, res.accessToken);
                this.isAuthenticated.set(true);
            })
        );
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.isAuthenticated.set(false);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
}
