import { Component, OnInit } from '@angular/core';
import { TechnicianDetails } from "./../../models/technician-details";

import { AngularFireDatabase } from "angularfire2/database";

@Component({
  selector: 'app-technician-list',
  templateUrl: './technician-list.component.html',
  styleUrls: ['./technician-list.component.css']
})
export class TechnicianListComponent {
  public technicianList: TechnicianDetails[] = [];
  constructor(private angularFireDatabase: AngularFireDatabase) {
    angularFireDatabase.list("/technicians").subscribe(
      (technicians: TechnicianDetails[]) => {
        this.technicianList = technicians;
      }
    );
  }
}
