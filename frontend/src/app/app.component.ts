import { Component } from '@angular/core'; import { DatePipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive,DatePipe],template:`
@if(auth.session(); as s){
<div class="app-shell"><aside class="sidebar"><a class="brand" [routerLink]="s.role==='MANAGER'?'/manager':'/employee'"><span class="brand-mark">E</span><span>expensely<small>CLAIM MANAGEMENT</small></span></a>
<div class="side-caption">WORKSPACE</div>
<a class="side-link" routerLink="/employee" routerLinkActive="active" [class.hidden]="s.role!=='EMPLOYEE'"><span>▦</span> Overview</a>
<a class="side-link" routerLink="/manager" routerLinkActive="active" [class.hidden]="s.role!=='MANAGER'"><span>▦</span> Overview</a>
<a class="side-link" routerLink="/claims" routerLinkActive="active"><span>▤</span>{{s.role==='MANAGER'?'Review claims':'My claims'}}</a>
<a class="side-link" routerLink="/new-claim" routerLinkActive="active" [class.hidden]="s.role!=='EMPLOYEE'"><span>＋</span> New expense</a>
<a class="side-link" routerLink="/users" routerLinkActive="active" [class.hidden]="s.role!=='MANAGER'"><span>♙</span> Employees</a>
<div class="sidebar-bottom"><div class="help-card"><strong>Need a hand?</strong><p>Contact your finance administrator for help with reimbursements.</p></div><div class="profile"><div class="avatar">{{initials(s.fullName)}}</div><div class="profile-info"><strong>{{s.fullName}}</strong><small>{{s.role==='MANAGER'?'Manager':'Employee'}}</small></div></div><button class="logout-button" (click)="auth.logout();router.navigateByUrl('/login')"><span>↪</span> Sign out</button></div></aside>
<div class="main-area"><header class="topbar"><div><span class="eyebrow">{{s.role==='MANAGER'?'MANAGER PORTAL':'EMPLOYEE PORTAL'}}</span><div class="top-title">Expense workspace</div></div><div class="top-actions"><span class="today">{{today | date:'EEE, d MMM yyyy'}}</span><div class="avatar small">{{initials(s.fullName)}}</div></div></header><main class="page-content"><router-outlet/></main></div></div>
}@else{<router-outlet/>}`})
export class AppComponent {today=new Date();constructor(public auth:AuthService,public router:Router){} initials(name:string){return (name||'U').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();}}
