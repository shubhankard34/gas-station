import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';

import { UserDetails } from "./../models/user-details";
import { OrderDetails } from "./../models/order-details";

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
    id: "",
    fname: "",
    lname: "",
    email: "",
    contact: "",
  };
  private userLat: string = "";
  private userLng: string = "";
  public isMapSupported: boolean = false;
  private orderDetails: any = {
    id: "",
    userId: "",
    assignedTechnicianId: "",
    reqLat: "",
    reqLng: "",
    completed: false
  }
  private canCreateRequest: boolean = true;
  public assignedTechnicianId: string;
  public assignedTechnician: any;
  public requestLat: number;
  public requestLng: number;
  public technicianLat: number;
  public technicianLng: number;
  public otp: number;

  constructor(private angularFireDatabase: AngularFireDatabase, private angularFireAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit() {
    if (navigator.geolocation) {
      this.isMapSupported = true;
    }

    this.currentUser = this.angularFireAuth.authState;
    this.currentUser.first().subscribe(
      (res: any) => {
        if (res) {
          this.currentUserEmail = res.email;
          this.angularFireDatabase.list("/users", {
            query: {
              orderByChild: "email",
              equalTo: this.currentUserEmail
            }
          }).subscribe(
            (users: any) => {
              this.userDetails = users[0];
              this.userDetails.id = users[0].$key;
              this.currentUserName = this.userDetails.fname + " " + this.userDetails.lname;
              this.angularFireDatabase.list("/orders").subscribe(
                (orders: any) => {
                  for (let order of orders) {
                    if (order.userId == this.userDetails.id && !order.completed) {
                      this.orderDetails = order;
                      this.orderDetails.id = order.$key;
                      this.canCreateRequest = false;
                      this.assignedTechnicianId = order.assignedTechnicianId;
                      this.getAssignedTechnician(this.assignedTechnicianId);
                      this.requestLat = order.reqLat;
                      this.requestLng = order.reqLng;
                      this.technicianLat = order.technicianLat;
                      this.technicianLng = order.technicianLng;
                      this.otp = order.otp;
                      break;
                    } else {
                      this.canCreateRequest = true;
                      this.assignedTechnicianId = undefined;
                      this.assignedTechnician = undefined;
                    }
                  }
                }
              );
            }
            );
        } else {
          this.router.navigate(["login"]);
        }
      }
    );

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

  private requestTechnician(): void {
    this.orderDetails.reqLat = this.userLat;
    this.orderDetails.reqLng = this.userLng;
    this.orderDetails.userId = this.userDetails.id;
    this.orderDetails.otp = this.generateOtp();
    this.orderDetails.assignedTechnicianId = "";
    this.angularFireDatabase.list("/orders").push(this.orderDetails);
  }

  private getAssignedTechnician(assignedTechnicianId: string): void {
    if(assignedTechnicianId) {
      this.angularFireDatabase.list("/technicians").subscribe(
        (technicianList: any) => {
          for(let technician of technicianList) {
            if(technician.$key == this.assignedTechnicianId) {
              this.assignedTechnician = technician;
              console.log(this.assignedTechnician);
            }
          }
        }
      );
    }
  }

  private generateOtp(): number {
    let otp: number;
    otp = Math.floor(1000 + Math.random() * 9000);
    this.otp = otp;
    return otp;
  }
}
