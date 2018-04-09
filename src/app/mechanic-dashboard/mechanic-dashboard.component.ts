import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';
import { TechnicianDetails } from "./../models/technician-details";

@Component({
    selector: 'app-mechanic-dashboard',
    templateUrl: './mechanic-dashboard.component.html',
    styleUrls: ['./mechanic-dashboard.component.css']
})
export class MechanicDashboardComponent implements OnInit {

    constructor(private angularFireDatabase: AngularFireDatabase, private angularFireAuth: AngularFireAuth, private router: Router) {
        this.user = angularFireAuth.authState;
        this.user.subscribe(
            (res: any) => {
                if (!res) {
                    router.navigate(["mechanic-login"]);
                }
            }
        );
    }
    private user: Observable<firebase.User>;
    private currentTechnician: TechnicianDetails;
    private currentTechnicianId: string;
    public currentOrder: any;
    public ngOnInit() {
        this.user.subscribe(
            (res) => {
                this.angularFireDatabase.list("/technicians").subscribe(
                    (listOfTechnicians: any) => {
                        for (let tech of listOfTechnicians) {
                            if (res && tech.email == res.email) {
                                this.currentTechnician = tech;
                                this.currentTechnicianId = tech.$key;
                                this.getCurrentOrder();
                            }
                        }
                    }
                );
            }
        );


    }

    public logout() {
        this.angularFireAuth.auth.signOut()
            .then(
            (res: any) => {
                this.router.navigate(["mechanic-login"]);
            }
            )
            .catch();
    }

    private getCurrentOrder(): void {
        this.angularFireDatabase.list("/orders").subscribe(
            (orderList: any) => {
                for (let order of orderList) {
                    if (order.assignedTechnicianId == this.currentTechnicianId && !order.completed) {
                        this.currentOrder = order;
                        break;
                    } else {
                        this.currentOrder = undefined;
                    }
                }
            }
        );
    }

    public goToHistory(): void {
        this.router.navigate(["mechanic-order-history"]);
    }
}
