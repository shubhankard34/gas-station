import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router"
import { AngularFireModule } from "angularfire2";
import { FormsModule } from "@angular/forms";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database"
import { AgmCoreModule } from "@agm/core"

import { AppComponent } from './app.component';
import { APP_ROUTES } from "./app.routes";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthService } from "./providers/auth.service";
import { AdminComponent } from "./admin/admin.component";
import { TechnicianListComponent } from "./admin/technician-list/technician-list.component";
import { AddTechnicianComponent } from "./admin/add-technician/add-technician.component";
import { MechanicLoginComponent } from "./mechanic-login/mechanic-login.component";
import { MechanicDashboardComponent } from "./mechanic-dashboard/mechanic-dashboard.component";
import { OrderListComponent } from "./mechanic-dashboard/order-list/order-list.component";
import { MechanicOrderPageComponent } from "./mechanic-dashboard/mechanic-order-page/mechanic-order-page.component"; 

export const fireBaseConfig = {
    apiKey: "AIzaSyDW4rG5TcGS7i93hQVLi69WB_fsoqVXilA",
    authDomain: "gas-station-dc8a2.firebaseapp.com",
    databaseURL: "https://gas-station-dc8a2.firebaseio.com",
    projectId: "gas-station-dc8a2",
    storageBucket: "gas-station-dc8a2.appspot.com",
    messagingSenderId: "564281047749"
};

export const googleMapApiKey = "AIzaSyCIx6PCS1QqXGzmWw_A3LO7Y7cykdpnT5Q";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        UserDashboardComponent,
        AdminComponent,
        TechnicianListComponent,
        AddTechnicianComponent,
        MechanicLoginComponent,
        MechanicDashboardComponent,
        OrderListComponent,
        MechanicOrderPageComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(APP_ROUTES, { useHash: true }),
        AngularFireModule.initializeApp(fireBaseConfig),
        AgmCoreModule.forRoot({
            apiKey: googleMapApiKey
        })
    ],
    providers: [AngularFireDatabase, AngularFireAuth, AuthService],
    bootstrap: [AppComponent]
})
export class AppModule { }