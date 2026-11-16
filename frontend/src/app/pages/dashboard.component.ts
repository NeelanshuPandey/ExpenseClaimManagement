import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ApiService, Claim } from '../core/api.service';

@Component({  
standalone: true, imports: [CommonModule, CurrencyPipe, DatePipe, RouterLink], template: `
<ng-container *ngIf="isManager; else employeeDashboard">
 <div class="page-heading manager-heading">
    <div>
    <span class="eyebrow">MANAGER OVERVIEW</span>
    <h1>Expense Approval Dashboard</h1>
    </div>
    <a routerLink="/claims" class="primary link-button">Review pending →</a>
    </div>
 <div *ngIf="error" class="notice error-notice" role="alert">{{error}}</div>
    <div *ngIf="loading" class="content-card empty-state" aria-live="polite">Loading dashboard…</div>
 <ng-container *ngIf="!loading">
  <div class="manager-stats">
   <article class="manager-stat">
    <div>
    <span>Pending approvals</span>
    <i class="manager-stat-icon amber">◷</i>
    </div>
    <strong>{{pending}}</strong>
    <small>Awaiting your review</small>
    </article>
   <article class="manager-stat">
    <div>
    <span>Total requests</span>
    <i class="manager-stat-icon violet">▤</i>
    </div>
    <strong>{{total}}</strong>
    <small>Requests assigned to you</small>
    </article>
   <article class="manager-stat">
    <div>
    <span>Total amount</span>
    <i class="manager-stat-icon green">₹</i>
    </div>
    <strong>{{totalAmount|currency:'INR':'symbol':'1.0-0'}}</strong>
    <small>Across all requests</small>
    </article>
   <article class="manager-stat">
    <div>
    <span>Approved amount</span>
    <i class="manager-stat-icon green">✓</i>
    </div>
    <strong>{{approvedAmount|currency:'INR':'symbol':'1.0-0'}}</strong>
    <small>{{approved}} approved requests</small>
    </article>
   <article class="manager-stat">
    <div>
    <span>Rejected amount</span>
    <i class="manager-stat-icon rose">×</i>
    </div>
    <strong>{{rejectedAmount|currency:'INR':'symbol':'1.0-0'}}</strong>
    <small>{{rejected}} rejected requests</small>
    </article>
  </div>
  <div class="manager-dashboard-grid">
   <section class="content-card trend-card">
    <div class="card-heading">
    <div>
    <h3>Expense overview</h3>
    <p class="muted">Submitted amount by day</p>
    </div>
    <span class="trend-period">Recent activity</span>
    </div>
    <div class="chart-area">
    <div class="chart-y-labels">
    <span>{{chartMax|currency:'INR':'symbol':'1.0-0'}}</span>
    <span>{{chartMax/2|currency:'INR':'symbol':'1.0-0'}}</span>
    <span>₹0</span>
    </div>
    <svg viewBox="0 0 600 190" preserveAspectRatio="none" role="img" aria-label="Claim amounts over recent days">
    <line x1="0" y1="15" x2="600" y2="15"/>
    <line x1="0" y1="95" x2="600" y2="95"/>
    <line x1="0" y1="175" x2="600" y2="175"/>
    <polygon [attr.points]="chartAreaPoints"/>
    <polyline [attr.points]="chartPoints"/>
    <circle *ngFor="let point of chartPointList" [attr.cx]="point.x" [attr.cy]="point.y" r="3.4"/>
    </svg>
    </div>
    <div class="chart-x-labels">
    <span *ngFor="let label of chartLabels">{{label|date:'MMM d'}}</span>
    </div>
   </section>
   <section class="content-card status-card">
    <div class="card-heading">
    <div>
    <h3>Requests by status</h3>
    <p class="muted">All assigned requests</p>
    </div>
    </div>
    <div class="status-chart-row">
    <div class="donut manager-donut" [style.background]="donut">
    <div class="donut-center">
    <strong>{{total}}</strong>
    <small>Total</small>
    </div>
    </div>
    <div class="manager-legend">
    <div>
    <i class="dot pending-dot">
    </i>
    <span>Pending</span>
    <strong>{{pending}} <small>({{percent(pending)}}%)</small>
    </strong>
    </div>
    <div>
    <i class="dot approved-dot">
    </i>
    <span>Approved</span>
    <strong>{{approved}} <small>({{percent(approved)}}%)</small>
    </strong>
    </div>
    <div>
    <i class="dot rejected-dot">
    </i>
    <span>Rejected</span>
    <strong>{{rejected}} <small>({{percent(rejected)}}%)</small>
    </strong>
    </div>
    </div>
    </div>
    </section>
   <section class="content-card manager-recent">
    <div class="card-heading">
    <div>
    <h3>Recent requests</h3>
    <p class="muted">Latest submissions</p>
    </div>
    <a routerLink="/claims" class="text-link">View all →</a>
    </div>
    <div *ngIf="!recent.length" class="empty-state">No requests yet</div>
    <div class="recent-request" *ngFor="let c of recent">
    <div class="avatar small">{{initials(c.employeeName)}}</div>
    <div class="recent-request-info">
    <strong>{{c.employeeName}}</strong>
    <small>{{c.title}} · {{c.expenseDate|date:'MMM d'}}</small>
    </div>
    <div class="recent-request-value">
    <strong>{{c.amount|currency:'INR':'symbol':'1.2-2'}}</strong>
    <span class="status" [ngClass]="c.status.toLowerCase()">{{c.status}}</span>
    </div>
    </div>
    </section>
   <section class="content-card pending-table-card">
    <div class="card-heading">
    <div>
    <h3>Pending approvals</h3>
    <p class="muted">Requests waiting for your decision</p>
    </div>
    <a routerLink="/claims" class="secondary small-btn">All requests</a>
    </div>
    <div *ngIf="!pendingClaims.length" class="empty-state">You're all caught up. No pending approvals.</div>
    <div class="table-wrap" *ngIf="pendingClaims.length">
    <table>
    <thead>
    <tr>
    <th>REQUEST</th>
    <th>EMPLOYEE</th>
    <th>TYPE</th>
    <th>DATE</th>
    <th>AMOUNT</th>
    <th>STATUS</th>
    <th>
    </th>
    </tr>
    </thead>
    <tbody>
    <tr *ngFor="let c of pendingClaims">
    <td>
    <strong>#{{c.id}}</strong>
    <small class="table-sub">{{c.title}}</small>
    </td>
    <td>
    <div class="user-cell">
    <div class="avatar small">{{initials(c.employeeName)}}</div>
    <strong>{{c.employeeName}}</strong>
    </div>
    </td>
    <td>
    <span class="category-pill">{{c.category}}</span>
    </td>
    <td>{{c.expenseDate|date:'MMM d, y'}}</td>
    <td class="amount">{{c.amount|currency:'INR':'symbol':'1.2-2'}}</td>
    <td>
    <span class="status pending">Pending</span>
    </td>
    <td>
    <a routerLink="/claims" class="table-action">Review →</a>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
    </section>
  </div>
 </ng-container>
</ng-container>
<ng-template #employeeDashboard>
 <div class="page-heading">
    <div>
    <span class="eyebrow">OVERVIEW</span>
    <h1>Good day, {{firstName}} <span class="wave">✦</span>
    </h1>
    <p class="muted">Here is a snapshot of your expense activity.</p>
    </div>
    <a routerLink="/new-claim" class="primary link-button">＋ New expense</a>
    </div>
 <div *ngIf="error" class="notice error-notice" role="alert">{{error}}</div>
    <div *ngIf="loading" class="content-card empty-state" aria-live="polite">Loading dashboard…</div>
 <ng-container *ngIf="!loading">
    <div class="stat-grid employee-stats">
    <article class="stat-card">
    <div class="stat-top">
    <span>Total claims</span>
    <span class="stat-icon violet">▤</span>
    </div>
    <strong>{{total}}</strong>
    <small>All submitted expenses</small>
    </article>
    <article class="stat-card">
    <div class="stat-top">
    <span>Pending review</span>
    <span class="stat-icon amber">◷</span>
    </div>
    <strong>{{pending}}</strong>
    <small>Awaiting a decision</small>
    </article>
    <article class="stat-card">
    <div class="stat-top">
    <span>Approved</span>
    <span class="stat-icon green">✓</span>
    </div>
    <strong>{{approved}}</strong>
    <small>Claims approved</small>
    </article>
    <article class="stat-card rejected-card">
    <div class="stat-top">
    <span>Rejected</span>
    <span class="stat-icon rose">!</span>
    </div>
    <strong>{{rejected}}</strong>
    <small>Claims declined</small>
    </article>
    <article class="stat-card">
    <div class="stat-top">
    <span>Approved amount</span>
    <span class="stat-icon green">₹</span>
    </div>
    <strong>{{approvedAmount|currency:'INR':'symbol':'1.0-0'}}</strong>
    <small>Total reimbursable</small>
    </article>
    </div>
 <div class="dashboard-grid">
    <section class="content-card recent-card">
    <div class="card-heading">
    <div>
    <h3>Recent claims</h3>
    <p class="muted">Your latest expense activity</p>
    </div>
    <a routerLink="/claims" class="text-link">View all →</a>
    </div>
    <div *ngIf="recent.length===0" class="empty-state">
    <span class="empty-icon">▤</span>
    <strong>No claims yet</strong>
    <p>Your submitted claims will appear here.</p>
    <a routerLink="/new-claim" class="text-link">Create your first claim →</a>
    </div>
    <div class="table-wrap" *ngIf="recent.length">
    <table>
    <thead>
    <tr>
    <th>EXPENSE</th>
    <th>DATE</th>
    <th>AMOUNT</th>
    <th>STATUS</th>
    </tr>
    </thead>
    <tbody>
    <tr *ngFor="let c of recent">
    <td>
    <strong>{{c.title}}</strong>
    <small class="table-sub">{{c.category}}</small>
    </td>
    <td>{{c.expenseDate|date:'d MMM yyyy'}}</td>
    <td class="amount">{{c.amount|currency:'INR':'symbol':'1.2-2'}}</td>
    <td>
    <span class="status" [ngClass]="c.status.toLowerCase()">{{c.status}}</span>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
    </section>
    <section class="content-card insight-card">
    <div class="card-heading">
    <div>
    <h3>Claim status</h3>
    <p class="muted">Your submission breakdown</p>
    </div>
    <span class="stat-icon violet">◉</span>
    </div>
    <div class="donut" [style.background]="donut">
    <div class="donut-center">
    <strong>{{total}}</strong>
    <small>Total claims</small>
    </div>
    </div>
    <div class="legend">
    <div>
    <i class="dot pending-dot">
    </i> Pending <strong>{{pending}}</strong>
    </div>
    <div>
    <i class="dot approved-dot">
    </i> Approved <strong>{{approved}}</strong>
    </div>
    <div>
    <i class="dot rejected-dot">
    </i> Rejected <strong>{{rejected}}</strong>
    </div>
    </div>
    </section>
    </div>
    </ng-container>
</ng-template>
`})
export class DashboardComponent implements OnInit {
  isManager = false;
  firstName = 'there';
  total = 0;
  pending = 0;
  approved = 0;
  rejected = 0;
  approvedAmount = 0;
  rejectedAmount = 0;
  totalAmount = 0;
  recent: Claim[] = [];
  pendingClaims: Claim[] = [];
  loading = true;
  error = '';
  chartPoints = '';
  chartAreaPoints = '';
  chartPointList: { x: number; y: number }[] = [];
  chartLabels: Date[] = [];
  chartMax = 1;

