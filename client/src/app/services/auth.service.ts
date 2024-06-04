import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import IUser from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient, private router: Router) {}

  signup(user: IUser): Observable<boolean> {
    return this.http
      .post<{ access_token: string }>('/api/v1/auth/signup', user)
      .pipe(
        switchMap(this.handleSigninResult.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  signin(signinDto: {
    userName: string;
    password: string;
  }): Observable<boolean> {
    return this.http
      .post<{ access_token: string }>('/api/v1/auth/signin', signinDto)
      .pipe(
        switchMap(this.handleSigninResult.bind(this)),
        catchError(this.handleError.bind(this))
      );
  }

  signout() {
    localStorage.removeItem('user');
    this.router.navigate(['/signin']);
  }

  isAuthenticated() {
    const user = this.getUser();
    return !!user;
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    const user: IUser = JSON.parse(userStr);
    if (user!.twilioToken!.length > 0) return user;
    return null;
  }

  async handleSigninResult(result: { access_token: string }) {
    if (result!.access_token!.length > 0) {
      const decoded = jwtDecode(result!.access_token);
      const user = {
        ...decoded,
        token: result!.access_token,
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/chat']);
      return true;
    }
    return false;
  }

  async handleError(err: any) {
    console.error(err);
    return false;
  }
}
