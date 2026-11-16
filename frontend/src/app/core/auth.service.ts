
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

const API='/api';

export interface Session {
  accessToken: string;
  refreshToken: string;
  userId: number;
  fullName: string;
  email: string;
  role: 'EMPLOYEE'|'MANAGER';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  session=signal<Session|null>(this.load());

  constructor(private http: HttpClient) { }

  private load(): Session|null {
    try {
      const raw=localStorage.getItem('session');

      if (!raw) {
        return null;
      }

      const value=JSON.parse(raw) as Session;

      if (
        !value?.accessToken||
        !value?.refreshToken||
        !['EMPLOYEE', 'MANAGER'].includes(value.role)
      ) {
        localStorage.removeItem('session');
        return null;
      }

      return value;

    } catch {
      localStorage.removeItem('session');
      return null;
    }
  }

  login(data: { email: string; password: string; }) {
    return this.http
      .post<Session>(API+'/auth/login', data)
      .pipe(
        tap(s => this.save(s))
      );
  }

  register(data: {
    fullName: string;
    email: string;
    password: string;
  }) {
    return this.http
      .post<Session>(API+'/auth/register', data)
      .pipe(
        tap(s => this.save(s))
      );
  }

  refresh() {
    const s=this.session();

    if (!s) {
      return null;
    }

    return this.http
      .post<Session>(API+'/auth/refresh', {
        refreshToken: s.refreshToken
      })
      .pipe(
        tap(v => this.save(v))
      );
  }

  save(s: Session) {
    localStorage.setItem('session', JSON.stringify(s));
    this.session.set(s);
  }

  logout() {
    localStorage.removeItem('session');
    this.session.set(null);
  }
}
