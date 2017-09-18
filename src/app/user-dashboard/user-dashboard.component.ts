import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';

import { UserDetails } from "./../models/user-details";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit, AfterViewInit {
  private currentUser: Observable<firebase.User>;
  private currentUserEmail: string;
  private currentUserName: string;
  private userDetails: UserDetails = {
    fname: "",
    lname: "",
    email: "",
    contact: ""
  };
  private userLat: string = "";
  private userLng: string = "";
  isMapSupported: boolean = false;

  constructor(private angularFireDatabase: AngularFireDatabase, private angularFireAuth: AngularFireAuth, private router: Router) {
    this.currentUser = angularFireAuth.authState;
    this.currentUser.first().subscribe(
      (res: any) => {
        this.currentUserEmail = res.email;
        angularFireDatabase.list("/users", {
          query: {
            orderByChild: "email",
            equalTo: this.currentUserEmail
          }
        }).subscribe(
          (users: any) => {
            this.userDetails = users[0];
            this.currentUserName = this.userDetails.fname + " " + this.userDetails.lname;
          }
          );
      }
    );
  }

  ngOnInit() {
    if (navigator.geolocation) {
      this.isMapSupported = true;
    }
  }

  ngAfterViewInit() {
    this.getCurrentUserPosition();
  }

  private logout(): void {
    this.angularFireAuth.auth.signOut()
      .then(
      (res: any) => {
        this.router.navigate(["login"]);
      }
      )
      .catch();
  }

  private getCurrentUserPosition(): void {
    if (this.isMapSupported) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
        },
        (error: any) => { },
        { enableHighAccuracy: true }
      );
    }
  }

  private getMyLocation(): void {
    if (this.isMapSupported) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
        },
        (error: any) => { },
        { enableHighAccuracy: true }
      );
    }
  }
  private setMapMarker(event: any): void {
    this.userLat = event.coords.lat;
    this.userLng = event.coords.lng;
  }
}
