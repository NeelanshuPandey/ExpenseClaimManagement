import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({standalone:true,imports:[FormsModule,CommonModule],template:`
<div class="login-page"><div class="login-art"><div class="login-brand"><span class="brand-mark">E</span> expensely</div><div class="art-copy"><span class="eyebrow light">SMARTER EXPENSE MANAGEMENT</span><h1>Every expense.<br><em>In its right place.</em></h1><p>Submit, track and manage reimbursements with clarity and confidence.</p><div class="art-stats"><div><strong>Simple</strong><small>Claim submission</small></div><div><strong>Clear</strong><small>Approval tracking</small></div><div><strong>Secure</strong><small>Role-based access</small></div></div></div><div class="art-foot">A better way to manage work expenses.</div></div>
<div class="login-panel"><div class="login-box"><span class="eyebrow">WELCOME BACK</span><h2>Sign in to your account</h2><p class="muted">Enter your details to continue to your workspace.</p>
<form (ngSubmit)="login()"><label>Email address<input name="email" type="email" [(ngModel)]="email" placeholder="you@company.com" required></label><label>Password<input name="password" type="password" [(ngModel)]="password" placeholder="Enter your password" required minlength="8"></label><p class="error" *ngIf="loginError">{{loginError}}</p><button class="primary full" [disabled]="busy">{{busy?'Signing in…':'Sign in →'}}</button></form>
<div class="login-divider"><span>NEW TO EXPENSELY?</span></div><button type="button" class="secondary full" (click)="showRegister=!showRegister">{{showRegister?'Hide registration':'Create employee account'}}</button>
<form class="register-form" *ngIf="showRegister" (ngSubmit)="register()"><label>Full name<input name="name" [(ngModel)]="name" required minlength="2"></label><label>Work email<input name="newEmail" type="email" [(ngModel)]="newEmail" required></label><label>Password<input name="newPassword" type="password" [(ngModel)]="newPassword" minlength="8" required></label><p class="error" *ngIf="registerError">{{registerError}}</p><button class="primary full" [disabled]="busy">{{busy?'Creating account…':'Create account'}}</button></form>
<p class="login-note">By continuing, you agree to your organization's expense policy.</p></div></div></div>`,styles:[`:host{display:block}.register-form{margin-top:18px}`]})
export class LoginComponent {
 email='';password='';name='';newEmail='';newPassword='';loginError='';registerError='';busy=false;showRegister=false;
 constructor(private auth:AuthService,private router:Router){}
 private errorMessage(e:any,action:string){return e.status===0?'Cannot reach the API. Make sure PostgreSQL and the backend are running, then try again.':e.error?.error||`Unable to ${action}. Check the details and try again.`;}
 login(){this.busy=true;this.loginError='';this.auth.login({email:this.email.trim(),password:this.password}).subscribe({next:s=>this.router.navigateByUrl(s.role==='MANAGER'?'/manager':'/employee'),error:e=>{this.loginError=this.errorMessage(e,'sign in');this.busy=false;}});}
 register(){this.busy=true;this.registerError='';this.auth.register({fullName:this.name.trim(),email:this.newEmail.trim(),password:this.newPassword}).subscribe({next:s=>this.router.navigateByUrl(s.role==='MANAGER'?'/manager':'/employee'),error:e=>{this.registerError=this.errorMessage(e,'create account');this.busy=false;}});}
}
