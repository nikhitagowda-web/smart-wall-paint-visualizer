import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userData = {
    name: '',
    email: '',
    password: '',
    role: 'user'
  };
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}