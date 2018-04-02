import { Component, OnInit, AfterContentChecked, Input } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';

@Component({
    selector: 'app-mechanic-order-page',
    templateUrl: './mechanic-order-page.component.html',
    styleUrls: ["mechanic-order-page.css"]
})
export class MechanicOrderPageComponent {
    @Input()
    public currentTechnician: any;

    public userLat: number;
    public userLng: number;
    public technicianLat: number;
    public technicianLng: number;
    public currentOrder: any;
    public google: any;
    public otp: number;
    public otpInput: any;

    constructor(private angularFireDatabase: AngularFireDatabase) { }

    public ngOnInit(): void {
        this.getCurrentUserPosition();
        this.angularFireDatabase.list("/orders").subscribe(
            (orderList: any) => {
                for (let order of orderList) {
                    if (order.assignedTechnicianId == this.currentTechnician.$key && !order.completed) {
                        this.currentOrder = order;
                        console.log(order);
                        this.userLat = order.reqLat;
                        this.userLng = order.reqLng;
                        this.google = "https://www.google.com/maps/dir/?api=1&destination=" + this.userLat + "," + this.userLng + "&dir_action=navigate&travelmode=driving";
                        this.otp = order.otp;
                    }
                }
            }
        );
    }

    private getCurrentUserPosition(): void {
        navigator.geolocation.getCurrentPosition(
            (position: any) => {
                this.technicianLat = position.coords.latitude;
                this.technicianLng = position.coords.longitude;
            },
            (error: any) => { },
            { enableHighAccuracy: true }
        );
        navigator.geolocation.watchPosition(
            (position: any) => {
                this.technicianLat = position.coords.latitude;
                this.technicianLng = position.coords.longitude;
                if (this.currentOrder) {
                    this.currentOrder.technicianLat = this.technicianLat;
                    this.currentOrder.technicianLng = this.technicianLng;
                    this.angularFireDatabase.list("/orders").update(this.currentOrder.$key, this.currentOrder);
                }
            },
            (error: any) => { },
            { enableHighAccuracy: true }
        );
    }

    public completeOrder(): void {
        if(this.otpInput == this.otp) {
            console.log("completed");
            this.currentOrder.completed = true;
            this.angularFireDatabase.list("/orders").update(this.currentOrder.$key, this.currentOrder);
        } else {
            console.log("not completed!")
        }
    }
}
