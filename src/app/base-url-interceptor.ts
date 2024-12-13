import { HttpInterceptorFn } from '@angular/common/http';

const baseUrl = 'http://localhost:3000';

export const provideBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const url = new URL(req.url, baseUrl);

  return next(req.clone({ url: url.href }));
};
