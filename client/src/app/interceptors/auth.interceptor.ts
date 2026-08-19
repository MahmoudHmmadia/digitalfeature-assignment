import {
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { accountInfo, lang } from '../context/global';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next,
) => {
  const account = accountInfo();

  const headers: Record<string, string> = {
    'Accept-Language': lang(),
  };

  if (account?.token) {
    headers['Authorization'] = `Bearer ${account.token}`;
  }

  return next(
    req.clone({
      setHeaders: headers,
    }),
  );
};
