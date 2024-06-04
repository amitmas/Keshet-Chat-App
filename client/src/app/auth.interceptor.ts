import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user = inject(AuthService).getUser();
  if (!user) return next(req);

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  return next(authReq);
};
