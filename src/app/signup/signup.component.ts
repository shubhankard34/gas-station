import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireDatabase } from "angularfire2/database";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/first';

import { AuthService } from "../providers/auth.service";
import { UserDetails } from "../models/user-details";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  private user: Observable<firebase.User>;
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
  private userPassword: string = "";
  private userPasswordConfirm: string = "";
  private errorMessages: string[] = [];
  private infoMessages: string[] = [];

  private userDetails: UserDetails = {
    id: "",
    fname: "",
    lname: "",
    contact: "",
    email: ""
  }
  ngOnInit() {
  }

  private goToLoginPage(): void {
    this.router.navigate(["login"]);
  }

  private onRegister(): void {
    let alreadyExists: boolean = false;
    if ((this.userPassword != "") && (this.userPasswordConfirm != "") && (this.userPassword == this.userPasswordConfirm)) {
      this.angularFireDatabase.list("/users").first().subscribe(
        (res: any[]) => {
          if (res) {
            res.forEach((element) => {
              if (element.email == this.userDetails.email) {
                alreadyExists = true;
                this.errorMessages.push(this.userDetails.email + " already registered.")
              }
            });
            if (!alreadyExists) {
              this.angularFireAuth.auth.createUserWithEmailAndPassword(this.userDetails.email, this.userPassword)
                .then(
                (res: any) => {
                  this.errorMessages = [];
                  this.infoMessages.push("Registered Successfully");
                  this.angularFireDatabase.list("/users").push(this.userDetails);
                  this.resetForm();
                  console.log("SUCCESS" + res);
                }
                )
                .catch(
                (error: any) => {
                  this.errorMessages.push(error);
                }
                );
            }
          }
        }
      );
    } else {
      this.errorMessages.push("2 password fields do not match.");
    }
  }

  private resetForm(): void {
    this.userDetails = {
      id: "",
      fname: "",
      lname: "",
      contact: "",
      email: ""
    };
    this.userPassword = "";
    this.userPasswordConfirm = "";
  }

}