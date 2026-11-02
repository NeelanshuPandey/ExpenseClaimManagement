import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Claim { id:number; title:string; amount:number; category:string; expenseDate:string; description:string; status:'PENDING'|'APPROVED'|'REJECTED'; employeeId:number; employeeName:string; employeeEmail:string; managerId:number; managerName:string; managerEmail:string; managerComment?:string; receiptFileName?:string; createdAt:string; updatedAt:string; }
export interface ManagerOption {id:number;fullName:string;email:string;}
export interface PageResult<T> { content:T[]; totalElements:number; totalPages:number; number:number; size:number; }
export interface AuditItem {actor:string;action:string;details:string;happenedAt:string;}
const API='/api';
@Injectable({providedIn:'root'})
export class ApiService {
 constructor(private http:HttpClient){}
 mine(page=0,size=10,status='',search=''):Observable<PageResult<Claim>> {let p=new HttpParams().set('page',page).set('size',size).set('sort','createdAt,desc');if(status)p=p.set('status',status);if(search)p=p.set('search',search);return this.http.get<PageResult<Claim>>(API+'/claims/mine',{params:p});}
 all(page=0,size=10,status='',employee='',from='',to=''):Observable<PageResult<Claim>> {let p=new HttpParams().set('page',page).set('size',size).set('sort','createdAt,desc');if(status)p=p.set('status',status);if(employee)p=p.set('employee',employee);if(from)p=p.set('from',from);if(to)p=p.set('to',to);return this.http.get<PageResult<Claim>>(API+'/manager/claims',{params:p});}
 exportClaims(status='',employee='',from='',to=''){let p=new HttpParams();if(status)p=p.set('status',status);if(employee)p=p.set('employee',employee);if(from)p=p.set('from',from);if(to)p=p.set('to',to);return this.http.get(`${API}/manager/claims/export.csv`,{params:p,responseType:'blob'});}
 create(data:any){return this.http.post<Claim>(API+'/claims',data);}
 update(id:number,data:any){return this.http.put<Claim>(`${API}/claims/${id}`,data);}
 delete(id:number){return this.http.delete(`${API}/claims/${id}`);}
 review(id:number,decision:'APPROVED'|'REJECTED',comment:string){return this.http.patch<Claim>(`${API}/manager/claims/${id}/review`,{decision,comment});}
 timeline(id:number){return this.http.get<AuditItem[]>(`${API}/claims/${id}/timeline`);}
 uploadReceipt(id:number,file:File){const body=new FormData();body.append('file',file);return this.http.post<Claim>(`${API}/claims/${id}/receipt`,body);}
 receipt(id:number){return this.http.get(`${API}/claims/${id}/receipt`,{responseType:'blob'});}
 managers(){return this.http.get<ManagerOption[]>(API+'/claims/managers');}
 users(){return this.http.get<any[]>(API+'/manager/users');}
 setUserActive(id:number,value:boolean){return this.http.patch<any>(`${API}/manager/users/${id}/active`,null,{params:{value}});}
}
