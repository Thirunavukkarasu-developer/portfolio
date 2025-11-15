---
title: How to Integrate TrackJS with Angular 9 SSR for Robust Frontend Error Monitoring
publishedDate: 2025-11-03
draft: false
authors:
- thiruna
description: Monitoring frontend errors is crucial for delivering high-quality user experiences in modern web applications. TrackJS is a powerful JavaScript error tracking tool that helps developers capture, diagnose, and resolve frontend issues in real-time. 
popularTags: In this blog, you’ll learn how to integrate TrackJS into an Angular 9 application with Server-Side Rendering (SSR). We’ll walk through installation, configuration, and usage—including optional server-side error handling techniques.
---

### 🛠 How to Integrate TrackJS with Angular 9 SSR for Robust Frontend Error Monitoring

Monitoring frontend errors is crucial for delivering high-quality user experiences in modern web applications. **TrackJS** is a powerful JavaScript error tracking tool that helps developers capture, diagnose, and resolve frontend issues in real-time.

In this blog, you’ll learn **how to integrate TrackJS into an Angular 9 application with Server-Side Rendering (SSR)**. We’ll walk through installation, configuration, and usage—including optional server-side error handling techniques.

### ✅ Prerequisites

Make sure you are using Node.js 12, which is compatible with Angular 9:
```bash
nvm use 12
```

Install TrackJS using:
```bash
npm install trackjs --save --legacy-peer-deps
```

### 🛠️ Step 1: Configure TrackJS in main.ts

In your Angular project’s main.ts, initialize TrackJS before bootstrapping the app:
```ts
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { TrackJS } from 'trackjs';

if (environment.TrackJS) {
  TrackJS.install(environment.TrackJS);
}

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
});
```


### 🌍 Step 2: Add TrackJS Config in environment.prod.ts
```ts
export const environment = {
  production: true,
  TrackJS: {
    token: 'YOUR_TRACKJS_TOKEN',
    enabled: true,
    application: 'front-end',
    console: { display: true },
  },
};
```


### ⚠️ Step 3: Implement Global Error Handling

Create a custom global error handler to send errors to TrackJS: 
```ts
// _services/global-error-handler.ts
import { ErrorHandler, Injectable } from '@angular/core';
import { TrackJS } from 'trackjs';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.warn(error.message);
    TrackJS.track(error.originalError || error);
  }
}
```

Register this in your AppModule:
```ts
providers: [
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
],
```


### 👤 Step 4: Add User Context with TrackingService
```ts
// _services/tracking.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const TrackJS: any;

@Injectable({ providedIn: 'root' })
export class TrackingService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  configureUser(userId: string): void {
    if (isPlatformBrowser(this.platformId) && typeof TrackJS !== 'undefined') {
      TrackJS.configure({ userId });
    }
  }

  clearUser(): void {
    if (isPlatformBrowser(this.platformId) && typeof TrackJS !== 'undefined') {
      TrackJS.configure({ userId: null });
    }
  }
}
```

Use this in your authentication service:
```ts
// _services/auth.service.ts
import { Injectable } from '@angular/core';
import { TrackingService } from './tracking.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private trackingService: TrackingService) {}

  login(user: { id: string }) {
    this.trackingService.configureUser(user.id);
  }

  logout() {
    this.trackingService.clearUser();
  }
}
```

### 🧪 Step 5: Test with a Simple Component
Create a test component to simulate errors:
```ts
// app/simple-form.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-simple-form',
  templateUrl: './simple-form.component.html',
})
export class SimpleFormComponent {
  inputValue: string = '';
  result: number | null = null;

  onSubmit() {
    try {
      const numberValue = parseInt(this.inputValue);
      if (isNaN(numberValue)) {
        throw new Error('Invalid number input');
      }
      this.result = numberValue * 10;
    } catch (error) {
      throw error;
    }
  }
}
```

```html
<!-- app/simple-form.component.html -->
<div class="container">
  <h1>Simple Error Handler Example</h1>
  <p>Enter a number and see the result multiplied by 10.</p>
  <form (ngSubmit)="onSubmit()">
    <label for="number">Enter a number:</label>
    <input type="text" [(ngModel)]="inputValue" name="number" />
    <button type="submit">Submit</button>
  </form>
  <p *ngIf="result !== null">Result: {{ result }}</p>
</div>
```



###  🧰 Optional: Server-Side Error Reporting (Advanced)

TrackJS only works on the browser side. For full-stack error visibility in SSR apps, use server-side logging:
```ts
// _services/server-error-reporter.service.ts
import { Injectable } from '@nestjs/common'; // Use @angular/core if Angular Universal
import axios from 'axios';

@Injectable()
export class ServerErrorReporterService {
  private readonly trackJsToken = 'YOUR_TRACKJS_TOKEN';

  async reportError(error: any, context: any = {}) {
    try {
      await axios.post('https://api.trackjs.com/v1/client/log', {
        token: this.trackJsToken,
        userId: context.userId || 'server',
        message: error.message || 'Unknown Server Error',
        stack: error.stack || '',
        url: 'server',
        console: [],
        network: [],
        session: [],
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Failed to send error to TrackJS:', e);
    }
  }
}
```

Then, in your server.ts (Express or SSR entry point):
```ts
import { ServerErrorReporterService } from './src/app/services/server-error-reporter.service';

app.use(async (err, req, res, next) => {
  const reporter = new ServerErrorReporterService();
  await reporter.reportError(err, {
    userId: req?.user?.id || 'anonymous',
  });

  res.status(500).send('Internal Server Error');
});
```


### ⚡ Final Note: TrackJS is Frontend Only
TrackJS **only tracks client-side errors**. If you’re building a full-stack Angular SSR application, consider using alternatives like **Sentry**, which supports both frontend and backend tracking out of the box.


### 📌 Conclusion
Integrating TrackJS with Angular 9 and SSR provides visibility into browser-side errors, making it easier to monitor production issues. With a global error handler, user context, and optional server-side reporting, you can deliver a more stable user experience.

If you need complete stack visibility (frontend + backend), explore tools like **Sentry** or **LogRocket**.
