import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";

import { AppComponent } from "./app.component"
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { UserDashboardComponent } from "./user-dashboard/user-dashboard.component";
import { AdminComponent } from "./admin/admin.component";
import { MechanicLoginComponent } from "./mechanic-login/mechanic-login.component";
import { MechanicDashboardComponent } from "./mechanic-dashboard/mechanic-dashboard.component";
import { UserOrderHistoryComponent } from "./user-order-history/user-order-history.component";
import { MechanicOrderHistoryComponent } from "./mechanic-order-history/mechanic-order-history.component";

export const APP_ROUTES: Routes = [
	{
		path: "",
		redirectTo: "login",
		pathMatch: "full"
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
	},
	{
		path: "mechanic-login",
		component: MechanicLoginComponent
	},
	{
		path: "mechanic-dashboard",
		component: MechanicDashboardComponent
	},
	{
		path: "user-order-history",
		component: UserOrderHistoryComponent
	},
	{
		path: "mechanic-order-history",
		component: MechanicOrderHistoryComponent
	}
];

export const APP_ROUTER_PROVIDERS: any = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(APP_ROUTES);
