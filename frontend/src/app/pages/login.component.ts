
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],

  template: `
        <div class="login-page">

            <!-- Left Side Login Design -->
            <div class="login-art">

                <div class="login-brand">
                    <span class="brand-mark">E</span>
                    expensely
                </div>

                <div class="art-copy">

                    <span class="eyebrow light">
                        SMARTER EXPENSE MANAGEMENT
                    </span>

                    <h1>
                        Every expense.<br>
                        <em>In its right place.</em>
                    </h1>

                    <p>
                        Submit, track and manage reimbursements
                        with clarity and confidence.
                    </p>

                    <div class="art-stats">

                        <div>
                            <strong>Simple</strong>
                            <small>Claim submission</small>
                        </div>

                        <div>
                            <strong>Clear</strong>
                            <small>Approval tracking</small>
                        </div>

                        <div>
                            <strong>Secure</strong>
                            <small>Role-based access</small>
                        </div>

                    </div>
                </div>

                <div class="art-foot">
                    A better way to manage work expenses.
                </div>

            </div>

            <!-- Right Side Login Panel -->
            <div class="login-panel">

                <div class="login-box">

                    <span class="login-welcome">{{showRegister ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}}</span>

                    <h2>{{showRegister ? 'Create your employee account' : 'Sign in to your account'}}</h2>

                    <p class="muted">
                        {{showRegister ? 'Set up your account to start managing expense claims.' : 'Enter your details to continue to your workspace.'}}
                    </p>

                    <div class="auth-tabs" role="tablist" aria-label="Choose sign in or create account">
                        <button
                            type="button"
                            role="tab"
                            [attr.aria-selected]="!showRegister"
                            [class.active]="!showRegister"
                            (click)="showRegister = false; loginError = ''; registerError = ''"
                        >Sign in</button>
                        <button
                            type="button"
                            role="tab"
                            [attr.aria-selected]="showRegister"
                            [class.active]="showRegister"
                            (click)="showRegister = true; loginError = ''; registerError = ''"
                        >Create account</button>
                    </div>

                    <!-- Login Form -->
                    <form *ngIf="!showRegister" (ngSubmit)="login()">

                        <label>
                            Email address

                            <input
                                name="email"
                                type="email"
                                [(ngModel)]="email"
                                placeholder="you@company.com"
                                required
                            >
                        </label>

                        <!-- Login Password -->
                        <label>
                            Password

                            <div class="password-field">

                                <input
                                    name="password"
                                    [type]="showPassword ? 'text' : 'password'"
                                    [(ngModel)]="password"
                                    placeholder="Enter your password"
                                    required
                                    minlength="8"
                                >

                                <button
                                    type="button"
                                    class="password-toggle"
                                    (click)="showPassword = !showPassword"
                                    [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                                >

                                    <!-- Eye Icon -->
                                    <svg
                                        *ngIf="!showPassword"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>

                                    <!-- Eye Off Icon -->
                                    <svg
                                        *ngIf="showPassword"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M3 3l18 18"/>
                                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
                                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 10 7 10 7-.3 1.3-1.2 2.7-2.4 3.8"/>
                                        <path d="M6.6 6.6C4.5 7.9 3.3 9.9 3 12c.5 2.5 4 7 9 7 1.2 0 2.3-.3 3.3-.8"/>
                                    </svg>

                                </button>

                            </div>
                        </label>

                        <p class="error" *ngIf="loginError">
                            {{loginError}}
                        </p>

                        <button
                            class="primary full"
                            [disabled]="busy"
                        >
                            {{busy ? 'Signing in…' : 'Sign in →'}}
                        </button>

                    </form>

                    <!-- Registration Form -->
                    <form
                        class="register-form"
                        *ngIf="showRegister"
                        (ngSubmit)="register()"
                    >

                        <label>
                            Full name

                            <input
                                name="name"
                                [(ngModel)]="name"
                                required
                                minlength="2"
                            >
                        </label>

                        <label>
                            Work email

                            <input
                                name="newEmail"
                                type="email"
                                [(ngModel)]="newEmail"
                                required
                            >
                        </label>

                        <!-- Registration Password -->
                        <label>
                            Password

                            <div class="password-field">

                                <input
                                    name="newPassword"
                                    [type]="showNewPassword ? 'text' : 'password'"
                                    [(ngModel)]="newPassword"
                                    minlength="8"
                                    required
                                    placeholder="Enter your password"
                                >

                                <button
                                    type="button"
                                    class="password-toggle"
                                    (click)="showNewPassword = !showNewPassword"
                                    [attr.aria-label]="showNewPassword ? 'Hide password' : 'Show password'"
                                >

                                    <!-- Eye Icon -->
                                    <svg
                                        *ngIf="!showNewPassword"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/>
                                        <circle cx="12" cy="12" r="3"/>
                                    </svg>

                                    <!-- Eye Off Icon -->
                                    <svg
                                        *ngIf="showNewPassword"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path d="M3 3l18 18"/>
                                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"/>
                                        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 10 7 10 7-.3 1.3-1.2 2.7-2.4 3.8"/>
                                        <path d="M6.6 6.6C4.5 7.9 3.3 9.9 3 12c.5 2.5 4 7 9 7 1.2 0 2.3-.3 3.3-.8"/>
                                    </svg>

                                </button>

                            </div>
                        </label>

                        <p class="error" *ngIf="registerError">
                            {{registerError}}
                        </p>

                        <button
                            class="primary full"
                            [disabled]="busy"
                        >
                            {{busy ? 'Creating account…' : 'Create account'}}
                        </button>

                    </form>

                    <p class="login-note">
                        By continuing, you agree to your organization's
                        expense policy.
                    </p>

                </div>
            </div>
        </div>
    `,

})

export class LoginComponent {

  email = '';
  password = '';

  name = '';
  newEmail = '';
  newPassword = '';

  loginError = '';
  registerError = '';

  busy = false;
  showRegister = false;

  // Password visibility variables
  showPassword = false;
  showNewPassword = false;

  constructor(
      private auth: AuthService,
      private router: Router
  ) {}

  private errorMessage(error: any, action: string): string {

    if (error.status === 0) {
      return 'Cannot reach the API. Make sure PostgreSQL and the backend are running, then try again.';
    }

    return error.error?.error ||
        `Unable to ${action}. Check the details and try again.`;
  }

  // Login Method
  login(): void {

    this.busy = true;
    this.loginError = '';

    this.auth.login({
      email: this.email.trim(),
      password: this.password,
    }).subscribe({

      next: (session) => {

        const dashboard =
            session.role === 'MANAGER'
                ? '/manager'
                : '/employee';

        this.router.navigateByUrl(
            dashboard,
            { replaceUrl: true }
        );
      },

      error: (error) => {

        this.loginError =
            this.errorMessage(error, 'sign in');

        this.busy = false;
      },

    });
  }

  // Registration Method
  register(): void {

    this.busy = true;
    this.registerError = '';

    this.auth.register({
      fullName: this.name.trim(),
      email: this.newEmail.trim(),
      password: this.newPassword,
    }).subscribe({

      next: (session) => {

        const dashboard =
            session.role === 'MANAGER'
                ? '/manager'
                : '/employee';

        this.router.navigateByUrl(
            dashboard,
            { replaceUrl: true }
        );
      },

      error: (error) => {

        this.registerError =
            this.errorMessage(error, 'create account');

        this.busy = false;
      },

    });
  }
}
