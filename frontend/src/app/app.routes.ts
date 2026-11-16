import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { DashboardComponent } from './pages/dashboard.component';
import { ClaimsComponent } from './pages/claims.component';
import { roleGuard, signedOutOnlyGuard } from './core/role.guard';
import { UsersComponent } from './pages/users.component';
import { Component } from '@angular/core'; import { RouterLink } from '@angular/router';
@Component({  
standalone: true, imports: [RouterLink], template: `<main class="page-content">
    <section class="content-card empty-state">
    <span class="eyebrow">403 · ACCESS DENIED</span>
    <h1>You don't have access to this page</h1>
    <p>Your account does not have permission to view this area.</p>
    <a routerLink="/" class="primary link-button">Return to dashboard</a>
    </section>
    </main>`}) class AccessDeniedComponent { }
export const routes: Routes=[
  { path: 'login', component: LoginComponent, canActivate: [signedOutOnlyGuard] },
  { path: 'employee', component: DashboardComponent, canActivate: [roleGuard('EMPLOYEE')] },
  { path: 'manager', component: DashboardComponent, canActivate: [roleGuard('MANAGER')] },
  { path: 'claims', component: ClaimsComponent, canActivate: [roleGuard('EMPLOYEE', 'MANAGER')] },
  { path: 'new-claim', component: ClaimsComponent, data: { createMode: true }, canActivate: [roleGuard('EMPLOYEE')] },
  { path: 'users', component: UsersComponent, canActivate: [roleGuard('MANAGER')] },
  { path: 'denied', component: AccessDeniedComponent }, { path: '', redirectTo: 'login', pathMatch: 'full' }, { path: '**', redirectTo: 'denied' }
];
