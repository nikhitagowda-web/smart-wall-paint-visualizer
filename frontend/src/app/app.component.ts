import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  template: `
    <div class="app-layout">
      <header class="app-header">
        <div class="header-container">
          <!-- App Title / Brand Logo -->
          <a routerLink="/visualizer" class="brand-logo">
            🎨 <span>Smart Wall Paint Visualizer</span>
          </a>

          <!-- Navigation Links -->
          <nav class="nav-menu">
            <a routerLink="/visualizer" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Paint Visualizer</a>
            <a routerLink="/my-projects" routerLinkActive="active">Saved Designs</a>
            <a routerLink="/user-guide" routerLinkActive="active">User Guide</a>
            <a routerLink="/admin-dashboard" routerLinkActive="active">Admin Panel</a>
          </nav>

          <!-- Dynamic Authentication Control (Login / Logout) -->
          <div class="auth-controls">
            <ng-container *ngIf="!isLoggedIn">
              <a routerLink="/login" class="btn-auth btn-login">Log In</a>
              <a routerLink="/register" class="btn-auth btn-register">Register</a>
            </ng-container>

            <ng-container *ngIf="isLoggedIn">
              <span class="user-badge">👤 Logged In</span>
              <button class="btn-auth btn-logout" (click)="onLogout()">Log Out</button>
            </ng-container>
          </div>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: Arial, sans-serif;
    }

    .app-header {
      background-color: #0f172a;
      padding: 14px 24px;
      color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-container {
      max-width: 1240px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand-logo {
      color: #ffffff;
      text-decoration: none;
      font-size: 18px;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .brand-logo span {
      color: #38bdf8;
    }

    .nav-menu {
      display: flex;
      gap: 20px;
    }

    .nav-menu a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 6px;
      transition: all 0.2s ease;
    }

    .nav-menu a:hover, .nav-menu a.active {
      color: #ffffff;
      background-color: #1e293b;
    }

    .auth-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-badge {
      font-size: 12px;
      background-color: #1e293b;
      color: #38bdf8;
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid #0284c7;
      font-weight: bold;
    }

    .btn-auth {
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .btn-auth:hover {
      opacity: 0.9;
    }

    .btn-login {
      background-color: transparent;
      color: #38bdf8;
      border: 1px solid #0284c7;
    }

    .btn-register {
      background-color: #0284c7;
      color: #ffffff;
      border: none;
    }

    .btn-logout {
      background-color: #ef4444;
      color: #ffffff;
      border: none;
    }

    .main-content {
      flex: 1;
      background-color: #f8fafc;
    }
  `]
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}