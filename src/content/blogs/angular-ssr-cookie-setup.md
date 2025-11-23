---
title: How to Set and Read Cookies in Angular 9 Universal (SSR) - Fix Missing Token on Server Side
publishedDate: 2025-11-01
draft: true
authors:
- thiruna
description: Angular 9 Universal app with Server-Side Rendering (SSR) and relying on cookies (e.g. for authentication tokens) 
popularTags: In this blog, you’ll learn how to properly set, read, and share cookies** between the browser and server in Angular 9 Universal using [ngx-cookie-service](https://www.npmjs.com/package/ngx-cookie-service), and how to fix the missing-token issue on SSR.
---

If you’re building an Angular 9 Universal app with Server-Side Rendering (SSR) and relying on cookies (e.g. for authentication tokens), you may hit a common problem:

✅ Cookie exists in the browser,
❌ But **on page reload, the token is not available on the server**,
❌ Resulting in **server-side data fetching errors**.


In this blog, you’ll learn **how to properly set, read, and share cookies** between the browser and server in Angular 9 Universal using [ngx-cookie-service](https://www.npmjs.com/package/ngx-cookie-service), and **how to fix the missing-token issue on SSR**.


#### ❓The Problem: Token Exists in Browser, But Not on Server
In your Angular 9 SSR setup, after logging in, the token is saved in a cookie:
Inside api.service.ts
```ts
this.cookieService.set('token', response.token, undefined, '/');
```
However, after refreshing the page, the server **can’t access the token** while rendering. This breaks data fetching and route guards on the server side — because the Authorization header isn’t set during SSR.

#### ✅ Solution Overview
1. Use [ngx-cookie-service@10.1.1](https://www.npmjs.com/package/ngx-cookie-service/v/10.1.1)
2. Inject REQUEST and RESPONSE tokens on server
3. Read and write cookies both on **server and browser**
4. Intercept HTTP requests to attach token properly on both environments

#### 📦 Step 1: Install Required Package
```bash
npm install ngx-cookie-service@10.1.1
```

#### 🔧 Step 2: Configure server.ts
Update your server.ts to inject cookies and make them available via DI:
```ts
server.get('*', (req, res) => {
  req.cookies = req.headers.cookie;

  const tokenValue = getTokenFromCookie(req);
  if (tokenValue) {
    res.cookie('token', tokenValue, {
      path: '/',
      sameSite: 'lax',
    });
  }

  res.render(indexHtml, {
    req, res,
    providers: [
      { provide: APP_BASE_HREF, useValue: req.baseUrl },
      { provide: 'REQUEST', useValue: req },
      { provide: 'RESPONSE', useValue: res },
    ],
  });
});

function getTokenFromCookie(request): string | null {
  const cookieHeader: string = request?.headers?.cookie || '';
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}
```


#### 🧠 Step 3: Provide CookieService in AppModule
```ts
// app.module.ts
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  ...
  providers: [CookieService],
})
export class AppModule {}
```

#### 🔐 Step 4: HTTP Interceptor for Token on Both Server & Browser
```ts
// app-interceptor.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';

function getTokenFromCookie(request): string | null {
  const cookieHeader: string = request?.headers?.cookie || '';
  const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(REQUEST) private request: Request
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token: string | null = null;

    if (isPlatformBrowser(this.platformId)) {
      token = this.cookieService.get('token');
    }

    if (isPlatformServer(this.platformId)) {
      token = getTokenFromCookie(this.request);
    }

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}
```

Add this interceptor in your AppModule or CoreModule:
```ts
providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AppInterceptor,
    multi: true
  }
]
```

#### 🔐 Step 5: Login & Logout Cookie Management
api.service.ts
```ts
loggedIn(data) {
  this.post('api/v1/sign-in', data)
    .then(response => {
      // ✅ Set cookie only on browser — ngx-cookie-service works only in browser context
      this.cookieService.set('token', response.token, undefined, '/');
      // Navigate to home
    })
    .catch(err => {
      // handle error
    });
}

logout() {
  this.cookieService.delete('token', '/');
  this.get('api/v1/sign-out')
    .then(() => {
      // Navigate to login
    });
}
```
 🔥 **Important Note:**
    ngx-cookie-service **only works in the browser** for setting and deleting cookies. On the **server side**, cookies must be read directly from the Request object, as shown in the interceptor.

#### 🧪 Debugging Tip
Add logs in your interceptor to verify where the token is being picked up:
```ts
console.log("Running on", isPlatformBrowser(this.platformId) ? "browser" : "server");
console.log("Token used in request:", token);
```

#### 🏁 Final Thoughts
If you’re facing the issue where cookies (like auth tokens) are **missing on page reload during SSR**, make sure to:

- ✅ Read cookies directly from the Request object on the server
- ✅ Use ngx-cookie-service@10.1.1 on the **browser only**
- ✅Add proper token forwarding in your HTTP interceptor for both platforms

This setup ensures your Angular 9 Universal SSR app consistently handles **authentication tokens** both on the server and browser — solving the **“token not available on SSR”** issue.
