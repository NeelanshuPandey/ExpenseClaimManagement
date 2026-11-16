import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/auth.interceptor';
bootstrapApplication(AppComponent, { providers: [provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor]))] }).catch(error => {
  console.error('Expense Claims failed to start', error);
  const root=document.querySelector('app-root');
  if (root) root.innerHTML='<main style="font:16px system-ui;max-width:680px;margin:12vh auto;padding:32px;color:#242344"><h1>The expense app could not start</h1><p>Reload the page. If the issue continues, open the browser console and share the first red error with your developer.</p></main>';
});
