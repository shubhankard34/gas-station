import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-mechanic-login',
  templateUrl: './mechanic-login.component.html',
  styleUrls: ['./mechanic-login.component.css']
})
export class MechanicLoginComponent implements OnInit {
  constructor(private angularFireAuth: AngularFireAuth, private angularFireDatabase: AngularFireDatabase, private router: Router) {
    this.user = angularFireAuth.authState;
    this.user.subscribe(
      (res: any) => {
        if (res) {
          router.navigate(["mechanic-dashboard"]);
        }
      }
    );
  }
  private user: Observable<firebase.User>;
  private email: string = "";
  private password: string = "";
  private errorMessages: string[] = [];
  private infoMessages: string[] = [];
  public ngOnInit() {

  }

  public login() {
    let techExists: boolean = false;
    if (this.email !== "" && this.password !== "") {
      this.angularFireDatabase.list("/technicians").subscribe(
        (listOfTechnicians: any) => {
          for (let tech of listOfTechnicians) {
            if (tech.email == this.email) {
              techExists = true;
            }
          }
          if (techExists) {
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
        }
      );
    }
  }

}
