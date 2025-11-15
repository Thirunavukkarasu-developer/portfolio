---
title: Improve the website initial load speed
publishedDate: 2025-11-07
draft: false
authors:
- thiruna
description: I recently faced a problem with my Angular 9 Universal (Server-Side Rendering) e-commerce website. When users landed on the first page, they saw a flicker or re-render before the content settled.
popularTags: Angular 9, Flicker, SSR
---

#### How I Fixed Page Flickering Issues in My Angular 9 SSR E-commerce Website

##### Introduction
I recently faced a problem with my Angular 9 Universal (Server-Side Rendering) e-commerce website. When users landed on the first page, they saw a flicker or re-render before the content settled. After some investigation, I found a few issues related to dynamic routes, lazy loading and missing server-side data.

In this blog, I'll share what caused the problem how I fixed it -- in simple steps.

###### My Setup
- **Framework**: Angular 9 Universal (SSR)
- **Node Version**: Node 12
- **Website**: Single codebase, but different UI for different stores (based on store ID from API)
- **Routes**: Dynamically prepared using APP_INITIALIZER in *app.module.ts*

Here’s an example of my initial routing setup:
```js
const routes: Routes = [
	{
		path: '',
		component: GlobalComponent,
		resolve: { store: StoreInfoResolver, user: UserInfoResolver },
		children: [
			{
				path: '',
				loadChildren: () => import(`${moduleConfig.path}`).then(m => m[moduleConfig.name]),
			}
		]
	},
];
```

##### Problems I Faced
###### 1. User Info Resolver (UserInfoResolver) Failing on SSR
I had a resolver (UserInfoResolver) that fetched user information using an API. However, it only worked on the browser side, not during server-side rendering. On the server side, this resolver returned undefined, so the browser tried to resolve it again, which caused the page to reload.

Here was the problematic code:
```js
getUserInfo() {
	if (this.isBrowser) {
		return this.get("/api/v1/user");
	}
}
```

- During SSR, this.isBrowser was false, so the API was never called.
- Because of this, the server returned incomplete data, and the browser had to reload, causing a UI flicker.

###### 2. Lazy Loading the Home Page
My landing (home) page was lazily loaded. This caused extra delays when the first page was rendered, which made the flicker even worse.

###### 3. Missing ServerTransferStateModule
I hadn’t properly set up the ServerTransferStateModule. Without it, there was no easy way to transfer server-fetched data to the browser, causing unnecessary re-fetches.


###### How I Fixed It
###### 1. Fixed UserInfoResolver
I updated the getUserInfo() method so that it runs both on the server and the browser:
```js
getUserInfo() {
	return this.get("/api/v1/user");
}
```
Now, the user info is fetched during server-side rendering too, fixing the missing data issue.

###### 2. Removed Lazy Loading for the Home Page
I changed the routing setup for the home page. Instead of lazy loading, I directly loaded the HomePageComponent:
```js
const routes: Routes = [
	{
		path: '',
		component: GlobalComponent,
		resolve: { store: StoreInfoResolver, user: UserInfoResolver },
		children: [
			{
				path: '',
				component: HomePageComponent,
			}
		]
	},
];
```
This helped make the first-page loading much faster and smoother.

###### 3. Added ServerTransferStateModule
I updated the ***app.server.module.ts*** to include ServerTransferStateModule.
This allowed the server-rendered data to be passed properly to the client, avoiding double API calls.
```js
import { ServerTransferStateModule } from '@angular/platform-server';

@NgModule({
  imports: [
    ServerTransferStateModule,
    // other imports
  ],
})
export class AppServerModule {}
```

###### Result
After making these changes:
- The flickering issue on the home page stopped completely.
- Server-side and client-side data stayed in sync.
- Nested routes and resolvers also worked properly without any unexpected reloads.


###### Final Thoughts
If you are facing flickering or re-render issues in your Angular Universal (SSR) application, make sure you:

- Properly fetch and resolve all required data on the server side.
- Avoid lazy loading for critical pages like the homepage.
- Use ServerTransferStateModule to pass server-fetched data to the browser smoothly.
  

Small changes can make a big difference in improving the user experience!


