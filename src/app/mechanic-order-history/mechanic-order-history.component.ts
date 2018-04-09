import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';

import { UserDetails } from "./../models/user-details";
import { OrderDetails } from "./../models/order-details";

@Component({
    selector: 'app-mechanic-order-history',
    templateUrl: './mechanic-order-history.component.html',
})
export class MechanicOrderHistoryComponent implements OnInit {

    public currentTechnician: any;
    public currentTechnicianEmail: any;
    public technicianDetails: any;
    public currentTechnicianName: any;
    public orders: any;
    public userList: any;
    constructor(private angularFireDatabase: AngularFireDatabase, private angularFireAuth: AngularFireAuth, private router: Router) {
    }

    public ngOnInit(): void {
        this.currentTechnician = this.angularFireAuth.authState;
        this.angularFireDatabase.list("/users").subscribe(
            (users: any) => {
                this.userList = [];
                for (let user of users) {
                    this.userList.push(user);
                }
            }
        );
        this.currentTechnician.first().subscribe(
            (res: any) => {
                if (res) {
                    this.currentTechnicianEmail = res.email;
                    this.angularFireDatabase.list("/technicians", {
                        query: {
                            orderByChild: "email",
                            equalTo: this.currentTechnicianEmail
                        }
                    }).subscribe(
                        (users: any) => {
                            this.technicianDetails = users[0];
                            this.technicianDetails.id = users[0].$key;
                            this.currentTechnicianName = this.technicianDetails.fname + " " + this.technicianDetails.lname;
                            this.angularFireDatabase.list("/orders").subscribe(
                                (orders: any) => {
                                    this.orders = [];
                                    for (let order of orders) {
                                        if (order.assignedTechnicianId == this.technicianDetails.id && order.completed) {
                                            this.orders.push(order);
                                        }
                                    }
                                    this.orders.sort(this.sortOrders);
                                }
                            );
                        });
                } else {
                    this.router.navigate(["mechanic-login"]);
                }
            }
        );
    }
    public goToDashBoard(): void {
        this.router.navigate(["mechanic-dashboard"]);
    }

    public logout(): void {
        this.angularFireAuth.auth.signOut()
            .then(
            (res: any) => {
                this.router.navigate(["mechanic-login"]);
            }
            )
            .catch();
    }

    public getOrderTime(orderTime: any): string {
        return new Date(orderTime).toString();
    }

    public getUserServed(userId: any): string {
        let userFname: string;
        let userLname: string;
        let userFullName: string;
        for (let user of this.userList) {
            if (userId == user.$key) {
                userFname = user.fname;
                userLname = user.lname;
                break;
            }
        }
        userFullName = userFname + " " + userLname;
        return userFullName;
    }

    private sortOrders(a, b) {
        // Use toUpperCase() to ignore character casing
        const sortOrderA = new Date(a.orderTime).getTime();
        const sortOrderB = new Date(b.orderTime).getTime();

        let comparison = 0;
        if (sortOrderA >= sortOrderA) {
            comparison = 1;
        } else if (sortOrderA <= sortOrderA) {
            comparison = -1;
        }
        return comparison;
    }
}
