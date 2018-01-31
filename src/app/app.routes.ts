import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";

import { AppComponent } from "./app.component"
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { AdminComponent } from "./admin/admin.component";
export const APP_ROUTES: Routes = [
	{
		path: "",
		redirectTo: "login",
		pathMatch: "full"
		// component: AppComponent
	},
	{
		path: "login",
		component: LoginComponent
	},
	{
		path: "signup",
		component: SignupComponent
	},
	{
		path: "user-dashboard",
		component: UserDashboardComponent
	},
	{
		path: "admin",
		component: AdminComponent
	}
];

export const APP_ROUTER_PROVIDERS: any = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
