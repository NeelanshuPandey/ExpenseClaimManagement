import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
let refreshing: ReturnType<AuthService['refresh']> | null = null;
export const authInterceptor:HttpInterceptorFn=(req,next)=>{
 const auth=inject(AuthService), session=auth.session();
 const send=(token:string|null)=>next(token?req.clone({setHeaders:{Authorization:`Bearer ${token}`}}):req);
 if(!session || /\/auth\/(login|register|refresh)$/.test(req.url)) return send(session?.accessToken||null);
 return send(session.accessToken).pipe(catchError(error=>{
  if(error.status!==401)return throwError(()=>error);
  if(!refreshing){const request=auth.refresh();if(!request){auth.logout();return throwError(()=>error);}refreshing=request.pipe(shareReplay(1));}
  return refreshing.pipe(switchMap(fresh=>{refreshing=null;return send(fresh.accessToken);}),catchError(e=>{refreshing=null;auth.logout();return throwError(()=>e);}));
 }));
};