  constructor(public auth: AuthService, private api: ApiService) {}

  get donut(): string {
    const total = this.total || 1;
    const pendingEnd = (this.pending / total) * 100;
    const approvedEnd = (this.approved / total) * 100 + pendingEnd;

    return `conic-gradient(#f0b94d 0 ${pendingEnd}%, #218b69 ${pendingEnd}% ${approvedEnd}%, #d95d66 ${approvedEnd}% 100%)`;
  }

  percent(value: number): number {
    return this.total ? Math.round((value / this.total) * 100) : 0;
  }

  ngOnInit(): void {
    const session = this.auth.session();
    this.isManager = session?.role === 'MANAGER';
    this.firstName = (session?.fullName || 'there').split(' ')[0];
    this.load();
  }

  initials(name: string): string {
    return (name || 'U')
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  private buildChart(claims: Claim[]): void {
    const totalsByDate = new Map<string, number>();

    for (const claim of claims) {
      const date = claim.expenseDate;
      const currentTotal = totalsByDate.get(date) || 0;
      totalsByDate.set(date, currentTotal + Number(claim.amount));
    }

    const recentDays = [...totalsByDate.entries()]
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .slice(-8);

    if (recentDays.length === 0) {
      this.chartLabels = [];
      this.chartPoints = '';
      this.chartAreaPoints = '0,175 600,175';
      this.chartPointList = [];
      return;
    }

    this.chartLabels = recentDays.map(([date]) => new Date(`${date}T00:00:00`));
    this.chartMax = Math.max(...recentDays.map(([, amount]) => amount), 1) * 1.15;

    this.chartPointList = recentDays.map(([, amount], index) => ({
      x: recentDays.length === 1 ? 300 : (index * 600) / (recentDays.length - 1),
      y: 175 - (amount / this.chartMax) * 160,
    }));

    this.chartPoints = this.chartPointList
      .map(({ x, y }) => `${x},${y}`)
      .join(' ');
    this.chartAreaPoints = `0,175 ${this.chartPoints} 600,175`;
  }

  load(): void {
    const request = this.isManager ? this.api.all(0, 500) : this.api.mine(0, 500);

    request.subscribe({
      next: (result) => {
        const claims = result.content || [];

        this.recent = claims.slice(0, 4);
        this.total = result.totalElements ?? claims.length;
        this.pending = claims.filter((claim) => claim.status === 'PENDING').length;
        this.approved = claims.filter((claim) => claim.status === 'APPROVED').length;
        this.rejected = claims.filter((claim) => claim.status === 'REJECTED').length;
        this.totalAmount = claims.reduce((sum, claim) => sum + Number(claim.amount), 0);
        this.approvedAmount = claims
          .filter((claim) => claim.status === 'APPROVED')
          .reduce((sum, claim) => sum + Number(claim.amount), 0);
        this.rejectedAmount = claims
          .filter((claim) => claim.status === 'REJECTED')
          .reduce((sum, claim) => sum + Number(claim.amount), 0);
        this.pendingClaims = claims
          .filter((claim) => claim.status === 'PENDING')
          .slice(0, 5);

        if (this.isManager) this.buildChart(claims);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Could not load dashboard claims. Check your connection and try again.';
      },
    });
  }
}
