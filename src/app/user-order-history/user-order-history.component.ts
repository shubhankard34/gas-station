import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';

import { UserDetails } from "./../models/user-details";
import { OrderDetails } from "./../models/order-details";

@Component({
    selector: 'app-user-order-history',
    templateUrl: './user-order-history.component.html',
})
export class UserOrderHistoryComponent implements OnInit {
    public currentUser: any;
    public currentUserEmail: any;
    public userDetails: any;
    public currentUserName: any;
    public orders: any;
    public technicianList: any;
    constructor(private angularFireDatabase: AngularFireDatabase, private angularFireAuth: AngularFireAuth, private router: Router) {
    }

    public ngOnInit(): void {
        this.currentUser = this.angularFireAuth.authState;
        this.angularFireDatabase.list("/technicians").subscribe(
            (technicians: any) => {
                this.technicianList = [];
                for (let technician of technicians) {
                    this.technicianList.push(technician);
                }
            }
        );
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
                                    this.orders = [];
                                    for (let order of orders) {
                                        if (order.userId == this.userDetails.id && order.completed) {
                                            this.orders.push(order);
                                        }
                                    }
                                }
                            );
                        });
                } else {
                    this.router.navigate(["login"]);
                }
            }
        );

    }

    public goToDashBoard(): void {
        this.router.navigate(["user-dashboard"]);
    }

    public logout(): void {
        this.angularFireAuth.auth.signOut()
            .then(
            (res: any) => {
                this.router.navigate(["login"]);
            }
            )
            .catch();
    }

    public getOrderTime(orderTime: any): string {
        return new Date(orderTime).toString();
    }

    public getAssignedTechnician(technicianId): string {
        let technicianFname: string;
        let technicianLname: string;
        let technicianFullName: string;
        for (let technician of this.technicianList) {
            if (technicianId == technician.$key) {
                technicianFname = technician.fname;
                technicianLname = technician.lname;
                break;
            }
        }
        technicianFullName = technicianFname + " " + technicianLname;
        return technicianFullName;
    }

}
