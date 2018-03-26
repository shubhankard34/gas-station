import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from "angularfire2/database";
import * as firebase from 'firebase/app';
import { OrderDetails } from "./../../models/order-details";
import { UserOrder } from "./../../models/user-order";

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit, AfterContentChecked {
    public orderList: any[] = [];
    public userOrderList: UserOrder[] = [];
    public isMapSupported: boolean = false;
    public mechLat: string = "";
    public mechLng: string = "";

    constructor(private afd: AngularFireDatabase) { }
    public ngOnInit(): void {
        if (navigator.geolocation) {
            this.isMapSupported = true;
        }
        this.afd.list("orders").subscribe(
            (res: OrderDetails[]) => {
                for (let order of res) {
                    if (order.assignedTechnicianId == "") {
                        this.orderList.push(order);
                    }
                }
                for (let order of this.orderList) {
                    let userOrder: UserOrder = {} as UserOrder;
                    this.afd.list("users/").subscribe(
                        (res: any) => {
                            for (let user of res) {
                                if (order.userId == user.$key) {
                                    userOrder.order = order;
                                    userOrder.user = user;
                                    this.userOrderList.push(userOrder);
                                }
                            }
                        }
                    );
                }
                console.log(this.userOrderList);
                // console.log(this.orderList);
            }
        );
    }

    public ngAfterContentChecked() {
        this.getCurrentUserPosition();
    }

    private getCurrentUserPosition(): void {
        if (this.isMapSupported) {
            navigator.geolocation.getCurrentPosition(
                (position: any) => {
                    this.mechLat = position.coords.latitude;
                    this.mechLng = position.coords.longitude;
                },
                (error: any) => { },
                { enableHighAccuracy: true }
            );
        }
    }

    public getDistance(lat, lon): string {
        let distance: string;
        var radlat1 = Math.PI * lat / 180;
        var radlat2 = Math.PI * parseFloat(this.mechLat) / 180;
        var theta = lon - parseFloat(this.mechLng);
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        distance = dist.toPrecision(3);
        return distance;
    }
}
