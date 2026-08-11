import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Account Login</h2>
        <p class="subtitle">Log in to upload room photos and save custom paint designs.</p>

        <form (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="user@example.com" required class="input-control" />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required class="input-control" />
          </div>

          <button type="submit" class="btn-submit">Log In</button>
        </form>

        <p class="footer-text">
          Don't have an account? <a routerLink="/register">Register here</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; padding: 40px 20px; font-family: Arial, sans-serif; }
    .login-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 30px; width: 100%; max-width: 400px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    h2 { margin: 0 0 6px 0; color: #0f172a; }
    .subtitle { color: #64748b; font-size: 13px; margin-bottom: 20px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 13px; font-weight: bold; color: #334155; margin-bottom: 6px; }
    .input-control { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; box-sizing: border-box; }
    .btn-submit { width: 100%; background: #0284c7; color: white; border: none; padding: 11px; border-radius: 6px; font-weight: bold; cursor: pointer; }
    .btn-submit:hover { background: #0369a1; }
    .footer-text { text-align: center; font-size: 13px; color: #64748b; margin-top: 16px; }
    .footer-text a { color: #0284c7; text-decoration: none; font-weight: bold; }
  `]
})
export class LoginComponent {
  email: string = 'user@example.com';
  password: string = 'password123';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login();
    this.router.navigate(['/visualizer']);
  }
}