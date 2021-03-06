import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';

import { UserDetails } from "./../models/user-details";
import { OrderDetails } from "./../models/order-details";

export const SERVICE_STATIONS: any[] = [
  {
    stationLat: 19.029833,
    stationLng: 73.057901
  },
  {
    stationLat: 19.030997,
    stationLng: 73.058213
  },
  {
    stationLat: 19.030291,
    stationLng: 73.058011
  },
  {
    stationLat: 19.028693,
    stationLng: 73.059933
  },
  {
    stationLat: 19.030074,
    stationLng: 73.057906
  },
  {
    stationLat: 19.029860,
    stationLng: 73.057852
  },
  {
    stationLat: 19.039614,
    stationLng: 73.070428
  },
  {
    stationLat: 19.043636,
    stationLng: 73.063659
  },
  {
    stationLat: 19.041843,
    stationLng: 73.072196
  },
  {
    stationLat: 19.035175,
    stationLng: 73.075324
  },
  {
    stationLat: 19.049057,
    stationLng: 73.070220
  },
  {
    stationLat: 19.048557,
    stationLng: 73.064834
  },
  {
    stationLat: 19.049025,
    stationLng: 73.079498
  },
  {
    stationLat: 19.013885,
    stationLng: 73.040636
  },
  {
    stationLat: 19.021087,
    stationLng: 73.103470
  },
  {
    stationLat: 19.020204,
    stationLng: 73.092769
  },
  {
    stationLat: 19.033334,
    stationLng: 73.106107
  }
];

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
  public isPaymentDone: boolean;
  public totalAmount: number;
  public serviceStations: any = SERVICE_STATIONS;

  constructor(private angularFireDatabase: AngularFireDatabase, private angularFireAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit() {
    if (navigator.geolocation) {
      this.isMapSupported = true;
      console.log(this.serviceStations);
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
                      this.isPaymentDone = order.isPaymentDone;
                      this.totalAmount = order.totalAmount;
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
    this.orderDetails.orderTime = new Date().getTime();
    this.orderDetails.technicianLat = "";
    this.orderDetails.technicianLng = "";
    this.orderDetails.isPaymentDone = false;
    this.orderDetails.totalAmount = "";
    this.angularFireDatabase.list("/orders").push(this.orderDetails);
  }

  private getAssignedTechnician(assignedTechnicianId: string): void {
    if (assignedTechnicianId) {
      this.angularFireDatabase.list("/technicians").subscribe(
        (technicianList: any) => {
          for (let technician of technicianList) {
            if (technician.$key == this.assignedTechnicianId) {
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

  public paymentComplete(event: any): void {
    if (event) {
      this.orderDetails.isPaymentDone = true;
      alert("Payment Successful!")
    } else {
      this.orderDetails.isPaymentDone = false;
    }
    this.angularFireDatabase.list("/orders").update(this.orderDetails.$key, this.orderDetails);
  }

  public goToUserHistory(): void {
    this.router.navigate(["user-order-history"]);
  }

  public goToGoogleNavigation(lat, lng): void {
    let url = "https://www.google.com/maps/dir/?api=1&destination=" + lat + "," + lng + "&dir_action=navigate&travelmode=driving";
    window.open(url, "_blank");
  }
}
