import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router"
import { AngularFireModule } from "angularfire2";
import { FormsModule } from "@angular/forms";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database"

import { AppComponent } from './app.component';
import { APP_ROUTES } from "./app.routes";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { AuthService } from "./providers/auth.service";

export const fireBaseConfig = {
    apiKey: "AIzaSyDW4rG5TcGS7i93hQVLi69WB_fsoqVXilA",
    authDomain: "gas-station-dc8a2.firebaseapp.com",
    databaseURL: "https://gas-station-dc8a2.firebaseio.com",
    projectId: "gas-station-dc8a2",
    storageBucket: "gas-station-dc8a2.appspot.com",
    messagingSenderId: "564281047749"
};

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        SignupComponent,
        UserDashboardComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(APP_ROUTES, { useHash: true }),
        AngularFireModule.initializeApp(fireBaseConfig)
    ],
    providers: [AngularFireDatabase,AngularFireAuth,AuthService],
    bootstrap: [AppComponent]
})
export class AppModule { }