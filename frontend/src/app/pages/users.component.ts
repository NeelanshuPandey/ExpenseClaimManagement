import { Component, OnInit } from '@angular/core'; import { CommonModule } from '@angular/common'; import { ApiService } from '../core/api.service';
@Component({  
standalone: true, imports: [CommonModule], template: `<div class="page-heading">
    <div>
    <span class="eyebrow">TEAM ADMINISTRATION</span>
    <h1>Employees</h1>
    <p class="muted">Manage employee access to the expense workspace.</p>
    </div>
    <button class="secondary" (click)="load()">↻ Refresh</button>
    </div>
    <section class="content-card">
    <div class="card-heading">
    <div>
    <h3>Team members</h3>
    <p class="muted">{{users.length}} accounts</p>
    </div>
    </div>
    <div class="notice" *ngIf="message">{{message}}</div>
    <div class="table-wrap">
    <table>
    <thead>
    <tr>
    <th>EMPLOYEE</th>
    <th>EMAIL</th>
    <th>ROLE</th>
    <th>ACCESS</th>
    <th class="right">ACTION</th>
    </tr>
    </thead>
    <tbody>
    <tr *ngFor="let u of users">
    <td>
    <div class="user-cell">
    <span class="avatar">{{initials(u.fullName)}}</span>
    <strong>{{u.fullName}}</strong>
    </div>
    </td>
    <td>{{u.email}}</td>
    <td>{{u.role}}</td>
    <td>
    <span class="status" [class.approved]="u.active" [class.rejected]="!u.active">{{u.active?'ACTIVE':'INACTIVE'}}</span>
    </td>
    <td class="right">
    <button class="table-action" [class.danger-text]="u.active" (click)="toggle(u)">{{u.active?'Deactivate':'Activate'}}</button>
    </td>
    </tr>
    <tr *ngIf="users.length===0">
    <td colspan="5" class="empty-state">No users found.</td>
    </tr>
    </tbody>
    </table>
    </div>
    </section>`})
export class UsersComponent implements OnInit {
  users: any[] = [];
  message = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.api.users().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: () => {
        this.message = 'Could not load users.';
      },
    });
  }

  initials(name: string): string {
    return (name || 'U')
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  toggle(user: any): void {
    this.api.setUserActive(user.id, !user.active).subscribe({
      next: () => {
        const action = user.active ? 'deactivated' : 'activated';
        this.message = `${user.fullName} account ${action}.`;
        this.load();
      },
      error: () => {
        this.message = 'Could not update account access.';
      },
    });
  }
}
