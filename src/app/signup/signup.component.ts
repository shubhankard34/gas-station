import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireDatabase } from "angularfire2/database";
import 'rxjs/add/operator/first';

import { AuthService } from "../providers/auth.service";
import { UserDetails } from "../models/user-details";
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService, private angularFireDatabase: AngularFireDatabase) { }
  private userPassword: string = "";
  private userPasswordConfirm: string = "";
  private errorMessages: string[] = [];
  private infoMessages: string[] = [];

  private userDetails: UserDetails = {
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
              this.authService.signup(this.userDetails.email, this.userPassword).then(
                (res: any) => {
                  this.errorMessages = [];
                  this.infoMessages.push("Registered Successfully");
                  this.angularFireDatabase.list("/users").push(this.userDetails);
                  this.resetForm();
                }

              ).catch(
                (error: any) => {
                  this.errorMessages.push("Could not register");
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
      fname: "",
      lname: "",
      contact: "",
      email: ""
    };
    this.userPassword = "";
    this.userPasswordConfirm = "";
  }

}
