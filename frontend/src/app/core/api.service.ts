import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Claim {
  id: number;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  managerId: number;
  managerName: string;
  managerEmail: string;
  managerComment?: string;
  receiptFileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManagerOption {
  id: number;
  fullName: string;
  email: string;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface AuditItem {
  actor: string;
  action: string;
  details: string;
  happenedAt: string;
}

const API = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  mine(
    page = 0,
    size = 10,
    status = '',
    search = ''
  ): Observable<PageResult<Claim>> {
    let params = this.pageParams(page, size);

    if (status) params = params.set('status', status);
    if (search) params = params.set('search', search);

    return this.http.get<PageResult<Claim>>(`${API}/claims/mine`, { params });
  }

  all(
    page = 0,
    size = 10,
    status = '',
    employee = '',
    from = '',
    to = ''
  ): Observable<PageResult<Claim>> {
    let params = this.pageParams(page, size);

    if (status) params = params.set('status', status);
    if (employee) params = params.set('employee', employee);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get<PageResult<Claim>>(`${API}/manager/claims`, { params });
  }

  exportClaims(status = '', employee = '', from = '', to = '') {
    let params = new HttpParams();

    if (status) params = params.set('status', status);
    if (employee) params = params.set('employee', employee);
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);

    return this.http.get(`${API}/manager/claims/export.csv`, {
      params,
      responseType: 'blob',
    });
  }

  create(data: unknown) {
    return this.http.post<Claim>(`${API}/claims`, data);
  }

  update(id: number, data: unknown) {
    return this.http.put<Claim>(`${API}/claims/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${API}/claims/${id}`);
  }

  review(id: number, decision: 'APPROVED' | 'REJECTED', comment: string) {
    return this.http.patch<Claim>(`${API}/manager/claims/${id}/review`, {
      decision,
      comment,
    });
  }

  timeline(id: number) {
    return this.http.get<AuditItem[]>(`${API}/claims/${id}/timeline`);
  }

  uploadReceipt(id: number, file: File) {
    const body = new FormData();
    body.append('file', file);

    return this.http.post<Claim>(`${API}/claims/${id}/receipt`, body);
  }

  receipt(id: number) {
    return this.http.get(`${API}/claims/${id}/receipt`, {
      responseType: 'blob',
    });
  }

  managers() {
    return this.http.get<ManagerOption[]>(`${API}/claims/managers`);
  }

  users() {
    return this.http.get<any[]>(`${API}/manager/users`);
  }

  setUserActive(id: number, value: boolean) {
    return this.http.patch<any>(`${API}/manager/users/${id}/active`, null, {
      params: { value },
    });
  }

  private pageParams(page: number, size: number) {
    return new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'createdAt,desc');
  }
}
