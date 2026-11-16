import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ApiService, Claim, AuditItem, ManagerOption } from '../core/api.service';

@Component({  
standalone: true, imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe], template: `
<div class="page-heading">
    <div>
    <span class="eyebrow">{{isManager?'TEAM WORKSPACE':'EXPENSE WORKSPACE'}}</span>
    <h1>{{isManager?'Review claims':'My expense claims'}}</h1>
    <p class="muted">{{isManager?'Review the claims employees submitted to you.':'Manage your submissions and follow their approval status.'}}</p>
    </div>
    <button *ngIf="!isManager" class="primary" (click)="showForm=!showForm">＋ New expense</button>
    </div>

<section class="content-card form-card" *ngIf="showForm">
    <div class="card-heading">
    <div>
    <h3>{{editing?'Edit expense':'Submit a new expense'}}</h3>
    <p class="muted">Add expense details, choose the manager, and attach a receipt.</p>
    </div>
    <button type="button" class="icon-btn" aria-label="Close form" (click)="cancelForm()">✕</button>
    </div>
<form class="claim-form" #claimForm="ngForm" (ngSubmit)="save(claimForm)" novalidate>
 <label>Expense title<input name="title" [(ngModel)]="form.title" #title="ngModel" placeholder="e.g. Client meeting travel" maxlength="180" required>
    <small class="field-error" *ngIf="title.invalid&&title.touched">Enter a title (up to 180 characters).</small>
    </label>
 <label>Category<select name="category" [(ngModel)]="form.category" required>
    <option value="Travel">Travel</option>
    <option value="Meals">Meals &amp; entertainment</option>
    <option value="Accommodation">Accommodation</option>
    <option value="Office Supplies">Office supplies</option>
    <option value="Software">Software &amp; subscriptions</option>
    <option value="Communication">Communication</option>
    <option value="Other">Other</option>
    </select>
    </label>
 <label>Amount (₹)<input name="amount" type="number" min="0.01" step="0.01" [(ngModel)]="form.amount" #amount="ngModel" placeholder="0.00" required>
    <small class="field-error" *ngIf="amount.invalid&&amount.touched">Amount must be greater than zero.</small>
    </label>
 <label>Expense date<input name="expenseDate" type="date" [(ngModel)]="form.expenseDate" #expenseDate="ngModel" [max]="today" required>
    <small class="field-error" *ngIf="expenseDate.invalid&&expenseDate.touched">Choose a valid expense date.</small>
    </label>
 <label class="span-two">Description<textarea name="description" [(ngModel)]="form.description" rows="3" maxlength="2000" placeholder="Add a short explanation for this expense">
    </textarea>
    </label>
 <label class="span-two">Receipt <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" (change)="selectReceipt($event)">
    <small class="muted">PDF, PNG, JPEG, or WebP · maximum 5 MB. {{selectedFile?.name||'Optional'}}</small>
    </label>
 <div *ngIf="message" class="notice span-two" [class.error-notice]="isError" role="alert">{{message}}</div>
 <div class="form-actions span-two">
    <span class="muted">Only your own pending claims can be edited or deleted.</span>
    <button type="button" class="secondary" [disabled]="busy" (click)="cancelForm()">Cancel</button>
    <button class="primary" [disabled]="busy">{{busy?'Sending…':'Send to manager →'}}</button>
    </div>
</form>
    </section>

<section class="content-card">
    <div class="filter-bar">
    <div class="search-box">
    <span>⌕</span>
    <input [(ngModel)]="search" (ngModelChange)="page=0;load()" [placeholder]="isManager?'Search employee name or email…':'Search expense title…'">
    </div>
    <select [(ngModel)]="status" (ngModelChange)="page=0;load()">
    <option value="">All statuses</option>
    <option value="PENDING">Pending</option>
    <option value="APPROVED">Approved</option>
    <option value="REJECTED">Rejected</option>
    </select>
    <ng-container *ngIf="isManager">
    <label class="date-filter">From<input type="date" [(ngModel)]="dateFrom" (ngModelChange)="page=0;load()">
    </label>
    <label class="date-filter">To<input type="date" [(ngModel)]="dateTo" (ngModelChange)="page=0;load()">
    </label>
    <button class="secondary csv-button" [disabled]="exporting||loading" (click)="exportCsv()">{{exporting?'Exporting…':'↓ Export CSV'}}</button>
    </ng-container>
    <span class="result-count">{{total}} claims</span>
    </div>
<div *ngIf="message&&!showForm" class="notice" [class.error-notice]="isError" role="alert">{{message}}</div>
    <div *ngIf="loading" class="empty-state" aria-live="polite">Loading claims…</div>
<div class="table-wrap" *ngIf="!loading">
    <table>
    <thead>
    <tr>
    <th>EXPENSE</th>
    <th *ngIf="isManager">EMPLOYEE</th>
    <th>DATE</th>
    <th>AMOUNT</th>
    <th>STATUS</th>
    <th>RECEIPT</th>
    <th class="right">ACTIONS</th>
    </tr>
    </thead>
    <tbody>
<tr *ngFor="let c of claims">
    <td>
    <strong>{{c.title}}</strong>
    <small class="table-sub">{{c.category}} · #{{c.id}}<span *ngIf="!isManager&&c.managerName"> · To {{c.managerName}}</span>
    </small>
    </td>
    <td *ngIf="isManager">
    <strong>{{c.employeeName}}</strong>
    <small class="table-sub">{{c.employeeEmail}}</small>
    </td>
    <td>{{c.expenseDate|date:'d MMM yyyy'}}</td>
    <td class="amount">{{c.amount|currency:'INR':'symbol':'1.2-2'}}</td>
    <td>
    <span class="status" [ngClass]="c.status.toLowerCase()">{{c.status}}</span>
    </td>
    <td>
    <div class="receipt-actions" *ngIf="c.receiptFileName">
    <button class="table-action" (click)="openReceipt(c,false)">View</button>
    <button class="table-action" (click)="openReceipt(c,true)">Download</button>
    </div>
    <span *ngIf="!c.receiptFileName" class="muted">—</span>
    </td>
<td class="right">
    <div class="actions">
    <button class="table-action" (click)="openTimeline(c)">Timeline</button>
    <ng-container *ngIf="!isManager&&c.status==='PENDING'">
    <button class="table-action" (click)="edit(c)">Edit</button>
    <button class="table-action danger-text" (click)="remove(c)">Delete</button>
    </ng-container>
    <ng-container *ngIf="isManager&&c.status==='PENDING'">
    <button class="table-action approve-text" [disabled]="busy" (click)="review(c,'APPROVED')">Approve</button>
    <button class="table-action danger-text" [disabled]="busy" (click)="startReject(c)">Reject</button>
    </ng-container>
    </div>
    </td>
    </tr>
<tr *ngIf="claims.length===0">
    <td [attr.colspan]="isManager?7:6">
    <div class="empty-state">
    <span class="empty-icon">▤</span>
    <strong>{{isManager?'No claims assigned to you yet':'No matching claims'}}</strong>
    <p>{{isManager?'Claims submitted to you will appear here.':'Try changing your search or filters.'}}</p>
    </div>
    </td>
    </tr>
    </tbody>
    </table>
    </div>
<div class="pagination">
    <span>Page {{page+1}} of {{pages||1}}</span>
    <div>
    <button class="secondary small-btn" [disabled]="page===0" (click)="changePage(-1)">Previous</button>
    <button class="secondary small-btn" [disabled]="page+1>=pages" (click)="changePage(1)">Next</button>
    </div>
    </div>
    </section>

<div class="modal-backdrop" *ngIf="activeClaim">
    <section class="modal-card">
    <div class="card-heading">
    <div>
    <span class="eyebrow">CLAIM #{{activeClaim.id}}</span>
    <h3>{{modalTitle}}</h3>
    </div>
    <button class="icon-btn" (click)="closeModal()">✕</button>
    </div>
    <div *ngIf="modalMode==='timeline'">
    <div *ngIf="timelineLoading" class="empty-state">Loading activity…</div>
    <div *ngIf="!timelineLoading&&timeline.length===0" class="empty-state">No timeline events found.</div>
    <div class="timeline">
    <div class="timeline-item" *ngFor="let item of timeline">
    <i>
    </i>
    <div>
    <strong>{{item.action}}</strong>
    <p>{{item.details}}</p>
    <small>{{item.actor}} · {{item.happenedAt|date:'d MMM yyyy, h:mm a'}}</small>
    </div>
    </div>
    </div>
    </div>
    <div *ngIf="modalMode==='reject'">
    <p class="muted">A rejection reason is required and will be visible to the employee.</p>
    <label>Reason for rejection<textarea rows="4" [(ngModel)]="rejectComment" #comment="ngModel" required maxlength="1000" placeholder="Explain what needs to be corrected…">
    </textarea>
    <small class="field-error" *ngIf="comment.invalid&&comment.touched">Enter a rejection reason.</small>
    </label>
    <div class="form-actions">
    <button class="secondary" (click)="closeModal()">Cancel</button>
    <button class="primary danger-button" [disabled]="!rejectComment.trim()||busy" (click)="confirmReject()">{{busy?'Submitting…':'Confirm rejection'}}</button>
    </div>
    </div>
    </section>
    </div>
<div class="modal-backdrop" *ngIf="managerPickerOpen">
    <section class="modal-card manager-picker">
    <div class="card-heading">
    <div>
    <span class="eyebrow">ROUTE CLAIM</span>
    <h3>Choose a manager</h3>
    <p class="muted">Only the manager you select will see and review this claim.</p>
    </div>
    <button class="icon-btn" [disabled]="busy" (click)="managerPickerOpen=false">✕</button>
    </div>
    <div *ngIf="managersLoading" class="empty-state">Loading managers…</div>
    <div *ngIf="!managersLoading&&!managers.length" class="empty-state">No active managers are available. Please contact your administrator.</div>
    <label class="manager-option" *ngFor="let manager of managers" [class.selected]="chosenManagerId===manager.id">
    <input type="radio" name="chosenManager" [value]="manager.id" [(ngModel)]="chosenManagerId">
    <span class="manager-avatar">{{manager.fullName.charAt(0).toUpperCase()}}</span>
    <span class="manager-details">
    <strong>{{manager.fullName}}</strong>
    <small>{{manager.email}}</small>
    </span>
    <span class="manager-check">✓</span>
    </label>
    <div *ngIf="message" class="notice" [class.error-notice]="isError" role="alert">{{message}}</div>
    <div class="form-actions">
    <button class="secondary" [disabled]="busy" (click)="managerPickerOpen=false">Back to claim</button>
    <button class="primary" [disabled]="busy||managersLoading||!chosenManagerId" (click)="sendToManager()">{{busy?'Sending…':editing?'Send changes':'Send claim'}}</button>
    </div>
    </section>
    </div>
`})
export class ClaimsComponent implements OnInit {
  isManager=false; showForm=false; editing=0; today=this.localToday();
  form: any={ title: '', amount: null, category: 'Travel', expenseDate: this.today, description: '', managerId: null };
  managers: ManagerOption[]=[]; managersLoading=false; selectedFile: File|null=null; managerPickerOpen=false; chosenManagerId: number|null=null; exporting=false;
  claims: Claim[]=[]; loading=false; busy=false; message=''; isError=false; search=''; status=''; page=0; pages=1; total=0;
  activeClaim: Claim|null=null; modalMode: 'timeline'|'reject'='timeline'; timeline: AuditItem[]=[]; timelineLoading=false; rejectComment=''; dateFrom=''; dateTo='';
  constructor(private api: ApiService, auth: AuthService, route: ActivatedRoute) { this.isManager=auth.session()?.role==='MANAGER'; this.showForm=route.snapshot.data['createMode']===true; }
  get modalTitle() { return this.modalMode==='reject'? 'Reject claim':'Activity timeline'; }
  private localToday() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  ngOnInit() { if (!this.isManager) this.loadManagers(); this.load(); }
  loadManagers() { this.managersLoading=true; this.api.managers().subscribe({ next: r => { this.managers=r; this.managersLoading=false; }, error: e => { this.managersLoading=false; this.setMessage(e.error?.error||'Could not load managers. Please try again.', true); } }); }
  load() { if (this.isManager&&this.dateFrom&&this.dateTo&&this.dateFrom>this.dateTo) { this.setMessage('The start date must be on or before the end date.', true); return; } this.loading=true; const req=this.isManager? this.api.all(this.page, 10, this.status, this.search, this.dateFrom, this.dateTo):this.api.mine(this.page, 10, this.status, this.search); req.subscribe({ next: r => { this.claims=r.content||[]; this.pages=r.totalPages||1; this.total=r.totalElements||0; this.loading=false; }, error: e => { this.loading=false; this.setMessage(e.error?.error||'Could not load claims. Check the backend connection.', true); } }); }
  changePage(delta: number) { this.page+=delta; this.load(); }
  exportCsv() { this.exporting=true; this.api.exportClaims(this.status, this.search, this.dateFrom, this.dateTo).subscribe({ next: blob => { const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='expense-claims.csv'; a.click(); URL.revokeObjectURL(url); this.exporting=false; }, error: e => { this.exporting=false; this.setMessage(e.error?.error||'Could not export claims. Please try again.', true); } }); }
  selectReceipt(event: Event) { const input=event.target as HTMLInputElement; const file=input.files?.[0]||null; if (!file) { this.selectedFile=null; return; } const allowed=['application/pdf', 'image/png', 'image/jpeg', 'image/webp']; if (!allowed.includes(file.type)) { this.selectedFile=null; input.value=''; this.setMessage('Choose a PDF, PNG, JPEG, or WebP receipt.', true); return; } if (file.size>5*1024*1024) { this.selectedFile=null; input.value=''; this.setMessage('Receipt must be 5 MB or smaller.', true); return; } this.selectedFile=file; this.message=''; }
  save(formRef: NgForm) { formRef.control.markAllAsTouched(); if (formRef.invalid) { this.setMessage('Check the highlighted fields before sending this claim.', true); return; } if (this.managersLoading) { this.setMessage('Please wait while the manager list loads.', true); return; } if (!this.managers.length) { this.setMessage('No active managers are available. Please contact your administrator.', true); return; } this.chosenManagerId=null; this.managerPickerOpen=true; this.message=''; }
  sendToManager() { if (!this.chosenManagerId) { this.setMessage('Choose a manager to receive this claim.', true); return; } this.busy=true; this.message=''; const payload={ ...this.form, managerId: Number(this.chosenManagerId), amount: Number(this.form.amount) }; const wasEditing=!!this.editing; const request=wasEditing? this.api.update(this.editing, payload):this.api.create(payload); request.subscribe({ next: claim => { if (this.selectedFile) { this.api.uploadReceipt(claim.id, this.selectedFile).subscribe({ next: () => this.finishSave(wasEditing), error: e => { this.busy=false; this.setMessage(`Claim saved, but receipt upload failed: ${e.error?.error||'please try again.'}`, true); this.editing=claim.id; this.managerPickerOpen=false; this.showForm=true; } }); } else this.finishSave(wasEditing); }, error: e => { this.busy=false; this.setMessage(e.error?.error||'Could not send this claim. Please try again.', true); } }); }
  finishSave(wasEditing: boolean) { this.busy=false; this.managerPickerOpen=false; this.cancelForm(); this.setMessage(wasEditing? 'Claim updated and sent to the selected manager.':'Claim sent to the selected manager.'); this.load(); }
  edit(c: Claim) { this.editing=c.id; this.form={ title: c.title, amount: c.amount, category: c.category, expenseDate: c.expenseDate, description: c.description||'' }; this.showForm=true; this.message=''; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  remove(c: Claim) { if (!confirm(`Delete claim “${c.title}”? This cannot be undone.`)) return; this.busy=true; this.api.delete(c.id).subscribe({ next: () => { this.busy=false; this.setMessage('Claim deleted.'); this.load(); }, error: e => { this.busy=false; this.setMessage(e.error?.error||'Could not delete claim.', true); } }); }
  review(c: Claim, decision: 'APPROVED'|'REJECTED') { if (decision==='APPROVED') { if (!confirm(`Approve ${c.title} for ₹${c.amount}?`)) return; this.busy=true; this.api.review(c.id, decision, '').subscribe({ next: () => { this.busy=false; this.setMessage('Claim approved.'); this.load(); }, error: e => { this.busy=false; this.setMessage(e.error?.error||'Review failed.', true); } }); } else { this.activeClaim=c; this.modalMode='reject'; this.rejectComment=''; } }
  startReject(c: Claim) { this.review(c, 'REJECTED'); }
  confirmReject() { if (!this.activeClaim||!this.rejectComment.trim()) return; this.busy=true; this.api.review(this.activeClaim.id, 'REJECTED', this.rejectComment.trim()).subscribe({ next: () => { this.busy=false; this.closeModal(); this.setMessage('Claim rejected.'); this.load(); }, error: e => { this.busy=false; this.setMessage(e.error?.error||'Could not reject claim.', true); } }); }
  openTimeline(c: Claim) { this.activeClaim=c; this.modalMode='timeline'; this.timeline=[]; this.timelineLoading=true; this.api.timeline(c.id).subscribe({ next: r => { this.timeline=r; this.timelineLoading=false; }, error: e => { this.timelineLoading=false; this.setMessage(e.error?.error||'Could not load claim activity.', true); } }); }
  openReceipt(c: Claim, download: boolean) { this.api.receipt(c.id).subscribe({ next: blob => { const url=URL.createObjectURL(blob); if (download) { const a=document.createElement('a'); a.href=url; a.download=c.receiptFileName||`receipt-${c.id}`; a.click(); } else window.open(url, '_blank', 'noopener'); setTimeout(() => URL.revokeObjectURL(url), 60000); }, error: e => this.setMessage(e.error?.error||'Could not load the receipt.', true) }); }
  closeModal() { this.activeClaim=null; this.timeline=[]; this.rejectComment=''; }
  cancelForm() { this.showForm=false; this.editing=0; this.selectedFile=null; this.form={ title: '', amount: null, category: 'Travel', expenseDate: this.today, description: '' }; this.message=''; }
  setMessage(s: string, error=false) { this.message=s; this.isError=error; }
}
