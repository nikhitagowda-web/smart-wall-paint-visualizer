import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor() {
    // Check local storage for existing session token
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isLoggedInSubject.next(true);
    }
  }

  // Handle User Login
  login(token: string = 'demo-jwt-token'): void {
    localStorage.setItem('auth_token', token);
    this.isLoggedInSubject.next(true);
  }

  // Handle User Registration
  register(userData?: any): void {
    localStorage.setItem('auth_token', 'demo-registered-jwt-token');
    this.isLoggedInSubject.next(true);
  }

  // Handle User Logout
  logout(): void {
    localStorage.removeItem('auth_token');
    this.isLoggedInSubject.next(false);
  }

  // Helper method to check active session status
  isAuthenticated(): boolean {
    return this.isLoggedInSubject.value;
  }
}