import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/first';
import { AngularFireDatabase } from "angularfire2/database";

import { UserDetails } from "./../models/user-details";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private user: Observable<firebase.User>;
  private email: string = "";
  private password: string = "";
  private errorMessages: string[] = [];
  private infoMessages: string[] = [];

  constructor(private router: Router, private angularFireAuth: AngularFireAuth, private angularFireDatabase: AngularFireDatabase) {
    this.user = angularFireAuth.authState;
    this.user.subscribe(
      (res: any) => {
        if (res) {
          router.navigate(["user-dashboard"]);
        }
      }
    );
  }

  private goToSignUpPage(): void {
    this.router.navigate(["signup"]);
  }

  public ngOnInit(): void {
  }

  private login(): void {
    this.angularFireAuth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(
      (res: any) => {
        this.errorMessages = [];
        this.infoMessages.push("Logged in successfully!");
      }
      )
      .catch(
      (error: any) => {
        this.infoMessages = [];
        this.errorMessages.push(error.message);
      }
      );
  }

  private loginUsingFacebook(): void {
    alert("Login using facebook coming soon!");
  }

  private loginUsingGoogle(): void {
    let googleProvider: any = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleProvider)
    .then(
      (res:any) => {
        let additionalUserInfo: any = res.additionalUserInfo.profile;
        let userDetails: UserDetails = {
          id: "",
          fname: additionalUserInfo.given_name,
          lname: additionalUserInfo.family_name,
          email: additionalUserInfo.email,
          contact: ""
        };
        let alreadyExists: boolean = false;
        this.angularFireDatabase.list("/users").first().subscribe(
          (res: any[]) => {
            if (res) {
              res.forEach((element) => {
                if (element.email == userDetails.email) {
                  alreadyExists = true;
                }
              });
              if (!alreadyExists) {
                this.angularFireDatabase.list("/users").push(userDetails);
              }
            }
          }
        );
      }
    )
    .catch();
  }

}
